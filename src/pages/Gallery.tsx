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
    <div className="min-h-screen bg-concrete-canvas">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-dm-sans text-sm uppercase tracking-wider text-citra-orange font-bold mb-3">
              [ GALERIE PHOTOS ]
            </p>
            <h1 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-ink uppercase tracking-tight mb-4">
              Nos souvenirs de voyage
            </h1>
            <span className="font-pp-neue-corp-compact text-2xl text-ink/80 block mb-6">
              Des sourires, de l'entraide et des paysages inoubliables
            </span>
            <p className="max-w-xl mx-auto text-lg font-dm-sans font-medium text-ink/80 leading-relaxed">
              Revivez les plus beaux moments de nos aventures à travers les albums partagés par nos voyageuses.
            </p>
          </div>

          {isLoading && (
            <div className="text-center font-dm-sans font-bold uppercase text-ink/60 py-16">Chargement des albums...</div>
          )}

          {!isLoading && (!albums || albums.length === 0) && (
            <div className="text-center py-16 text-ink">
              <Camera size={48} className="mx-auto text-ink/40 mb-4" />
              <p className="font-dm-sans font-medium text-ink/70">Aucun album pour le moment. Revenez bientôt !</p>
            </div>
          )}

          {!selectedAlbum && albums && albums.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbum(album.id)}
                  className="group text-left rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col p-6"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-[20px] bg-gray-100 mb-6">
                    {album.cover_image_url ? (
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink/30 bg-gray-100">
                        <Camera size={40} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    {album.destination && (
                      <div className="flex items-center gap-1 text-ink/70 mb-3">
                        <MapPin size={14} />
                        <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">{album.destination}</span>
                      </div>
                    )}
                    <h3 className="font-pp-neue-corp-compact text-2xl font-black text-ink uppercase tracking-tight group-hover:text-citra-orange transition-colors mb-3">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-base font-dm-sans font-medium text-ink/80 line-clamp-2 leading-relaxed flex-1">{album.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedAlbum && activeAlbum && (
            <div className="bg-white/80 backdrop-blur-md shadow-xl p-8 md:p-12 rounded-[32px] text-ink">
              <button
                onClick={() => setSelectedAlbum(null)}
                className="font-dm-sans text-sm text-citra-orange hover:text-citra-orange/80 font-bold mb-8 inline-flex items-center gap-2 transition-colors uppercase tracking-wider"
              >
                ← Retour aux albums
              </button>
              <h2 className="font-pp-neue-corp-compact text-4xl md:text-5xl font-black text-ink uppercase tracking-tight mb-4">
                {activeAlbum.title}
              </h2>
              {activeAlbum.description && (
                <p className="font-dm-sans font-medium text-lg text-ink/80 mb-10 max-w-3xl leading-relaxed">{activeAlbum.description}</p>
              )}

              {photos && photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setLightboxImg(photo.image_url)}
                      className="aspect-square rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gray-100 group"
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
                <p className="font-dm-sans font-medium text-lg text-ink/60 text-center py-12">Aucune photo dans cet album.</p>
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
