import { Link } from "react-router-dom";
import AnimatedLogo from "@/components/AnimatedLogo";
import { Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 mt-20 bg-ink text-cream-card">
      <div className="container mx-auto max-w-[1280px] px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <AnimatedLogo className="h-10 w-10 grayscale invert opacity-90" />
              <span className="font-pp-neue-corp-compact text-3xl font-black uppercase tracking-tight text-cream-card leading-none">
                GOLDIES TRAVEL
              </span>
            </div>
            <p className="text-cream-card/80 text-sm font-dm-sans font-medium leading-relaxed">
              Agence de voyage solidaire et d'empouvoirement 100% féminin.
              Découvrez l'Afrique autrement.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-pp-neue-corp-compact text-2xl font-black text-cream-card uppercase tracking-tight mb-4">
              Navigation
            </h4>
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
              <ul className="space-y-3">
                {[
                  { label: "Accueil", to: "/" },
                  { label: "Voyages", to: "/voyages" },
                  { label: "Concept", to: "/concept" },
                  { label: "Galerie", to: "/galerie" },
                  { label: "Contact", to: "/contact" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm font-dm-sans font-medium text-cream-card/70 hover:text-citra-orange transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {[
                  { label: "Mentions Légales", to: "/mentions-legales" },
                  { label: "Confidentialité", to: "/politique-confidentialite" },
                  { label: "CGV", to: "/cgv" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm font-dm-sans font-medium text-cream-card/70 hover:text-citra-orange transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-pp-neue-corp-compact text-2xl font-black text-cream-card uppercase tracking-tight mb-4">
              Nous suivre
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/goldies.travel?igsh=MTV6dThwbjlrYzg0MA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full shadow-sm bg-white/10 flex items-center justify-center text-cream-card hover:bg-citra-orange hover:text-ink hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@goldies_travel?_r=1&_t=ZN-9716IvKcjKQ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full shadow-sm bg-white/10 flex items-center justify-center text-cream-card hover:bg-citra-orange hover:text-ink hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                aria-label="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a
                href="https://linktr.ee/goldiestraveel?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnCgMPOU8iPMDmlD4_I8SVyIlxro-W_Ecneah7aSOgXTf5br_kf1C_CUfUHRY_aem_mmKyfr9r-ot3WxjMpwK_Jg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full shadow-sm bg-white/10 flex items-center justify-center text-cream-card hover:bg-citra-orange hover:text-ink hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                aria-label="Linktree"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10V4" />
                  <path d="M12 10l4.5-4.5" />
                  <path d="M12 10h6" />
                  <path d="M12 10l4.5 4.5" />
                  <path d="M12 10L7.5 14.5" />
                  <path d="M12 10H6" />
                  <path d="M12 10L7.5 5.5" />
                  <path d="M12 15v5" />
                </svg>
              </a>
              <a
                href="mailto:contact@goldiestravel.com"
                className="w-12 h-12 rounded-full shadow-sm bg-white/10 flex items-center justify-center text-cream-card hover:bg-citra-orange hover:text-ink hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 text-left md:text-center mt-8 border-t border-cream-card/10">
          <p className="text-xs font-dm-sans font-medium uppercase tracking-widest text-cream-card/60">
            © {new Date().getFullYear()} GOLDIES TRAVEL. TOUS DROITS RÉSERVÉS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
