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
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("admin-users?action=create", {
      method: "POST",
      body: { username: username.trim().toLowerCase(), password },
    });
    setSubmitting(false);
    if (error || data?.error) {
      toast({ title: "Erreur", description: data?.error ?? error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Admin créé", description: username });
    setUsername("");
    setPassword("");
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
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="nom.prenom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="^[a-z0-9]+\.[a-z0-9]+$"
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <Button type="submit" disabled={submitting} className="rounded-full">
            {submitting ? "Création..." : "Créer l'admin"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Format requis : <code>nom.prenom</code> (lettres minuscules, chiffres, séparés par un point)
        </p>
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
                  <p className="font-medium text-foreground">{u.username}</p>
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
