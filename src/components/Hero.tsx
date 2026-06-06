import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import destTanzanie from "@/assets/dest-tanzanie.jpg"; // Using an existing photo, ideally a blue coastal one

const Hero = () => {
  return (
    <section
      id="accueil"
      className="relative w-full h-[600px] md:h-[800px] lg:h-[85vh] min-h-[600px] overflow-hidden rounded-b-[2rem] md:rounded-[2rem] md:m-0"
    >
      {/* Full Bleed Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={destTanzanie} 
          alt="Beautiful coastal view" 
          className="w-full h-full object-cover"
        />
        {/* Subtle dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
        
        {/* Rating Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-dm-sans font-medium mb-6">
          <Star size={12} className="fill-white" />
          4.93 / 5 • 2000+ reviews on Airbnb
        </div>

        {/* Mixed Typography Headline */}
        <h1 className="text-white text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6">
          <span className="font-dm-sans font-bold">Escape the </span>
          <span className="font-serif italic font-normal">ordinary.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/90 font-dm-sans text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed mb-10">
          Find calm in a modern hideaway with stunning views in the heart of Africa.
        </p>

        {/* CTA */}
        <Link 
          to="/voyages"
          className="inline-flex items-center justify-center bg-white text-ink px-8 py-3.5 rounded-full text-base font-dm-sans font-medium transition-transform hover:scale-[1.02] shadow-xl"
        >
          Explore our villa
        </Link>

      </div>
    </section>
  );
};

export default Hero;
