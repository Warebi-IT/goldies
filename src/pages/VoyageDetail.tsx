import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle, Users, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingFormModal from "@/components/BookingFormModal";

const VoyageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: trip, isLoading } = useQuery({
    queryKey: ["trip-detail", id],
    queryFn: async () => {
      let q = await supabase.from("trips").select("*").eq("slug", id!).maybeSingle();
      if (!q.data) {
        q = await supabase.from("trips").select("*").eq("id", id!).maybeSingle();
      }
      if (q.error) throw q.error;
      return q.data;
    },
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
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 text-muted-foreground">Chargement...</div>
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

      {/* Hero */}
      <section 
        className="relative h-[65vh] min-h-[450px] mt-16 overflow-hidden group/hero"
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
        
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-concrete-canvas via-concrete-canvas/40 to-black/10 z-10" />

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
        <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-16">
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
            <div className="bg-white/80 backdrop-blur-sm shadow-xl p-8 rounded-[32px]">
              <h2 className="font-pp-neue-corp-compact text-2xl font-black uppercase tracking-tight mb-4">Description</h2>
              <p className="font-dm-sans text-ink/80 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {trip.description || "Aucune description disponible."}
              </p>
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
          <aside className="lg:sticky lg:top-32 h-fit bg-white/80 backdrop-blur-sm rounded-[32px] shadow-xl p-8 text-ink space-y-6">
            <div className="flex items-baseline justify-between">
              <span className="font-dm-sans text-sm text-ink/60">À partir de</span>
              <span className="font-pp-neue-corp-compact text-4xl font-black text-citra-orange">{trip.price} €</span>
            </div>
            <div className="space-y-4 text-sm border-t border-ink/5 pt-6">
              <div className="flex items-center gap-3 font-dm-sans text-ink/80">
                <Clock size={18} className="text-citra-orange" />
                <span className="font-dm-sans text-sm font-bold uppercase tracking-wider">{trip.duration}</span>
              </div>
              <div className="flex items-center gap-3 font-dm-sans text-ink/80">
                <Users size={18} className="text-citra-orange" />
                <span className="font-dm-sans text-sm font-bold uppercase tracking-wider">
                  {(trip as any).spots_left ?? 8} places restantes sur {(trip as any).total_spots ?? 12}
                </span>
              </div>
              <div className="flex items-center gap-3 font-dm-sans text-ink/80">
                <Calendar size={18} className="text-citra-orange" />
                <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">{trip.dates}</span>
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

            {trip.payment_link ? (
              <Button 
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full rounded-full shadow-md bg-white/50 backdrop-blur-sm text-ink hover:bg-ink hover:text-cream-card font-dm-sans font-bold h-14 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl mt-4"
              >
                Réserver maintenant
              </Button>
            ) : (
              <Button disabled className="w-full rounded-full shadow-sm h-14 bg-white/30 text-ink/40 font-dm-sans cursor-not-allowed mt-4">
                Réservation bientôt disponible
              </Button>
            )}
          </aside>
        </div>
      </section>

      <Footer />

      {trip && (
        <BookingFormModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          trip={trip} 
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
