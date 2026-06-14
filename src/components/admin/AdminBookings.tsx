import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Trash2, Search, Filter, Phone, Mail, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminBookings = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedTrip, setSelectedTrip] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"bookings" | "contacts">("bookings");

  // Fetch bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-bookings-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, trips(name, destination)")
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

  // Toggle payment status mutation
  const togglePaymentMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      const newStatus = currentStatus === "paid" ? "unpaid" : "paid";
      const { error } = await supabase
        .from("bookings")
        .update({ payment_status: newStatus })
        .eq("id", id);
      if (error) throw error;
      return { id, newStatus };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-dashboard"] });
      toast.success(`Statut mis à jour : ${data.newStatus === "paid" ? "Payé" : "Non payé"}`);
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la mise à jour : " + error.message);
    },
  });

  // Delete booking mutation
  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings-dashboard"] });
      toast.success("Réservation supprimée.");
    },
    onError: (error: any) => {
      toast.error("Erreur de suppression : " + error.message);
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contacts-dashboard"] });
      toast.success("Message supprimé.");
    },
    onError: (error: any) => {
      toast.error("Erreur de suppression : " + error.message);
    },
  });

  // Filtering & searching bookings
  const filteredBookings = bookings?.filter((b) => {
    const tripName = b.trips?.name?.toLowerCase() || "";
    const nameMatch = `${b.nom} ${b.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
                      b.email.toLowerCase().includes(search.toLowerCase());
    const tripMatch = selectedTrip === "" || b.trip_id === selectedTrip;
    return nameMatch && tripMatch;
  });

  // Searching contacts
  const filteredContacts = contacts?.filter((c) => {
    return `${c.nom} ${c.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
           c.email.toLowerCase().includes(search.toLowerCase()) ||
           c.message.toLowerCase().includes(search.toLowerCase()) ||
           c.destination.toLowerCase().includes(search.toLowerCase());
  });

  const handleDeleteBooking = (id: string, name: string) => {
    if (confirm(`Voulez-vous vraiment supprimer l'inscription de ${name} ?`)) {
      deleteBookingMutation.mutate(id);
    }
  };

  const handleDeleteContact = (id: string, name: string) => {
    if (confirm(`Voulez-vous supprimer le message de ${name} ?`)) {
      deleteContactMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="pb-6 border-b border-ink/10">
        <h2 className="font-pp-neue-corp-compact text-3xl font-black text-ink uppercase tracking-tight">
          Inscriptions & Contacts
        </h2>
        <p className="font-dm-sans text-sm text-ink/60 mt-1">
          Gérez les réservations des participantes et répondez aux messages de contact reçus.
        </p>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex gap-4 border-b border-ink/5 pb-4">
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
      </div>

      {/* Filters & Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-ink/5 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email..."
            className="pl-10 h-10 bg-gray-50 border-ink/5 focus-visible:ring-citra-orange"
          />
        </div>

        {activeSubTab === "bookings" && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-ink/60" />
            <select
              value={selectedTrip}
              onChange={(e) => setSelectedTrip(e.target.value)}
              className="bg-gray-50 border border-ink/5 rounded-md px-3 py-2 text-sm font-dm-sans focus:outline-none focus:ring-1 focus:ring-citra-orange text-ink w-full sm:w-64"
            >
              <option value="">Tous les voyages</option>
              {trips?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
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
                    <th className="px-6 py-4">Nom / Prénom</th>
                    <th className="px-6 py-4">Voyage</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Détails</th>
                    <th className="px-6 py-4 text-center">Paiement</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {filteredBookings.map((b) => {
                    const fullName = `${b.prenom} ${b.nom}`;
                    const isPaid = b.payment_status === "paid";

                    return (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-ink">{fullName}</div>
                          <div className="text-xs text-ink/50">Âge: {b.age} ans</div>
                        </td>
                        <td className="px-6 py-4 max-w-[200px]">
                          <div className="font-semibold truncate text-ink">{b.trips?.name || "Voyage inconnu"}</div>
                          <div className="text-xs text-ink/50 uppercase">{b.trips?.destination}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-ink/80 mb-1">
                            <Mail size={12} className="text-ink/40" />
                            <a href={`mailto:${b.email}`} className="hover:underline">{b.email}</a>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-ink/80">
                            <Phone size={12} className="text-ink/40" />
                            <a href={`tel:${b.telephone}`} className="hover:underline">{b.telephone}</a>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs space-y-1 text-ink/70 max-w-[220px]">
                          <div><strong>Allergies :</strong> <span className="text-rose-600 font-medium">{b.allergies}</span></div>
                          <div><strong>Assurance :</strong> {b.assurance}</div>
                          {b.autre && <div className="truncate" title={b.autre}><strong>Note :</strong> {b.autre}</div>}
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
                            {isPaid ? "Payé (Acompte)" : "Non payé"}
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
      ) : (
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
                          <div className="text-xs text-ink/50">
                            <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
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
      )}
    </div>
  );
};

export default AdminBookings;
