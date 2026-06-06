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
    <div className="min-h-screen bg-sky-canvas">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-control-tnt text-xs uppercase tracking-[0.2em] text-action-blue font-bold mb-3">
              [ 05 // GALERIE PHOTOS ]
            </p>
            <h1 className="font-control-compressed text-4xl md:text-6xl font-black text-cloud-white uppercase tracking-tight mb-2">
              Nos souvenirs de voyage
            </h1>
            <span className="font-control-cursive text-2xl text-cloud-white/80 block mb-4">
              Des sourires, de l'entraide et des paysages inoubliables
            </span>
            <p className="max-w-xl mx-auto text-sm font-control text-cloud-white/80 leading-relaxed">
              Revivez les plus beaux moments de nos aventures à travers les albums partagés par nos voyageuses.
            </p>
          </div>

          {isLoading && (
            <div className="text-center font-control-tnt text-cloud-white/60 py-16">Chargement des albums...</div>
          )}

          {!isLoading && (!albums || albums.length === 0) && (
            <div className="text-center py-16 text-cloud-white">
              <Camera size={48} className="mx-auto text-cloud-white/40 mb-4" />
              <p className="font-control text-cloud-white/70">Aucun album pour le moment. Revenez bientôt !</p>
            </div>
          )}

          {!selectedAlbum && albums && albums.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbum(album.id)}
                  className="group text-left rounded-cards overflow-hidden border border-cloud-white/10 bg-cloud-white shadow-none hover:border-action-blue/40 transition-all duration-300 flex flex-col p-4"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-images bg-haze-grey mb-4">
                    {album.cover_image_url ? (
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal-text/30 bg-haze-grey">
                        <Camera size={40} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col px-2">
                    {album.destination && (
                      <div className="flex items-center gap-1.5 text-action-blue mb-2">
                        <MapPin size={14} />
                        <span className="font-control-tnt text-xs font-bold uppercase tracking-wider">{album.destination}</span>
                      </div>
                    )}
                    <h3 className="font-control-compressed text-xl font-black text-midnight-ink uppercase tracking-tight group-hover:text-action-blue transition-colors mb-2">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-sm font-control text-charcoal-text/80 line-clamp-2 leading-relaxed flex-1">{album.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedAlbum && activeAlbum && (
            <div className="backdrop-blur-md bg-cloud-white/5 border border-cloud-white/10 p-8 rounded-cards text-cloud-white">
              <button
                onClick={() => setSelectedAlbum(null)}
                className="font-control text-sm text-action-blue hover:text-action-blue/80 font-bold mb-6 inline-flex items-center gap-1.5 transition-colors"
              >
                ← Retour aux albums
              </button>
              <h2 className="font-control-compressed text-3xl font-black text-cloud-white uppercase tracking-tight mb-2">
                {activeAlbum.title}
              </h2>
              {activeAlbum.description && (
                <p className="font-control text-sm text-cloud-white/80 mb-8 max-w-2xl leading-relaxed">{activeAlbum.description}</p>
              )}

              {photos && photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setLightboxImg(photo.image_url)}
                      className="aspect-square rounded-images overflow-hidden border border-cloud-white/10 bg-haze-grey group"
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
                <p className="font-control text-sm text-cloud-white/60 text-center py-8">Aucune photo dans cet album.</p>
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
