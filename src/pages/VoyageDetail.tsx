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
    <div className="min-h-screen bg-concrete-canvas text-ink">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] mt-16">
        {trip.image_url && (
          <img src={trip.image_url} alt={trip.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-concrete-canvas via-concrete-canvas/60 to-transparent" />
        <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-12">
          <Link to="/voyages" className="inline-flex items-center gap-2 text-ink/80 hover:text-citra-orange text-sm mb-4 transition-all duration-300 font-dm-sans font-medium">
            <ArrowLeft size={16} /> Tous nos voyages
          </Link>
          <div className="flex items-center gap-2 text-ink/80 mb-2">
            <MapPin size={16} className="text-citra-orange" />
            <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">{trip.destination}</span>
          </div>
          <h1 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-ink uppercase tracking-tight">{trip.name}</h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 bg-concrete-canvas">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl p-8 rounded-[32px]">
              <h2 className="font-pp-neue-corp-compact text-2xl font-black uppercase tracking-tight mb-4">Description</h2>
              <p className="font-dm-sans text-ink/80 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {trip.description || "Aucune description disponible."}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow-xl p-8 rounded-[32px]">
              <h2 className="font-pp-neue-corp-compact text-2xl font-black uppercase tracking-tight mb-6">Programme jour par jour</h2>
              {program.length === 0 ? (
                <p className="font-dm-sans text-sm text-ink/60">Programme à venir.</p>
              ) : (
                <ol className="space-y-6">
                  {program.map((day, i) => (
                    <li key={i} className="bg-white/50 backdrop-blur-sm rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-10 h-10 rounded-full shadow-sm bg-hazard-yellow text-ink flex items-center justify-center font-dm-sans font-bold text-sm">
                          J{i + 1}
                        </span>
                        <h3 className="font-pp-neue-corp-compact text-lg font-black text-ink uppercase tracking-tight">{day.title}</h3>
                      </div>
                      <p className="text-sm font-dm-sans text-ink/80 leading-relaxed whitespace-pre-line">
                        {day.description}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-32 h-fit bg-white/80 backdrop-blur-sm rounded-[32px] shadow-xl p-8 text-ink space-y-6">
            <div className="flex items-baseline justify-between">
              <span className="font-dm-sans text-sm text-ink/60">À partir de</span>
              <span className="font-pp-neue-corp-compact text-4xl font-black text-citra-orange">{trip.price} €</span>
            </div>
            <div className="space-y-4 text-sm border-t border-ink/5 pt-6">
              <div className="flex items-center gap-3 font-dm-sans text-ink/80">
                <Clock size={18} className="text-citra-orange" />
                <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">{trip.duration}</span>
              </div>
              <div className="flex items-center gap-3 font-dm-sans text-ink/80">
                <Calendar size={18} className="text-citra-orange" />
                <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">{trip.dates}</span>
              </div>
            </div>

            {trip.includes && trip.includes.length > 0 && (
              <div className="border-t border-ink/5 pt-6">
                <p className="font-pp-neue-corp-compact text-sm font-black uppercase tracking-wider mb-4 text-ink/80">Inclus dans le séjour</p>
                <ul className="space-y-3">
                  {trip.includes.map((item: string) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-dm-sans text-ink/80">
                      <CheckCircle size={16} className="text-citra-orange" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {trip.payment_link ? (
              <Button asChild className="w-full rounded-full shadow-md bg-white/50 backdrop-blur-sm text-ink hover:bg-ink hover:text-cream-card font-dm-sans font-bold h-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl mt-4">
                <a href={trip.payment_link} target="_blank" rel="noopener noreferrer">
                  Réserver maintenant
                </a>
              </Button>
            ) : (
              <Button disabled className="w-full rounded-full shadow-sm h-14 bg-white/30 text-ink/40 font-dm-sans cursor-not-allowed mt-4">
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
