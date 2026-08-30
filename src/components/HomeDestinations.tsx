import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, ArrowRight, Users, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import destSenegal from "@/assets/dest-senegal.jpg";
import destMaroc from "@/assets/dest-maroc.jpg";
import destTanzanie from "@/assets/dest-tanzanie.jpg";

const fallbackImages: Record<string, string> = {
  "Sénégal": destSenegal,
  "Maroc": destMaroc,
  "Tanzanie": destTanzanie,
};

const HomeDestinations = () => {
  const { data: trips, isLoading } = useQuery({
    queryKey: ["home-trips"],
    queryFn: async () => {
      let result = [];
      const today = new Date().toISOString();

      // 1. Try to fetch featured trips, gracefully handle error if column doesn't exist
      const { data: featured, error: fError } = await supabase
        .from("trips")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3);
        
      if (!fError && featured) {
        result = [...featured];
      }

      // 2. If we need more trips (or if featured failed), fetch closest upcoming
      if (result.length < 3) {
        const { data: upcoming } = await supabase
          .from("trips")
          .select("*")
          .eq("is_active", true)
          .gte("start_date", today)
          .order("start_date", { ascending: true })
          .limit(10);
          
        const existingIds = new Set(result.map((t) => t.id));
        for (const trip of upcoming || []) {
          if (result.length >= 3) break;
          if (!existingIds.has(trip.id)) {
            result.push(trip);
            existingIds.add(trip.id);
          }
        }
      }

      // 3. If still < 3, fetch latest as a last resort
      if (result.length < 3) {
        const { data: latest } = await supabase
          .from("trips")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(10);
          
        const existingIds = new Set(result.map((t) => t.id));
        for (const trip of latest || []) {
          if (result.length >= 3) break;
          if (!existingIds.has(trip.id)) {
            result.push(trip);
            existingIds.add(trip.id);
          }
        }
      }

      return result;
    },
  });

  return (
    <section id="destinations" className="relative z-10 py-20">
      <div className="container mx-auto max-w-[1280px] px-6">
        
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-dm-sans uppercase tracking-wider font-bold text-citra-orange mb-3">
            SÉJOURS
          </p>
          <h2 className="font-pp-neue-corp-compact font-black uppercase tracking-tight text-ink text-5xl md:text-7xl mb-4">
            Explorez l'Afrique
          </h2>
          <p className="max-w-xl mx-auto text-lg font-dm-sans font-medium text-ink leading-relaxed">
            Des voyages en groupe qui inspirent confiance et sororité. Hébergement, transport,
            activités solidaires et repas inclus.
          </p>
        </div>

        {/* Trip cards */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-citra-orange border-t-transparent rounded-full animate-spin"></div>
            <p className="text-ink/60 font-dm-sans font-medium">Chargement des voyages...</p>
          </div>
        ) : trips && trips.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {trips.map((d, idx) => {
              const img = d.image_url || fallbackImages[d.destination] || destSenegal;
            
            // Dynamic color logic for trip status
            let tagColors = "bg-amber-400 text-ink shadow-sm"; // Default
            if (d.tag) {
              const t = d.tag.toLowerCase();
              if (t.includes("complet") || t.includes("fermé") || t.includes("clôturé") || t.includes("cloture")) {
                tagColors = "bg-rose-500 text-white shadow-sm";
              } else if (t.includes("non disponible") || t.includes("bientôt") || t.includes("fermeture")) {
                tagColors = "bg-gray-200 text-ink shadow-sm";
              } else if (t.includes("disponible") || t.includes("ouvert")) {
                tagColors = "bg-emerald-500 text-white shadow-sm";
              }
            }
            
            return (
              <Link
                key={d.id}
                to={`/voyages/${d.slug || d.id}`}
                className={`group relative flex flex-col overflow-hidden bg-cream-card shadow-md hover:shadow-xl rounded-cards p-6 transition-all duration-300 hover:-translate-y-1 border border-ink/5`}
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] overflow-hidden rounded-[20px] mb-6 relative">
                  <img
                    src={img}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>

                {/* Tag badge */}
                {d.tag && (
                  <span className={`absolute top-10 right-10 text-xs font-dm-sans font-bold px-3 py-1 rounded-tags z-20 ${tagColors}`}>
                    {d.tag}
                  </span>
                )}

                {/* Card content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-ink/70 mb-2">
                    <MapPin size={14} />
                    <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">{d.destination}</span>
                  </div>

                  <h3 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight mb-3 group-hover:text-citra-orange transition-colors">
                    {d.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-3">
                    {typeof d.price === "number" ? (
                      <div className="flex items-baseline gap-1">
                        <span className="font-pp-neue-corp-compact text-3xl font-black text-citra-orange">{d.price} €</span>
                        <span className="text-xs font-dm-sans font-bold text-ink/50">/pers.</span>
                      </div>
                    ) : (
                      <span className="font-pp-neue-corp-compact text-lg font-black text-citra-orange">{d.price}</span>
                    )}
                  </div>

                  {/* Dates du voyage */}
                  <div className="inline-flex items-center gap-2 text-ink font-dm-sans text-xs font-extrabold bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full mb-3 border border-ink/10 shadow-2xs w-fit">
                    <Calendar size={14} className="text-citra-orange shrink-0" />
                    <span>{d.dates}</span>
                  </div>

                  <div className="flex items-center gap-3 text-ink/70 mb-3 text-xs font-dm-sans font-bold">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{d.duration}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{(d as any).spots_left ?? 8} Places restantes</span>
                    </div>
                  </div>

                  {/* Payment options */}
                  <div className="mb-3 px-3 py-1.5 bg-[#FFE1E8]/60 text-ink/80 text-[11px] font-dm-sans font-bold rounded-md w-fit flex items-center gap-1.5">
                    Acompte {(d as any).deposit_amount ? `${(d as any).deposit_amount} €` : typeof d.price === "number" ? `${Math.round(d.price * 0.3)} €` : "30%"} ou 3x sans frais
                  </div>

                  <p className="text-sm font-dm-sans font-medium text-ink/80 leading-relaxed line-clamp-2 mb-6 flex-1">
                    {d.description}
                  </p>

                  {/* Ghost Button CTA inside card */}
                  <span className="block text-center w-full bg-white/50 backdrop-blur-sm text-ink shadow-sm rounded-buttons py-3 text-sm font-dm-sans font-medium transition-colors group-hover:bg-ink group-hover:text-cream-card">
                    Voir le séjour →
                  </span>
                </div>
              </Link>
            );
          })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-ink/5 shadow-sm">
            <p className="text-ink/60 font-dm-sans">Aucun voyage mis à la une pour le moment.</p>
          </div>
        )}

        {/* Global CTA */}
        <div className="text-center mt-12">
          <Link
            to="/voyages"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-md shadow-md text-ink rounded-full font-dm-sans font-bold text-lg transition-transform hover:scale-105"
          >
            Voir tous nos voyages
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeDestinations;
