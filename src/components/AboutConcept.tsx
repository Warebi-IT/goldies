import { Package, Users, Heart, Globe } from "lucide-react";

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
  return (
    <section id="concept" className="py-20">
      <div className="container mx-auto max-w-[1280px] px-6">
        {/* About intro */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="font-dm-sans text-sm uppercase tracking-wider text-citra-orange font-bold mb-3">
            QUI SOMMES-NOUS
          </p>
          <h2 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-ink uppercase tracking-tight mb-6">
            Goldies Travel,<br /> c'est quoi ?
          </h2>
          <div className="text-base md:text-lg font-dm-sans text-ink/80 leading-relaxed space-y-8 mb-16 text-left md:text-center">
            <p className="font-medium text-xl md:text-2xl text-ink leading-relaxed">
              <strong className="font-bold text-citra-orange">Bienvenue chez Goldies Travel.</strong> C'est une agence qui a été créée par deux femmes, toutes les deux passionnées par le voyage, l'aventure et surtout les expériences.
            </p>
            
            <div className="relative bg-white/60 backdrop-blur-sm border border-citra-orange/20 p-8 md:p-10 rounded-[32px] text-left md:text-center shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-citra-orange/30 text-8xl font-serif">"</div>
              <p className="relative z-10 text-xl md:text-2xl font-dm-sans font-medium text-ink/90 leading-relaxed">
                Goldies Travel, ce n'est pas seulement voyager, c'est <strong className="text-citra-orange">aider, contribuer, partager.</strong> Nous organisons des voyages entre femmes au Maroc, au Sénégal et dans toute l'Afrique pour vous impacter et vous faire vivre des expériences inoubliables.
              </p>
            </div>

            <p className="font-medium text-lg md:text-xl">
              Si tu es une jeune femme en quête d'impact, n'hésite pas à nous contacter.<br/>
              <span className="inline-block mt-4 bg-hazard-yellow/40 px-4 py-2 rounded-full text-ink font-bold uppercase tracking-wider text-sm shadow-sm">
                Humanitaire entre femmes
              </span>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 bg-white/80 backdrop-blur-sm shadow-xl p-8 rounded-[32px]">
            {[
              { value: "500+", label: "Voyageuses" },
              { value: "2", label: "Destinations" },
              { value: "100%", label: "Féminin" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-pp-neue-corp-compact text-4xl md:text-6xl font-black text-citra-orange leading-none mb-2">
                  {s.value}
                </p>
                <p className="font-dm-sans text-xs text-ink/70 uppercase tracking-wider font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Concept steps */}
        <div className="text-center mb-16">
          <p className="font-dm-sans text-sm uppercase tracking-wider text-citra-orange font-bold mb-3">
            NOTRE CONCEPT
          </p>
          <h2 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-ink uppercase tracking-tight mb-4">
            Comment ça fonctionne ?
          </h2>
          <p className="max-w-xl mx-auto text-lg font-dm-sans font-medium text-ink/80 leading-relaxed">
            Un parcours simplifié pour vous donner la confiance d'oser l'inconnu en toute sérénité.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="bg-white/80 backdrop-blur-sm rounded-[32px] shadow-lg p-8 text-center group transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="w-16 h-16 mx-auto rounded-full shadow-md flex items-center justify-center mb-6 bg-hazard-yellow text-ink transition-colors group-hover:bg-citra-orange">
                <s.icon size={28} />
              </div>
              <span className="font-dm-sans text-xs font-bold text-citra-orange uppercase tracking-wider mb-3 block">
                Étape [0{i + 1}]
              </span>
              <h3 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight mb-4 transition-colors">
                {s.title}
              </h3>
              <p className="text-base font-dm-sans font-medium text-ink/80 leading-relaxed flex-1 transition-colors">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutConcept;
