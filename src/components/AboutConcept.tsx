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
    <section id="concept" className="py-24 bg-sky-canvas border-t border-cloud-white/10">
      <div className="container mx-auto px-6">
        {/* About intro */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="font-control-tnt text-xs uppercase tracking-[0.2em] text-action-blue font-bold mb-3">
            [ QUI SOMMES-NOUS ]
          </p>
          <h2 className="font-control-compressed text-4xl md:text-6xl font-black text-cloud-white uppercase tracking-tight mb-2">
            Goldies Travel, c'est quoi ?
          </h2>
          <span className="font-control-cursive text-2xl text-cloud-white/80 block mb-8">
            Une aventure humaine d'empouvoirement et de partage
          </span>
          <div className="text-base md:text-lg text-cloud-white/90 leading-relaxed space-y-6 mb-12">
            <p>
              <strong className="text-cloud-white font-bold underline decoration-action-blue decoration-2">Goldies Travel</strong> est une agence de voyage spécialisée dans
              l'organisation d'expériences touristiques et solidaires en groupe,{" "}
              <strong className="text-cloud-white font-bold underline decoration-action-blue decoration-2">100% féminin</strong>. Notre mission : permettre aux femmes
              francophones de 18 à 45 ans de découvrir l'Afrique dans un cadre
              sécurisé, bienveillant et enrichissant.
            </p>
            <p>
              Nous croyons fermement que le voyage est un vecteur puissant de transformation
              personnelle et de solidarité. Chaque séjour intègre un volet
              associatif pour soutenir activement le travail des communautés locales.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 border border-cloud-white/10 p-8 rounded-cards bg-cloud-white/5 backdrop-blur-sm">
            {[
              { value: "500+", label: "Voyageuses" },
              { value: "2", label: "Destinations" },
              { value: "100%", label: "Féminin" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-control-compressed text-3xl md:text-5xl font-black text-cloud-white">
                  {s.value}
                </p>
                <p className="font-control-tnt text-xs text-cloud-white/70 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Concept steps */}
        <div className="text-center mb-16">
          <p className="font-control-tnt text-xs uppercase tracking-[0.2em] text-action-blue font-bold mb-3">
            [ NOTRE CONCEPT ]
          </p>
          <h2 className="font-control-compressed text-4xl md:text-6xl font-black text-cloud-white uppercase tracking-tight mb-2">
            Comment ça fonctionne ?
          </h2>
          <p className="max-w-xl mx-auto text-sm font-control text-cloud-white/80 leading-relaxed">
            Un parcours simplifié pour vous donner la confiance d'oser l'inconnu en toute sérénité.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="bg-haze-grey rounded-[12px] p-8 text-center border border-midnight-ink/10 hover:border-action-blue transition-all duration-300 flex flex-col shadow-none"
            >
              <div className="w-14 h-14 mx-auto rounded-full border border-midnight-ink/10 flex items-center justify-center mb-6 text-action-blue bg-cloud-white shadow-sm">
                <s.icon size={24} />
              </div>
              <span className="font-control-tnt text-xs font-bold text-action-blue uppercase tracking-wider mb-2 block">
                Étape [0{i + 1}]
              </span>
              <h3 className="font-control-compressed text-lg font-black text-midnight-ink uppercase tracking-tight mb-3">
                {s.title}
              </h3>
              <p className="text-sm font-control text-charcoal-text/80 leading-relaxed flex-1">
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
