import { useState } from "react";
import { Link } from "react-router-dom";
import InteractiveAfricaMap from "./InteractiveAfricaMap";
import imgChildren from "@/assets/children.jpeg";
import imgFourImage from "@/assets/fourimagegoldiesChlidrenWomen.jpeg";
import imgWomenScarf from "@/assets/womenwithscarf.jpeg";
import onlyWomen from "@/assets/onlywomen.jpeg";

const Hero = () => {
  const [activeImg, setActiveImg] = useState<number | null>(null);

  const handleImgClick = (index: number) => {
    setActiveImg(activeImg === index ? null : index);
  };

  return (
    <section
      id="accueil"
      className="relative z-0 w-full h-[100dvh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 bg-transparent"
    >
      {/* Background Image (Behind Everything) */}
      <div className="absolute inset-0 w-full h-full z-[-2]">
        <img src={onlyWomen} alt="Hero Background" className="w-full h-full object-cover" />
      </div>

      <InteractiveAfricaMap />
      {/* 
        Left Content (Text)
      */}
      <div className="relative z-10 w-full lg:w-[70%] xl:w-[75%] flex flex-col items-start text-left mt-[15vh] pointer-events-none pr-0 lg:pr-12">

        {/* Badge aligned left */}
        <div className="uppercase tracking-[0.2em] text-xs font-dm-sans font-bold text-ink/60 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6 pointer-events-none w-max">
          100% Féminin • 100% Solidaire
        </div>

        {/* Headline */}
        <h1 className="text-ink text-3xl md:text-5xl lg:text-[3.5rem] xl:text-[4.5rem] tracking-tight mb-8 leading-[1.05]">
          <span className="font-dm-sans font-bold block">Voyagez autrement,</span>
          <span className="font-serif italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 block mt-1">vivez pleinement</span>
        </h1>

        {/* Subtitle */}
        <p className="text-ink/80 font-dm-sans text-sm md:text-base max-w-lg font-light leading-relaxed mb-12 bg-white/30 backdrop-blur-sm p-4 rounded-2xl md:bg-transparent md:backdrop-blur-none md:p-0">
          Des séjours en groupe exclusivement féminins à la découverte de l'Afrique. Logement, transport, activités et repas inclus.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pointer-events-auto">
          <Link 
            to="/voyages"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#e99ba9] text-white px-8 py-4 rounded-full text-base font-dm-sans font-bold transition-transform hover:scale-105 shadow-[0_8px_30px_rgb(233,155,169,0.3)]"
          >
            Découvrir nos séjours
          </Link>
          <Link 
            to="/concept"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white/80 backdrop-blur-md text-ink border border-ink/10 px-8 py-4 rounded-full text-base font-dm-sans font-bold transition-all hover:bg-white shadow-lg"
          >
            Notre concept
          </Link>
        </div>

      </div>

      {/* 
        Right Content (Photos)
        A beautiful collage of photos perfectly balancing the right edge.
      */}
      <div className="relative z-10 w-full lg:w-[30%] xl:w-[25%] mt-[5vh] lg:mt-[15vh] flex justify-center lg:justify-end pointer-events-none">
        <div className="relative w-full max-w-[320px] md:max-w-[400px] aspect-[3/4]">
           
           {/* Backdrop for active image */}
           {activeImg !== null && (
             <div 
               className="fixed inset-0 z-40 bg-white/30 backdrop-blur-md cursor-pointer pointer-events-auto transition-all duration-500" 
               onClick={() => setActiveImg(null)}
             />
           )}

           {/* Third Photo (Top Right, Behind) -> z-0 */}
           <div 
             onClick={() => handleImgClick(0)}
             className={`absolute -top-12 -right-12 w-3/4 aspect-square rounded-[2rem] overflow-hidden shadow-xl border-[6px] border-white transition-all duration-500 pointer-events-auto cursor-pointer
               ${activeImg === 0 ? 'z-50 scale-125 rotate-0 shadow-2xl' : 'z-0 rotate-12 hover:rotate-6 hover:scale-[1.05] opacity-90 hover:opacity-100'}
             `}
           >
             <img src={imgFourImage} alt="Collage Femmes et Enfants" className="w-full h-full object-cover" />
           </div>

           {/* Main Photo (Tall) -> z-10 */}
           <div 
             onClick={() => handleImgClick(1)}
             className={`absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white transition-all duration-500 pointer-events-auto cursor-pointer
               ${activeImg === 1 ? 'z-50 scale-[1.15] rotate-0' : 'z-10 rotate-3 hover:rotate-1 hover:scale-[1.02]'}
             `}
           >
             <img src={imgWomenScarf} alt="Femmes avec foulard" className="w-full h-full object-cover" />
           </div>
           
           {/* Overlapping Photo (Square/Small) -> z-20 */}
           <div 
             onClick={() => handleImgClick(2)}
             className={`absolute -bottom-8 -left-12 w-2/3 aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white transition-all duration-500 pointer-events-auto cursor-pointer
               ${activeImg === 2 ? 'z-50 scale-[1.35] rotate-0 -translate-y-8 translate-x-8' : 'z-20 -rotate-6 hover:-rotate-2 hover:scale-[1.05]'}
             `}
           >
             <img src={imgChildren} alt="Enfants" className="w-full h-full object-cover" />
           </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;
