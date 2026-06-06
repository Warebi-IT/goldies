import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const GalleryCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { data: photos } = useQuery({
    queryKey: ["gallery-carousel-photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*, gallery_albums!inner(is_published)")
        .eq("gallery_albums.is_published", true)
        .order("sort_order")
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !photos?.length) return;

    let animId: number;
    const speed = 0.5;

    const animate = () => {
      if (!isPaused) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [photos, isPaused]);

  if (!photos?.length) return null;

  const displayPhotos = [...photos, ...photos];

  return (
    <section className="py-28" style={{ backgroundColor: "var(--color-haze-grey)" }}>
      {/* Section header */}
      <div className="container mx-auto px-6 mb-12 text-center">
        <p
          className="text-xs uppercase tracking-[0.2em] font-bold mb-4"
          style={{
            fontFamily: "var(--font-control-tnt)",
            color: "var(--color-action-blue)",
          }}
        >
          [ Galerie ]
        </p>
        <h2
          className="font-black uppercase tracking-tight leading-none mb-2"
          style={{
            fontFamily: "var(--font-control-compressed)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "var(--color-midnight-ink)",
          }}
        >
          Nos plus beaux moments
        </h2>
        <span
          className="block"
          style={{
            fontFamily: "var(--font-control-cursive)",
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            color: "var(--color-action-blue)",
          }}
        >
          Des souvenirs qui durent toute une vie
        </span>
      </div>

      {/* Infinite scroll strip */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-4 overflow-hidden cursor-grab"
        style={{ scrollbarWidth: "none", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        {displayPhotos.map((photo, i) => (
          <div
            key={`${photo.id}-${i}`}
            className="flex-shrink-0 overflow-hidden"
            style={{
              width: "300px",
              height: "220px",
              borderRadius: "var(--radius-images)",
            }}
          >
            <img
              src={photo.image_url}
              alt={photo.caption || "Souvenir de voyage Goldies"}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link
          to="/galerie"
          className="inline-flex items-center gap-2 transition-all"
          style={{
            fontFamily: "var(--font-control)",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "2px solid var(--color-action-blue)",
            color: "var(--color-action-blue)",
            background: "transparent",
            borderRadius: "100px",
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
          Voir toute la galerie
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default GalleryCarousel;
