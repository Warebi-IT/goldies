import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera, MapPin } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Gallery = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const { data: albums, isLoading } = useQuery({
    queryKey: ["gallery-albums"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_albums")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: photos } = useQuery({
    queryKey: ["gallery-photos", selectedAlbum],
    queryFn: async () => {
      if (!selectedAlbum) return [];
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("album_id", selectedAlbum)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedAlbum,
  });

  const activeAlbum = albums?.find((a) => a.id === selectedAlbum);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary font-semibold mb-3">
              Nos souvenirs
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
              Galerie photo
            </h1>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Revivez les plus beaux moments de nos voyages à travers nos albums photo.
            </p>
          </div>

          {isLoading && (
            <div className="text-center text-muted-foreground py-16">Chargement...</div>
          )}

          {!isLoading && (!albums || albums.length === 0) && (
            <div className="text-center py-16">
              <Camera size={48} className="mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">Aucun album pour le moment. Revenez bientôt !</p>
            </div>
          )}

          {!selectedAlbum && albums && albums.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbum(album.id)}
                  className="group text-left rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-card"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {album.cover_image_url ? (
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera size={40} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                      {album.title}
                    </h3>
                    {album.destination && (
                      <div className="flex items-center gap-1 text-secondary text-sm mb-2">
                        <MapPin size={14} />
                        <span>{album.destination}</span>
                      </div>
                    )}
                    {album.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedAlbum && activeAlbum && (
            <div>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="text-sm text-secondary hover:text-secondary/80 font-medium mb-6 inline-flex items-center gap-1"
              >
                ← Retour aux albums
              </button>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                {activeAlbum.title}
              </h2>
              {activeAlbum.description && (
                <p className="text-muted-foreground mb-8">{activeAlbum.description}</p>
              )}

              {photos && photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setLightboxImg(photo.image_url)}
                      className="aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={photo.image_url}
                        alt={photo.caption || ""}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Aucune photo dans cet album.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!lightboxImg} onOpenChange={() => setLightboxImg(null)}>
        <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none">
          {lightboxImg && (
            <img
              src={lightboxImg}
              alt=""
              className="w-full h-auto rounded-xl"
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
