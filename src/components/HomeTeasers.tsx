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
  <section
    className="py-28"
    style={{ backgroundColor: "var(--color-sky-canvas)" }}
  >
    <div className="container mx-auto px-6">
      {/* Trust badges strip */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-20">
        {trustBadges.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2.5 px-5 py-2.5"
            style={{
              background: "var(--color-cloud-white)",
              borderRadius: "100px",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Icon
              size={15}
              style={{ color: "var(--color-action-blue)" }}
            />
            <span
              className="text-sm font-semibold"
              style={{
                fontFamily: "var(--font-control)",
                color: "var(--color-midnight-ink)",
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Teaser cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {teasers.map(({ to, icon: Icon, label, title, body, cta }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col p-9 transition-all duration-300"
            style={{
              background: "var(--color-cloud-white)",
              borderRadius: "var(--radius-cards)",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 8px 30px rgba(219,122,141,0.15)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(219,122,141,0.35)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 1px 4px rgba(0,0,0,0.05)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(0,0,0,0.07)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            {/* Icon bubble */}
            <div
              className="w-12 h-12 flex items-center justify-center mb-6"
              style={{
                background: "var(--color-haze-grey)",
                borderRadius: "50%",
                border: "1px solid rgba(219,122,141,0.2)",
              }}
            >
              <Icon size={20} style={{ color: "var(--color-action-blue)" }} />
            </div>

            <p
              className="text-xs uppercase tracking-[0.2em] font-bold mb-2"
              style={{
                fontFamily: "var(--font-control-tnt)",
                color: "var(--color-action-blue)",
              }}
            >
              [ {label} ]
            </p>

            <h3
              className="font-black uppercase tracking-tight mb-3"
              style={{
                fontFamily: "var(--font-control-compressed)",
                fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
                color: "var(--color-midnight-ink)",
              }}
            >
              {title}
            </h3>

            <p
              className="text-sm leading-relaxed mb-8 flex-1"
              style={{
                fontFamily: "var(--font-control)",
                color: "var(--color-charcoal-text)",
                opacity: 0.75,
              }}
            >
              {body}
            </p>

            <span
              className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
              style={{
                fontFamily: "var(--font-control)",
                color: "var(--color-action-blue)",
              }}
            >
              {cta}
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default HomeTeasers;
