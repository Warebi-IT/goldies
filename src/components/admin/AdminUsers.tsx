import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, UserCog } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminUser {
  user_id: string;
  username: string;
  created_at: string;
  invited_at: string | null;
  confirmed_at: string | null;
}

async function invokeAdmin(action: string, options?: Parameters<typeof supabase.functions.invoke>[1]) {
  const { data, error } = await supabase.functions.invoke(`admin-users?action=${action}`, options);
  if (error) {
    let message = error.message;
    try {
      const body = await (error as any).context?.json?.();
      if (body?.error) message = body.error;
    } catch { /* use generic message */ }
    return { data: null as null, errorMessage: message };
  }
  if (data?.error) return { data: null as null, errorMessage: String(data.error) };
  return { data, errorMessage: null };
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, errorMessage } = await invokeAdmin("list", { method: "GET" });
    if (errorMessage) toast({ title: "Erreur", description: errorMessage, variant: "destructive" });
    else setUsers(data?.users ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    setSubmitting(true);
    const { errorMessage } = await invokeAdmin("invite", {
      method: "POST",
      body: { email: normalizedEmail },
    });
    setSubmitting(false);
    if (errorMessage) {
      toast({ title: "Erreur", description: errorMessage, variant: "destructive" });
      return;
    }
    toast({ title: "Invitation envoyée", description: `Invitation envoyée à ${normalizedEmail}` });
    setEmail("");
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    const { errorMessage } = await invokeAdmin("delete", {
      method: "DELETE",
      body: { user_id: toDelete.user_id },
    });
    if (errorMessage) {
      toast({ title: "Erreur", description: errorMessage, variant: "destructive" });
    } else {
      toast({ title: "Admin supprimé" });
      load();
    }
    setToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ink/10">
        <h2 className="font-pp-neue-corp-compact text-3xl font-black text-ink uppercase tracking-tight">
          Gestion des Administrateurs
        </h2>
        <p className="font-dm-sans text-sm text-ink/60 mt-1">
          Invitez de nouveaux administrateurs ou gérez les comptes d'accès existants.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-ink/5 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={18} className="text-primary" />
          <h3 className="font-pp-neue-corp-compact text-lg font-black text-ink uppercase tracking-tight">Ajouter un admin</h3>
        </div>
        <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <Input
            type="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={submitting} className="rounded-full">
            {submitting ? "Invitation..." : "Inviter"}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-ink/5 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <UserCog size={18} className="text-primary" />
          <h3 className="font-pp-neue-corp-compact text-lg font-black text-ink uppercase tracking-tight">Admins existants</h3>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun admin.</p>
        ) : (
          <ul className="divide-y divide-border">
            {users.map((u) => (
              <li key={u.user_id} className="flex items-center justify-between py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{u.username}</p>
                    {u.invited_at && !u.confirmed_at ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        Invitation en attente
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Créé le {new Date(u.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setToDelete(u)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet admin ?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete?.username} ne pourra plus se connecter. Action irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
