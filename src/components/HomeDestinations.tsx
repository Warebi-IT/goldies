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
    <section id="destinations" className="py-20">
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
          {trips?.map((d) => {
            const img = d.image_url || fallbackImages[d.destination] || destSenegal;
            
            // Dynamic color logic for trip status
            let tagColors = "bg-hazard-yellow text-ink border-ink"; // Default
            if (d.tag) {
              const t = d.tag.toLowerCase();
              if (t.includes("complet") || t.includes("fermé")) {
                tagColors = "bg-ink text-cream-card border-ink";
              } else if (t.includes("dernier") || t.includes("bientôt") || t.includes("alerte")) {
                tagColors = "bg-citra-orange text-ink border-ink";
              }
            }
            
            return (
              <Link
                key={d.id}
                to={`/voyages/${d.slug || d.id}`}
                className="group relative flex flex-col overflow-hidden bg-cream-card rounded-cards border border-ink p-6 transition-transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden rounded-[20px] mb-6 relative border border-ink/20">
                  <div className="absolute inset-0 bg-gradient-to-tr from-citra-orange to-ion-violet mix-blend-color z-10 opacity-30 group-hover:opacity-0 transition-opacity"></div>
                  <img
                    src={img}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>

                {/* Tag badge */}
                {d.tag && (
                  <span className={`absolute top-10 right-10 text-xs font-dm-sans font-bold px-3 py-1 rounded-tags border z-20 ${tagColors}`}>
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
                  <span className="block text-center w-full bg-transparent text-ink border border-ink rounded-buttons py-3 text-sm font-dm-sans font-medium transition-colors group-hover:bg-ink group-hover:text-cream-card">
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
            className="inline-flex items-center justify-center gap-2 bg-citra-orange text-ink px-8 py-3 rounded-buttons text-base font-dm-sans font-medium transition-transform hover:scale-[1.02]"
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
