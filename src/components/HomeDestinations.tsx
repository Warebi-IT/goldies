import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, ArrowRight, Users, Calendar } from "lucide-react";
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
  const { data: trips } = useQuery({
    queryKey: ["public-trips-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("is_active", true)
        .order("created_at")
        .limit(3);
      if (error) throw error;
      return data;
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
        <div className="grid md:grid-cols-3 gap-6">
          {trips?.map((d, idx) => {
            const img = d.image_url || fallbackImages[d.destination] || destSenegal;
            
            const bgColors = ["bg-pastel-sand", "bg-pastel-sage", "bg-pastel-rose", "bg-pastel-peach", "bg-pastel-lime"];
            const cardBg = bgColors[idx % bgColors.length];
            
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
                className={`group relative flex flex-col overflow-hidden ${cardBg} shadow-md hover:shadow-xl rounded-cards p-6 transition-all duration-300 hover:-translate-y-1`}
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-ink/70">
                      <MapPin size={14} />
                      <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">{d.destination}</span>
                    </div>
                    <span className="font-pp-neue-corp-compact font-black text-2xl text-ink">{d.price} €</span>
                  </div>

                  <h3 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight mb-3 group-hover:text-citra-orange transition-colors">
                    {d.name}
                  </h3>

                  <p className="text-sm font-dm-sans font-medium text-ink/80 leading-relaxed line-clamp-2 mb-6 flex-1">
                    {d.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 mb-6 text-xs font-dm-sans font-medium text-ink/60">
                    {d.duration && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {d.duration}
                      </span>
                    )}
                    {d.max_participants && (
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {d.max_participants} places max
                      </span>
                    )}
                  </div>

                  {/* Ghost Button CTA inside card */}
                  <span className="block text-center w-full bg-white/50 backdrop-blur-sm text-ink shadow-sm rounded-buttons py-3 text-sm font-dm-sans font-medium transition-colors group-hover:bg-ink group-hover:text-cream-card">
                    Voir le séjour →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

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
