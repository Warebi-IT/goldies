import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Goldies Travel" className="h-10 w-10" />
              <span className="font-serif text-xl font-bold text-background">
                Goldies Travel
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Agence de voyage solidaire 100% féminin.
              Découvrez l'Afrique autrement.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-background mb-4">
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
                  <Link to={l.to} className="text-sm text-background/60 hover:text-background transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-base font-semibold text-background mb-4">
              Nous suivre
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-background/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-background/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="mailto:contact@goldiestravel.com"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-background/20 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center">
          <p className="text-sm text-background/40">
            © {new Date().getFullYear()} Goldies Travel. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
