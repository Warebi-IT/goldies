import React, { useEffect, useRef } from "react";
import destSenegal from "@/assets/dest-senegal.jpg";
import destMaroc from "@/assets/dest-maroc.jpg";
import destTanzanie from "@/assets/dest-tanzanie.jpg";

const BackgroundFX: React.FC = () => {
  const auraRef = useRef<HTMLDivElement>(null);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initial center position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      // 1. Smooth trailing for the aura (Lerp)
      auraX += (mouseX - auraX) * 0.05;
      auraY += (mouseY - auraY) * 0.05;

      if (auraRef.current) {
        // Center the aura on the cursor
        auraRef.current.style.transform = `translate(${auraX}px, ${auraY}px) translate(-50%, -50%)`;
      }

      // 2. Parallax effect for the image masks
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate normalized offset from center (-1 to +1)
      const moveX = (mouseX - centerX) / centerX;
      const moveY = (mouseY - centerY) / centerY;

      parallaxRefs.current.forEach((el, index) => {
        if (!el) return;
        // Different layers move at different speeds based on index
        const depth = (index + 1) * 20; 
        el.style.transform = `translate(${moveX * -depth}px, ${moveY * -depth}px)`;
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-50] overflow-hidden pointer-events-none select-none bg-concrete-canvas">
      
      {/* 
        Interactive Cursor Aura 
        A massive glowing orb that smoothly trails the user's mouse.
      */}
      <div 
        ref={auraRef}
        className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-[0.20] mix-blend-multiply"
        style={{ 
          backgroundColor: "var(--color-citra-orange)",
          willChange: "transform"
        }}
      />

      {/* 
        Masked Image 1: The Massive Arch (Right side)
      */}
      <div ref={el => parallaxRefs.current[0] = el} className="absolute inset-0 w-full h-full" style={{ willChange: "transform" }}>
        <div 
          className="absolute top-[-10vh] right-[-5vw] w-[45vw] h-[85vh] overflow-hidden"
          style={{ 
            borderRadius: "9999px 9999px 0 0",
            opacity: 0.12,
            mixBlendMode: "multiply"
          }}
        >
          <img 
            src={destSenegal} 
            alt="" 
            className="w-full h-full object-cover animate-pan-slow"
          />
        </div>
      </div>

      {/* 
        Masked Image 2: Organic Blob (Bottom Left)
      */}
      <div ref={el => parallaxRefs.current[1] = el} className="absolute inset-0 w-full h-full" style={{ willChange: "transform" }}>
        <div 
          className="absolute bottom-[-15vh] left-[-10vw] w-[40vw] h-[40vw] overflow-hidden"
          style={{ 
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            opacity: 0.15,
            mixBlendMode: "multiply",
            transform: "rotate(-15deg)"
          }}
        >
          <img 
            src={destMaroc} 
            alt="" 
            className="w-full h-full object-cover animate-pan-slow"
            style={{ animationDirection: "alternate-reverse", animationDuration: "35s" }}
          />
        </div>
      </div>

      {/* 
        Masked Image 3: The Floating Pill (Center top)
      */}
      <div ref={el => parallaxRefs.current[2] = el} className="absolute inset-0 w-full h-full" style={{ willChange: "transform" }}>
        <div 
          className="absolute top-[10vh] left-[25vw] w-[15vw] h-[35vw] overflow-hidden rounded-full"
          style={{ 
            opacity: 0.1,
            mixBlendMode: "multiply",
            transform: "rotate(35deg)"
          }}
        >
          <img 
            src={destTanzanie} 
            alt="" 
            className="w-full h-full object-cover animate-pan-slow"
            style={{ animationDuration: "40s" }}
          />
        </div>
      </div>

      {/* 
        Living Noise Overlay 
        Stays static relative to mouse to feel like a lens filter
      */}
      <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-[0.05] mix-blend-overlay animate-noise-jitter">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
      
    </div>
  );
};

export default BackgroundFX;
