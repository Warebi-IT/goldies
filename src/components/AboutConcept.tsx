import { Package, Users, Heart, Globe, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import InteractiveAfricaMap from "./InteractiveAfricaMap";
import AnimatedStrings from "./AnimatedStrings";
import AnimatedImpact from "./AnimatedImpact";
import ExplorerGirl from "./ExplorerGirl";

const steps = [
  {
    icon: Globe,
    title: "Choisissez votre destination",
    desc: "Sénégal, Maroc et bientôt d'autres pays africains. Consultez le programme détaillé de chaque séjour.",
  },
  {
    icon: Package,
    title: "Package tout compris",
    desc: "Logement, transport, activités, nourriture et budget association inclus. Seul le billet d'avion reste à votre charge.",
  },
  {
    icon: Users,
    title: "Voyagez en groupe",
    desc: "Des séjours 100% féminins pour créer des liens forts et vivre une expérience unique entre femmes.",
  },
  {
    icon: Heart,
    title: "Impact solidaire",
    desc: "Une partie de votre séjour contribue à des projets associatifs locaux. Voyager avec du sens.",
  },
];

const AboutConcept = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  const [smileCount, setSmileCount] = useState(0);
  const isSmiling = smileCount > 0;

  // Map scroll progress to vertical position percentage (from 0% to 100% of the timeline height)
  const characterTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="concept" className="w-full overflow-hidden">
      
      {/* 1. HERO SECTION SPECTACULAIRE */}
      <div className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-pastel-peach/10 to-white"></div>
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-pastel-rose/30 rounded-full blur-[120px] animate-float-slow opacity-60"></div>
          <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-pastel-lime/20 rounded-full blur-[100px] animate-float-slow opacity-60" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="container mx-auto max-w-[1280px] relative z-10 text-center">
          <p className="font-dm-sans text-sm uppercase tracking-widest text-citra-orange font-bold mb-6">
            [ NOTRE RAISON D'ÊTRE ]
          </p>
          <h1 className="font-pp-neue-corp-compact text-6xl md:text-8xl lg:text-[7rem] font-black text-ink uppercase tracking-tight mb-8 leading-[0.9]">
            Voyager <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-citra-orange to-rose-400">Autrement</span>
          </h1>
          <p className="max-w-2xl mx-auto font-dm-sans text-xl md:text-2xl text-ink/70 font-medium leading-relaxed">
            Goldies Travel est une agence créée par deux femmes, pour les femmes. Passionnées par l'aventure, nous créons des expériences qui changent des vies.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-[1280px] px-6">
        
        {/* 2. LE MANIFESTE EN BENTO GRID */}
        <div className="grid md:grid-cols-12 gap-6 mb-32 max-w-[1200px] mx-auto">
          {/* Main Statement */}
          <div className="md:col-span-8 bg-pastel-sand/40 rounded-[40px] p-10 md:p-14 relative overflow-hidden group border border-white/50 shadow-sm">
            <div className="absolute -top-10 -right-10 p-8 text-white group-hover:scale-110 transition-transform duration-700 opacity-80">
               <Globe size={250} strokeWidth={0.5} />
            </div>
            <div className="relative z-10">
              <h3 className="font-pp-neue-corp-compact text-4xl md:text-5xl font-black text-ink mb-6 uppercase tracking-tight">
                Plus qu'un voyage,<br/>une <span className="text-citra-orange">mission</span>.
              </h3>
              <p className="font-dm-sans text-lg md:text-xl text-ink/80 leading-relaxed max-w-xl font-medium">
                Nous ne sommes pas une agence ordinaire. Goldies Travel, ce n'est pas seulement voyager, c'est aider, contribuer et partager. Nous organisons des expéditions en Afrique pour vous impacter profondément.
              </p>
            </div>
          </div>
          
          {/* Stat Box */}
          <div className="md:col-span-4 bg-citra-orange text-white rounded-[40px] p-10 flex flex-col justify-center items-center text-center shadow-lg shadow-citra-orange/20 hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
            </div>
            <p className="font-pp-neue-corp-compact text-7xl font-black mb-2 relative z-10">500+</p>
            <p className="font-dm-sans text-sm uppercase tracking-widest font-bold opacity-90 relative z-10">Voyageuses Impactées</p>
          </div>

          {/* Quote Box */}
          <div className="md:col-span-5 bg-ink text-white rounded-[40px] p-10 md:p-12 relative flex flex-col justify-between overflow-hidden group shadow-xl">
             <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-700">
                <Heart size={200} />
             </div>
             <div className="text-citra-orange text-7xl font-serif leading-none mb-4 absolute top-8 left-8 opacity-40">"</div>
             <div className="relative z-10 mt-12">
               <p className="font-dm-sans text-xl md:text-2xl font-medium leading-relaxed mb-8">
                  Une immersion authentique dans la culture, avec une empreinte positive et durable sur les communautés.
               </p>
               <span className="inline-block bg-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                 100% Féminin
               </span>
             </div>
          </div>

          {/* Features List */}
          <div className="md:col-span-7 bg-white rounded-[40px] p-10 md:p-12 flex flex-col justify-center relative overflow-hidden border border-ink/5 shadow-sm hover:shadow-md transition-shadow duration-300">
             <h3 className="font-pp-neue-corp-compact text-3xl font-black text-ink mb-8 uppercase tracking-tight">L'Expérience Goldies</h3>
             <ul className="space-y-5">
               {[
                 "Des séjours 100% exclusifs entre femmes",
                 "Un package logistique tout inclus (hors vol)",
                 "Une immersion authentique et éthique",
                 "Des actions de solidarité locale"
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-5 font-dm-sans text-lg text-ink/80 font-medium group">
                   <div className="w-10 h-10 rounded-full bg-pastel-sage/30 flex flex-shrink-0 items-center justify-center text-ink group-hover:bg-citra-orange group-hover:text-white transition-colors duration-300">
                     <Sparkles size={16} />
                   </div>
                   {item}
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* 3. TIMELINE "NOTRE CONCEPT" */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <p className="font-dm-sans text-sm uppercase tracking-wider text-citra-orange font-bold mb-3">
              MÉTHODOLOGIE
            </p>
            <h2 className="font-pp-neue-corp-compact text-5xl md:text-6xl font-black text-ink uppercase tracking-tight mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="max-w-xl mx-auto text-lg font-dm-sans font-medium text-ink/70">
              Un parcours simplifié pour vous donner la confiance d'oser l'inconnu en toute sérénité.
            </p>
          </div>

          <div className="max-w-[1000px] mx-auto relative" ref={timelineRef}>
            {/* Vertical Line */}
            <div className="absolute left-[28px] md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-citra-orange/10 via-citra-orange/40 to-citra-orange/10 md:-translate-x-1/2 rounded-full"></div>
            
            {/* Explorer Girl Scroll Animation */}
            <motion.div 
              className="absolute left-[28px] md:left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              style={{ top: characterTop }}
            >
              {/* Adding a slight bounce animation when she is smiling */}
              <div className={`w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] border-2 border-citra-orange flex items-center justify-center -mt-10 md:-mt-12 transition-transform duration-300 ${isSmiling ? 'scale-125 -translate-y-2' : 'scale-100'}`}>
                <ExplorerGirl isSmiling={isSmiling} className="w-16 h-16 md:w-20 md:h-20" />
              </div>
            </motion.div>
            
            <div className="space-y-12 md:space-y-24">
              {steps.map((s, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div key={i} className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Timeline Dot with Glow - Now using motion.div to precisely track intersection with Dora */}
                    <motion.div 
                      viewport={{ margin: "-40% 0px -40% 0px", amount: "some" }}
                      onViewportEnter={() => setSmileCount(c => c + 1)}
                      onViewportLeave={() => setSmileCount(c => Math.max(0, c - 1))}
                      className="absolute left-[13px] md:left-1/2 top-8 md:top-1/2 w-8 h-8 rounded-full bg-white border-[6px] border-citra-orange md:-translate-x-1/2 md:-translate-y-1/2 z-10 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                    />
                    
                    {/* Empty space for alternating layout */}
                    <div className="hidden md:block md:w-1/2"></div>
                    
                    {/* Content Card */}
                    <div className="md:w-1/2 w-full pl-20 md:pl-0 group">
                      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-ink/5 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pastel-sage/30 rounded-full blur-[40px] group-hover:bg-pastel-peach/40 group-hover:scale-150 transition-all duration-700 pointer-events-none"></div>
                        
                        <div className="w-16 h-16 rounded-2xl bg-pastel-sand text-citra-orange flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10">
                          <s.icon size={28} />
                        </div>
                        <span className="font-dm-sans text-xs font-bold text-citra-orange uppercase tracking-wider mb-2 block relative z-10">
                          Étape 0{i + 1}
                        </span>
                        <h3 className="font-pp-neue-corp-compact text-3xl font-black text-ink uppercase tracking-tight mb-4 relative z-10">
                          {s.title}
                        </h3>
                        <p className="font-dm-sans text-ink/70 leading-relaxed text-lg relative z-10">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* 4. SECTION IMPACT SOLIDAIRE (VIBRANT SUNSET MESH) */}
      <div className="relative w-full py-32 overflow-hidden">
        {/* Animated Mesh Gradient Background representing warmth, humanity and African sunset */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D95F3B] to-[#C04A2A] z-0"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-hazard-yellow rounded-full mix-blend-overlay filter blur-[120px] opacity-80 animate-float-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-[#FF6B9E] rounded-full mix-blend-overlay filter blur-[150px] opacity-70 animate-float-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[40%] w-[50%] h-[50%] bg-[#BCE3F1] rounded-full mix-blend-overlay filter blur-[100px] opacity-40 animate-float-slow" style={{ animationDelay: '4s' }}></div>
        
        {/* Abstract animated impact over the gradient */}
        <div className="absolute inset-0 opacity-100 pointer-events-none z-0">
           <AnimatedImpact />
        </div>
        
        <div className="container mx-auto max-w-[1280px] px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Subtle dark gradient behind text for guaranteed readability */}
              <div className="absolute -inset-10 bg-gradient-to-r from-ink/30 to-transparent blur-2xl -z-10 rounded-full"></div>
              
              <p className="font-dm-sans text-sm uppercase tracking-widest text-[#F7CA44] font-black mb-4 flex items-center gap-2 drop-shadow-md">
                <Heart size={16} fill="currentColor" />
                L'ESSENCE DE GOLDIES
              </p>
              <h2 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-8 leading-[0.9] drop-shadow-xl">
                Humanitaire<br/>entre femmes
              </h2>
              <p className="font-dm-sans text-xl md:text-2xl text-white leading-relaxed mb-10 font-medium drop-shadow-lg">
                Si tu es une jeune femme en quête d'impact, tu es au bon endroit. Une partie de chaque séjour est systématiquement dédiée à soutenir des initiatives associatives locales.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-3 bg-white text-citra-orange px-8 py-4 rounded-full font-dm-sans font-black hover:bg-ink hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-xl hover:-translate-y-1">
                S'engager avec nous <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 lg:ml-10">
              <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-8 border border-white/30 flex flex-col items-center text-center hover:bg-white/20 transition-all duration-300 shadow-2xl shadow-ink/10 group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Heart size={32} className="text-white drop-shadow-md" />
                </div>
                <h4 className="font-dm-sans font-bold text-white text-xl mb-3 drop-shadow-md">Soutien Local</h4>
                <p className="font-dm-sans text-base text-white/90 font-medium leading-relaxed drop-shadow-sm">
                  Aide directe et matérielle aux populations et orphelinats vulnérables.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-8 border border-white/30 flex flex-col items-center text-center sm:translate-y-12 hover:bg-white/20 transition-all duration-300 shadow-2xl shadow-ink/10 mt-6 sm:mt-0 group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Users size={32} className="text-white drop-shadow-md" />
                </div>
                <h4 className="font-dm-sans font-bold text-white text-xl mb-3 drop-shadow-md">Sororité</h4>
                <p className="font-dm-sans text-base text-white/90 font-medium leading-relaxed drop-shadow-sm">
                  Un espace de confiance et de bienveillance 100% féminin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutConcept;
