import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminTrips from "@/components/admin/AdminTrips";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminUsers from "@/components/admin/AdminUsers";
import logo from "@/assets/logo.png";
import { LogOut } from "lucide-react";

const EMAIL_DOMAIN = "goldies.local";

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [needsBootstrap, setNeedsBootstrap] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const check = async () => {
      if (!session) {
        setIsAdmin(null);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    check();
  }, [session]);

  useEffect(() => {
    const check = async () => {
      if (session) return;
      const { data } = await supabase.functions.invoke("admin-users?action=status", {
        method: "GET",
      });
      setNeedsBootstrap(!!data?.needs_bootstrap);
    };
    check();
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const clean = username.trim().toLowerCase();
    const email = clean.includes("@") ? clean : `${clean}@${EMAIL_DOMAIN}`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError("Identifiants invalides");
  };

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const clean = username.trim().toLowerCase();
    const { data, error } = await supabase.functions.invoke("admin-users?action=create", {
      method: "POST",
      body: { username: clean, password },
    });
    if (error || data?.error) {
      setAuthError(data?.error ?? error?.message ?? "Erreur");
      return;
    }
    // sign in
    const email = `${clean}@${EMAIL_DOMAIN}`;
    await supabase.auth.signInWithPassword({ email, password });
    setNeedsBootstrap(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    const isBootstrap = needsBootstrap;
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-sm bg-card rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 justify-center mb-6">
            <img src={logo} alt="Goldies Travel" className="h-10 w-10" />
            <span className="font-serif text-xl font-bold text-foreground">Admin</span>
          </div>
          {isBootstrap && (
            <p className="text-xs text-center text-muted-foreground mb-4">
              Aucun admin n'existe. Créez le premier compte.
            </p>
          )}
          <form onSubmit={isBootstrap ? handleBootstrap : handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Identifiant</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nom.prenom ou email@exemple.com"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Mot de passe</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground">
              {isBootstrap ? "Créer le compte admin" : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 gap-4">
        <p className="text-foreground">Ce compte n'a pas les droits administrateur.</p>
        <Button variant="ghost" onClick={handleLogout} className="gap-2">
          <LogOut size={16} /> Déconnexion
        </Button>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Vérification...</p>
      </div>
    );
  }

  const currentUsername = session.user.email?.replace(`@${EMAIL_DOMAIN}`, "") ?? "";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Goldies Travel" className="h-8 w-8" />
          <span className="font-serif text-lg font-bold text-foreground">
            Goldies <span className="text-primary">Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">{currentUsername}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut size={16} />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="trips">
          <TabsList className="mb-8">
            <TabsTrigger value="trips">Voyages</TabsTrigger>
            <TabsTrigger value="gallery">Galerie</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="trips"><AdminTrips /></TabsContent>
          <TabsContent value="gallery"><AdminGallery /></TabsContent>
          <TabsContent value="admins"><AdminUsers /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
