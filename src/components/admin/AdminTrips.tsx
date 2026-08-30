import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X, Calendar as CalendarIcon, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ConfirmationMFA from "@/components/admin/ConfirmationMFA";
import { isValidRedirectUrl } from "@/lib/security";
import { canHardDeleteTrip } from "@/lib/business-rules";
import { formatUserErrorMessage } from "@/lib/error-handler";

interface ProgramDay {
  title: string;
  description: string;
}

interface TripPhoto {
  url: string;
}

interface TripForm {
  name: string;
  description: string;
  destination: string;
  price: number;
  deposit_amount: number | null;
  qte: number | null;
  duration: string;
  dates: string;
  includes: string;
  image_url: string;
  tag: string;
  payment_link: string;
  deposit_payment_link: string;
  slug: string;
  program: ProgramDay[];
  start_date: string;
  end_date: string;
}

const emptyForm: TripForm = {
  name: "",
  description: "",
  destination: "",
  price: 0,
  deposit_amount: null,
  qte: null,
  duration: "",
  dates: "",
  includes: "Logement, Transport, Repas, Activités touristiques, Budget association",
  image_url: "",
  tag: "Disponible",
  payment_link: "",
  deposit_payment_link: "",
  slug: "",
  program: [],
  start_date: "",
  end_date: "",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toLocalISODate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const fromLocalISODate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatDateFr = (date: Date) =>
  date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

const AdminTrips = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TripForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [tripPhotos, setTripPhotos] = useState<TripPhoto[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [showMfaConfirm, setShowMfaConfirm] = useState(false);
  const [originalPaymentLink, setOriginalPaymentLink] = useState("");
  const [originalDepositLink, setOriginalDepositLink] = useState("");
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

  const handleStartDate = (date: Date | undefined) => {
    const iso = date ? toLocalISODate(date) : "";
    setForm((prev) => {
      const endDate = prev.end_date ? fromLocalISODate(prev.end_date) : undefined;
      if (date && endDate && endDate > date) {
        const days = Math.round((endDate.getTime() - date.getTime()) / 86400000) + 1;
        const nights = days - 1;
        return {
          ...prev,
          start_date: iso,
          duration: `${days} jour${days > 1 ? "s" : ""} / ${nights} nuit${nights > 1 ? "s" : ""}`,
          dates: `${formatDateFr(date)} au ${formatDateFr(endDate)}`,
        };
      }
      return { ...prev, start_date: iso };
    });
  };

  const handleEndDate = (date: Date | undefined) => {
    const iso = date ? toLocalISODate(date) : "";
    setForm((prev) => {
      const startDate = prev.start_date ? fromLocalISODate(prev.start_date) : undefined;
      if (date && startDate && date > startDate) {
        const days = Math.round((date.getTime() - startDate.getTime()) / 86400000) + 1;
        const nights = days - 1;
        return {
          ...prev,
          end_date: iso,
          duration: `${days} jour${days > 1 ? "s" : ""} / ${nights} nuit${nights > 1 ? "s" : ""}`,
          dates: `${formatDateFr(startDate)} au ${formatDateFr(date)}`,
        };
      }
      return { ...prev, end_date: iso };
    });
  };

  const upsertMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name: form.name,
        description: form.description,
        destination: form.destination,
        price: form.price,
        deposit_amount: form.deposit_amount ? Number(form.deposit_amount) : null,
        qte: form.qte ?? null,
        duration: form.duration,
        dates: form.dates,
        includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean),
        image_url: form.image_url || null,
        tag: form.tag,
        payment_link: form.payment_link || null,
        deposit_payment_link: form.deposit_payment_link || null,
        slug: form.slug || slugify(form.name) || null,
        program: form.program as any,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };

      let tripId: string;
      let depositColumnMissing = false;

      try {
        if (editId) {
          const { error } = await supabase.from("trips").update(payload).eq("id", editId);
          if (error) throw error;
          tripId = editId;
        } else {
          const { data, error } = await supabase.from("trips").insert(payload).select("id").single();
          if (error) throw error;
          tripId = data.id;
        }
      } catch (err: any) {
        // Fallback: If deposit_amount column is not yet present in remote Supabase schema cache, retry without it
        if (err?.message?.includes("deposit_amount") || err?.code === "PGRST204") {
          depositColumnMissing = true;
          const { deposit_amount, ...fallbackPayload } = payload;
          if (editId) {
            const { error: retryErr } = await supabase.from("trips").update(fallbackPayload).eq("id", editId);
            if (retryErr) throw retryErr;
            tripId = editId;
          } else {
            const { data, error: retryErr } = await supabase.from("trips").insert(fallbackPayload).select("id").single();
            if (retryErr) throw retryErr;
            tripId = data.id;
          }
        } else {
          throw err;
        }
      }

      // Replace all photos for this trip
      const { error: delError } = await supabase
        .from("trip_photos")
        .delete()
        .eq("trip_id", tripId);
      if (delError) throw delError;

      if (tripPhotos.length > 0) {
        const { error: insError } = await supabase.from("trip_photos").insert(
          tripPhotos.map((p, i) => ({ trip_id: tripId, image_url: p.url, sort_order: i }))
        );
        if (insError) throw insError;
      }

      // Log audit event
      await supabase.from("audit_events").insert({
        action: editId ? "TRIP_UPDATED" : "TRIP_CREATED",
        entity_type: "trip",
        entity_id: tripId,
        details: {
          name: form.name,
          destination: form.destination,
          price: form.price,
          is_active: true,
          deposit_column_missing: depositColumnMissing,
        },
      });

      return { tripId, isEdit: !!editId, depositColumnMissing };
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-trips"] });
      setModalOpen(false);
      setEditId(null);
      setForm(emptyForm);
      setTripPhotos([]);

      if (res?.depositColumnMissing) {
        toast({
          title: res.isEdit ? "Voyage modifié avec succès" : "Voyage ajouté avec succès",
          description: "Les informations et liens Stripe ont bien été enregistrés.\n\n💡 Note : pour persister le montant d'acompte personnalisé, exécutez la commande SQL suivante dans Supabase :\nALTER TABLE trips ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC;",
        });
      } else {
        toast({ title: res?.isEdit ? "Voyage modifié avec succès" : "Voyage ajouté avec succès" });
      }
    },
    onError: (e: any) => {
      const err = formatUserErrorMessage(e);
      toast({
        title: err.title,
        description: `${err.description}${err.action ? `\n\n💡 Action requise : ${err.action}` : ""}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Check if bookings are attached to this trip
      const { count, error: countErr } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("trip_id", id);
      if (countErr) throw countErr;

      const check = canHardDeleteTrip(count ?? 0);
      if (!check.allowed) {
        // Enforce Soft-Delete: deactivate and hide from public
        const { error: updateErr } = await supabase
          .from("trips")
          .update({ is_active: false })
          .eq("id", id);
        if (updateErr) throw updateErr;

        await supabase.from("audit_events").insert({
          action: "TRIP_ARCHIVED_PROTECTED",
          entity_type: "trip",
          entity_id: id,
          details: {
            reason: "Règle de gestion : Soft-delete automatique car des inscriptions existent.",
            bookings_count: count,
          },
        });

        return { softDeleted: true, count };
      }

      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;

      await supabase.from("audit_events").insert({
        action: "TRIP_DELETED",
        entity_type: "trip",
        entity_id: id,
      });

      return { softDeleted: false };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-trips"] });
      if (data?.softDeleted) {
        toast({
          title: "Voyage archivé avec succès",
          description: `Des participantes (${data.count}) sont inscrites. Le voyage a été désactivé et masqué du public pour protéger vos données.`,
        });
      } else {
        toast({ title: "Voyage supprimé définitivement" });
      }
    },
    onError: (err: any) => {
      const errDiag = formatUserErrorMessage(err);
      toast({
        title: errDiag.title,
        description: `${errDiag.description}${errDiag.action ? `\n\n💡 Action requise : ${errDiag.action}` : ""}`,
        variant: "destructive",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("trips").update({ is_active }).eq("id", id);
      if (error) throw error;

      await supabase.from("audit_events").insert({
        action: "TRIP_VISIBILITY_TOGGLED",
        entity_type: "trip",
        entity_id: id,
        details: { is_active },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-trips"] }),
    onError: (e: any) => {
      const err = formatUserErrorMessage(e);
      toast({ title: err.title, description: err.description, variant: "destructive" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from("trips").update({ is_featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trips"] });
      toast({ title: "Mise en avant modifiée" });
    },
    onError: (e: any) => {
      const err = formatUserErrorMessage(e);
      toast({ title: err.title, description: err.description, variant: "destructive" });
    },
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
      toast({ title: "Image uploadée avec succès" });
    } catch (e: any) {
      const err = formatUserErrorMessage(e);
      toast({ title: err.title, description: `${err.description} ${err.action || ""}`, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files) return;
    setGalleryUploading(true);
    try {
      const uploaded: TripPhoto[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const path = `trips/${filename}.${ext}`;
        const { error } = await supabase.storage.from("gallery").upload(path, file, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from("gallery").getPublicUrl(path);
        uploaded.push({ url: data.publicUrl });
      }
      setTripPhotos((prev) => [...prev, ...uploaded]);
      toast({ title: `${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} ajoutée${uploaded.length > 1 ? "s" : ""}` });
    } catch (e: any) {
      const err = formatUserErrorMessage(e);
      toast({ title: err.title, description: `${err.description} ${err.action || ""}`, variant: "destructive" });
    } finally {
      setGalleryUploading(false);
    }
  };

  const openEdit = async (trip: any) => {
    setEditId(trip.id);
    setOriginalPaymentLink(trip.payment_link || "");
    setOriginalDepositLink(trip.deposit_payment_link || "");
    setForm({
      name: trip.name,
      description: trip.description || "",
      destination: trip.destination,
      price: trip.price,
      deposit_amount: trip.deposit_amount ?? null,
      qte: trip.qte ?? null,
      duration: trip.duration,
      dates: trip.dates,
      includes: (trip.includes || []).join(", "),
      image_url: trip.image_url || "",
      tag: trip.tag,
      payment_link: trip.payment_link || "",
      deposit_payment_link: trip.deposit_payment_link || "",
      slug: trip.slug || "",
      program: Array.isArray(trip.program) ? trip.program : [],
      start_date: trip.start_date || "",
      end_date: trip.end_date || "",
    });

    const { data } = await supabase
      .from("trip_photos")
      .select("image_url")
      .eq("trip_id", trip.id)
      .order("sort_order");
    setTripPhotos(data?.map((p) => ({ url: p.image_url })) || []);

    setModalOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setOriginalPaymentLink("");
    setOriginalDepositLink("");
    setForm(emptyForm);
    setTripPhotos([]);
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.payment_link && !isValidRedirectUrl(form.payment_link)) {
      toast({
        title: "Lien de paiement invalide",
        description: "Le lien doit être une URL complète commençant par https://",
        variant: "destructive",
      });
      return;
    }
    if (form.deposit_payment_link && !isValidRedirectUrl(form.deposit_payment_link)) {
      toast({
        title: "Lien d'acompte invalide",
        description: "Le lien doit être une URL complète commençant par https://",
        variant: "destructive",
      });
      return;
    }
    if (form.payment_link !== originalPaymentLink || form.deposit_payment_link !== originalDepositLink) {
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

  const computedDuration = (() => {
    if (!form.start_date || !form.end_date) return null;
    const start = fromLocalISODate(form.start_date);
    const end = fromLocalISODate(form.end_date);
    const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    const nights = days - 1;
    return `${days} jour${days > 1 ? "s" : ""} / ${nights} nuit${nights > 1 ? "s" : ""}`;
  })();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10 mb-6">
        <div>
          <h2 className="font-pp-neue-corp-compact text-3xl font-black text-ink uppercase tracking-tight">
            Gestion des Voyages
          </h2>
          <p className="font-dm-sans text-sm text-ink/60 mt-1">
            Configurez les destinations, les tarifs, les dates et les programmes des séjours.
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 rounded-full bg-primary text-primary-foreground self-start sm:self-auto">
          <Plus size={16} /> Ajouter un voyage
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Chargement...</p>}

      <div className="space-y-4">
        {trips?.map((trip) => (
          <div key={trip.id} className="bg-white border border-ink/5 rounded-xl p-5 flex items-center gap-4 shadow-sm">
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
                {trip.is_featured && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-citra-orange/10 text-citra-orange font-bold flex items-center gap-1">
                    <Star size={12} className="fill-current" /> Accueil
                  </span>
                )}
                {trip.payment_link && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/30 text-foreground font-medium">
                    💳 Total/Klarna
                  </span>
                )}
                {trip.deposit_payment_link && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                    💰 Acompte ({trip.deposit_amount ? `${trip.deposit_amount} €` : "30%"})
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {trip.destination} · {trip.price} € {trip.deposit_amount ? `(Acompte : ${trip.deposit_amount} €)` : ""} · {trip.duration}
              </p>
            </div>
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFeaturedMutation.mutate({ id: trip.id, is_featured: !trip.is_featured })}
                    className={trip.is_featured ? "text-citra-orange" : "text-muted-foreground"}
                  >
                    <Star size={16} className={trip.is_featured ? "fill-current" : ""} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-ink text-white font-dm-sans text-xs">
                  <p>{trip.is_featured ? "Retirer ce voyage de la page d'accueil" : "Afficher ce voyage sur la page d'accueil"}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleMutation.mutate({ id: trip.id, is_active: !trip.is_active })}
                  >
                    {trip.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-ink text-white font-dm-sans text-xs">
                  <p>{trip.is_active ? "Cacher ce voyage (le rendre invisible aux clients)" : "Activer ce voyage (le rendre visible aux clients)"}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(trip)}>
                    <Pencil size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-ink text-white font-dm-sans text-xs">
                  <p>Modifier les informations de ce voyage</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent className="bg-destructive text-destructive-foreground font-dm-sans text-xs font-bold">
                  <p>Supprimer définitivement ce voyage</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
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
            <div>
              <label className="text-xs font-medium mb-1 block">Quantité de places</label>
              <Input
                type="number"
                min={0}
                value={form.qte ?? ""}
                onChange={(e) => setForm({ ...form, qte: e.target.value === "" ? null : Number(e.target.value) })}
                placeholder="Nombre de places disponibles"
              />
            </div>

            {/* Dates */}
            <div className="space-y-3">
              <label className="text-xs font-medium block">Dates du voyage</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Date de début</label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal h-10 text-sm">
                        <CalendarIcon size={14} className="mr-2 shrink-0" />
                        {form.start_date
                          ? fromLocalISODate(form.start_date).toLocaleDateString("fr-FR")
                          : <span className="text-muted-foreground">Choisir</span>
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.start_date ? fromLocalISODate(form.start_date) : undefined}
                        onSelect={(date) => { handleStartDate(date); setStartDateOpen(false); }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Date de fin</label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal h-10 text-sm">
                        <CalendarIcon size={14} className="mr-2 shrink-0" />
                        {form.end_date
                          ? fromLocalISODate(form.end_date).toLocaleDateString("fr-FR")
                          : <span className="text-muted-foreground">Choisir</span>
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.end_date ? fromLocalISODate(form.end_date) : undefined}
                        onSelect={(date) => { handleEndDate(date); setEndDateOpen(false); }}
                        disabled={(date) =>
                          form.start_date ? date <= fromLocalISODate(form.start_date) : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {computedDuration && (
                <p className="text-sm font-medium text-primary">{computedDuration}</p>
              )}

              {/* Fallback text fields for trips without date picker data */}
              {!form.start_date && !form.end_date && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Durée (texte)</label>
                    <Input
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      placeholder="7 jours / 6 nuits"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Dates (texte)</label>
                    <Input
                      value={form.dates}
                      onChange={(e) => setForm({ ...form, dates: e.target.value })}
                      placeholder="15 – 21 Juillet 2026"
                    />
                  </div>
                </div>
              )}
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

            {/* Image de couverture */}
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

            {/* Photos du voyage */}
            <div>
              <label className="text-xs font-medium mb-2 block">Photos du voyage</label>
              {tripPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {tripPhotos.map((photo, i) => (
                    <div key={i} className="relative group">
                      <img src={photo.url} alt="" className="w-full h-24 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => setTripPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium cursor-pointer w-full justify-center">
                <Upload size={14} /> {galleryUploading ? "..." : "Ajouter des photos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleGalleryUpload(e.target.files)}
                />
              </label>
            </div>

            {/* Payment links & Deposit amount */}
            <div className="border border-ink/10 rounded-xl p-4 bg-muted/20 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  💳 Configuration des Paiements Stripe
                </label>
                <span className="text-[11px] text-muted-foreground bg-white px-2 py-0.5 rounded-full border border-ink/10">
                  2 Liens & Acompte
                </span>
              </div>

              {/* Lien 1 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Lien 1 : Paiement intégral ou en plusieurs fois (Klarna / Stripe)
                  </label>
                  {form.payment_link ? (
                    <span className="text-[10px] text-emerald-600 font-medium">Configuré ✓</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Recommandé</span>
                  )}
                </div>
                <Input
                  value={form.payment_link}
                  onChange={(e) => setForm({ ...form, payment_link: e.target.value })}
                  placeholder="https://buy.stripe.com/... (Totalité & 3x/4x Klarna)"
                />
                <p className="text-[11px] text-muted-foreground">
                  Ce lien sera utilisé pour les clientes choisissant « Payer la totalité » ou « Payer en plusieurs fois ».
                </p>
              </div>

              {/* Lien 2 */}
              <div className="space-y-1 pt-1 border-t border-ink/5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Lien 2 : Paiement de l'acompte (Stripe)
                  </label>
                  {form.deposit_payment_link ? (
                    <span className="text-[10px] text-emerald-600 font-medium">Configuré ✓</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Optionnel</span>
                  )}
                </div>
                <Input
                  value={form.deposit_payment_link}
                  onChange={(e) => setForm({ ...form, deposit_payment_link: e.target.value })}
                  placeholder="https://buy.stripe.com/... (Acompte)"
                />
                <p className="text-[11px] text-muted-foreground">
                  Ce lien sera utilisé pour les clientes choisissant « Payer un acompte ».
                </p>
              </div>

              {/* Montant de l'acompte */}
              <div className="space-y-2 pt-1 border-t border-ink/5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Montant de l'acompte (€)
                  </label>
                  {form.price > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 text-[11px] px-2 py-0"
                        onClick={() => setForm({ ...form, deposit_amount: Math.round(form.price * 0.3) })}
                      >
                        Suggérer 30% ({Math.round(form.price * 0.3)} €)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 text-[11px] px-2 py-0"
                        onClick={() => setForm({ ...form, deposit_amount: Math.round(form.price * 0.4) })}
                      >
                        40% ({Math.round(form.price * 0.4)} €)
                      </Button>
                    </div>
                  )}
                </div>
                <Input
                  type="number"
                  min={0}
                  max={form.price || undefined}
                  value={form.deposit_amount ?? ""}
                  onChange={(e) => setForm({ ...form, deposit_amount: e.target.value === "" ? null : Number(e.target.value) })}
                  placeholder={form.price ? `Ex : ${Math.round(form.price * 0.3)} € (ou laisser vide pour 30%)` : "Montant fixe de l'acompte en €"}
                />
                {form.price > 0 && (
                  <div className="text-xs bg-white/80 p-2.5 rounded-lg border border-ink/5 text-ink/70 flex items-center justify-between flex-wrap gap-1">
                    <span>
                      Acompte : <strong>{form.deposit_amount ?? Math.round(form.price * 0.3)} €</strong>
                      {" "}({Math.round(((form.deposit_amount ?? Math.round(form.price * 0.3)) / form.price) * 100)}% du total)
                    </span>
                    <span className="text-citra-orange font-semibold">
                      Solde restant : {Math.max(0, form.price - (form.deposit_amount ?? Math.round(form.price * 0.3)))} €
                    </span>
                  </div>
                )}
              </div>
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
