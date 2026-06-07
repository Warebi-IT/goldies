import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AnimatedLogo from "@/components/AnimatedLogo";
import { Menu, X, Instagram, Home, Compass, Sparkles, Camera, Star, Mail, CalendarPlus } from "lucide-react";

const navLinks = [
  { label: "Accueil", to: "/", icon: Home },
  { label: "Voyages", to: "/voyages", icon: Compass },
  { label: "Concept", to: "/concept", icon: Sparkles },
  { label: "Galerie", to: "/galerie", icon: Camera },
  { label: "Avis", to: "/avis", icon: Star },
  { label: "Contact", to: "/contact", icon: Mail },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-6 md:top-10 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] px-4 md:px-8 z-50 flex items-center justify-between pointer-events-none">
      
      {/* 1. Left: Isolated Logo */}
      <div className="pointer-events-auto">
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all group"
        >
          <AnimatedLogo className="h-8 w-8" />
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-pp-neue-corp-compact text-xl font-black uppercase tracking-tight text-[#e99ba9] leading-none group-hover:text-citra-orange transition-colors">
              GOLDIES
            </span>
            <span className="font-pp-neue-corp-compact text-sm font-black uppercase tracking-tight text-[#BCE3F1] leading-none">
              TRAVEL
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Center: Isolated Nav Links */}
      <div className="hidden md:flex pointer-events-auto bg-white/95 backdrop-blur-md px-8 py-3 rounded-full shadow-lg">
        <ul className="flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `font-dm-sans transition-colors relative px-1 flex items-center gap-1.5 ${
                    isActive 
                      ? "text-ink font-bold text-base after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-ink after:rounded-full" 
                      : "text-ink/60 font-medium text-sm hover:text-citra-orange"
                  }`
                }
              >
                <l.icon size={16} strokeWidth={2.5} className="mb-0.5" />
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Right: Isolated CTA & Mobile Menu */}
      <div className="flex items-center gap-3 pointer-events-auto">
        
        {/* Social Links (Desktop) */}
        <div className="hidden md:flex items-center gap-2 mr-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full shadow-lg">
          <a
            href="https://www.instagram.com/goldies.travel?igsh=MTV6dThwbjlrYzg0MA=="
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink/70 hover:bg-citra-orange hover:text-ink transition-all"
            aria-label="Instagram"
          >
            <Instagram size={16} />
          </a>
          <a
            href="https://www.tiktok.com/@goldies_travel?_r=1&_t=ZN-9716IvKcjKQ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink/70 hover:bg-citra-orange hover:text-ink transition-all"
            aria-label="TikTok"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
          </a>
        </div>
        
        <Link
          to="/contact"
          className="hidden md:inline-flex items-center justify-center gap-2 bg-ink text-white px-6 py-3 rounded-full text-sm font-dm-sans font-bold shadow-lg transition-transform hover:scale-105"
        >
          <CalendarPlus size={16} strokeWidth={2.5} />
          Réserver
        </Link>

        {/* Mobile toggle (shown only on small screens) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center justify-center bg-white text-ink h-12 w-12 rounded-full shadow-lg hover:bg-zinc-100 transition-colors"
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-6 pointer-events-auto border border-ink/5 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((l) => (
               <li key={l.to}>
                 <NavLink
                   to={l.to}
                   onClick={() => setOpen(false)}
                   className={({ isActive }) => 
                     `font-dm-sans py-2 border-b border-ink/10 transition-colors flex items-center gap-3 ${
                       isActive ? "text-ink font-bold text-xl" : "text-ink text-lg font-medium hover:text-citra-orange"
                     }`
                   }
                 >
                   <l.icon size={20} strokeWidth={2.5} />
                   {l.label}
                 </NavLink>
               </li>
            ))}
            <li className="pt-4">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 bg-ink text-white px-6 py-4 rounded-full text-base font-dm-sans font-bold shadow-lg"
              >
                <CalendarPlus size={20} strokeWidth={2.5} />
                Réserver
              </Link>
            </li>
          </ul>
        </div>
      )}
      
    </nav>
  );
};

export default Navbar;
