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
    <section id="destinations" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary font-semibold mb-3">
            Nos destinations
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Explorez l'Afrique entre femmes
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            Chaque séjour est un package tout compris : logement, transport, activités touristiques et repas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {trips?.map((d) => {
            const img = d.image_url || fallbackImages[d.destination] || destSenegal;
            return (
              <Link
                to={`/voyages/${d.slug || d.id}`}
                key={d.id}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-card block"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={img}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <span
                  className={`absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    d.tag === "Disponible"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gold text-gold-foreground"
                  }`}
                >
                  {d.tag}
                </span>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-secondary">
                      <MapPin size={16} />
                      <span className="text-sm font-semibold">{d.destination}</span>
                    </div>
                    <span className="font-bold text-lg text-foreground">{d.price} €</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {d.description}
                  </p>
                  <span className="block text-center w-full rounded-full px-6 py-2.5 text-sm font-semibold bg-secondary text-secondary-foreground group-hover:bg-secondary/90 transition-colors">
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
