import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ConfirmationMFA from "@/components/admin/ConfirmationMFA";

interface ProgramDay {
  title: string;
  description: string;
}

interface TripForm {
  name: string;
  description: string;
  destination: string;
  price: number;
  duration: string;
  dates: string;
  includes: string;
  image_url: string;
  tag: string;
  payment_link: string;
  slug: string;
  program: ProgramDay[];
}

const emptyForm: TripForm = {
  name: "",
  description: "",
  destination: "",
  price: 0,
  duration: "",
  dates: "",
  includes: "Logement, Transport, Repas, Activités touristiques, Budget association",
  image_url: "",
  tag: "Disponible",
  payment_link: "",
  slug: "",
  program: [],
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminTrips = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TripForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [showMfaConfirm, setShowMfaConfirm] = useState(false);
  const [originalPaymentLink, setOriginalPaymentLink] = useState("");
  const mfaSucceeded = useRef(false);

  const { data: trips, isLoading } = useQuery({
    queryKey: ["admin-trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description,
        destination: form.destination,
        price: form.price,
        duration: form.duration,
        dates: form.dates,
        includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean),
        image_url: form.image_url || null,
        tag: form.tag,
        payment_link: form.payment_link || null,
        slug: form.slug || slugify(form.name) || null,
        program: form.program as any,
      };
      if (editId) {
        const { error } = await supabase.from("trips").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("trips").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trips"] });
      setModalOpen(false);
      setEditId(null);
      setForm(emptyForm);
      toast({ title: editId ? "Voyage modifié" : "Voyage ajouté" });
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trips"] });
      toast({ title: "Voyage supprimé" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("trips").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-trips"] }),
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `trips/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("gallery").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("gallery").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast({ title: "Image uploadée" });
    } catch (e: any) {
      toast({ title: "Erreur upload", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (trip: any) => {
    setEditId(trip.id);
    setOriginalPaymentLink(trip.payment_link || "");
    setForm({
      name: trip.name,
      description: trip.description || "",
      destination: trip.destination,
      price: trip.price,
      duration: trip.duration,
      dates: trip.dates,
      includes: (trip.includes || []).join(", "),
      image_url: trip.image_url || "",
      tag: trip.tag,
      payment_link: trip.payment_link || "",
      slug: trip.slug || "",
      program: Array.isArray(trip.program) ? trip.program : [],
    });
    setModalOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setOriginalPaymentLink("");
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.payment_link !== originalPaymentLink) {
      setShowMfaConfirm(true);
    } else {
      upsertMutation.mutate();
    }
  };

  const handleMfaOpenChange = (open: boolean) => {
    if (!open && !mfaSucceeded.current) {
      toast({ title: "Modification du lien Stripe annulée" });
    }
    mfaSucceeded.current = false;
    setShowMfaConfirm(open);
  };

  const handleMfaSuccess = () => {
    mfaSucceeded.current = true;
    setShowMfaConfirm(false);
    upsertMutation.mutate();
  };

  const addDay = () =>
    setForm((f) => ({ ...f, program: [...f.program, { title: "", description: "" }] }));
  const updateDay = (i: number, key: keyof ProgramDay, val: string) =>
    setForm((f) => ({
      ...f,
      program: f.program.map((d, idx) => (idx === i ? { ...d, [key]: val } : d)),
    }));
  const removeDay = (i: number) =>
    setForm((f) => ({ ...f, program: f.program.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">Gestion des voyages</h2>
        <Button onClick={openNew} className="gap-2 rounded-full bg-primary text-primary-foreground">
          <Plus size={16} /> Ajouter un voyage
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Chargement...</p>}

      <div className="space-y-4">
        {trips?.map((trip) => (
          <div key={trip.id} className="bg-card rounded-xl p-5 flex items-center gap-4 shadow-sm">
            {trip.image_url && (
              <img src={trip.image_url} alt={trip.name} className="w-20 h-16 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-foreground truncate">{trip.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  trip.is_active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {trip.is_active ? "Actif" : "Inactif"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-medium">
                  {trip.tag}
                </span>
                {trip.payment_link && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/30 text-foreground font-medium">
                    💳 Paiement
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {trip.destination} · {trip.price} € · {trip.duration}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleMutation.mutate({ id: trip.id, is_active: !trip.is_active })}
                title={trip.is_active ? "Désactiver" : "Activer"}
              >
                {trip.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => openEdit(trip)}>
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  if (confirm("Supprimer ce voyage ?")) deleteMutation.mutate(trip.id);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editId ? "Modifier le voyage" : "Nouveau voyage"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Nom du voyage *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Destination *</label>
                <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Prix (€) *</label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Durée *</label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="7 jours / 6 nuits" required />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Dates *</label>
                <Input value={form.dates} onChange={(e) => setForm({ ...form, dates: e.target.value })} placeholder="15 – 21 Juillet 2026" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Tag</label>
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Disponible">Disponible</option>
                <option value="Bientôt">Bientôt</option>
                <option value="Complet">Complet</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Inclus (séparés par des virgules)</label>
              <Input value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} />
            </div>

            {/* Image */}
            <div>
              <label className="text-xs font-medium mb-1 block">Image de couverture</label>
              {form.image_url && (
                <img src={form.image_url} alt="cover" className="w-full h-40 object-cover rounded-md mb-2" />
              )}
              <div className="flex gap-2">
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://... ou uploadez"
                />
                <label className="inline-flex items-center gap-2 px-3 rounded-md bg-secondary text-secondary-foreground text-sm font-medium cursor-pointer">
                  <Upload size={14} /> {uploading ? "..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            {/* Payment link */}
            <div>
              <label className="text-xs font-medium mb-1 block">Lien de paiement Stripe</label>
              <Input
                value={form.payment_link}
                onChange={(e) => setForm({ ...form, payment_link: e.target.value })}
                placeholder="https://buy.stripe.com/..."
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-xs font-medium mb-1 block">Slug URL (optionnel)</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder={slugify(form.name) || "auto-genere-depuis-le-nom"}
              />
            </div>

            {/* Program */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium block">Programme jour par jour</label>
                <Button type="button" variant="outline" size="sm" onClick={addDay} className="gap-1">
                  <Plus size={14} /> Ajouter un jour
                </Button>
              </div>
              <div className="space-y-3">
                {form.program.map((day, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">Jour {i + 1}</span>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeDay(i)}>
                        <X size={14} />
                      </Button>
                    </div>
                    <Input
                      value={day.title}
                      onChange={(e) => updateDay(i, "title", e.target.value)}
                      placeholder="Titre du jour"
                    />
                    <Textarea
                      value={day.description}
                      onChange={(e) => updateDay(i, "description", e.target.value)}
                      placeholder="Description des activités"
                      rows={2}
                    />
                  </div>
                ))}
                {form.program.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">Aucun jour. Cliquez "Ajouter un jour".</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "..." : editId ? "Enregistrer" : "Ajouter"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationMFA
        open={showMfaConfirm}
        onOpenChange={handleMfaOpenChange}
        onSuccess={handleMfaSuccess}
      />
    </div>
  );
};

export default AdminTrips;
