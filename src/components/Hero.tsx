import heroImg from "@/assets/hero-senegal.jpg";

const Hero = () => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Groupe de femmes sur une plage au Sénégal"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <p className="animate-fade-up text-sm md:text-base uppercase tracking-[0.3em] text-primary-foreground/80 mb-4">
          100% féminin · 100% solidaire
        </p>
        <h1 className="animate-fade-up delay-100 font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
          Voyagez autrement,{" "}
          <span className="text-secondary">vivez pleinement</span>
        </h1>
        <p className="animate-fade-up delay-200 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/85 mb-10">
          Des séjours en groupe exclusivement féminins à la découverte de l'Afrique.
          Logement, transport, activités et repas inclus.
        </p>
        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#destinations"
            className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3.5 text-base font-semibold text-secondary-foreground hover:opacity-90 transition-opacity"
          >
            Découvrir nos séjours
          </a>
          <a
            href="#concept"
            className="inline-flex items-center justify-center rounded-full border-2 border-primary-foreground/50 px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
          >
            Notre concept
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/70" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
