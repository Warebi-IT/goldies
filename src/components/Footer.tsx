import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cloud-white py-16 border-t border-midnight-ink/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Goldies Travel" className="h-10 w-10 object-contain" />
              <span className="font-control-compressed text-2xl font-black uppercase tracking-tight text-midnight-ink">
                GOLDIES <span className="font-control-cursive text-action-blue capitalize font-medium text-xl ml-1">Travel</span>
              </span>
            </div>
            <p className="text-charcoal-text/80 text-sm font-control leading-relaxed">
              Agence de voyage solidaire et d'empouvoirement 100% féminin.
              Découvrez l'Afrique autrement.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-control-compressed text-lg font-black text-midnight-ink uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Accueil", to: "/" },
                { label: "Voyages", to: "/voyages" },
                { label: "Concept", to: "/concept" },
                { label: "Galerie", to: "/galerie" },
                { label: "Contact", to: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm font-control text-charcoal-text/70 hover:text-action-blue transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-control-compressed text-lg font-black text-midnight-ink uppercase tracking-wider mb-4">
              Nous suivre
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-midnight-ink/10 flex items-center justify-center text-charcoal-text hover:border-action-blue hover:text-action-blue hover:bg-haze-grey transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-midnight-ink/10 flex items-center justify-center text-charcoal-text hover:border-action-blue hover:text-action-blue hover:bg-haze-grey transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="mailto:contact@goldiestravel.com"
                className="w-10 h-10 rounded-full border border-midnight-ink/10 flex items-center justify-center text-charcoal-text hover:border-action-blue hover:text-action-blue hover:bg-haze-grey transition-all"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-midnight-ink/10 pt-8 text-center">
          <p className="text-xs font-control-tnt text-charcoal-text/60">
            © {new Date().getFullYear()} GOLDIES TRAVEL. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
