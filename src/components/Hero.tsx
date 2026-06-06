import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Star } from "lucide-react";
import heroImg from "@/assets/hero-senegal.jpg";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "Voyages", to: "/voyages" },
  { label: "Concept", to: "/concept" },
  { label: "Galerie", to: "/galerie" },
  { label: "Contact", to: "/contact" },
];

const Hero = () => {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="accueil"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "600px" }}
    >
      {/* Background image — full bleed */}
      <img
        src={heroImg}
        alt="Femmes en voyage en Afrique"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />

      {/* Subtle gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />

      {/* ──────────────── EMBEDDED NAVBAR ──────────────── */}
      <nav className="absolute top-0 left-0 right-0 z-30">
        <div className="mx-auto px-6 md:px-10 pt-6">
          {/* Frosted pill bar */}
          <div className="flex items-center justify-between backdrop-blur-md bg-white/15 border border-white/25 rounded-2xl px-5 py-3 shadow-lg">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src={logo}
                alt="Goldies Travel"
                className="h-9 w-9 object-contain"
              />
              <span
                className="font-black uppercase tracking-tight text-white leading-none"
                style={{ fontFamily: "var(--font-control-compressed)", fontSize: "1.25rem" }}
              >
                GOLDIES{" "}
                <span
                  style={{
                    fontFamily: "var(--font-control-cursive)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#f9b8c6",
                    textTransform: "none",
                    marginLeft: "2px",
                  }}
                >
                  Travel
                </span>
              </span>
            </Link>

            {/* Desktop nav links — centered */}
            <ul className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `text-sm font-medium tracking-wide transition-all ${
                        isActive
                          ? "text-white border-b border-white/70 pb-0.5"
                          : "text-white/75 hover:text-white"
                      }`
                    }
                    style={{ fontFamily: "var(--font-control)" }}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
              style={{
                fontFamily: "var(--font-control)",
                background: "rgba(255,255,255,0.95)",
                color: "#263238",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              Réserver
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-white p-1"
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile menu dropdown */}
          {open && (
            <div
              className="md:hidden mt-2 backdrop-blur-md bg-white/15 border border-white/25 rounded-2xl px-6 py-5"
            >
              <ul className="flex flex-col gap-4">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-white/90 hover:text-white transition-colors block"
                      style={{ fontFamily: "var(--font-control)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                    className="inline-flex w-full items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-midnight-ink transition-all"
                    style={{
                      fontFamily: "var(--font-control)",
                      background: "rgba(255,255,255,0.95)",
                    }}
                  >
                    Réserver
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* ──────────────── HERO CONTENT ──────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
        {/* Star rating badge */}
        <div
          className="inline-flex items-center gap-2 mb-8 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div
            className="flex items-center gap-1.5 backdrop-blur-sm bg-white/15 border border-white/30 rounded-full px-4 py-2"
          >
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span
              className="text-white text-xs font-semibold tracking-wide"
              style={{ fontFamily: "var(--font-control)" }}
            >
              4.9/5 · +200 femmes voyageuses
            </span>
          </div>
        </div>

        {/* Main headline — mixed typography */}
        <h1
          className="text-white leading-none mb-5 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Bold compressed line */}
          <span
            className="block font-black uppercase tracking-tight"
            style={{
              fontFamily: "var(--font-control-compressed)",
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Voyagez autrement,
          </span>
          {/* Cursive italic accent line */}
          <span
            className="block"
            style={{
              fontFamily: "var(--font-control-cursive)",
              fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)",
              color: "#f9b8c6",
              fontWeight: 600,
              marginTop: "4px",
            }}
          >
            vivez pleinement
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/80 max-w-md mx-auto mb-10 animate-fade-up"
          style={{
            fontFamily: "var(--font-control)",
            fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
            lineHeight: 1.65,
            animationDelay: "0.35s",
          }}
        >
          Des séjours féminins exclusifs au cœur de l'Afrique —
          transport, hébergement et activités inclus.
        </p>

        {/* Single pill CTA */}
        <a
          href="#destinations"
          className="inline-flex items-center justify-center animate-fade-up transition-all"
          style={{
            animationDelay: "0.5s",
            fontFamily: "var(--font-control)",
            fontSize: "0.9rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            border: "2px solid rgba(255,255,255,0.75)",
            color: "#ffffff",
            background: "transparent",
            borderRadius: "100px",
            padding: "14px 36px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          }}
        >
          Découvrir nos séjours
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
