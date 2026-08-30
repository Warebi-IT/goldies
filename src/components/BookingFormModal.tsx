import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { safeRedirect, isValidEmail, sanitizeTextInput } from "@/lib/security";
import { detectMedicalAlert, calculateDepositAmount, calculateRemainingBalance } from "@/lib/business-rules";
import { formatUserErrorMessage } from "@/lib/error-handler";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: {
    id: string;
    name: string;
    dates: string;
    price: string | number;
    deposit_amount?: number | null;
    payment_link?: string | null;
    deposit_payment_link?: string | null;
  };
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({ isOpen, onClose, trip }) => {
  // Form State
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [disponibilite, setDisponibilite] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [engagement, setEngagement] = useState<"Oui" | "Non" | "">("");
  const [assurance, setAssurance] = useState<"Oui" | "Non" | "Je vais en faire une" | "">("" );
  const [autre, setAutre] = useState("");
  const [paymentType, setPaymentType] = useState<"deposit" | "installment" | "full">(
    trip.deposit_payment_link ? "deposit" : "full"
  );
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const numericPrice = typeof trip.price === "number" ? trip.price : parseInt(String(trip.price), 10) || 0;
  const depositAmount = calculateDepositAmount(numericPrice, trip.deposit_amount);
  const remainingBalance = calculateRemainingBalance(numericPrice, depositAmount);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedImageRights, setAcceptedImageRights] = useState(true);

  // Validation
  const isValid = 
    nom.trim() !== "" &&
    prenom.trim() !== "" &&
    age.trim() !== "" &&
    isValidEmail(email) &&
    telephone.trim() !== "" &&
    disponibilite &&
    allergies.trim() !== "" && 
    engagement !== "" &&
    assurance !== "" &&
    acceptedTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Bot detection via honeypot
    if (honeypot.trim() !== "") {
      onClose();
      return;
    }

    const cleanNom = sanitizeTextInput(nom, 100);
    const cleanPrenom = sanitizeTextInput(prenom, 100);
    const cleanEmail = sanitizeTextInput(email, 254).toLowerCase();
    const cleanPhone = sanitizeTextInput(telephone, 30);
    const cleanAllergies = sanitizeTextInput(allergies, 500);
    const cleanAutre = sanitizeTextInput(autre, 1000);
    const parsedAge = Math.min(Math.max(parseInt(age, 10) || 0, 1), 120);
    const hasMedicalAlert = detectMedicalAlert(cleanAllergies);
    const numericPrice = typeof trip.price === "number" ? trip.price : parseInt(String(trip.price), 10) || 0;

    setLoading(true);
    try {
      const { data: insertedBooking, error } = await supabase.from("bookings").insert({
        trip_id: trip.id,
        nom: cleanNom,
        prenom: cleanPrenom,
        age: parsedAge,
        email: cleanEmail,
        telephone: cleanPhone,
        disponibilite,
        allergies: cleanAllergies,
        engagement,
        assurance,
        autre: cleanAutre !== "" ? cleanAutre : null,
        payment_status: "unpaid",
        payment_type: paymentType,
        price_at_booking: numericPrice,
        has_medical_alert: hasMedicalAlert,
        medical_alert_acknowledged: false,
        insurance_verified: assurance.toLowerCase() === "oui",
      }).select("id").single();

      if (error) throw error;

      // Log audit event
      await supabase.from("audit_events").insert({
        action: "BOOKING_SUBMITTED",
        entity_type: "booking",
        entity_id: insertedBooking?.id || null,
        details: {
          trip_id: trip.id,
          trip_name: trip.name,
          client_email: cleanEmail,
          payment_type: paymentType,
          price_at_booking: numericPrice,
          has_medical_alert: hasMedicalAlert,
        },
      });

      // Redirect to the appropriate payment link based on choice
      let redirectLink: string | null | undefined = null;
      if (paymentType === "deposit" && trip.deposit_payment_link) {
        redirectLink = trip.deposit_payment_link;
      } else if (trip.payment_link) {
        redirectLink = trip.payment_link;
      }

      if (redirectLink) {
        const redirected = safeRedirect(redirectLink);
        if (!redirected) {
          alert("Inscription enregistrée ! Lien de paiement invalide.");
          onClose();
        }
      } else {
        alert("Inscription enregistrée ! (Ce voyage n'a pas encore de lien de paiement configuré)");
        onClose();
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      const errDiag = formatUserErrorMessage(error);
      alert(`${errDiag.title}\n\n${errDiag.description}${errDiag.action ? `\n\nAction : ${errDiag.action}` : ""}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col bg-concrete-canvas p-0 gap-0 rounded-[24px]">
        
        {/* Header */}
        <DialogHeader className="px-6 py-6 border-b border-ink/10 bg-white/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <DialogTitle className="font-pp-neue-corp-compact text-3xl font-black uppercase tracking-tight text-ink">
            {trip.name} {trip.dates}
          </DialogTitle>
          <DialogDescription className="font-dm-sans text-ink/70">
            Rejoignez Goldies Travel pour ce voyage pensé par des femmes, pour des femmes.
            Remplissez ce formulaire d'inscription pour valider votre place.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
            {/* Honeypot field for bot mitigation */}
            <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
              <input
                type="text"
                name="website_url"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            
            {/* Identity */}
            <div className="space-y-4">
              <h3 className="font-dm-sans font-bold text-lg text-ink">Ton Nom & Prénom *</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input 
                    placeholder="Nom" 
                    value={nom} 
                    onChange={(e) => setNom(e.target.value)} 
                    className="bg-white/60 border-ink/10 h-12 rounded-xl focus-visible:ring-citra-orange" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Input 
                    placeholder="Prénom" 
                    value={prenom} 
                    onChange={(e) => setPrenom(e.target.value)} 
                    className="bg-white/60 border-ink/10 h-12 rounded-xl focus-visible:ring-citra-orange" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-4">
              <h3 className="font-dm-sans font-bold text-lg text-ink">Ton âge *</h3>
              <Input 
                type="number"
                placeholder="Ex: 28" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                className="bg-white/60 border-ink/10 h-12 rounded-xl focus-visible:ring-citra-orange w-full" 
                required 
              />
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-dm-sans font-bold text-lg text-ink">Ton adresse e-mail *</h3>
              <Input 
                type="email"
                placeholder="email@exemple.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-white/60 border-ink/10 h-12 rounded-xl focus-visible:ring-citra-orange w-full" 
                required 
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-dm-sans font-bold text-lg text-ink">Ton numéro de téléphone *</h3>
              <Input 
                type="tel"
                placeholder="+33 6 00 00 00 00" 
                value={telephone} 
                onChange={(e) => setTelephone(e.target.value)} 
                className="bg-white/60 border-ink/10 h-12 rounded-xl focus-visible:ring-citra-orange w-full" 
                required 
              />
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="font-dm-sans font-bold text-lg text-ink">Tu confirmes ta disponibilité pour cette date *</h3>
              <div className="flex items-center space-x-3 bg-white/40 p-4 rounded-xl border border-ink/5">
                <Checkbox 
                  id="dispo" 
                  checked={disponibilite} 
                  onCheckedChange={(c) => setDisponibilite(c as boolean)} 
                  className="w-5 h-5 rounded-md border-ink/20 data-[state=checked]:bg-citra-orange data-[state=checked]:border-citra-orange"
                />
                <Label htmlFor="dispo" className="text-base font-dm-sans text-ink/80 cursor-pointer">
                  {trip.dates}
                </Label>
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <h3 className="font-dm-sans font-bold text-lg text-ink">Des allergies/maladies à signaler *</h3>
              <p className="text-xs text-ink/60 font-dm-sans">
                Donnée collectée uniquement pour assurer votre sécurité alimentaire et médicale durant le séjour (Art. 9.2.a RGPD). Purgée après le séjour.
              </p>
              <Input 
                placeholder="Si aucune, écrire 'Aucune'" 
                value={allergies} 
                onChange={(e) => setAllergies(e.target.value)} 
                className="bg-white/60 border-ink/10 h-12 rounded-xl focus-visible:ring-citra-orange w-full" 
                required 
              />
            </div>

            {/* Engagement */}
            <div className="space-y-4">
              <h3 className="font-dm-sans font-bold text-lg text-ink">Tu t'engages à participer au voyage *</h3>
              <RadioGroup 
                value={engagement} 
                onValueChange={(val: any) => setEngagement(val)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-3 bg-white/40 p-4 rounded-xl border border-ink/5">
                  <RadioGroupItem value="Oui" id="eng-oui" className="border-ink/20 text-citra-orange" />
                  <Label htmlFor="eng-oui" className="text-base font-dm-sans text-ink/80 cursor-pointer w-full">OUI</Label>
                </div>
                <div className="flex items-center space-x-3 bg-white/40 p-4 rounded-xl border border-ink/5">
                  <RadioGroupItem value="Non" id="eng-non" className="border-ink/20 text-citra-orange" />
                  <Label htmlFor="eng-non" className="text-base font-dm-sans text-ink/80 cursor-pointer w-full">NON</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Assurance */}
            <div className="space-y-4">
              <h3 className="font-dm-sans font-bold text-lg text-ink">As-tu une assurance voyage personnelle? (il est recommandé d'en avoir une) *</h3>
              <RadioGroup 
                value={assurance} 
                onValueChange={(val: any) => setAssurance(val)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-3 bg-white/40 p-4 rounded-xl border border-ink/5">
                  <RadioGroupItem value="Oui" id="ass-oui" className="border-ink/20 text-citra-orange" />
                  <Label htmlFor="ass-oui" className="text-base font-dm-sans text-ink/80 cursor-pointer w-full">Oui</Label>
                </div>
                <div className="flex items-center space-x-3 bg-white/40 p-4 rounded-xl border border-ink/5">
                  <RadioGroupItem value="Non" id="ass-non" className="border-ink/20 text-citra-orange" />
                  <Label htmlFor="ass-non" className="text-base font-dm-sans text-ink/80 cursor-pointer w-full">Non</Label>
                </div>
                <div className="flex items-center space-x-3 bg-white/40 p-4 rounded-xl border border-ink/5">
                  <RadioGroupItem value="Je vais en faire une" id="ass-faire" className="border-ink/20 text-citra-orange" />
                  <Label htmlFor="ass-faire" className="text-base font-dm-sans text-ink/80 cursor-pointer w-full">Je vais en faire une</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Autre */}
            <div className="space-y-4">
              <h3 className="font-dm-sans font-bold text-lg text-ink">Autre chose à nous dire ? :)</h3>
              <Textarea 
                placeholder="Vos remarques, questions..." 
                value={autre} 
                onChange={(e) => setAutre(e.target.value)} 
                className="bg-white/60 border-ink/10 min-h-[100px] rounded-xl focus-visible:ring-citra-orange w-full resize-y" 
              />
            </div>

            {/* Payment Type Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-dm-sans font-bold text-lg text-ink">Mode de paiement *</h3>
                  <p className="text-sm font-dm-sans text-ink/60">Choisissez comment vous souhaitez régler votre séjour.</p>
                </div>
                {numericPrice > 0 && (
                  <span className="text-xs font-dm-sans font-bold px-3 py-1 bg-ink/5 text-ink rounded-full">
                    Tarif total du séjour : {numericPrice} €
                  </span>
                )}
              </div>

              <RadioGroup 
                value={paymentType} 
                onValueChange={(val: any) => setPaymentType(val)}
                className="flex flex-col space-y-3"
              >
                {/* Option 1: Acompte (si lien d'acompte configuré) */}
                {trip.deposit_payment_link && (
                  <label
                    htmlFor="pay-deposit"
                    className={`relative flex items-start space-x-3.5 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentType === "deposit"
                        ? "bg-blue-50/90 border-blue-500 shadow-md ring-1 ring-blue-500/30"
                        : "bg-white/60 border-blue-200/50 hover:bg-blue-50/40 hover:border-blue-300"
                    }`}
                  >
                    <RadioGroupItem value="deposit" id="pay-deposit" className="mt-1 border-blue-400 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-bold text-ink text-base flex items-center gap-1.5">
                          💰 Payer un acompte
                        </span>
                        <span className="font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full text-xs">
                          {depositAmount} € aujourd'hui
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                        Versez seulement <strong>{depositAmount} €</strong> aujourd'hui pour bloquer votre place.
                      </p>
                      {remainingBalance > 0 && (
                        <div className="mt-2 text-xs font-semibold text-blue-900/80 bg-white/70 px-2.5 py-1 rounded-lg border border-blue-200/40 inline-flex items-center gap-1">
                          <span>📅 Solde restant ({remainingBalance} €) à régler avant le départ</span>
                        </div>
                      )}
                    </div>
                  </label>
                )}

                {/* Option 2: Paiement en plusieurs fois (Klarna) */}
                <label
                  htmlFor="pay-installment"
                  className={`relative flex items-start space-x-3.5 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentType === "installment"
                      ? "bg-[#FFF0F4] border-pink-500 shadow-md ring-1 ring-pink-500/30"
                      : "bg-white/60 border-[#FFE1E8]/70 hover:bg-[#FFF0F4]/50 hover:border-pink-300"
                  }`}
                >
                  <RadioGroupItem value="installment" id="pay-installment" className="mt-1 border-pink-400 text-pink-600" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-ink text-base flex items-center gap-1.5">
                        💳 Payer en 3x ou 4x sans frais
                      </span>
                      <span className="font-black text-pink-700 bg-pink-100/80 px-2.5 py-0.5 rounded-full text-xs">
                        Klarna.
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                      Réglez en 3 ou 4 mensualités sans aucun frais supplémentaire
                      {numericPrice > 0 ? ` (soit ~${Math.round(numericPrice / 3)} € / mois)` : ""}.
                    </p>
                  </div>
                </label>

                {/* Option 3: Paiement intégral */}
                <label
                  htmlFor="pay-full"
                  className={`relative flex items-start space-x-3.5 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentType === "full"
                      ? "bg-emerald-50/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/30"
                      : "bg-white/60 border-emerald-200/50 hover:bg-emerald-50/40 hover:border-emerald-300"
                  }`}
                >
                  <RadioGroupItem value="full" id="pay-full" className="mt-1 border-emerald-400 text-emerald-600" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-ink text-base flex items-center gap-1.5">
                        ✅ Payer la totalité
                      </span>
                      {numericPrice > 0 && (
                        <span className="font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full text-xs">
                          {numericPrice} €
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                      Réglez le montant intégral du séjour en une seule fois par carte bancaire.
                    </p>
                  </div>
                </label>
              </RadioGroup>

              {/* Dynamic Recap Card */}
              <div className="bg-white/70 p-3.5 rounded-xl border border-ink/10 text-xs font-dm-sans text-ink/80 flex items-center justify-between">
                <span className="text-ink/60">Montant à régler à la confirmation :</span>
                <span className="font-extrabold text-sm text-ink">
                  {paymentType === "deposit"
                    ? `${depositAmount} € (Acompte)`
                    : paymentType === "installment"
                    ? `${numericPrice} € (échelonné via Klarna)`
                    : `${numericPrice} € (Règlement total)`}
                </span>
              </div>
            </div>

            {/* T&Cs Block */}
            <div className="mt-12 space-y-6 pt-10 border-t border-ink/10">
              <h2 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight">Conditions Générales</h2>
              
              <div className="bg-white/60 p-6 rounded-2xl border border-ink/10 h-64 overflow-y-auto text-sm font-dm-sans text-ink/80 leading-relaxed space-y-4 shadow-inner">
                <h4 className="font-bold text-ink uppercase">Conditions de participation au programme Goldie’s Travel</h4>
                
                <h5 className="font-bold text-ink">1. Procédures de paiement et modalités de remboursement</h5>
                <p><strong>1.1 Modalités de paiement et de participation</strong><br/>
                En s’inscrivant au programme proposé par Goldie’s Travel, la participante reconnaît avoir lu et accepté l’ensemble des conditions relatives aux modalités de paiement et de remboursement des activités proposées.<br/>
                Le paiement du séjour s’effectue via les plateformes Paypal et Revolut.<br/>
                Lors de l’inscription, un acompte de 30 % du montant total du séjour est demandé afin de confirmer la participation. Cet acompte est non remboursable, sauf en cas d’annulation du voyage par l’organisation.<br/>
                Pendant la période d’inscription, les paiements peuvent être placés en attente pendant la phase de sélection et de confirmation des participantes. Une fois le nombre minimum de participantes atteint, le paiement sera validé et transféré sur le compte de l’entreprise.<br/>
                Les participantes seront régulièrement informées de l’évolution du nombre d’inscriptions et de la confirmation du départ.<br/>
                Si le nombre minimum de participantes n’est pas atteint, les sommes versées seront intégralement remboursées.<br/>
                Une fois le voyage confirmé et les réservations effectuées (billets d’avion, hébergements ou activités), aucun remboursement ne pourra être effectué en cas de désistement.</p>

                <p><strong>1.2 Modalités de remboursement</strong><br/>
                Le remboursement n’est possible que pendant la période d’attente, c’est-à-dire avant la confirmation officielle du voyage.<br/>
                Une fois le voyage confirmé et les réservations engagées par l’organisation, aucun remboursement ne pourra être accordé, même en cas de désistement personnel.<br/>
                Il est donc de la responsabilité de chaque participante de s’assurer de sa disponibilité et de sa capacité à participer au voyage avant d’effectuer son inscription.</p>

                <p><strong>1.3 Utilisation des données personnelles</strong><br/>
                La participante accepte que certaines données personnelles (état civil, numéro de passeport ou autres informations nécessaires) soient utilisées par les coordinatrices de Goldie’s Travel dans le cadre de l’organisation du séjour.<br/>
                Ces données pourront être utilisées uniquement pour les besoins liés aux réservations, aux activités et à la gestion logistique du voyage.</p>

                <h5 className="font-bold text-ink">2. Éthique, savoir-vivre et responsabilité personnelle</h5>
                <p><strong>2.1 Responsabilité et encadrement de l’organisation</strong><br/>
                Goldie’s Travel organise et encadre certaines activités prévues dans le programme du voyage.<br/>
                Cependant, l’organisation ne peut être tenue responsable des incidents survenant en dehors des activités encadrées ou en dehors des horaires d’encadrement.<br/>
                L’encadrement est assuré de 8h00 à 19h00. Tout événement se produisant en dehors de ces horaires relève de la responsabilité personnelle des participantes.<br/>
                L’agence ne pourra pas être tenue responsable en cas de : vol, perte d’objets personnels, incidents ne relevant pas directement de son organisation.</p>

                <p><strong>2.2 Assurance et frais médicaux</strong><br/>
                Si l’assurance n’est pas incluse dans le package ou que les participantes n’ont pas d’assurance personnelle. Elles sont entièrement responsables de leurs frais médicaux en cas d’accident, de maladie ou de tout autre incident survenant avant, pendant ou après le séjour.<br/>
                Goldie’s Travel ne fournit pas d’assurance médicale dans le cadre du voyage (sauf si il est inclus dans le package) et ne pourra en aucun cas avancer ou prendre en charge les frais médicaux ou hospitaliers.<br/>
                Il appartient donc à chaque participante de souscrire une assurance voyage ou santé adaptée si elle le souhaite avant le départ.</p>

                <p><strong>2.3 Cohabitation et savoir-vivre</strong><br/>
                Les participantes acceptent de vivre en communauté pendant la durée du séjour, ce qui peut inclure le partage d’un logement, d’une chambre ou d’espaces communs.<br/>
                Chaque participante s’engage à adopter un comportement respectueux envers : les autres participantes, les organisatrices, les intervenants, les communautés locales.<br/>
                Tout comportement raciste, discriminatoire, violent, ou contraire à la loi pourra entraîner des mesures disciplinaires ou des poursuites judiciaires.</p>

                <p><strong>2.4 Responsabilité personnelle et effets personnels</strong><br/>
                Chaque participante est responsable de la surveillance et de la sécurité de ses effets personnels. Goldie’s Travel ne pourra être tenu responsable en cas de perte, vol ou détérioration d’objets personnels. Toute activité suspecte ou tout incident devra être signalé à l’organisation.</p>

                <p><strong>2.5 Respect des communautés locales</strong><br/>
                Les participantes s’engagent à adopter un comportement respectueux envers les communautés locales, leur environnement et leur culture.<br/>
                Tout comportement stigmatisant, irrespectueux ou offensant envers les populations locales est strictement interdit.</p>

                <p><strong>2.6 Utilisation des outils numériques et droit à l’image</strong><br/>
                Les participantes s’engagent à ne pas diffuser de photos, vidéos ou contenus numériques impliquant d’autres participantes, organisatrices ou intervenants sans leur consentement préalable. Cette règle s’applique pendant et après le voyage.</p>

                <p><strong>2.7 Participation aux activités humanitaires</strong><br/>
                Les participantes s’engagent à respecter les personnes rencontrées dans le cadre des activités humanitaires proposées.<br/>
                Aucun comportement offensant ou irrespectueux envers les bénéficiaires ou les intervenants ne sera toléré.<br/>
                Une partie de la participation financière au voyage pourra être reversée aux associations partenaires visitées durant le séjour.</p>

                <p><strong>2.8 Dégâts matériels et sécurité</strong><br/>
                Chaque participante est responsable des dommages matériels qu’elle pourrait causer lors des activités proposées.<br/>
                L’organisation veille à la prévention des risques et à la sécurité générale, mais la responsabilité individuelle reste engagée si les règles ou consignes ne sont pas respectées.</p>

                <p><strong>2.9 Limites de la formule proposée</strong><br/>
                La formule proposée par Goldie’s Travel comprend uniquement les prestations mentionnées dans le programme officiel du séjour.<br/>
                Ne sont pas pris en charge : les dépenses personnelles, les activités non prévues dans le programme, les frais engagés en dehors de la durée de la semaine de séjour, les transports vers ou depuis l’aéroport après la date officielle de fin du programme, les repas pris après 18h.<br/>
                Si une participante décide de prolonger ou de raccourcir son séjour, elle devra prendre en charge l’ensemble des frais supplémentaires.</p>
                
                <h5 className="font-bold text-ink">Autorisation droit à l'image</h5>
                <p>Conformément aux dispositions relatives au droit à l’image, j’autorise Goldie's Travel et ses prestataires techniques à réaliser des prises de vue photographiques, des vidéos ou des captations numériques lors de l’évènement.<br/>
                Les images pourront être exploitées et utilisées directement par la structure sous toute forme et tous supports, pour un territoire illimité, sans limitation de durée, intégralement ou par extraits et notamment : presse, livre, supports numérique, exposition, publicité, projection publique, concours, site internet, réseaux sociaux.<br/>
                Le bénéficiaire de l’autorisation s’interdit expressément de procéder à une exploitation des photographies susceptible de porter atteinte à la vie privée ou à la réputation, et d’utiliser les photographies, vidéos ou captations numériques de la présente, dans tout support ou toute exploitation préjudiciable.<br/>
                Je reconnais être entièrement rempli de mes droits et je ne pourrai prétendre à aucune rémunération pour l’exploitation des droits visés aux présentes.<br/>
                Je garantis que ni moi, ni le cas échéant la personne que je représente, n’est lié par un contrat exclusif relatif à l’utilisation de mon image ou de mon nom.</p>
              </div>

              <div className="space-y-3">
                {/* Mandatory CGV Checkbox */}
                <div className="flex items-start space-x-4 bg-citra-orange/10 p-4 rounded-xl border border-citra-orange/20">
                  <Checkbox 
                    id="terms" 
                    checked={acceptedTerms} 
                    onCheckedChange={(c) => setAcceptedTerms(c as boolean)} 
                    className="mt-1 w-6 h-6 rounded-md border-citra-orange/40 data-[state=checked]:bg-citra-orange data-[state=checked]:border-citra-orange"
                  />
                  <Label htmlFor="terms" className="text-base font-dm-sans text-ink/90 cursor-pointer font-bold leading-snug">
                    Je déclare avoir lu, compris et accepté l'ensemble des Conditions Générales de Vente et de participation au programme Goldie's Travel. *
                  </Label>
                </div>

                {/* Optional Image Rights Checkbox */}
                <div className="flex items-start space-x-4 bg-white/60 p-4 rounded-xl border border-ink/10">
                  <Checkbox 
                    id="image-rights" 
                    checked={acceptedImageRights} 
                    onCheckedChange={(c) => setAcceptedImageRights(c as boolean)} 
                    className="mt-1 w-5 h-5 rounded-md border-ink/30 data-[state=checked]:bg-citra-orange data-[state=checked]:border-citra-orange"
                  />
                  <Label htmlFor="image-rights" className="text-sm font-dm-sans text-ink/80 cursor-pointer leading-snug">
                    <span className="font-semibold text-ink">Autorisation droit à l'image (Optionnel) :</span> J'autorise Goldie's Travel à utiliser les photos/vidéos prises lors du séjour sur ses supports de communication (site, réseaux sociaux).
                  </Label>
                </div>
              </div>
            </div>

            <div className="py-8">
               <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 mb-8 text-center shadow-sm">
                 <h4 className="font-pp-neue-corp-compact font-black text-xl uppercase mb-2">Les prochaines étapes</h4>
                 <ul className="text-sm font-dm-sans text-ink/80 space-y-2">
                   <li>1. Remplissez ce formulaire et payez l'acompte (ou la totalité) via Stripe.</li>
                   <li>2. Tu seras contactée très bientôt par téléphone !</li>
                   <li>3. Nous t'enverrons les documents de voyage à signer par e-mail.</li>
                   <li>4. Ensuite, tu seras ajoutée au Groupe WhatsApp du Voyage.</li>
                 </ul>
                 <p className="mt-4 font-bold text-citra-orange">Bienvenue dans l'aventure Goldie's !</p>
               </div>
            </div>

          </form>
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-white/80 backdrop-blur-md border-t border-ink/10 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-ink/80 font-dm-sans text-sm">
             Séjour sélectionné : <strong className="text-ink font-extrabold text-base">{trip.name}</strong> <span className="text-ink/70 text-xs font-bold font-dm-sans block sm:inline sm:ml-2">({trip.dates})</span>
           </div>
           <div className="flex gap-4 w-full sm:w-auto">
              <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto rounded-full font-dm-sans font-bold">
                Annuler
              </Button>
              <Button 
                type="submit" 
                form="booking-form"
                disabled={!isValid || loading} 
                className="w-full sm:w-auto rounded-full bg-citra-orange text-white hover:bg-citra-orange/90 font-dm-sans font-bold shadow-md transition-all h-12 px-8 disabled:opacity-50"
              >
                {loading
                  ? "Enregistrement..."
                  : isValid
                  ? paymentType === "deposit"
                    ? `Payer l'acompte (${depositAmount} €)`
                    : paymentType === "installment"
                    ? "Payer en plusieurs fois"
                    : `Payer la totalité (${numericPrice ? `${numericPrice} €` : ""})`
                  : "Remplissez tous les champs"}
              </Button>
           </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default BookingFormModal;
