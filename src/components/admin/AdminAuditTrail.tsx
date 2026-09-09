import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  PhoneCall,
  XCircle,
  CreditCard,
  Trash2,
  MapPin,
  Mail,
  ShieldCheck,
  Activity,
  HeartPulse,
  Edit3,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  User,
  Clock,
  Code,
  Tag,
  AlertTriangle,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface AuditEvent {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, any> | null;
  created_at: string;
}

interface AdminAuditTrailProps {
  events: AuditEvent[];
  isLoading: boolean;
  searchQuery?: string;
}

type EventCategory = "all" | "bookings" | "payments" | "trips" | "contacts" | "security";

// Helper to get relative time in French
function getRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return new Date(dateString).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

// Meta configuration per action
function getActionMeta(action: string) {
  switch (action) {
    case "BOOKING_SUBMITTED":
      return {
        title: "Nouvelle réservation enregistrée",
        icon: CheckCircle2,
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        category: "bookings",
      };
    case "BOOKING_CONTACT_REQUESTED":
      return {
        title: "Demande de rappel / contact reçue",
        icon: PhoneCall,
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        iconBg: "bg-blue-50 text-blue-600 border-blue-100",
        category: "bookings",
      };
    case "BOOKING_ABANDONED_OR_CANCELLED":
      return {
        title: "Réservation annulée / abandonnée",
        icon: XCircle,
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        iconBg: "bg-amber-50 text-amber-600 border-amber-100",
        category: "bookings",
      };
    case "PAYMENT_STATUS_UPDATED":
      return {
        title: "Statut de paiement modifié",
        icon: CreditCard,
        badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
        iconBg: "bg-teal-50 text-teal-600 border-teal-100",
        category: "payments",
      };
    case "BOOKING_DELETED":
      return {
        title: "Réservation supprimée",
        icon: Trash2,
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
        iconBg: "bg-rose-50 text-rose-600 border-rose-100",
        category: "bookings",
      };
    case "MEDICAL_ALERT_ACKNOWLEDGED":
      return {
        title: "Alerte médicale prise en compte",
        icon: HeartPulse,
        badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
        iconBg: "bg-purple-50 text-purple-600 border-purple-100",
        category: "security",
      };
    case "TRIP_CREATED":
      return {
        title: "Nouveau voyage créé",
        icon: MapPin,
        badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
        iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        category: "trips",
      };
    case "TRIP_UPDATED":
      return {
        title: "Voyage mis à jour",
        icon: Edit3,
        badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
        iconBg: "bg-sky-50 text-sky-600 border-sky-100",
        category: "trips",
      };
    case "TRIP_DELETED":
      return {
        title: "Voyage supprimé",
        icon: Trash2,
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
        iconBg: "bg-rose-50 text-rose-600 border-rose-100",
        category: "trips",
      };
    case "CONTACT_SUBMITTED":
      return {
        title: "Nouveau message de contact reçu",
        icon: Mail,
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        iconBg: "bg-blue-50 text-blue-600 border-blue-100",
        category: "contacts",
      };
    case "CONTACT_DELETED":
      return {
        title: "Message de contact supprimé",
        icon: Trash2,
        badgeColor: "bg-zinc-100 text-zinc-700 border-zinc-200",
        iconBg: "bg-zinc-100 text-zinc-600 border-zinc-200",
        category: "contacts",
      };
    case "GDPR_MAINTENANCE_RUN":
      return {
        title: "Maintenance RGPD & Anonymisation",
        icon: ShieldCheck,
        badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
        iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        category: "security",
      };
    default:
      return {
        title: action.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
        icon: Activity,
        badgeColor: "bg-zinc-100 text-zinc-700 border-zinc-200",
        iconBg: "bg-zinc-100 text-zinc-600 border-zinc-200",
        category: "security",
      };
  }
}

// Payment type translation
function formatPaymentType(type: string | undefined): { label: string; color: string } {
  switch (type) {
    case "deposit":
      return { label: "Acompte (30%)", color: "bg-amber-100/80 text-amber-900 border-amber-300" };
    case "installment":
      return { label: "Plusieurs fois (3x / 4x)", color: "bg-blue-100/80 text-blue-900 border-blue-300" };
    case "full":
      return { label: "Paiement comptant", color: "bg-emerald-100/80 text-emerald-900 border-emerald-300" };
    default:
      return { label: type || "Non précisé", color: "bg-zinc-100 text-zinc-700 border-zinc-300" };
  }
}

