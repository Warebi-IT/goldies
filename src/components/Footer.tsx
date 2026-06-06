import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-ink/20">
      <div className="container mx-auto max-w-[1280px] px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src={logo} alt="Goldies Travel" className="h-10 w-10 object-contain grayscale" />
              <span className="font-pp-neue-corp-compact text-3xl font-black uppercase tracking-tight text-ink leading-none">
                GOLDIES TRAVEL
              </span>
            </div>
            <p className="text-ink/80 text-sm font-dm-sans font-medium leading-relaxed">
              Agence de voyage solidaire et d'empouvoirement 100% féminin.
              Découvrez l'Afrique autrement.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Accueil", to: "/" },
                { label: "Voyages", to: "/voyages" },
                { label: "Concept", to: "/concept" },
                { label: "Galerie", to: "/galerie" },
                { label: "Contact", to: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm font-dm-sans font-medium text-ink/70 hover:text-citra-orange transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight mb-4">
              Nous suivre
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-ink flex items-center justify-center text-ink hover:bg-citra-orange hover:text-ink hover:border-citra-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-ink flex items-center justify-center text-ink hover:bg-citra-orange hover:text-ink hover:border-citra-orange transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="mailto:contact@goldiestravel.com"
                className="w-12 h-12 rounded-full border border-ink flex items-center justify-center text-ink hover:bg-citra-orange hover:text-ink hover:border-citra-orange transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-ink/20 pt-8 text-left md:text-center">
          <p className="text-xs font-dm-sans font-medium uppercase tracking-widest text-ink/60">
            © {new Date().getFullYear()} GOLDIES TRAVEL. TOUS DROITS RÉSERVÉS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
