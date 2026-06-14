import { Link } from "react-router-dom";
import AnimatedLogo from "@/components/AnimatedLogo";
import { Instagram, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://www.instagram.com/goldies.travel?igsh=MTV6dThwbjlrYzg0MA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full shadow-sm bg-white/10 flex items-center justify-center text-cream-card hover:bg-citra-orange hover:text-ink hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-ink border-cream-card/10 text-cream-card font-dm-sans">
                  <p>Instagram</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent className="bg-ink border-cream-card/10 text-cream-card font-dm-sans">
                  <p>TikTok</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://chat.whatsapp.com/JwP9zvmow5UJyfeiVkiSbE?mode=gi_t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full shadow-sm bg-white/10 flex items-center justify-center text-cream-card hover:bg-citra-orange hover:text-ink hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    aria-label="WhatsApp"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.52 3.449A11.968 11.968 0 0 0 12.001 0C5.352 0 0 5.349 0 11.999c0 2.118.552 4.187 1.602 6.002L0 24l6.198-1.626a11.91 11.91 0 0 0 5.803 1.477h.005c6.649 0 12.001-5.35 12.001-12.001A11.933 11.933 0 0 0 20.52 3.449zM12.001 21.848a9.927 9.927 0 0 1-5.056-1.385l-.363-.216-3.766.988 1.006-3.669-.236-.376A9.878 9.878 0 0 1 2.13 12.001c0-5.467 4.453-9.92 9.924-9.92 2.656 0 5.152 1.035 7.028 2.913a9.897 9.897 0 0 1 2.903 7.024c0 5.468-4.454 9.92-9.922 9.92zm5.454-7.447c-.299-.15-1.768-.873-2.042-.973-.274-.101-.473-.15-.672.15-.2.3-.776.973-.951 1.173-.174.2-.349.225-.648.075-.3-.15-1.264-.466-2.407-1.487-.89-.793-1.49-1.77-1.664-2.069-.174-.3-.018-.463.13-.612.134-.134.3-.349.449-.523.15-.174.201-.3.3-.5.1-.2.05-.374-.025-.523-.075-.15-.672-1.62-.922-2.217-.238-.576-.48-.498-.672-.507-.174-.01-.374-.01-.574-.01s-.524.075-.798.374c-.274.3-1.047 1.023-.997 2.493.05 1.47 1.071 2.891 1.221 3.09s2.122 3.242 5.143 4.545c.717.309 1.276.494 1.713.627.721.229 1.378.197 1.896.12.576-.086 1.768-.723 2.016-1.422.248-.7.248-1.298.174-1.422-.074-.124-.273-.199-.572-.348z"/>
                    </svg>
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-ink border-cream-card/10 text-cream-card font-dm-sans">
                  <p>WhatsApp</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent className="bg-ink border-cream-card/10 text-cream-card font-dm-sans">
                  <p>Linktree</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="mailto:contact@goldiestravel.com"
                    className="w-12 h-12 rounded-full shadow-sm bg-white/10 flex items-center justify-center text-cream-card hover:bg-citra-orange hover:text-ink hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    aria-label="Email"
                  >
                    <Mail size={20} />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-ink border-cream-card/10 text-cream-card font-dm-sans">
                  <p>Email</p>
                </TooltipContent>
              </Tooltip>
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
