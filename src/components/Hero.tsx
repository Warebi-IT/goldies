import { Link } from "react-router-dom";
import { Compass, Sparkles, MapPin, Calendar, ArrowUpRight, Star, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { staticTrips } from "@/data/trips";
import videoSenegal from "@/assets/goldiessenegalversion.mp4";
import destSenegal from "@/assets/dest-senegal.jpg";
import avatarWomen1 from "@/assets/womenwithscarf.jpeg";
import avatarWomen2 from "@/assets/onlywomen.jpeg";
import avatarWomen3 from "@/assets/children.jpeg";

const Hero = () => {
  // Fetch dynamic trip for "Prochain départ" card with static fallback
  const { data: nextTrip } = useQuery({
    queryKey: ["hero-next-trip"],
    queryFn: async () => {
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("is_active", true)
        .gte("start_date", today)
        .order("start_date", { ascending: true })
        .limit(1);

      if (!error && data && data.length > 0) {
        return data[0];
      }

      // Fallback to latest active trip if none in the future
      const { data: latest } = await supabase
        .from("trips")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (latest && latest.length > 0) {
        return latest[0];
      }

      return staticTrips[1] || staticTrips[0];
    },
    initialData: staticTrips[1] || staticTrips[0],
  });

  const trip = nextTrip || staticTrips[1];

  return (
    <section
      id="accueil"
      className="relative z-0 w-full min-h-[100dvh] flex flex-col justify-between px-6 md:px-12 lg:px-16 pt-28 pb-12 overflow-hidden"
    >
      {/* 1. Background Video */}
      <div className="absolute inset-0 w-full h-full z-[-3] overflow-hidden bg-white">
        <video 
          src={videoSenegal} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-90 scale-105 animate-pan-slow"
        />
      </div>

      {/* 2. Pure Crisp White Luminous Scrims */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 md:via-white/60 to-transparent pointer-events-none z-[-2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent pointer-events-none z-[-2]" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-[-2]" />

      {/* 3. Main Content Grid (Editorial Left + Floating Card Right) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Editorial Content */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start text-left pt-6 lg:pt-0">
          
          {/* Unified Social Proof & Identity Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            
            {/* Pill 1: Official Brand Identity */}
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-ink/10 px-4 py-2 rounded-full shadow-xs text-ink">
              <span className="text-sm">🌸</span>
              <span className="font-dm-sans text-xs font-bold uppercase tracking-wider text-ink">
                L'agence de voyages solidaires entre femmes
              </span>
            </div>

            {/* Pill 2: Social Proof with Avatars & Real Stats */}
            <Link 
              to="/avis" 
              className="inline-flex items-center gap-2.5 bg-white/95 hover:bg-white backdrop-blur-md border border-ink/10 px-4 py-1.5 rounded-full shadow-xs text-ink transition-all duration-300 hover:scale-105 group"
            >
              {/* Stacked Mini Avatars */}
              <div className="flex -space-x-2 overflow-hidden py-0.5">
                <img 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" 
                  src={avatarWomen1} 
                  alt="Voyageuse Goldies" 
                />
                <img 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" 
                  src={avatarWomen2} 
                  alt="Voyageuse Goldies" 
                />
                <img 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" 
                  src={avatarWomen3} 
                  alt="Voyageuse Goldies" 
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs font-dm-sans font-bold">
                <div className="flex items-center text-amber-500">
                  <Star size={13} fill="currentColor" />
                </div>
                <span className="text-ink font-bold">4.93 / 5</span>
                <span className="text-ink/40">•</span>
                <span className="text-ink/70 group-hover:text-ink font-medium">+100 voyages réalisés</span>
              </div>
            </Link>
          </div>

          {/* Impactful Emotional Headline using Brand Core */}
          <h1 className="text-ink tracking-tight mb-6 leading-[0.95]">
            <span className="font-pp-neue-corp-compact font-black uppercase text-4xl sm:text-6xl lg:text-[4.2rem] xl:text-[5rem] block text-ink">
              Voyages entre femmes.
            </span>
            <span className="font-serif italic font-semibold text-[#B6656E] text-2xl sm:text-4xl lg:text-[3.2rem] block mt-1">
              Organisation d'expériences uniques.
            </span>
          </h1>

          {/* Inspiring Value Proposition Subtitle with Proof Elements */}
          <p className="text-ink/80 font-dm-sans text-base sm:text-lg max-w-xl font-medium leading-relaxed mb-6">
            Depuis plus de 3 ans et +100 voyages organisés, nous créons des séjours immersifs et solidaires en petits groupes. Partez seule en toute sécurité et revenez avec une véritable tribu.
          </p>

          {/* Key Brand Pillars & Financial Ease Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-dm-sans font-bold text-ink/75 mb-8">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-citra-orange" />
              +100 voyages organisés
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-citra-orange" />
              3 ans d'expérience
            </span>
            <span className="inline-flex items-center gap-1.5 bg-citra-orange/10 px-2.5 py-1 rounded-full text-ink border border-citra-orange/20">
              <CreditCard size={13} className="text-citra-orange" />
              Paiement en plusieurs fois
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link 
              to="/voyages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-citra-orange hover:bg-citra-orange/90 text-white px-8 py-4 rounded-full text-base font-dm-sans font-bold transition-all duration-300 hover:scale-105 shadow-[0_10px_25px_-5px_rgba(182,101,110,0.4)] active:scale-95"
            >
              <Compass size={20} strokeWidth={2.5} />
              Découvrir nos séjours
            </Link>
            
            <Link 
              to="/concept"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/90 hover:bg-white backdrop-blur-md text-ink border border-ink/10 px-8 py-4 rounded-full text-base font-dm-sans font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
            >
              <Sparkles size={18} strokeWidth={2.2} />
              Notre concept
            </Link>
          </div>

        </div>

        {/* Right Column: Floating "Prochain Départ" Card — Subtle version */}
        {trip && (
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <Link 
              to={`/voyages/${trip.slug || trip.id}`}
              className="group relative w-full max-w-[260px] bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(182,101,110,0.2)] hover:bg-white/90"
            >
              {/* Header Badge — compact */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-dm-sans font-extrabold uppercase tracking-wider text-citra-orange">
                  <span className="w-1.5 h-1.5 rounded-full bg-citra-orange animate-pulse" />
                  Prochain départ
                </span>
                <span className="text-[10px] font-dm-sans font-bold text-ink/60">
                  🔥 {trip.spots_left || 12} places
                </span>
              </div>

              {/* Destination Image — smaller */}
              <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                <img 
                  src={trip.image_url || destSenegal} 
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-dm-sans font-bold">
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                    <MapPin size={10} className="text-citra-orange" />
                    {trip.destination}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                    {trip.duration || "8-9 jours"}
                  </span>
                </div>
              </div>

              {/* Trip Title — compact */}
              <h3 className="font-pp-neue-corp-compact font-black uppercase text-base text-ink tracking-tight mb-1 group-hover:text-citra-orange transition-colors leading-tight">
                {trip.name}
              </h3>

              {/* Dates — compact */}
              <p className="text-[10px] font-dm-sans font-medium text-ink/60 mb-2.5 flex items-center gap-1.5">
                <Calendar size={11} className="text-citra-orange shrink-0" />
                <span>{trip.dates}</span>
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-2.5 border-t border-ink/8">
                <div>
                  <span className="text-[9px] font-dm-sans text-ink/40 block">À partir de</span>
                  <span className="font-pp-neue-corp-compact text-lg font-black text-citra-orange leading-none">
                    {trip.price}{typeof trip.price === "number" ? " €" : ""}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 bg-ink group-hover:bg-citra-orange text-white px-3 py-1.5 rounded-full text-[10px] font-dm-sans font-bold transition-colors">
                  Explorer
                  <ArrowUpRight size={11} />
                </div>
              </div>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default Hero;

