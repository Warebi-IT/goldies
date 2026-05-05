import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, MapPin, Bed, Bus, UtensilsCrossed, HeartHandshake, Plane } from "lucide-react";

interface Destination {
  name: string;
  desc: string;
  img: string;
  tag: string;
  price: number;
  duration: string;
  includes: string[];
  dates: string;
}

interface BookingModalProps {
  destination: Destination | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const includeIcons: Record<string, React.ReactNode> = {
  Logement: <Bed size={16} />,
  Transport: <Bus size={16} />,
  Repas: <UtensilsCrossed size={16} />,
  "Activités touristiques": <MapPin size={16} />,
  "Budget association": <HeartHandshake size={16} />,
};

const BookingModal = ({ destination, open, onOpenChange }: BookingModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", tel: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setForm({ prenom: "", nom: "", email: "", tel: "" });
    }, 300);
  };

  const isFormValid = form.prenom && form.nom && form.email && form.tel;

  if (!destination) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border-none">
        {/* Header image */}
        <div className="relative h-44 overflow-hidden rounded-t-2xl">
          <img src={destination.img} alt={destination.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-4 left-5 text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={14} />
              <span className="text-sm font-medium">{destination.name}</span>
            </div>
            <h3 className="font-serif text-xl font-bold">Réserver ce séjour</h3>
          </div>
        </div>

        <div className="p-6">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle size={16} /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground mb-1">Détails du séjour</h4>
                <p className="text-sm text-muted-foreground">{destination.desc}</p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Durée</span>
                  <span className="font-semibold text-foreground">{destination.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prochaines dates</span>
                  <span className="font-semibold text-foreground">{destination.dates}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prix par personne</span>
                  <span className="font-bold text-xl text-secondary">{destination.price} €</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Le package inclut :</p>
                <div className="grid grid-cols-2 gap-2">
                  {destination.includes.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">{includeIcons[item] || <CheckCircle size={16} />}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/30 rounded-lg p-3">
                <Plane size={14} className="text-secondary shrink-0" />
                <span>Le billet d'avion n'est pas inclus dans le package.</span>
              </div>

              <Button onClick={() => setStep(2)} className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                Continuer la réservation
              </Button>
            </div>
          )}

          {/* Step 2: Form */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground mb-1">Vos informations</h4>
                <p className="text-sm text-muted-foreground">Remplissez vos coordonnées pour réserver.</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Prénom *</label>
                    <Input
                      value={form.prenom}
                      onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                      placeholder="Fatima"
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Nom *</label>
                    <Input
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      placeholder="Diallo"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Email *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="fatima@email.com"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Téléphone *</label>
                  <Input
                    type="tel"
                    value={form.tel}
                    onChange={(e) => setForm({ ...form, tel: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-full">
                  Retour
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!isFormValid}
                  className="flex-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
                >
                  Passer au paiement
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment summary */}
          {step === 3 && !submitted && (
            <div className="space-y-5">
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground mb-1">Récapitulatif & Paiement</h4>
                <p className="text-sm text-muted-foreground">Vérifiez les informations avant de procéder au paiement.</p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voyageuse</span>
                  <span className="font-medium text-foreground">{form.prenom} {form.nom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{form.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span className="font-medium text-foreground">{form.tel}</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium text-foreground">{destination.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durée</span>
                  <span className="font-medium text-foreground">{destination.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium text-foreground">{destination.dates}</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total à payer</span>
                  <span className="font-bold text-2xl text-secondary">{destination.price} €</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-full">
                  Retour
                </Button>
                <Button
                  onClick={() => setSubmitted(true)}
                  className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  Confirmer & Payer
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé. Vous recevrez un email de confirmation.
              </p>
            </div>
          )}

          {/* Confirmation */}
          {submitted && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle className="text-primary" size={32} />
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground">Réservation confirmée !</h4>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Merci {form.prenom} ! Un email de confirmation a été envoyé à <strong>{form.email}</strong>.
                Notre équipe vous contactera sous 48h avec tous les détails.
              </p>
              <Button onClick={handleClose} className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Fermer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
