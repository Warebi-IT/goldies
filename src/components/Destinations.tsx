import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import destSenegal from "@/assets/dest-senegal.jpg";
import destMaroc from "@/assets/dest-maroc.jpg";
import destTanzanie from "@/assets/dest-tanzanie.jpg";

const fallbackImages: Record<string, string> = {
  "Sénégal": destSenegal,
  "Maroc": destMaroc,
  "Tanzanie": destTanzanie,
};

const Destinations = () => {
  const { data: trips } = useQuery({
    queryKey: ["public-trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="destinations" className="py-20">
      <div className="container mx-auto max-w-[1280px] px-6">
        <div className="text-center mb-16">
          <p className="font-dm-sans text-sm uppercase tracking-wider text-citra-orange font-bold mb-3">
            SÉJOURS DISPONIBLES
          </p>
          <h2 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-ink uppercase tracking-tight mb-4">
            Explorez l'Afrique
          </h2>
          <p className="max-w-xl mx-auto text-lg font-dm-sans font-medium text-ink leading-relaxed">
            Hébergement, transport, activités touristiques, repas et accompagnement local.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {trips?.map((d) => {
            // Using halftone placeholder if no photography allowed, but keeping images with halftone overlay for effect.
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
                to={`/voyages/${d.slug || d.id}`}
                key={d.id}
                className="group relative rounded-cards overflow-hidden border border-ink bg-cream-card flex flex-col p-6 transition-transform hover:-translate-y-1"
              >
                {/* Thumbnail - 16:9 or similar with halftone feel */}
                <div className="aspect-[4/3] overflow-hidden rounded-[20px] mb-6 relative border border-ink/20">
                  <div className="absolute inset-0 bg-gradient-to-tr from-citra-orange to-ion-violet mix-blend-color z-10 opacity-30 group-hover:opacity-0 transition-opacity"></div>
                  <img
                    src={img}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                
                {d.tag && (
                  <span className={`absolute top-10 right-10 text-xs font-dm-sans font-bold px-3 py-1 rounded-tags border z-20 ${tagColors}`}>
                    {d.tag}
                  </span>
                )}

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-ink/70">
                      <MapPin size={14} />
                      <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">{d.destination}</span>
                    </div>
                    <span className="font-pp-neue-corp-compact font-black text-2xl text-ink">{d.price} €</span>
                  </div>
                  
                  <h3 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight mb-3">
                    {d.name}
                  </h3>
                  
                  <p className="text-sm font-dm-sans font-medium text-ink/80 leading-relaxed line-clamp-3 mb-6 flex-1">
                    {d.description}
                  </p>
                  
                  {/* Primary button style inside card */}
                  <span className="block text-center w-full bg-citra-orange text-ink rounded-buttons py-3 text-sm font-dm-sans font-medium transition-transform group-hover:scale-[1.02]">
                    Voir le voyage
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
