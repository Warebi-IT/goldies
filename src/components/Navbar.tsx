import { useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "Voyages", to: "/voyages" },
  { label: "Concept", to: "/concept" },
  { label: "Galerie", to: "/galerie" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cloud-white/80 backdrop-blur-md border-b border-midnight-ink/10">
      <div className="container mx-auto flex items-center justify-between py-3.5 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Goldies Travel" className="h-10 w-10 object-contain" />
          <span className="font-control-compressed text-2xl font-black uppercase tracking-tight text-midnight-ink">
            GOLDIES <span className="font-control-cursive text-action-blue capitalize font-medium text-xl ml-1">Travel</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-control font-medium transition-colors tracking-wide ${
                    isActive ? "text-action-blue border-b border-action-blue pb-1" : "text-charcoal-text hover:text-action-blue"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link
          to="/contact"
          className="hidden md:inline-flex items-center justify-center border border-action-blue bg-transparent text-action-blue hover:bg-action-blue hover:text-cloud-white px-6 py-2 rounded-buttons text-sm font-control font-medium transition-all"
        >
          Réserver
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-charcoal-text p-1 hover:text-action-blue transition-colors"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cloud-white border-b border-midnight-ink/10 px-6 pb-6 pt-2">
          <ul className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="text-sm font-control font-medium text-charcoal-text hover:text-action-blue transition-colors block py-1"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center border border-action-blue bg-transparent text-action-blue hover:bg-action-blue hover:text-cloud-white px-6 py-2 rounded-buttons text-sm font-control font-medium transition-all"
              >
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
