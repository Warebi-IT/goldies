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
    <section id="concept" className="py-20 border-t border-ink/20">
      <div className="container mx-auto max-w-[1280px] px-6">
        {/* About intro */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="font-dm-sans text-sm uppercase tracking-wider text-citra-orange font-bold mb-3">
            QUI SOMMES-NOUS
          </p>
          <h2 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-ink uppercase tracking-tight mb-6">
            Goldies Travel,<br /> c'est quoi ?
          </h2>
          <div className="text-base md:text-lg font-dm-sans font-medium text-ink/80 leading-relaxed space-y-6 mb-12">
            <p>
              <strong className="text-ink font-bold bg-hazard-yellow/50 px-1">Goldies Travel</strong> est une agence de voyage spécialisée dans
              l'organisation d'expériences touristiques et solidaires en groupe,{" "}
              <strong className="text-ink font-bold bg-hazard-yellow/50 px-1">100% féminin</strong>. Notre mission : permettre aux femmes
              francophones de 18 à 45 ans de découvrir l'Afrique dans un cadre
              sécurisé, bienveillant et enrichissant.
            </p>
            <p>
              Nous croyons fermement que le voyage est un vecteur puissant de transformation
              personnelle et de solidarité. Chaque séjour intègre un volet
              associatif pour soutenir activement le travail des communautés locales.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 border border-ink bg-cream-card p-8 rounded-cards">
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
              className="bg-cream-card rounded-cards p-8 text-center border border-ink hover:bg-ink group transition-colors flex flex-col"
            >
              <div className="w-16 h-16 mx-auto rounded-full border border-ink flex items-center justify-center mb-6 bg-hazard-yellow text-ink transition-colors group-hover:border-cream-card">
                <s.icon size={28} />
              </div>
              <span className="font-dm-sans text-xs font-bold text-citra-orange uppercase tracking-wider mb-3 block">
                Étape [0{i + 1}]
              </span>
              <h3 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight mb-4 group-hover:text-cream-card transition-colors">
                {s.title}
              </h3>
              <p className="text-base font-dm-sans font-medium text-ink/80 leading-relaxed flex-1 group-hover:text-cream-card/80 transition-colors">
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
