import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Image, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AlbumForm {
  title: string;
  description: string;
  destination: string;
  cover_image_url: string;
}

const emptyAlbumForm: AlbumForm = {
  title: "",
  description: "",
  destination: "",
  cover_image_url: "",
};

const AdminGallery = () => {
  const queryClient = useQueryClient();
  const [albumModal, setAlbumModal] = useState(false);
  const [editAlbumId, setEditAlbumId] = useState<string | null>(null);
  const [albumForm, setAlbumForm] = useState<AlbumForm>(emptyAlbumForm);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const ext = file.name.split(".").pop();
      //const path = `covers/${crypto.randomUUID()}.${ext}`;
      const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(path);
      setAlbumForm((f) => ({ ...f, cover_image_url: publicUrl }));
      toast({ title: "Couverture uploadée" });
    } catch (err: any) {
      toast({ title: "Erreur upload", description: err.message, variant: "destructive" });
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  const { data: albums, isLoading } = useQuery({
    queryKey: ["admin-albums"],
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
    queryKey: ["admin-photos", selectedAlbum],
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

  const upsertAlbum = useMutation({
    mutationFn: async () => {
      const payload = {
        title: albumForm.title,
        description: albumForm.description || null,
        destination: albumForm.destination || null,
        cover_image_url: albumForm.cover_image_url || null,
      };
      if (editAlbumId) {
        const { error } = await supabase.from("gallery_albums").update(payload).eq("id", editAlbumId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery_albums").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-albums"] });
      setAlbumModal(false);
      setEditAlbumId(null);
      setAlbumForm(emptyAlbumForm);
      toast({ title: editAlbumId ? "Album modifié" : "Album créé" });
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteAlbum = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_albums").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-albums"] });
      if (selectedAlbum) setSelectedAlbum(null);
      toast({ title: "Album supprimé" });
    },
  });

  const deletePhoto = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-photos", selectedAlbum] });
      toast({ title: "Photo supprimée" });
    },
  });

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedAlbum) return;
    setUploading(true);
    try {
      const files = Array.from(e.target.files);
      for (const file of files) {
        const ext = file.name.split(".").pop();
        //const path = `${selectedAlbum}/${crypto.randomUUID()}.${ext}`;
        const path = `${selectedAlbum}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(path);

        const { error: insertError } = await supabase.from("gallery_photos").insert({
          album_id: selectedAlbum,
          image_url: publicUrl,
          caption: file.name.replace(/\.[^/.]+$/, ""),
          sort_order: (photos?.length || 0) + files.indexOf(file),
        });
        if (insertError) throw insertError;
      }
      queryClient.invalidateQueries({ queryKey: ["admin-photos", selectedAlbum] });
      toast({ title: `${files.length} photo(s) ajoutée(s)` });
    } catch (err: any) {
      toast({ title: "Erreur upload", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const openEditAlbum = (album: any) => {
    setEditAlbumId(album.id);
    setAlbumForm({
      title: album.title,
      description: album.description || "",
      destination: album.destination || "",
      cover_image_url: album.cover_image_url || "",
    });
    setAlbumModal(true);
  };

  const openNewAlbum = () => {
    setEditAlbumId(null);
    setAlbumForm(emptyAlbumForm);
    setAlbumModal(true);
  };

  const activeAlbum = albums?.find((a) => a.id === selectedAlbum);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          {selectedAlbum && activeAlbum ? activeAlbum.title : "Gestion de la galerie"}
        </h2>
        {!selectedAlbum ? (
          <Button onClick={openNewAlbum} className="gap-2 rounded-full bg-primary text-primary-foreground">
            <Plus size={16} /> Nouvel album
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedAlbum(null)}>
              ← Retour
            </Button>
            <label className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium cursor-pointer hover:bg-primary/90">
              <Upload size={16} />
              {uploading ? "Upload..." : "Ajouter photos"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUploadPhotos}
                disabled={uploading}
              />
            </label>
          </div>
        )}
      </div>

      {isLoading && <p className="text-muted-foreground">Chargement...</p>}

      {/* Album list */}
      {!selectedAlbum && (
        <div className="space-y-4">
          {albums?.map((album) => (
            <div key={album.id} className="bg-card rounded-xl p-5 flex items-center gap-4 shadow-sm">
              {album.cover_image_url ? (
                <img src={album.cover_image_url} alt="" className="w-20 h-16 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-20 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Image size={20} className="text-muted-foreground/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{album.title}</h3>
                <p className="text-sm text-muted-foreground">{album.destination || "—"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setSelectedAlbum(album.id)}>
                  Voir photos
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEditAlbum(album)}>
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm("Supprimer cet album et toutes ses photos ?")) deleteAlbum.mutate(album.id);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          {albums && albums.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Aucun album. Créez-en un !</p>
          )}
        </div>
      )}

      {/* Photos grid */}
      {selectedAlbum && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos?.map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square">
              <img src={photo.image_url} alt={photo.caption || ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-background hover:text-background hover:bg-destructive/80"
                  onClick={() => {
                    if (confirm("Supprimer cette photo ?")) deletePhoto.mutate(photo.id);
                  }}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-foreground/60 px-2 py-1">
                  <p className="text-xs text-background truncate">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
          {photos && photos.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-8">
              Aucune photo. Utilisez le bouton "Ajouter photos" ci-dessus.
            </p>
          )}
        </div>
      )}

      {/* Album form modal */}
      <Dialog open={albumModal} onOpenChange={setAlbumModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editAlbumId ? "Modifier l'album" : "Nouvel album"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              upsertAlbum.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-medium mb-1 block">Titre *</label>
              <Input value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Destination</label>
              <Input value={albumForm.destination} onChange={(e) => setAlbumForm({ ...albumForm, destination: e.target.value })} placeholder="Sénégal" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Description</label>
              <Textarea value={albumForm.description} onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })} rows={2} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Image de couverture</label>
              {albumForm.cover_image_url && (
                <img src={albumForm.cover_image_url} alt="" className="w-full h-32 object-cover rounded-md mb-2" />
              )}
              <div className="flex gap-2">
                <Input
                  value={albumForm.cover_image_url}
                  onChange={(e) => setAlbumForm({ ...albumForm, cover_image_url: e.target.value })}
                  placeholder="https://... ou uploadez"
                  className="flex-1"
                />
                <label className="inline-flex items-center gap-2 rounded-md bg-secondary text-secondary-foreground px-3 py-2 text-sm font-medium cursor-pointer hover:bg-secondary/80 shrink-0">
                  <Upload size={14} />
                  {uploadingCover ? "..." : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadCover} disabled={uploadingCover} />
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setAlbumModal(false)} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground" disabled={upsertAlbum.isPending}>
                {upsertAlbum.isPending ? "..." : editAlbumId ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
