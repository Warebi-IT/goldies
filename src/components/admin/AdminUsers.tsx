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

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-users?action=list", {
      method: "GET",
    });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
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
    const { data, error } = await supabase.functions.invoke("admin-users?action=invite", {
      method: "POST",
      body: { email: normalizedEmail },
    });
    setSubmitting(false);
    if (error || data?.error) {
      toast({ title: "Erreur", description: data?.error ?? error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Invitation envoyée", description: `Invitation envoyée à ${normalizedEmail}` });
    setEmail("");
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    const { data, error } = await supabase.functions.invoke("admin-users?action=delete", {
      method: "DELETE",
      body: { user_id: toDelete.user_id },
    });
    if (error || data?.error) {
      toast({ title: "Erreur", description: data?.error ?? error?.message, variant: "destructive" });
    } else {
      toast({ title: "Admin supprimé" });
      load();
    }
    setToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={18} className="text-primary" />
          <h3 className="font-serif text-lg font-bold text-foreground">Ajouter un admin</h3>
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

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCog size={18} className="text-primary" />
          <h3 className="font-serif text-lg font-bold text-foreground">Admins existants</h3>
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
