import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { MapPin, Clock, Users } from "lucide-react";
import destSenegal from "@/assets/dest-senegal.jpg";
import destMaroc from "@/assets/dest-maroc.jpg";
import destTanzanie from "@/assets/dest-tanzanie.jpg";
import goldiesIdeaVideo from "@/assets/goldiesIdea.mp4";

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
    <>
      {/* Video Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <video 
            src={goldiesIdeaVideo} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-3xl mx-auto">
          <p className="font-dm-sans text-sm uppercase tracking-wider text-citra-orange font-bold mb-3 drop-shadow-md">
            SÉJOURS DISPONIBLES
          </p>
          <h1 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-lg">
            Explorez l'Afrique
          </h1>
          <p className="max-w-xl mx-auto text-lg font-dm-sans font-medium text-white/90 leading-relaxed drop-shadow-md">
            Hébergement, transport, activités touristiques, repas et accompagnement local.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section id="destinations" className="py-20 bg-cream-card">
        <div className="container mx-auto max-w-[1280px] px-6">
          <div className="grid md:grid-cols-3 gap-6">
          {trips?.map((d, idx) => {
            // Using halftone placeholder if no photography allowed, but keeping images with halftone overlay for effect.
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
                to={`/voyages/${d.slug || d.id}`}
                key={d.id}
                className={`group relative rounded-cards overflow-hidden ${cardBg} shadow-md hover:shadow-xl flex flex-col p-6 transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Thumbnail - 16:9 or similar with halftone feel */}
                <div className="aspect-[4/3] overflow-hidden rounded-[20px] mb-6 relative">
                  <img
                    src={img}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>
                
                {d.tag && (
                  <span className={`absolute top-10 right-10 text-xs font-dm-sans font-bold px-3 py-1 rounded-tags z-20 ${tagColors}`}>
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
                  
                  <h3 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight mb-2">
                    {d.name}
                  </h3>

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
                  
                  <p className="text-sm font-dm-sans font-medium text-ink/80 leading-relaxed line-clamp-2 mb-6 flex-1">
                    {d.description}
                  </p>
                  
                  {/* Glassmorphism CTA inside card */}
                  <span className="block text-center w-full bg-white/50 backdrop-blur-sm text-ink shadow-sm rounded-buttons py-3 text-sm font-dm-sans font-medium transition-colors group-hover:bg-ink group-hover:text-cream-card">
                    Voir le séjour →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  </>
);
};

export default Destinations;
