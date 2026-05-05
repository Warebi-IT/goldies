import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VoyageDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: trip, isLoading } = useQuery({
    queryKey: ["trip-detail", id],
    queryFn: async () => {
      // Try slug first, then id
      let q = await supabase.from("trips").select("*").eq("slug", id!).maybeSingle();
      if (!q.data) {
        q = await supabase.from("trips").select("*").eq("id", id!).maybeSingle();
      }
      if (q.error) throw q.error;
      return q.data;
    },
  });

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
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {trip.description || "Aucune description disponible."}
              </p>
            </div>

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
                <Calendar size={16} className="text-primary" /> {trip.dates}
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
