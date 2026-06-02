import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VoyageDetail = () => {
  const { id } = useParams<{ id: string }>();

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

  useEffect(() => {
    setPhotoIndex(0);
  }, [trip?.id]);

  useEffect(() => {
    if (!tripPhotos?.length || tripPhotos.length <= 1 || photoPaused) return;
    const timer = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % tripPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tripPhotos, photoPaused]);

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
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] mt-16">
        {trip.image_url && (
          <img src={trip.image_url} alt={trip.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-end pb-12">
          <Link to="/voyages" className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm mb-4">
            <ArrowLeft size={16} /> Tous nos voyages
          </Link>
          <div className="flex items-center gap-2 text-white/90 mb-2">
            <MapPin size={16} />
            <span className="text-sm font-medium">{trip.destination}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white">{trip.name}</h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {trip.description || "Aucune description disponible."}
              </p>
            </div>

            {/* Carousel photos */}
            {hasPhotos && (
              <div>
                <h2 className="font-serif text-2xl font-bold mb-6">Photos</h2>
                <div
                  className="relative rounded-2xl overflow-hidden"
                  onMouseEnter={() => setPhotoPaused(true)}
                  onMouseLeave={() => setPhotoPaused(false)}
                >
                  <img
                    src={tripPhotos[photoIndex].image_url}
                    alt=""
                    className="w-full h-80 object-cover"
                  />

                  {tripPhotos.length > 1 && (
                    <>
                      <button
                        onClick={() => setPhotoIndex((i) => (i - 1 + tripPhotos.length) % tripPhotos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                        aria-label="Photo précédente"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <button
                        onClick={() => setPhotoIndex((i) => (i + 1) % tripPhotos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                        aria-label="Photo suivante"
                      >
                        <ArrowRight size={16} />
                      </button>
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                        {tripPhotos.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPhotoIndex(i)}
                            className={`rounded-full transition-all ${
                              i === photoIndex ? "bg-white w-4 h-2" : "bg-white/50 w-2 h-2"
                            }`}
                            aria-label={`Photo ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Programme */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6">Programme jour par jour</h2>
              {program.length === 0 ? (
                <p className="text-muted-foreground">Programme à venir.</p>
              ) : (
                <ol className="space-y-5">
                  {program.map((day, i) => (
                    <li key={i} className="bg-card rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                          J{i + 1}
                        </span>
                        <h3 className="font-serif text-lg font-semibold">{day.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {day.description}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit bg-card rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">À partir de</span>
              <span className="font-serif text-3xl font-bold text-secondary">{trip.price} €</span>
            </div>
            <div className="space-y-3 text-sm border-t border-border pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={16} className="text-primary" /> {trip.duration}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} className="text-primary" /> {displayDates}
              </div>
            </div>

            {trip.includes && trip.includes.length > 0 && (
              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold mb-2">Inclus dans le séjour</p>
                <ul className="space-y-1.5">
                  {trip.includes.map((item: string) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={14} className="text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {trip.payment_link ? (
              <Button asChild className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-12">
                <a href={trip.payment_link} target="_blank" rel="noopener noreferrer">
                  Réserver maintenant
                </a>
              </Button>
            ) : (
              <Button disabled className="w-full rounded-full h-12">
                Réservation bientôt disponible
              </Button>
            )}
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VoyageDetail;
