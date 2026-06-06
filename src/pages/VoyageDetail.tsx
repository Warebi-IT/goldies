import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VoyageDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: trip, isLoading } = useQuery({
    queryKey: ["trip-detail", id],
    queryFn: async () => {
      // Try slug first, then id
      let q = await supabase.from("trips").select("*").eq("slug", id!).maybeSingle();
      if (!q.data) {
        q = await supabase.from("trips").select("*").eq("id", id!).maybeSingle();
      }
      if (q.error) throw q.error;
      return q.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Voyage introuvable</h1>
          <Link to="/voyages" className="text-secondary underline">Retour aux voyages</Link>
        </div>
      </div>
    );
  }

  const program: Array<{ title: string; description: string }> = Array.isArray(trip.program)
    ? (trip.program as any)
    : [];

  return (
    <div className="min-h-screen bg-sky-canvas text-cloud-white">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] mt-16 border-b border-cloud-white/10">
        {trip.image_url && (
          <img src={trip.image_url} alt={trip.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-canvas via-sky-canvas/40 to-transparent" />
        <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-12">
          <Link to="/voyages" className="inline-flex items-center gap-2 text-cloud-white/90 hover:text-action-blue text-sm mb-4 transition-all duration-300 font-control font-medium">
            <ArrowLeft size={16} /> Tous nos voyages
          </Link>
          <div className="flex items-center gap-2 text-cloud-white/90 mb-2">
            <MapPin size={16} className="text-action-blue" />
            <span className="font-control-tnt text-xs font-bold uppercase tracking-wider">{trip.destination}</span>
          </div>
          <h1 className="font-control-compressed text-4xl md:text-6xl font-black text-cloud-white uppercase tracking-tight">{trip.name}</h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 bg-sky-canvas">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="backdrop-blur-md bg-cloud-white/5 border border-cloud-white/10 p-8 rounded-cards">
              <h2 className="font-control-compressed text-2xl font-black uppercase tracking-tight mb-4">Description</h2>
              <p className="font-control text-cloud-white/90 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {trip.description || "Aucune description disponible."}
              </p>
            </div>

            <div className="backdrop-blur-md bg-cloud-white/5 border border-cloud-white/10 p-8 rounded-cards">
              <h2 className="font-control-compressed text-2xl font-black uppercase tracking-tight mb-6">Programme jour par jour</h2>
              {program.length === 0 ? (
                <p className="font-control text-sm text-cloud-white/60">Programme à venir.</p>
              ) : (
                <ol className="space-y-6">
                  {program.map((day, i) => (
                    <li key={i} className="bg-haze-grey rounded-[12px] p-6 border border-midnight-ink/10 text-charcoal-text shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-9 h-9 rounded-full border border-midnight-ink/10 bg-cloud-white text-action-blue flex items-center justify-center font-control-tnt font-bold text-sm shadow-sm">
                          J{i + 1}
                        </span>
                        <h3 className="font-control-compressed text-lg font-black text-midnight-ink uppercase tracking-tight">{day.title}</h3>
                      </div>
                      <p className="text-sm font-control text-charcoal-text/80 leading-relaxed whitespace-pre-line">
                        {day.description}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit bg-cloud-white rounded-cards p-8 border border-midnight-ink/10 text-midnight-ink space-y-6 shadow-none">
            <div className="flex items-baseline justify-between">
              <span className="font-control text-sm text-charcoal-text/60">À partir de</span>
              <span className="font-control-tnt text-3xl font-black text-action-blue">{trip.price} €</span>
            </div>
            <div className="space-y-3 text-sm border-t border-midnight-ink/10 pt-6">
              <div className="flex items-center gap-2 font-control text-charcoal-text/80">
                <Clock size={16} className="text-action-blue" />
                <span className="font-control-tnt text-xs font-bold uppercase tracking-wider">{trip.duration}</span>
              </div>
              <div className="flex items-center gap-2 font-control text-charcoal-text/80">
                <Calendar size={16} className="text-action-blue" />
                <span className="font-control-tnt text-xs font-bold uppercase tracking-wider">{trip.dates}</span>
              </div>
            </div>

            {trip.includes && trip.includes.length > 0 && (
              <div className="border-t border-midnight-ink/10 pt-6">
                <p className="font-control-compressed text-sm font-black uppercase tracking-wider mb-3">Inclus dans le séjour</p>
                <ul className="space-y-2.5">
                  {trip.includes.map((item: string) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-control text-charcoal-text/85">
                      <CheckCircle size={14} className="text-action-blue" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {trip.payment_link ? (
              <Button asChild className="w-full rounded-buttons border border-action-blue bg-transparent text-action-blue hover:bg-action-blue hover:text-cloud-white font-control font-medium h-12 transition-all">
                <a href={trip.payment_link} target="_blank" rel="noopener noreferrer">
                  Réserver maintenant
                </a>
              </Button>
            ) : (
              <Button disabled className="w-full rounded-buttons h-12 bg-haze-grey text-charcoal-text/40 border border-midnight-ink/10 cursor-not-allowed">
                Réservation bientôt disponible
              </Button>
            )}
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VoyageDetail;
