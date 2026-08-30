import { Package, Users, Heart, Globe, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import AnimatedStrings from "./AnimatedStrings";
import AnimatedImpact from "./AnimatedImpact";
import ExplorerGirl from "./ExplorerGirl";

const steps = [
  {
    icon: Globe,
    title: "L'immersion culturelle",
    desc: "Découvrir un pays à travers ses habitants, ses traditions, son patrimoine, son artisanat et sa gastronomie.",
  },
  {
    icon: Users,
    title: "L'expérience humaine",
    desc: "Créer des liens authentiques entre les participantes et favoriser des rencontres qui dépassent le simple cadre du voyage.",
  },
  {
    icon: Heart,
    title: "Le tourisme responsable",
    desc: "Collaborer avec des acteurs locaux et intégrer des actions solidaires afin que nos voyages aient également un impact positif.",
  },
  {
    icon: Package,
    title: "La sécurité et l'accompagnement",
    desc: "Chaque séjour est entièrement organisé et encadré afin que les participantes puissent profiter pleinement de leur expérience en toute sérénité.",
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
            [ À PROPOS DE GOLDIES TRAVEL ]
          </p>
          <h1 className="font-pp-neue-corp-compact text-6xl md:text-8xl lg:text-[7rem] font-black text-ink uppercase tracking-tight mb-8 leading-[0.9]">
            Voyager <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-citra-orange to-rose-400">Autrement</span>
          </h1>
          <p className="max-w-2xl mx-auto font-dm-sans text-xl md:text-2xl text-ink/70 font-medium leading-relaxed">
            Goldies Travel est une agence spécialisée dans l'organisation de voyages immersifs et expérientiels en Afrique. Chaque voyage est pensé comme une véritable expérience humaine où les rencontres, le partage et l'immersion sont au cœur de chaque journée.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-[1280px] px-6">
        
        {/* 2. LE MANIFESTE EN BENTO GRID */}
        <div className="grid md:grid-cols-12 gap-6 mb-32 max-w-[1200px] mx-auto">
          {/* Main Statement */}
          <div className="md:col-span-8 bg-pastel-sand/40 rounded-[40px] p-10 md:p-14 relative overflow-hidden group border border-white/50 shadow-sm">
            <div className="absolute -top-10 -right-10 p-8 text-white group-hover:scale-110 transition-transform duration-700 opacity-80">
               <Users size={250} strokeWidth={0.5} />
            </div>
            <div className="relative z-10">
              <p className="font-dm-sans text-sm uppercase tracking-widest text-citra-orange font-bold mb-4">LES FONDATRICES</p>
              <h3 className="font-pp-neue-corp-compact text-4xl md:text-5xl font-black text-ink mb-6 uppercase tracking-tight">
                Une aventure née d'une <span className="text-citra-orange">passion commune</span>
              </h3>
              <p className="font-dm-sans text-lg md:text-xl text-ink/80 leading-relaxed max-w-xl font-medium">
                Goldies Travel a été fondée par Aïda Fall et Naïma Arrazki, deux jeunes entrepreneures diplômées de Sciences Po. Animées par leur passion pour l'Afrique, les voyages et les échanges interculturels, elles ont imaginé Goldies Travel afin de proposer une nouvelle manière de voyager : plus humaine, plus authentique et plus responsable.
              </p>
            </div>
          </div>
          
          {/* Stat Box */}
          <div className="md:col-span-4 bg-citra-orange text-white rounded-[40px] p-10 flex flex-col justify-center items-center text-center shadow-lg shadow-citra-orange/20 hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
            </div>
            <p className="font-pp-neue-corp-compact text-7xl font-black mb-2 relative z-10">100+</p>
            <p className="font-dm-sans text-sm uppercase tracking-widest font-bold opacity-90 relative z-10">Participantes</p>
          </div>

          {/* Quote Box */}
          <div className="md:col-span-5 bg-ink text-white rounded-[40px] p-10 md:p-12 relative flex flex-col justify-between overflow-hidden group shadow-xl">
             <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-700">
                <Heart size={200} />
             </div>
             <div className="text-citra-orange text-7xl font-serif leading-none mb-4 absolute top-8 left-8 opacity-40">"</div>
             <div className="relative z-10 mt-12">
               <p className="font-dm-sans text-xl md:text-2xl font-medium leading-relaxed mb-8">
                  Faire découvrir les richesses du continent africain tout en créant des expériences qui marquent durablement les participantes.
               </p>
               <span className="inline-block bg-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                 Incubé à Sciences Po
               </span>
             </div>
          </div>

          {/* Features List */}
          <div className="md:col-span-7 bg-white rounded-[40px] p-10 md:p-12 flex flex-col justify-center relative overflow-hidden border border-ink/5 shadow-sm hover:shadow-md transition-shadow duration-300">
             <h3 className="font-pp-neue-corp-compact text-3xl font-black text-ink mb-8 uppercase tracking-tight">Pourquoi choisir Goldies Travel ?</h3>
             <ul className="space-y-5">
               {[
                 "Des voyages organisés de A à Z",
                 "Des groupes à taille humaine",
                 "Une immersion culturelle authentique",
                 "Un accompagnement avant, pendant et après le voyage",
                 "Des expériences solidaires et rencontres inoubliables",
                 "Une équipe passionnée par l'Afrique"
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
              NOTRE VISION
            </p>
            <h2 className="font-pp-neue-corp-compact text-5xl md:text-6xl font-black text-ink uppercase tracking-tight mb-4">
              4 Engagements
            </h2>
            <p className="max-w-xl mx-auto text-lg font-dm-sans font-medium text-ink/70">
              Nous croyons que le voyage est bien plus qu'un simple déplacement. C'est une opportunité de rencontrer, d'apprendre et de créer des souvenirs inoubliables.
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

      {/* 4. SECTION IMPACT SOLIDAIRE (CITRA ORANGE / SOFT PINK) */}
      <div className="relative w-full py-32 bg-citra-orange overflow-hidden">
        {/* Subtle decorative animations */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] pointer-events-none animate-float-slow"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-white/30 rounded-full blur-[100px] pointer-events-none animate-float-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Abstract animated impact over the background */}
        <div className="absolute inset-0 opacity-100 pointer-events-none z-0">
           <AnimatedImpact />
        </div>
        
        <div className="container mx-auto max-w-[1280px] px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <p className="font-dm-sans text-sm uppercase tracking-widest text-ink font-black mb-4 flex items-center gap-2">
                <Users size={16} fill="currentColor" />
                UNE COMMUNAUTÉ EN PLEINE CROISSANCE
              </p>
              <h2 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-8 leading-[0.9] drop-shadow-sm">
                Bien plus<br/>qu'une agence
              </h2>
              <p className="font-dm-sans text-xl md:text-2xl text-white/95 leading-relaxed mb-10 font-medium">
                C'est une communauté qui rassemble des milliers de personnes passionnées par la découverte de l'Afrique. Notre présence digitale nous permet d'inspirer quotidiennement notre audience.
              </p>
              <a href="https://www.instagram.com/goldies.travel" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white text-ink px-8 py-4 rounded-full font-dm-sans font-black hover:bg-ink hover:text-white transition-all duration-300 shadow-xl hover:-translate-y-1">
                Suivez l'aventure <ArrowRight size={20} />
              </a>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 lg:ml-10">
              <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 border border-white flex flex-col items-center justify-center text-center transition-all duration-300 shadow-xl hover:shadow-2xl group hover:-translate-y-2">
                <h4 className="font-pp-neue-corp-compact font-black text-ink group-hover:text-citra-orange transition-colors text-4xl mb-3">+ 45 000</h4>
                <p className="font-dm-sans text-base text-ink/80 font-medium leading-relaxed">
                  Abonnés sur TikTok
                </p>
              </div>
              <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 border border-white flex flex-col items-center justify-center text-center sm:translate-y-12 transition-all duration-300 shadow-xl hover:shadow-2xl mt-6 sm:mt-0 group hover:-translate-y-2">
                <h4 className="font-pp-neue-corp-compact font-black text-ink group-hover:text-citra-orange transition-colors text-4xl mb-3">+ 3 400</h4>
                <p className="font-dm-sans text-base text-ink/80 font-medium leading-relaxed">
                  Abonnés sur Instagram
                </p>
              </div>
              <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 border border-white flex flex-col items-center justify-center text-center transition-all duration-300 shadow-xl hover:shadow-2xl mt-6 sm:mt-16 group hover:-translate-y-2 sm:col-span-2">
                <h4 className="font-pp-neue-corp-compact font-black text-ink group-hover:text-citra-orange transition-colors text-4xl mb-3">+ 300 000</h4>
                <p className="font-dm-sans text-base text-ink/80 font-medium leading-relaxed">
                  Personnes touchées grâce aux réseaux sociaux de nos fondatrices et marques.
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
