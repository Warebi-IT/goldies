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
    <section
      id="destinations"
      className="py-28"
      style={{ backgroundColor: "var(--color-sky-canvas)" }}
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p
            className="text-xs uppercase tracking-[0.2em] font-bold mb-4"
            style={{
              fontFamily: "var(--font-control-tnt)",
              color: "var(--color-action-blue)",
            }}
          >
            [ Séjours ]
          </p>
          <h2
            className="font-black uppercase tracking-tight leading-none mb-3"
            style={{
              fontFamily: "var(--font-control-compressed)",
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
              color: "var(--color-midnight-ink)",
            }}
          >
            Explorez l'Afrique entre femmes
          </h2>
          <span
            className="block mb-5"
            style={{
              fontFamily: "var(--font-control-cursive)",
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              color: "var(--color-action-blue)",
            }}
          >
            Des voyages en groupe qui inspirent confiance et sororité
          </span>
          <p
            className="max-w-xl mx-auto text-sm leading-relaxed"
            style={{
              fontFamily: "var(--font-control)",
              color: "var(--color-charcoal-text)",
              opacity: 0.8,
            }}
          >
            Chaque séjour est un package tout compris : hébergement, transport,
            activités solidaires et repas. Tout est pensé pour votre tranquillité.
          </p>
        </div>

        {/* Trip cards */}
        <div className="grid md:grid-cols-3 gap-7">
          {trips?.map((d, idx) => {
            const img = d.image_url || fallbackImages[d.destination] || destSenegal;
            return (
              <Link
                key={d.id}
                to={`/voyages/${d.slug || d.id}`}
                className="group relative flex flex-col overflow-hidden transition-all duration-300"
                style={{
                  background: "var(--color-cloud-white)",
                  borderRadius: "var(--radius-cards)",
                  border: "1px solid rgba(0,0,0,0.07)",
                  animationDelay: `${idx * 0.1}s`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 8px 30px rgba(219,122,141,0.18)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(219,122,141,0.4)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 1px 4px rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(0,0,0,0.07)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden" style={{ borderRadius: "var(--radius-images) var(--radius-images) 0 0" }}>
                  <img
                    src={img}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Tag badge */}
                {d.tag && (
                  <span
                    className="absolute top-4 right-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1"
                    style={{
                      fontFamily: "var(--font-control-tnt)",
                      background: "var(--color-cloud-white)",
                      color: "var(--color-action-blue)",
                      borderRadius: "100px",
                      border: "1px solid var(--color-action-blue)",
                    }}
                  >
                    {d.tag}
                  </span>
                )}

                {/* Card content */}
                <div className="flex-1 flex flex-col p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="flex items-center gap-1.5"
                      style={{ color: "var(--color-action-blue)" }}
                    >
                      <MapPin size={13} />
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-control-tnt)" }}
                      >
                        {d.destination}
                      </span>
                    </div>
                    <span
                      className="font-bold text-base"
                      style={{
                        fontFamily: "var(--font-control-tnt)",
                        color: "var(--color-midnight-ink)",
                      }}
                    >
                      {d.price} €
                    </span>
                  </div>

                  <h3
                    className="font-black uppercase tracking-tight mb-2 group-hover:text-action-blue transition-colors"
                    style={{
                      fontFamily: "var(--font-control-compressed)",
                      fontSize: "1.2rem",
                      color: "var(--color-midnight-ink)",
                    }}
                  >
                    {d.name}
                  </h3>

                  <p
                    className="text-sm leading-relaxed line-clamp-2 mb-5 flex-1"
                    style={{
                      fontFamily: "var(--font-control)",
                      color: "var(--color-charcoal-text)",
                      opacity: 0.75,
                    }}
                  >
                    {d.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: "var(--color-charcoal-text)", opacity: 0.6, fontFamily: "var(--font-control)" }}>
                    {d.duration && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {d.duration}
                      </span>
                    )}
                    {d.max_participants && (
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {d.max_participants} places max
                      </span>
                    )}
                  </div>

                  <span
                    className="block text-center w-full py-2.5 text-xs font-semibold transition-all"
                    style={{
                      fontFamily: "var(--font-control)",
                      border: "1.5px solid var(--color-action-blue)",
                      color: "var(--color-action-blue)",
                      borderRadius: "var(--radius-buttons)",
                      background: "transparent",
                    }}
                  >
                    Voir le séjour →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            to="/voyages"
            className="inline-flex items-center justify-center gap-2 transition-all"
            style={{
              fontFamily: "var(--font-control)",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "2px solid var(--color-action-blue)",
              color: "var(--color-action-blue)",
              background: "transparent",
              borderRadius: "var(--radius-buttons)",
              padding: "12px 32px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-action-blue)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-action-blue)";
            }}
          >
            Voir tous nos voyages
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeDestinations;
