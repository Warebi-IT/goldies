import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import destSenegal from "@/assets/dest-senegal.jpg";
import destMaroc from "@/assets/dest-maroc.jpg";
import destTanzanie from "@/assets/dest-tanzanie.jpg";
import { MapPin } from "lucide-react";

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
    <section id="destinations" className="py-24 bg-sky-canvas">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-control-tnt text-xs uppercase tracking-[0.2em] text-action-blue font-bold mb-3">
            [ 02 // SÉJOURS DISPONIBLES ]
          </p>
          <h2 className="font-control-compressed text-4xl md:text-6xl font-black text-cloud-white uppercase tracking-tight mb-2">
            Explorez l'Afrique entre femmes
          </h2>
          <span className="font-control-cursive text-2xl text-cloud-white/80 block mb-4">
            Des moments d'authenticité, d'échange et de déconnexion
          </span>
          <p className="max-w-xl mx-auto text-sm font-control text-cloud-white/80 leading-relaxed">
            Chaque séjour est un package tout compris : hébergement, transport, activités touristiques, repas et accompagnement local.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {trips?.map((d) => {
            const img = d.image_url || fallbackImages[d.destination] || destSenegal;
            return (
              <Link
                to={`/voyages/${d.slug || d.id}`}
                key={d.id}
                className="group relative rounded-cards overflow-hidden border border-cloud-white/10 bg-cloud-white shadow-none hover:border-action-blue/40 transition-all duration-300 flex flex-col p-4"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-images mb-4">
                  <img
                    src={img}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <span
                  className="absolute top-8 right-8 text-[11px] font-control-tnt font-bold uppercase tracking-wider px-3 py-1 rounded-buttons border border-action-blue bg-cloud-white text-action-blue shadow-sm"
                >
                  {d.tag}
                </span>
                <div className="flex-1 flex flex-col px-2 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-action-blue">
                      <MapPin size={14} />
                      <span className="font-control-tnt text-xs font-bold uppercase tracking-wider">{d.destination}</span>
                    </div>
                    <span className="font-control-tnt font-bold text-base text-midnight-ink">{d.price} €</span>
                  </div>
                  <h3 className="font-control-compressed text-xl font-black text-midnight-ink uppercase tracking-tight group-hover:text-action-blue transition-colors mb-2">
                    {d.name}
                  </h3>
                  <p className="text-sm font-control text-charcoal-text/80 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {d.description}
                  </p>
                  <span className="block text-center w-full border border-action-blue bg-transparent text-action-blue group-hover:bg-action-blue group-hover:text-cloud-white rounded-buttons py-2.5 text-xs font-control font-medium transition-colors">
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
