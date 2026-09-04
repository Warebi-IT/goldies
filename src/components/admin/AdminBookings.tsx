import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Check, 
  X, 
  Trash2, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle,
  HeartPulse,
  Clock,
  History,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { calculateBalanceDueDate, calculateDepositAmount, calculateRemainingBalance } from "@/lib/business-rules";
import { formatUserErrorMessage } from "@/lib/error-handler";

const AdminBookings = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedTrip, setSelectedTrip] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"bookings" | "contacts" | "audit">("bookings");
  const [isPurging, setIsPurging] = useState(false);

  const handleRunGdprMaintenance = async () => {
    if (!confirm("Exécuter la maintenance RGPD ? Cela va purger les contacts inactifs (> 3 ans), les réservations abandonnées (> 90j), et nettoyer les données de santé des anciens séjours (> 1 an).")) {
      return;
    }
    setIsPurging(true);
    try {
      const { data, error } = await supabase.rpc("apply_gdpr_retention_policy");
      if (error) throw error;
      toast.success(
        `Maintenance RGPD réussie : ${data?.prospects_purged ?? 0} prospect(s) purgé(s), ${data?.unpaid_purged ?? 0} abandon(s) supprimé(s), ${data?.health_data_cleared ?? 0} donnée(s) de santé nettoyée(s).`
      );
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contacts-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-events"] });
    } catch (err: any) {
      toast.error("Erreur maintenance RGPD : " + err.message);
    } finally {
      setIsPurging(false);
    }
  };

  // Fetch bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-bookings-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, trips(name, destination, start_date, price)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch trips for filtering
  const { data: trips } = useQuery({
    queryKey: ["admin-trips-filter"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trips").select("id, name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch contacts
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["admin-contacts-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch audit events
  const { data: auditEvents, isLoading: auditLoading } = useQuery({
    queryKey: ["admin-audit-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Toggle payment status mutation
  const togglePaymentMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      const newStatus = currentStatus === "paid" ? "unpaid" : "paid";
      const { error } = await supabase
        .from("bookings")
        .update({ payment_status: newStatus })
        .eq("id", id);
      if (error) throw error;

      await supabase.from("audit_events").insert({
        action: "PAYMENT_STATUS_UPDATED",
        entity_type: "booking",
        entity_id: id,
        details: { previous_status: currentStatus, new_status: newStatus },
      });

      return { id, newStatus };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-events"] });
      toast.success(`Statut mis à jour : ${data.newStatus === "paid" ? "Payé" : "Non payé"}`);
    },
    onError: (error: any) => {
      const err = formatUserErrorMessage(error);
      toast.error(`${err.title} : ${err.description} ${err.action ? `(Action: ${err.action})` : ""}`);
    },
  });

  // Toggle Medical Alert Ack Mutation
  const toggleMedicalAckMutation = useMutation({
    mutationFn: async ({ id, acknowledged }: { id: string; acknowledged: boolean }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ medical_alert_acknowledged: !acknowledged })
        .eq("id", id);
      if (error) throw error;

      await supabase.from("audit_events").insert({
        action: "MEDICAL_ALERT_ACK_TOGGLED",
        entity_type: "booking",
        entity_id: id,
        details: { acknowledged: !acknowledged },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-events"] });
      toast.success("Statut alerte médicale mis à jour.");
    },
    onError: (e: any) => {
      const err = formatUserErrorMessage(e);
      toast.error(`${err.title} : ${err.description}`);
    },
  });

  // Toggle Insurance Verified Mutation
  const toggleInsuranceMutation = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ insurance_verified: !verified })
        .eq("id", id);
      if (error) throw error;

      await supabase.from("audit_events").insert({
        action: "INSURANCE_VERIFIED_TOGGLED",
        entity_type: "booking",
        entity_id: id,
        details: { insurance_verified: !verified },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-events"] });
      toast.success("Statut assurance mis à jour.");
    },
    onError: (e: any) => {
      const err = formatUserErrorMessage(e);
      toast.error(`${err.title} : ${err.description}`);
    },
  });

  // Update payment type mutation
  const updatePaymentTypeMutation = useMutation({
    mutationFn: async ({ id, payment_type }: { id: string; payment_type: string }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ payment_type })
        .eq("id", id);
      if (error) throw error;
      return { id, payment_type };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-list"] });
      const labels: Record<string, string> = { deposit: "Acompte", installment: "Plusieurs fois", full: "Totalité" };
      toast.success(`Mode de paiement : ${labels[data.payment_type] || data.payment_type}`);
    },
    onError: (error: any) => {
      const err = formatUserErrorMessage(error);
      toast.error(`${err.title} : ${err.description}`);
    },
  });

  // Delete booking mutation
  const handleDeleteBooking = (id: string, name: string) => {
    if (confirm(`Voulez-vous vraiment supprimer l'inscription de ${name} ?`)) {
      deleteBookingMutation.mutate(id);
    }
  };

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;

      await supabase.from("audit_events").insert({
        action: "BOOKING_DELETED",
        entity_type: "booking",
        entity_id: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-events"] });
      toast.success("Réservation supprimée.");
    },
    onError: (error: any) => {
      const err = formatUserErrorMessage(error);
      toast.error(`${err.title} : ${err.description}`);
    },
  });

  // Delete contact mutation
  const handleDeleteContact = (id: string, name: string) => {
    if (confirm(`Voulez-vous supprimer le message de ${name} ?`)) {
      deleteContactMutation.mutate(id);
    }
  };

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;

      await supabase.from("audit_events").insert({
        action: "CONTACT_DELETED",
        entity_type: "contact",
        entity_id: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-events"] });
      toast.success("Message supprimé.");
    },
    onError: (error: any) => {
      const err = formatUserErrorMessage(error);
      toast.error(`${err.title} : ${err.description}`);
    },
  });

  // Searching bookings
  const filteredBookings = bookings?.filter((b) => {
    const fullName = `${b.prenom} ${b.nom}`.toLowerCase();
    const nameMatch = fullName.includes(search.toLowerCase()) || b.email.toLowerCase().includes(search.toLowerCase()) || b.telephone.includes(search);
    const tripMatch = selectedTrip === "" || b.trip_id === selectedTrip;
    const paymentTypeMatch = selectedPaymentType === "" || (b as any).payment_type === selectedPaymentType;
    return nameMatch && tripMatch && paymentTypeMatch;
  });

  // Searching contacts
  const filteredContacts = contacts?.filter((c) => {
    return `${c.nom} ${c.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
           c.email.toLowerCase().includes(search.toLowerCase()) ||
           c.message.toLowerCase().includes(search.toLowerCase()) ||
           c.destination.toLowerCase().includes(search.toLowerCase());
  });

  // Searching audit events
  const filteredAuditEvents = auditEvents?.filter((a) => {
    return a.action.toLowerCase().includes(search.toLowerCase()) ||
           (a.actor_email || "").toLowerCase().includes(search.toLowerCase()) ||
           (a.entity_type || "").toLowerCase().includes(search.toLowerCase()) ||
           (a.entity_id || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
        <div>
          <h2 className="font-pp-neue-corp-compact text-3xl font-black text-ink uppercase tracking-tight">
            Inscriptions, Sécurité & Traçabilité
          </h2>
          <p className="font-dm-sans text-sm text-ink/60 mt-1">
            Gestion des voyageuses, conformité médicale et journal d'audit immuable.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRunGdprMaintenance}
          disabled={isPurging}
          className="gap-2 rounded-full border-primary/30 text-primary hover:bg-primary/10 self-start sm:self-auto"
          title="Purger les prospects > 3 ans et nettoyer les données de santé anciennes"
        >
          <ShieldCheck size={16} />
          {isPurging ? "Nettoyage en cours..." : "Maintenance RGPD"}
        </Button>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex flex-wrap gap-4 border-b border-ink/5 pb-4">
        <button
          onClick={() => {
            setActiveSubTab("bookings");
            setSearch("");
          }}
          className={`font-pp-neue-corp-compact text-xl uppercase tracking-tight pb-2 px-1 transition-all border-b-2 ${
            activeSubTab === "bookings" ? "border-citra-orange text-ink font-black" : "border-transparent text-ink/40"
          }`}
        >
          Réservations & Inscriptions ({bookings?.length || 0})
        </button>
        <button
          onClick={() => {
            setActiveSubTab("contacts");
            setSearch("");
          }}
          className={`font-pp-neue-corp-compact text-xl uppercase tracking-tight pb-2 px-1 transition-all border-b-2 ${
            activeSubTab === "contacts" ? "border-citra-orange text-ink font-black" : "border-transparent text-ink/40"
          }`}
        >
          Messages de Contact ({contacts?.length || 0})
        </button>
        <button
          onClick={() => {
            setActiveSubTab("audit");
            setSearch("");
          }}
          className={`font-pp-neue-corp-compact text-xl uppercase tracking-tight pb-2 px-1 transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === "audit" ? "border-citra-orange text-ink font-black" : "border-transparent text-ink/40"
          }`}
        >
          <History size={18} />
          Journal d'Audit ({auditEvents?.length || 0})
        </button>
      </div>

      {/* Filters & Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-ink/5 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
          <Input
            placeholder={
              activeSubTab === "bookings"
                ? "Rechercher une participante..."
                : activeSubTab === "contacts"
                ? "Rechercher un message..."
                : "Filtrer l'audit par action, email..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-gray-50 border-ink/5 h-10 rounded-xl font-dm-sans text-sm focus-visible:ring-citra-orange"
          />
        </div>

        {activeSubTab === "bookings" && (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedTrip}
              onChange={(e) => setSelectedTrip(e.target.value)}
              className="bg-gray-50 border border-ink/5 rounded-md px-3 py-2 text-sm font-dm-sans focus:outline-none focus:ring-1 focus:ring-citra-orange text-ink w-full sm:w-48"
            >
              <option value="">Tous les voyages</option>
              {trips?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              value={selectedPaymentType}
              onChange={(e) => setSelectedPaymentType(e.target.value)}
              className="bg-gray-50 border border-ink/5 rounded-md px-3 py-2 text-sm font-dm-sans focus:outline-none focus:ring-1 focus:ring-citra-orange text-ink w-full sm:w-48"
            >
              <option value="">Tous les modes</option>
              <option value="deposit">Acompte</option>
              <option value="installment">Plusieurs fois</option>
              <option value="full">Totalité</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Areas */}
      {activeSubTab === "bookings" ? (
        <div className="bg-white rounded-[32px] overflow-hidden border border-ink/5 shadow-sm">
          {bookingsLoading ? (
            <div className="p-12 text-center text-ink/60 font-dm-sans">Chargement des réservations...</div>
          ) : !filteredBookings || filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-ink/50 font-dm-sans">Aucune réservation trouvée.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-dm-sans text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-ink/5 text-ink/60 font-bold uppercase tracking-wider text-xs">
                    <th className="px-6 py-4">Participante</th>
                    <th className="px-6 py-4">Voyage & Tarif</th>
                    <th className="px-6 py-4">Santé & Allergies</th>
                    <th className="px-6 py-4">Assurance</th>
                    <th className="px-6 py-4 text-center">Mode</th>
                    <th className="px-6 py-4 text-center">Paiement</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {filteredBookings.map((b) => {
                    const fullName = `${b.prenom} ${b.nom}`;
                    const isPaid = b.payment_status === "paid";
                    const isDeposit = (b as any).payment_type === "deposit";
                    const tripStartDate = b.trips?.start_date;
                    const balanceDueDate = isDeposit ? calculateBalanceDueDate(tripStartDate) : null;
                    const priceSnapshot = (b as any).price_at_booking ?? b.trips?.price;
                    const depositSnapshot = isDeposit ? calculateDepositAmount(priceSnapshot, (b.trips as any)?.deposit_amount) : 0;
                    const remainingBalanceSnapshot = isDeposit ? calculateRemainingBalance(priceSnapshot, depositSnapshot) : 0;

                    return (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-ink">{fullName}</div>
                          <div className="text-xs text-ink/50">Âge : {b.age} ans</div>
                          <div className="flex items-center gap-1.5 text-xs text-ink/70 mt-1">
                            <Mail size={11} className="text-ink/40" />
                            <a href={`mailto:${b.email}`} className="hover:underline">{b.email}</a>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-ink/70">
                            <Phone size={11} className="text-ink/40" />
                            <a href={`tel:${b.telephone}`} className="hover:underline">{b.telephone}</a>
                          </div>
                          {(b as any).submission_action === "etre_contacte" ? (
                            <span className="inline-block px-2 py-0.5 mt-1 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800">
                              📞 Demande de contact
                            </span>
                          ) : (b as any).submission_action === "annuler" || b.payment_status === "cancelled" ? (
                            <span className="inline-block px-2 py-0.5 mt-1 rounded-md text-[10px] font-extrabold bg-gray-100 text-gray-700">
                              ⚠️ Abandon / Annulé
                            </span>
                          ) : null}
                        </td>

                        <td className="px-6 py-4 max-w-[200px]">
                          <div className="font-semibold truncate text-ink">{b.trips?.name || "Voyage"}</div>
                          <div className="text-xs text-ink/50 uppercase">{b.trips?.destination}</div>
                          <div className="text-xs font-semibold text-citra-orange mt-1">
                            Prix total : {priceSnapshot ? `${priceSnapshot} €` : "N/A"}
                          </div>
                          {isDeposit && (
                            <div className="text-[11px] font-semibold text-blue-700 mt-0.5">
                              Acompte : {depositSnapshot} € (Reste : {remainingBalanceSnapshot} €)
                            </div>
                          )}
                          {balanceDueDate && (
                            <div className="text-[11px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
                              <Clock size={11} /> Solde à J-45 : {balanceDueDate.toLocaleDateString("fr-FR")}
                            </div>
                          )}
                        </td>

                        {/* Santé & Allergies (Règle 7) */}
                        <td className="px-6 py-4 max-w-[240px]">
                          <div className="text-xs text-ink/80 mb-1">
                            <strong>Déclaré :</strong> {b.allergies}
                          </div>
                          {(b as any).has_medical_alert && (
                            <div className="mt-1">
                              <button
                                type="button"
                                onClick={() => toggleMedicalAckMutation.mutate({ id: b.id, acknowledged: (b as any).medical_alert_acknowledged })}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                                  (b as any).medical_alert_acknowledged
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : "bg-rose-50 text-rose-800 border-rose-300 animate-pulse"
                                }`}
                                title="Cliquer pour changer l'acquittement"
                              >
                                <HeartPulse size={12} />
                                {(b as any).medical_alert_acknowledged ? "Alerte Traitée ✅" : "Alerte Médicale 🚨"}
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Assurance (Règle 8) */}
                        <td className="px-6 py-4">
                          <div className="text-xs text-ink/70 mb-1">{b.assurance}</div>
                          <button
                            type="button"
                            onClick={() => toggleInsuranceMutation.mutate({ id: b.id, verified: (b as any).insurance_verified })}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                              (b as any).insurance_verified
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                            title="Cliquer pour valider la réception de l'attestation"
                          >
                            <ShieldCheck size={12} />
                            {(b as any).insurance_verified ? "Attestation OK" : "Attestation requise"}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <select
                            value={(b as any).payment_type || "full"}
                            onChange={(e) => updatePaymentTypeMutation.mutate({ id: b.id, payment_type: e.target.value })}
                            className={`text-xs font-bold rounded-full px-3 py-1 border-0 cursor-pointer transition-all ${
                              (b as any).payment_type === "deposit"
                                ? "bg-blue-100 text-blue-800"
                                : (b as any).payment_type === "installment"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            <option value="full">Totalité</option>
                            <option value="deposit">Acompte</option>
                            <option value="installment">Plusieurs fois</option>
                          </select>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => togglePaymentMutation.mutate({ id: b.id, currentStatus: b.payment_status })}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            }`}
                          >
                            {isPaid ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                            {isPaid ? "Payé" : "Non payé"}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBooking(b.id, fullName)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeSubTab === "contacts" ? (
        <div className="bg-white rounded-[32px] overflow-hidden border border-ink/5 shadow-sm">
          {contactsLoading ? (
            <div className="p-12 text-center text-ink/60 font-dm-sans">Chargement des messages...</div>
          ) : !filteredContacts || filteredContacts.length === 0 ? (
            <div className="p-12 text-center text-ink/50 font-dm-sans">Aucun message trouvé.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-dm-sans text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-ink/5 text-ink/60 font-bold uppercase tracking-wider text-xs">
                    <th className="px-6 py-4">Expéditeur</th>
                    <th className="px-6 py-4">Destination</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {filteredContacts.map((c) => {
                    const fullName = `${c.prenom} ${c.nom}`;
                    const date = new Date(c.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-ink">{fullName}</div>
                          <div className="text-xs text-ink/50 space-y-0.5">
                            <div><a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a></div>
                            {c.telephone && (
                              <div><a href={`tel:${c.telephone}`} className="text-citra-orange font-medium hover:underline flex items-center gap-1"><Phone size={11} /> {c.telephone}</a></div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-pastel-sand text-ink uppercase tracking-wider">
                            {c.destination}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          <p className="text-ink/80 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                            {c.message}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-xs text-ink/50 whitespace-nowrap">
                          {date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteContact(c.id, fullName)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Audit Events Timeline (Règle 6) */
        <div className="bg-white rounded-[32px] p-6 border border-ink/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ink/5">
            <div>
              <h3 className="font-pp-neue-corp-compact font-bold text-xl uppercase text-ink">
                Historique des Événements & Traçabilité
              </h3>
              <p className="text-xs text-ink/60 font-dm-sans">
                Journal immuable enregistrant chaque action sensible et cycle de vie client.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-pastel-sand rounded-full text-ink">
              {filteredAuditEvents?.length || 0} événement(s)
            </span>
          </div>

          {auditLoading ? (
            <div className="p-12 text-center text-ink/60 font-dm-sans">Chargement du journal d'audit...</div>
          ) : !filteredAuditEvents || filteredAuditEvents.length === 0 ? (
            <div className="p-12 text-center text-ink/50 font-dm-sans">Aucun événement d'audit enregistré.</div>
          ) : (
            <div className="divide-y divide-ink/5">
              {filteredAuditEvents.map((evt) => {
                const date = new Date(evt.created_at).toLocaleString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });

                return (
                  <div key={evt.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 font-dm-sans text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold font-mono px-2 py-0.5 rounded bg-ink/5 text-ink">
                          {evt.action}
                        </span>
                        <span className="text-ink/60 uppercase font-semibold text-[10px] px-2 py-0.5 rounded bg-pastel-sand">
                          {evt.entity_type} {evt.entity_id ? `(#${evt.entity_id.slice(0, 8)})` : ""}
                        </span>
                        {evt.actor_email && (
                          <span className="text-citra-orange font-medium">Par : {evt.actor_email}</span>
                        )}
                      </div>
                      {evt.details && Object.keys(evt.details as object).length > 0 && (
                        <p className="text-ink/70 font-mono text-[11px] bg-gray-50 p-1.5 rounded-lg">
                          {JSON.stringify(evt.details)}
                        </p>
                      )}
                    </div>
                    <div className="text-ink/40 whitespace-nowrap text-right shrink-0">
                      {date}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
