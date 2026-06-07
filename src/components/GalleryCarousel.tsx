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
    <section className="py-20 bg-cream-card">
      {/* Section header */}
      <div className="container mx-auto px-6 mb-12 text-center">
        <p className="text-sm font-dm-sans uppercase tracking-wider font-bold text-citra-orange mb-4">
          GALERIE
        </p>
        <h2 className="font-pp-neue-corp-compact font-black uppercase tracking-tight text-ink text-5xl md:text-7xl mb-4">
          Nos plus beaux moments
        </h2>
        <span className="block font-dm-sans font-medium text-lg text-ink/80">
          Des souvenirs qui durent toute une vie
        </span>
      </div>

      {/* Infinite scroll strip */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-4 overflow-hidden cursor-grab px-6"
        style={{ scrollbarWidth: "none" }}
      >
        {displayPhotos.map((photo, i) => (
          <div
            key={`${photo.id}-${i}`}
            className="flex-shrink-0 overflow-hidden rounded-[32px] shadow-lg bg-white/80"
            style={{ width: "300px", height: "220px" }}
          >
            <div className="w-full h-full relative">
              <img
                src={photo.image_url}
                alt={photo.caption || "Souvenir de voyage Goldies"}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Ghost Secondary Button CTA */}
      <div className="text-center mt-12">
        <Link
          to="/galerie"
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md shadow-md text-ink font-dm-sans font-medium text-base px-8 py-3 rounded-full hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Voir toute la galerie
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default GalleryCarousel;
