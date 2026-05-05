import { Link } from "react-router-dom";
import { ArrowRight, Heart, Mail } from "lucide-react";

const HomeTeasers = () => (
  <section className="py-24 bg-muted/40">
    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
      <Link
        to="/concept"
        className="group bg-card rounded-2xl p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col"
      >
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-5">
          <Heart size={26} className="text-primary" />
        </div>
        <p className="text-sm uppercase tracking-[0.2em] text-secondary font-semibold mb-2">
          Notre concept
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
          Voyager entre femmes, avec du sens
        </h3>
        <p className="text-muted-foreground mb-6 flex-1">
          Découvrez notre vision et l'organisation de nos séjours solidaires 100% féminins.
        </p>
        <span className="inline-flex items-center gap-2 text-secondary font-semibold text-sm">
          En savoir plus <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>

      <Link
        to="/contact"
        className="group bg-card rounded-2xl p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col"
      >
        <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center mb-5">
          <Mail size={26} className="text-secondary" />
        </div>
        <p className="text-sm uppercase tracking-[0.2em] text-secondary font-semibold mb-2">
          Contact
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
          Une question ? Parlons-en
        </h3>
        <p className="text-muted-foreground mb-6 flex-1">
          Remplissez notre formulaire et nous vous recontactons sous 24h avec tous les détails.
        </p>
        <span className="inline-flex items-center gap-2 text-secondary font-semibold text-sm">
          Nous contacter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </div>
  </section>
);

export default HomeTeasers;
