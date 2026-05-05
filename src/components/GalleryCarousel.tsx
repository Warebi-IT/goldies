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
    let speed = 0.5;

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

  // Duplicate for infinite scroll effect
  const displayPhotos = [...photos, ...photos];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 mb-10">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary font-semibold mb-3">
            Souvenirs de voyage
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Nos plus beaux moments
          </h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-4 overflow-hidden cursor-grab"
        style={{ scrollbarWidth: "none" }}
      >
        {displayPhotos.map((photo, i) => (
          <div
            key={`${photo.id}-${i}`}
            className="flex-shrink-0 w-72 h-48 md:w-96 md:h-64 rounded-xl overflow-hidden"
          >
            <img
              src={photo.image_url}
              alt={photo.caption || "Souvenir de voyage"}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/galerie"
          className="inline-flex items-center gap-2 rounded-full border-2 border-secondary text-secondary px-8 py-3 text-sm font-semibold hover:bg-secondary hover:text-secondary-foreground transition-colors"
        >
          Voir toute la galerie
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default GalleryCarousel;
