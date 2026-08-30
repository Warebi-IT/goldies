import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle, Users, X, Eye, CreditCard, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingFormModal from "@/components/BookingFormModal";
import { calculateDepositAmount, calculateRemainingBalance } from "@/lib/business-rules";

const VoyageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPaymentType, setBookingPaymentType] = useState<"deposit" | "installment" | "full">("deposit");

  const { data: trip, isLoading } = useQuery({
    queryKey: ["trip", id],
    queryFn: async () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || "");
      
      let query = supabase.from("trips").select("*");
      
      if (isUuid) {
        query = query.eq("id", id);
      } else {
        query = query.eq("slug", id);
      }
      
      const { data, error } = await query.single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: tripPhotos } = useQuery({
    queryKey: ["trip-photos", trip?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trip_photos")
        .select("*")
        .eq("trip_id", trip!.id)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!trip?.id,
  });

  const [photoIndex, setPhotoIndex] = useState(0);
  const [photoPaused, setPhotoPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const allPhotos = trip
    ? Array.from(
        new Set([
          ...(trip.image_url ? [trip.image_url] : []),
          ...(tripPhotos?.map((p) => p.image_url).filter(Boolean) || []),
        ])
      )
    : [];

  const numericPrice = typeof trip?.price === "number" ? trip.price : parseInt(String(trip?.price || 0), 10) || 0;
  const depositAmount = trip ? calculateDepositAmount(numericPrice, trip.deposit_amount) : 0;
  const remainingBalance = trip ? calculateRemainingBalance(numericPrice, depositAmount) : 0;
  const installment3x = numericPrice > 0 ? Math.round(numericPrice / 3) : 0;
  const installment4x = numericPrice > 0 ? Math.round(numericPrice / 4) : 0;

  useEffect(() => {
    setPhotoIndex(0);
  }, [trip?.id]);

  useEffect(() => {
    if (!allPhotos.length || allPhotos.length <= 1 || photoPaused) return;
    const timer = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % allPhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [allPhotos, photoPaused]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i + 1) % allPhotos.length);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length);
      } else if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, allPhotos.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-card">
        <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-citra-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="text-ink/60 font-dm-sans font-medium">Chargement du voyage...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Voyage introuvable</h1>
          <Link to="/voyages" className="text-secondary underline">Retour aux voyages</Link>
        </div>
      </div>
    );
  }

  const program: Array<{ title: string; description: string }> = Array.isArray(trip.program)
    ? (trip.program as any)
    : [];

  const displayDates = (() => {
    if (trip.start_date && trip.end_date) {
      const start = new Date(trip.start_date + "T00:00:00");
      const end = new Date(trip.end_date + "T00:00:00");
      const day1 = start.getDate();
      const day2 = end.getDate();
      const month1 = start.toLocaleDateString("fr-FR", { month: "long" });
      const month2 = end.toLocaleDateString("fr-FR", { month: "long" });
      const year = end.getFullYear();
      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `Du ${day1} au ${day2} ${month2} ${year}`;
      }
      return `Du ${day1} ${month1} au ${day2} ${month2} ${year}`;
    }
    return trip.dates;
  })();

  const hasPhotos = tripPhotos && tripPhotos.length > 0;

  return (
    <div className="min-h-screen bg-concrete-canvas text-ink">
      <Navbar />

      {/* Hero Header (extends fully under Navbar) */}
      <section 
        className="relative w-full h-[70vh] min-h-[520px] overflow-hidden group/hero flex flex-col justify-end"
        onMouseEnter={() => setPhotoPaused(true)}
        onMouseLeave={() => setPhotoPaused(false)}
      >
        {/* Slideshow background */}
        {allPhotos.length > 0 ? (
          allPhotos.map((photoUrl, index) => (
            <div
              key={photoUrl}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === photoIndex ? "opacity-100 z-0" : "opacity-0 z-0"
              }`}
            >
              <img 
                src={photoUrl} 
                alt={`${trip.name} - ${index + 1}`} 
                className="w-full h-full object-cover transform scale-100 transition-transform ease-out"
                style={{
                  transform: index === photoIndex ? "scale(1)" : "scale(1.05)",
                  transitionDuration: "5000ms"
                }}
              />
            </div>
          ))
        ) : trip.image_url ? (
          <img src={trip.image_url} alt={trip.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        
        {/* Dark overlay & gradients for navbar and bottom seamless transition */}
        <div className="absolute inset-0 bg-black/25 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-concrete-canvas via-concrete-canvas/40 to-transparent z-10 pointer-events-none" />

        {/* Navigation Arrows (visible on hover) */}
        {allPhotos.length > 1 && (
          <>
            <button
              onClick={() => setPhotoIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover/hero:opacity-100 shadow-md"
              aria-label="Photo précédente"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => setPhotoIndex((i) => (i + 1) % allPhotos.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover/hero:opacity-100 shadow-md"
              aria-label="Photo suivante"
            >
              <ArrowRight size={20} />
            </button>
          </>
        )}

        {/* Indicators/Dots at bottom */}
        {allPhotos.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
            {allPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => setPhotoIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === photoIndex ? "bg-citra-orange w-6" : "bg-white/50 hover:bg-white"
                }`}
                aria-label={`Aller à la photo ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Title Content */}
        <div className="relative z-20 container mx-auto px-6 flex flex-col justify-end pb-16 pt-32">
          <Link to="/voyages" className="inline-flex items-center gap-2 text-white hover:text-citra-orange text-sm mb-4 transition-all duration-300 font-dm-sans font-medium drop-shadow-md">
            <ArrowLeft size={16} /> Tous nos voyages
          </Link>
          <div className="flex items-center gap-2 text-white/95 mb-2 drop-shadow-md">
            <MapPin size={16} className="text-citra-orange" />
            <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">{trip.destination}</span>
          </div>
          <h1 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-white uppercase tracking-tight drop-shadow-lg">{trip.name}</h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 bg-concrete-canvas">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl p-8 rounded-[32px] border border-white/60 space-y-6">
              {/* En-tête de la description avec badges de facilité de paiement */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-pp-neue-corp-compact text-2xl font-black uppercase tracking-tight text-ink">Description</h2>
                  <p className="font-dm-sans text-xs text-ink/60 font-medium">Découvrez l'esprit et les détails de cette aventure solidaire</p>
                </div>

                {/* Badges réactifs de facilitation financière */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200/60 shadow-xs">
                    <CreditCard size={13} className="text-blue-600" />
                    <span>Acompte : dès {depositAmount} €</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#FDF2F4] text-[#111111] text-xs font-bold px-3 py-1.5 rounded-full border border-pink-200/60 shadow-xs">
                    <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-tighter">Klarna.</span>
                    <span>3x / 4x sans frais</span>
                  </span>
                </div>
              </div>

              {/* Texte de description */}
              <p className="font-dm-sans text-ink/85 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {trip.description || "Aucune description disponible."}
              </p>

              {/* Cartes interactives des facilités de paiement intégrées à la description */}
              <div className="bg-gradient-to-br from-amber-50/70 via-white to-pink-50/50 rounded-2xl p-5 border border-amber-200/60 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-citra-orange" />
                    <h3 className="font-pp-neue-corp-compact text-sm font-black uppercase tracking-wider text-ink">
                      Facilités de paiement au choix
                    </h3>
                  </div>
                  <span className="font-dm-sans text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Paiement 100% sécurisé
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Option 1 : Acompte */}
                  <div 
                    onClick={() => {
                      setBookingPaymentType("deposit");
                      setIsBookingModalOpen(true);
                    }}
                    className="group relative bg-white/95 rounded-xl p-4 border border-blue-100/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-dm-sans text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
                          Option 1 · Acompte
                        </span>
                        <span className="font-pp-neue-corp-compact text-lg font-black text-blue-950">
                          {depositAmount} € <span className="text-[11px] font-dm-sans font-normal text-ink/60">maintenant</span>
                        </span>
                      </div>
                      <p className="font-dm-sans text-xs text-ink/75 leading-relaxed">
                        Bloquez votre place immédiatement. Solde restant ({remainingBalance} €) payable avant le départ.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-ink/5 flex items-center justify-between text-blue-700 font-dm-sans text-xs font-bold group-hover:text-blue-900 transition-colors">
                      <span>Réserver avec acompte</span>
                      <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Option 2 : 3x / 4x Klarna */}
                  <div 
                    onClick={() => {
                      setBookingPaymentType("installment");
                      setIsBookingModalOpen(true);
                    }}
                    className="group relative bg-white/95 rounded-xl p-4 border border-pink-100/80 shadow-xs hover:shadow-md hover:border-pink-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-dm-sans text-xs font-bold text-[#491217] bg-[#FDF2F4] px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span className="bg-black text-white text-[8px] font-black px-1 py-0.2 rounded">Klarna.</span>
                          Option 2 · Échelonné
                        </span>
                        <span className="font-pp-neue-corp-compact text-lg font-black text-ink">
                          {installment3x > 0 ? `3x ${installment3x} €` : "3x ou 4x"} <span className="text-[11px] font-dm-sans font-normal text-ink/60">sans frais</span>
                        </span>
                      </div>
                      <p className="font-dm-sans text-xs text-ink/75 leading-relaxed">
                        Paiement en 3x ou 4x sans frais par carte bancaire. 1ère mensualité prélevée aujourd'hui.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-ink/5 flex items-center justify-between text-[#d64c7f] font-dm-sans text-xs font-bold group-hover:text-[#9e2754] transition-colors">
                      <span>Payer en plusieurs fois</span>
                      <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow-xl p-8 rounded-[32px]">
              <h2 className="font-pp-neue-corp-compact text-2xl font-black uppercase tracking-tight mb-6">Programme jour par jour</h2>
              {program.length === 0 ? (
                <p className="font-dm-sans text-sm text-ink/60">Programme à venir.</p>
              ) : (
                <ol className="space-y-6">
                  {program.map((day, i) => (
                    <li key={i} className="bg-white/50 backdrop-blur-sm rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-10 h-10 rounded-full shadow-sm bg-hazard-yellow text-ink flex items-center justify-center font-dm-sans font-bold text-sm">
                          J{i + 1}
                        </span>
                        <h3 className="font-pp-neue-corp-compact text-lg font-black text-ink uppercase tracking-tight">{day.title}</h3>
                      </div>
                      <p className="text-sm font-dm-sans text-ink/80 leading-relaxed whitespace-pre-line">
                        {day.description}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Gallery Section */}
            {allPhotos.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl p-8 rounded-[32px] space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-pp-neue-corp-compact text-2xl font-black uppercase tracking-tight text-ink">
                    L'album photo du voyage
                  </h2>
                  <span className="font-dm-sans text-xs font-bold text-ink/50 bg-ink/5 px-3 py-1 rounded-full">
                    {allPhotos.length} photo{allPhotos.length > 1 ? "s" : ""}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allPhotos.map((photoUrl, index) => (
                    <div 
                      key={photoUrl} 
                      onClick={() => {
                        setLightboxIndex(index);
                        setIsLightboxOpen(true);
                      }}
                      className="group relative aspect-square overflow-hidden rounded-[20px] bg-muted cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <img 
                        src={photoUrl} 
                        alt={`${trip.name} - Galerie ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white bg-white/20 p-3 rounded-full backdrop-blur-md transform scale-90 group-hover:scale-100 transition-all duration-300">
                          <Eye size={20} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-32 h-fit bg-white/90 backdrop-blur-md rounded-[32px] shadow-xl p-8 text-ink space-y-6 border border-white/50">
            {/* Price */}
            <div className="border-b border-ink/10 pb-6 text-center">
              {typeof trip.price === "number" ? (
                <>
                  <p className="font-dm-sans text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">Prix par personne</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-pp-neue-corp-compact text-5xl font-black text-citra-orange">{trip.price}</span>
                    <span className="font-pp-neue-corp-compact text-2xl font-black text-citra-orange">€</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-dm-sans text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">Tarif</p>
                  <span className="font-pp-neue-corp-compact text-2xl font-black text-citra-orange">{trip.price}</span>
                </>
              )}
            </div>
            <div className="border-b border-ink/10 pb-6">
              <p className="font-dm-sans text-xs font-bold uppercase tracking-widest text-ink/60 mb-2">Dates du séjour</p>
              <div className="flex items-center gap-2.5 text-ink">
                <Calendar size={26} className="text-citra-orange shrink-0" />
                <span className="font-pp-neue-corp-compact text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
                  {trip.dates}
                </span>
              </div>
            </div>
            <div className="space-y-4 text-sm pt-2">
              <div className="flex items-center gap-3 font-dm-sans text-ink/80">
                <Clock size={18} className="text-citra-orange" />
                <span className="font-dm-sans text-sm font-bold uppercase tracking-wider">Durée : {trip.duration}</span>
              </div>
              <div className="flex items-center gap-3 font-dm-sans text-ink/80">
                <Users size={18} className="text-citra-orange" />
                <span className="font-dm-sans text-sm font-bold uppercase tracking-wider">
                  {(trip as any).spots_left ?? 12} places restantes sur {(trip as any).total_spots ?? 12}
                </span>
              </div>
            </div>

            {trip.includes && trip.includes.length > 0 && (
              <div className="border-t border-ink/5 pt-6">
                <p className="font-pp-neue-corp-compact text-sm font-black uppercase tracking-wider mb-4 text-ink/80">Inclus dans le séjour</p>
                <ul className="space-y-3">
                  {trip.includes.map((item: string) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-dm-sans text-ink/80">
                      <CheckCircle size={16} className="text-citra-orange" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-col items-center gap-3">
              {/* Payment info badges */}
              {(trip as any).deposit_payment_link && (
                <div className="px-4 py-2.5 bg-blue-50 text-blue-900 text-xs font-dm-sans font-bold rounded-xl w-full flex justify-center items-center gap-2 border border-blue-100 shadow-sm">
                  💰 Acompte de {calculateDepositAmount(trip.price, (trip as any).deposit_amount)} € disponible pour réserver
                </div>
              )}
              <div className="px-4 py-2.5 bg-[#FFE1E8]/60 text-ink/90 text-xs font-dm-sans font-bold rounded-xl w-full flex justify-center items-center gap-2 border border-[#FFE1E8]">
                <span className="font-black">Klarna.</span>
                Paiement en 3x ou 4x sans frais disponible
              </div>
              
              {trip.tag === "Complet" || (trip as any).spots_left === 0 ? (
                <div className="w-full space-y-2">
                  <div className="bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold p-3 rounded-xl text-center">
                    ⚠️ Ce voyage est complet. Inscrivez-vous pour être alertée en priorité en cas de désistement.
                  </div>
                  <Button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full rounded-full shadow-lg bg-ink text-white hover:bg-citra-orange font-dm-sans font-bold h-14 transition-all duration-300"
                  >
                    Rejoindre la liste d'attente
                  </Button>
                </div>
              ) : (trip.payment_link || (trip as any).deposit_payment_link) ? (
                <Button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full rounded-full shadow-lg bg-ink text-cream-card hover:bg-citra-orange hover:text-white font-dm-sans font-bold h-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  Réserver maintenant
                </Button>
              ) : (
                <Button disabled className="w-full rounded-full shadow-sm h-14 bg-white/30 text-ink/40 font-dm-sans cursor-not-allowed">
                  Réservation bientôt disponible
                </Button>
              )}
            </div>
          </aside>
        </div>
      </section>

      <Footer />

      {trip && (
        <BookingFormModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          trip={trip} 
          initialPaymentType={bookingPaymentType}
        />
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-[60]"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>

          {/* Left Arrow */}
          {allPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length);
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-sm transition-all duration-300 z-[60] hidden md:flex"
              aria-label="Image précédente"
            >
              <ArrowLeft size={24} />
            </button>
          )}

          {/* Main Image Container */}
          <div 
            className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={allPhotos[lightboxIndex]} 
              alt={`${trip.name} - Zoom ${lightboxIndex + 1}`} 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl transition-all duration-500"
            />
          </div>

          {/* Right Arrow */}
          {allPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i + 1) % allPhotos.length);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-sm transition-all duration-300 z-[60] hidden md:flex"
              aria-label="Image suivante"
            >
              <ArrowRight size={24} />
            </button>
          )}

          {/* Footer Info / Counter */}
          <div className="absolute bottom-6 text-center text-white/80 font-dm-sans space-y-2 select-none">
            <p className="text-sm font-bold tracking-widest uppercase">
              {trip.name}
            </p>
            <p className="text-xs text-white/50">
              {lightboxIndex + 1} / {allPhotos.length}
            </p>
          </div>

          {/* Mobile Navigation Taps */}
          <div className="md:hidden absolute bottom-20 flex gap-6 z-[60]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length);
              }}
              className="text-white/75 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i + 1) % allPhotos.length);
              }}
              className="text-white/75 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-sm"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoyageDetail;
