import { Link } from "react-router-dom";
import { ArrowRight, Heart, Mail, Shield, Users } from "lucide-react";

const teasers = [
  {
    to: "/concept",
    icon: Heart,
    label: "Concept",
    title: "Voyager entre femmes, avec du sens",
    body: "Découvrez notre vision unique et l'organisation minutieuse de nos séjours solidaires 100% féminins. Chaque détail est pensé pour votre sécurité et votre épanouissement.",
    cta: "En savoir plus",
  },
  {
    to: "/contact",
    icon: Mail,
    label: "Contact",
    title: "Une question ? Parlons-en",
    body: "Remplissez notre formulaire et notre équipe vous recontactera sous 24h avec tous les détails pratiques pour que vous partiez l'esprit serein.",
    cta: "Nous contacter",
  },
];

const trustBadges = [
  { icon: Shield, text: "Voyages sécurisés" },
  { icon: Users, text: "100% féminins" },
  { icon: Heart, text: "Solidaires & inclusifs" },
];

const HomeTeasers = () => (
  <section className="py-20">
    <div className="container mx-auto max-w-[1280px] px-6">
      {/* Trust badges strip */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
        {trustBadges.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-3 px-6 py-3 bg-cream-card rounded-tags border border-ink text-ink font-dm-sans font-medium text-sm"
          >
            <Icon size={16} className="text-citra-orange" />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Teaser cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {teasers.map(({ to, icon: Icon, label, title, body, cta }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col p-8 md:p-12 bg-cream-card rounded-cards border border-ink transition-transform hover:-translate-y-1"
          >
            {/* Icon bubble */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-hazard-yellow border border-ink mb-6">
              <Icon size={24} className="text-ink" />
            </div>

            <p className="text-xs uppercase tracking-wider font-bold font-dm-sans text-citra-orange mb-3">
              {label}
            </p>

            <h3 className="font-pp-neue-corp-compact font-black uppercase tracking-tight text-ink text-3xl md:text-5xl mb-4 group-hover:text-citra-orange transition-colors">
              {title}
            </h3>

            <p className="text-base font-dm-sans font-medium text-ink/80 leading-relaxed mb-8 flex-1">
              {body}
            </p>

            <span className="inline-flex items-center gap-2 text-base font-dm-sans font-medium text-citra-orange group-hover:gap-4 transition-all">
              {cta}
              <ArrowRight size={18} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default HomeTeasers;
