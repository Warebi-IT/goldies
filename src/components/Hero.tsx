import { Link } from "react-router-dom";
import { Compass, Sparkles } from "lucide-react";
import InteractiveHeart from "./InteractiveHeart";
import videoSenegal from "@/assets/goldiessenegalversion.mp4";

const Hero = () => {

  return (
    <section
      id="accueil"
      className="relative z-0 w-full h-[100dvh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 bg-transparent"
    >
      {/* Background Video (Behind Everything) */}
      <div className="absolute inset-0 w-full h-full z-[-2] overflow-hidden bg-black">
        <video 
          src={videoSenegal} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      <InteractiveHeart />
      {/* 
        Left Content (Text)
      */}
      <div className="relative z-10 w-full lg:w-[70%] xl:w-[75%] flex flex-col items-start text-left mt-24 lg:mt-[15vh] pointer-events-none pr-0 lg:pr-12">

        {/* Badges */}
        <div className="flex flex-col gap-3 mb-6 pointer-events-none">
          <div className="uppercase tracking-[0.2em] text-xs font-dm-sans font-bold text-ink/60 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm w-max">
            100% Féminin • 100% Solidaire
          </div>
          <Link to="/avis" className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm w-max hover:bg-white/70 hover:-translate-y-0.5 transition-all duration-300 pointer-events-auto cursor-pointer">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-citra-orange">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span className="font-dm-sans text-sm font-bold text-ink">4.93 / 5</span>
            <span className="font-dm-sans text-sm text-ink/70 mx-0.5">•</span>
            <span className="font-dm-sans text-sm font-medium text-ink/80">200+ avis</span>
          </Link>
        </div>

        {/* Headline */}
        <h1 className="text-ink text-3xl md:text-5xl lg:text-[3.5rem] xl:text-[4.5rem] tracking-tight mb-8 leading-[1.05]">
          <span className="font-dm-sans font-bold block">Voyager autrement.</span>
          <span className="font-serif italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 block mt-1">Rencontrer, partager, grandir.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-black font-dm-sans text-base md:text-lg max-w-lg font-medium leading-relaxed mb-12">
          Goldies Travel est une agence spécialisée dans l'organisation de voyages immersifs et expérientiels en Afrique. Depuis plus de trois ans, nous imaginons des séjours qui vont bien au-delà du tourisme traditionnel.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pointer-events-auto">
          <Link 
            to="/voyages"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#e99ba9] text-white px-8 py-4 rounded-full text-base font-dm-sans font-bold transition-transform hover:scale-105 shadow-[0_8px_30px_rgb(233,155,169,0.3)]"
          >
            <Compass size={20} strokeWidth={2.5} />
            Découvrir nos séjours
          </Link>
          <Link 
            to="/concept"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md text-ink px-8 py-4 rounded-full text-base font-dm-sans font-bold transition-all hover:bg-white shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Sparkles size={20} strokeWidth={2.5} />
            Notre concept
          </Link>
        </div>

      </div>

      {/* Photo collage removed per user request */}
    </section>
  );
};

export default Hero;
