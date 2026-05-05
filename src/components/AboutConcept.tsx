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
    <section id="concept" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* About intro */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary font-semibold mb-3">
            Qui sommes-nous
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-8">
            Goldies Travel, c'est quoi ?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            <strong className="text-foreground">Goldies Travel</strong> est une agence de voyage spécialisée dans
            l'organisation d'expériences touristiques et solidaires en groupe,{" "}
            <strong className="text-foreground">100% féminin</strong>. Notre mission : permettre aux femmes
            francophones de 18 à 45 ans de découvrir l'Afrique dans un cadre
            sécurisé, bienveillant et enrichissant.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            Nous croyons que le voyage est un vecteur de transformation
            personnelle et de solidarité. Chaque séjour intègre un volet
            associatif pour soutenir les communautés locales.
          </p>
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: "500+", label: "Voyageuses" },
              { value: "2", label: "Destinations" },
              { value: "100%", label: "Féminin" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary">
                  {s.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Concept steps */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary font-semibold mb-3">
            Notre concept
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Comment ça fonctionne ?
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            Un parcours simplifié pour que vous puissiez vous concentrer sur l'essentiel : profiter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="bg-card rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/15 flex items-center justify-center mb-5">
                <s.icon size={26} className="text-primary" />
              </div>
              <span className="text-xs font-bold text-secondary mb-2 block">
                Étape {i + 1}
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
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
