import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AnimatedStrings from "./AnimatedStrings";

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
    let scrollPos = el.scrollLeft;

    const animate = () => {
      if (!isPaused) {
        scrollPos += 0.8; // Safe fractional increment with accumulator
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      } else {
        // Sync accumulator with the current scroll position
        scrollPos = el.scrollLeft;
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [photos, isPaused]);

  if (!photos?.length) return null;

  const displayPhotos = [...photos, ...photos];

  return (
    <section className="relative py-24 bg-[#BCE3F1] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <AnimatedStrings />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-pastel-lime/60 rounded-full blur-[120px] animate-float-slow mix-blend-multiply opacity-80"></div>
        <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-blue-300/40 rounded-full blur-[100px] animate-float-slow mix-blend-multiply opacity-80" style={{ animationDelay: "2s" }}></div>
        <div className="absolute -bottom-40 left-1/4 w-[800px] h-[600px] bg-emerald-300/30 rounded-full blur-[150px] animate-float-slow mix-blend-multiply opacity-80" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Section header */}
      <div className="relative z-10 container mx-auto px-6 mb-12 text-center">
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
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="relative z-10 flex gap-4 overflow-x-auto cursor-grab px-6 py-4 touch-pan-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .touch-pan-x::-webkit-scrollbar { display: none; }
        `}} />
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
      <div className="relative z-10 text-center mt-12">
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
