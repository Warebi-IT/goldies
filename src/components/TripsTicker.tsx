import { useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { staticTrips } from "@/data/trips";

const TripsTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const { data: trips } = useQuery({
    queryKey: ["ticker-trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("id, slug, name, destination, dates, price, image_url, spots_left")
        .eq("is_active", true)
        .order("start_date", { ascending: true })
        .limit(6);
      if (!error && data && data.length > 0) return data;
      return staticTrips;
    },
    initialData: staticTrips,
  });

  // Triple-duplicate for seamless infinite scroll
  const items = trips ? [...trips, ...trips, ...trips] : [];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden">
      {/* Glassmorphic strip */}
      <div className="bg-white/20 backdrop-blur-md border-t border-white/20 py-3 px-0">
        <div className="flex items-center gap-0 overflow-hidden">
          {/* Fixed label */}
          <div className="flex-shrink-0 flex items-center gap-2 px-5 border-r border-white/30 mr-4">
            <span className="w-2 h-2 rounded-full bg-citra-orange animate-pulse" />
            <span className="font-dm-sans text-[10px] font-black uppercase tracking-[0.15em] text-ink whitespace-nowrap">
              Prochains voyages
            </span>
          </div>

          {/* Scrolling track */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={trackRef}
              className="flex items-center gap-3 animate-ticker whitespace-nowrap"
              style={{ width: "max-content" }}
            >
              {items.map((trip, i) => (
                <Link
                  key={`${trip.id}-${i}`}
                  to={`/voyages/${(trip as any).slug || trip.id}`}
                  className="inline-flex items-center gap-2.5 bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-white/40 hover:border-citra-orange/30 px-3.5 py-1.5 rounded-full transition-all duration-200 hover:scale-105 group flex-shrink-0"
                >
                  <MapPin size={11} className="text-citra-orange flex-shrink-0" />
                  <span className="font-pp-neue-corp-compact font-black uppercase text-[11px] text-ink tracking-tight">
                    {trip.name}
                  </span>
                  <span className="text-ink/30 text-[10px]">·</span>
                  <span className="flex items-center gap-1 text-[10px] font-dm-sans font-medium text-ink/70">
                    <Calendar size={9} className="text-citra-orange" />
                    {(trip as any).dates || "Dates à venir"}
                  </span>
                  {trip.price && (
                    <>
                      <span className="text-ink/30 text-[10px]">·</span>
                      <span className="font-pp-neue-corp-compact font-black text-[11px] text-citra-orange">
                        {typeof trip.price === "number" ? `${trip.price} €` : trip.price}
                      </span>
                    </>
                  )}
                  <ArrowUpRight
                    size={11}
                    className="text-ink/40 group-hover:text-citra-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripsTicker;