const AdminAuditTrail: React.FC<AdminAuditTrailProps> = ({ events, isLoading, searchQuery = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("all");
  const [expandedJsonIds, setExpandedJsonIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleJson = (id: string) => {
    setExpandedJsonIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyJson = async (id: string, details: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(details, null, 2));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success("Données JSON copiées dans le presse-papier");
    } catch {
      toast.error("Impossible de copier dans le presse-papier");
    }
  };

  // Filter events by category and search
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const query = searchQuery.trim().toLowerCase();

    return events.filter((evt) => {
      // 1. Category filter
      const meta = getActionMeta(evt.action);
      if (selectedCategory !== "all" && meta.category !== selectedCategory) {
        return false;
      }

      // 2. Search filter
      if (!query) return true;

      const detailsStr = evt.details ? JSON.stringify(evt.details).toLowerCase() : "";
      return (
        evt.action.toLowerCase().includes(query) ||
        meta.title.toLowerCase().includes(query) ||
        (evt.actor_email || "").toLowerCase().includes(query) ||
        (evt.entity_type || "").toLowerCase().includes(query) ||
        (evt.entity_id || "").toLowerCase().includes(query) ||
        detailsStr.includes(query)
      );
    });
  }, [events, selectedCategory, searchQuery]);

  // Count by category
  const categoryCounts = useMemo(() => {
    const counts = {
      all: events?.length || 0,
      bookings: 0,
      payments: 0,
      trips: 0,
      contacts: 0,
      security: 0,
    };

    events?.forEach((evt) => {
      const meta = getActionMeta(evt.action);
      if (meta.category in counts) {
        counts[meta.category as keyof typeof counts]++;
      }
    });

    return counts;
  }, [events]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-12 border border-ink/5 shadow-sm text-center space-y-3 font-dm-sans">
        <div className="inline-block animate-spin text-primary">
          <Activity size={32} />
        </div>
        <p className="text-sm font-medium text-ink/70">Chargement sécurisé du journal d'audit...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-ink/5 shadow-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === "all"
              ? "bg-ink text-white shadow-xs"
              : "bg-transparent text-ink/60 hover:text-ink hover:bg-ink/5"
          }`}
        >
          Tous ({categoryCounts.all})
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory("bookings")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === "bookings"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-transparent text-ink/60 hover:text-ink hover:bg-ink/5"
          }`}
        >
          Réservations ({categoryCounts.bookings})
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory("payments")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === "payments"
              ? "bg-teal-600 text-white shadow-xs"
              : "bg-transparent text-ink/60 hover:text-ink hover:bg-ink/5"
          }`}
        >
          Paiements ({categoryCounts.payments})
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory("trips")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === "trips"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-transparent text-ink/60 hover:text-ink hover:bg-ink/5"
          }`}
        >
          Voyages ({categoryCounts.trips})
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory("contacts")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === "contacts"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-transparent text-ink/60 hover:text-ink hover:bg-ink/5"
          }`}
        >
          Messages ({categoryCounts.contacts})
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory("security")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === "security"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-transparent text-ink/60 hover:text-ink hover:bg-ink/5"
          }`}
        >
          Sécurité & RGPD ({categoryCounts.security})
        </button>
      </div>

      {/* Audit List Container */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-ink/5 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-ink/5">
          <div>
            <h3 className="font-pp-neue-corp-compact font-bold text-2xl uppercase text-ink tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="text-citra-orange" size={24} />
              Journal Immuable d'Audit & Traçabilité
            </h3>
            <p className="text-xs text-ink/60 font-dm-sans mt-0.5">
              Historique certifié des transactions, réservations, consentements et modifications administratives.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 bg-pastel-sand/80 rounded-full text-ink border border-ink/5">
              {filteredEvents.length} entrée{filteredEvents.length > 1 ? "s" : ""} affichée{filteredEvents.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-ink/50 font-dm-sans space-y-2">
            <Activity size={32} className="mx-auto text-ink/20" />
            <p className="text-sm font-semibold">Aucun événement ne correspond à vos critères de recherche.</p>
            {searchQuery && (
              <p className="text-xs text-ink/40">
                Essayez de modifier votre mot-clé ou de réinitialiser le filtre de catégorie.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((evt) => {
              const meta = getActionMeta(evt.action);
              const ActionIcon = meta.icon;
              const details = evt.details || {};
              const isExpanded = !!expandedJsonIds[evt.id];
              const relativeTime = getRelativeTime(evt.created_at);
              const fullDate = new Date(evt.created_at).toLocaleString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              // Extract structured details
              const tripName = details.trip_name;
              const clientEmail = details.client_email;
              const clientName = details.client_name;
              const clientPhone = details.client_phone;
              const paymentType = details.payment_type;
              const priceAtBooking = details.price_at_booking;
              const hasMedicalAlert = details.has_medical_alert;

              // Remaining custom fields
              const knownKeys = new Set([
                "trip_id",
                "trip_name",
                "client_email",
                "client_name",
                "client_phone",
                "payment_type",
                "price_at_booking",
                "has_medical_alert",
              ]);
              const otherEntries = Object.entries(details).filter(([key]) => !knownKeys.has(key));

              return (
                <div
                  key={evt.id}
                  className="rounded-2xl border border-ink/8 hover:border-ink/20 transition-all bg-white hover:shadow-md p-5 font-dm-sans space-y-3.5"
                >
                  {/* Top Bar: Icon, Title, Badges, and Timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${meta.iconBg}`}
                      >
                        <ActionIcon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-ink leading-tight">{meta.title}</h4>
                          <Badge variant="outline" className={`text-[10px] font-mono px-2 py-0.5 ${meta.badgeColor}`}>
                            {evt.action}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] font-medium bg-gray-100 text-ink/70">
                            {evt.entity_type}
                            {evt.entity_id ? ` #${evt.entity_id.slice(0, 8)}` : ""}
                          </Badge>
                        </div>
                        {/* Actor indication */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-ink/60">
                          {evt.actor_email ? (
                            <span className="flex items-center gap-1 text-citra-orange font-medium">
                              <ShieldCheck size={13} /> Par l'administrateur : {evt.actor_email}
                            </span>
                          ) : clientEmail ? (
                            <span className="flex items-center gap-1 text-ink/70">
                              <User size={13} className="text-ink/40" /> Cliente : {clientName ? `${clientName} (${clientEmail})` : clientEmail}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-ink/40">
                              <Clock size={13} /> Action automatique / client public
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Date info */}
                    <div className="text-left sm:text-right shrink-0 pl-13 sm:pl-0">
                      <div className="text-xs font-bold text-ink flex items-center sm:justify-end gap-1.5">
                        <Clock size={12} className="text-citra-orange" />
                        {relativeTime}
                      </div>
                      <div className="text-[11px] text-ink/40" title={evt.created_at}>
                        {fullDate}
                      </div>
                    </div>
                  </div>

                  {/* Structured Details Cards */}
                  {(tripName || clientEmail || paymentType || priceAtBooking !== undefined || hasMedicalAlert !== undefined || otherEntries.length > 0) && (
                    <div className="bg-gray-50/90 rounded-xl p-3.5 border border-ink/5 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                        {tripName && (
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-ink/5 shadow-xs">
                            <Compass size={15} className="text-primary shrink-0" />
                            <div className="truncate">
                              <span className="text-[10px] uppercase font-bold text-ink/40 block">Séjour</span>
                              <span className="font-bold text-ink truncate block">{tripName}</span>
                            </div>
                          </div>
                        )}

                        {paymentType && (
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-ink/5 shadow-xs">
                            <CreditCard size={15} className="text-emerald-600 shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase font-bold text-ink/40 block">Formule Paiement</span>
                              <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border ${formatPaymentType(paymentType).color}`}>
                                {formatPaymentType(paymentType).label}
                              </span>
                            </div>
                          </div>
                        )}

                        {priceAtBooking !== undefined && (
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-ink/5 shadow-xs">
                            <Tag size={15} className="text-citra-orange shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase font-bold text-ink/40 block">Tarif snapshot</span>
                              <span className="font-mono font-bold text-ink">{priceAtBooking} €</span>
                            </div>
                          </div>
                        )}

                        {hasMedicalAlert !== undefined && (
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-ink/5 shadow-xs">
                            <HeartPulse size={15} className={hasMedicalAlert ? "text-rose-600 shrink-0" : "text-emerald-600 shrink-0"} />
                            <div>
                              <span className="text-[10px] uppercase font-bold text-ink/40 block">Alerte Médicale</span>
                              {hasMedicalAlert ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  <AlertTriangle size={11} /> Vigilance requise
                                </span>
                              ) : (
                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Aucune allergie critique
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {clientPhone && (
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-ink/5 shadow-xs">
                            <PhoneCall size={15} className="text-citra-orange shrink-0" />
                            <div className="truncate">
                              <span className="text-[10px] uppercase font-bold text-ink/40 block">Téléphone</span>
                              <a href={`tel:${clientPhone}`} className="font-semibold text-primary hover:underline truncate block">
                                {clientPhone}
                              </a>
                            </div>
                          </div>
                        )}

                        {clientEmail && !tripName && (
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-ink/5 shadow-xs">
                            <Mail size={15} className="text-sky-600 shrink-0" />
                            <div className="truncate">
                              <span className="text-[10px] uppercase font-bold text-ink/40 block">Email contact</span>
                              <a href={`mailto:${clientEmail}`} className="font-semibold text-primary hover:underline truncate block">
                                {clientEmail}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Other dynamic metadata pills */}
                      {otherEntries.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-ink/5">
                          {otherEntries.map(([key, val]) => (
                            <span
                              key={key}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-ink/10 text-ink/70 font-mono"
                            >
                              <strong className="text-ink/90 font-semibold">{key}:</strong>{" "}
                              {typeof val === "object" ? JSON.stringify(val) : String(val)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expandable Raw JSON Technical Inspector */}
                  {details && Object.keys(details).length > 0 && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => toggleJson(evt.id)}
                          className="text-xs text-ink/50 hover:text-ink font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Code size={13} />
                          {isExpanded ? "Masquer les données brutes" : "Afficher le payload JSON certifié"}
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>

                        {isExpanded && (
                          <button
                            type="button"
                            onClick={() => copyJson(evt.id, details)}
                            className="text-xs text-citra-orange hover:text-citra-orange/80 flex items-center gap-1 font-medium transition-colors"
                          >
                            {copiedId === evt.id ? <Check size={13} /> : <Copy size={13} />}
                            {copiedId === evt.id ? "Copié !" : "Copier le JSON"}
                          </button>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="mt-2.5 p-3 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-[11px] overflow-x-auto shadow-inner border border-zinc-800">
                          <pre className="whitespace-pre leading-relaxed">{JSON.stringify(details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditTrail;
