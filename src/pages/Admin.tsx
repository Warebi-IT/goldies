import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminTrips from "@/components/admin/AdminTrips";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminBookings from "@/components/admin/AdminBookings";
import logo from "@/assets/logo.png";
import { LogOut, Shield } from "lucide-react";

const EMAIL_DOMAIN = "goldies.local";

interface LoginFormProps {
  isBootstrap: boolean;
  onLogin: (username: string, password: string) => Promise<string | null>;
  onBootstrap: (username: string, password: string) => Promise<string | null>;
}

const LoginForm = ({ isBootstrap, onLogin, onBootstrap }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const fn = isBootstrap ? onBootstrap : onLogin;
    const error = await fn(username, password);
    if (error) setAuthError(error);
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
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
};

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
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
      const admin = !!data;
      setIsAdmin(admin);

      if (admin) {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal?.nextLevel === "aal2" && aal?.currentLevel !== "aal2") {
          navigate("/mfa-verify");
        }
      }
    };
    check();
  }, [session, navigate]);

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

  const handleLogin = async (username: string, password: string): Promise<string | null> => {
    const clean = username.trim().toLowerCase();
    const email = clean.includes("@") ? clean : `${clean}@${EMAIL_DOMAIN}`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return "Identifiants invalides";

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.nextLevel === "aal2") {
      navigate("/mfa-verify");
    } else {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const hasVerifiedFactor = factors?.totp?.some(f => f.status === "verified");
      if (!hasVerifiedFactor) {
        navigate("/mfa-setup", {
          state: {
            message:
              "Vous devez activer Google Authenticator pour accéder au back-office",
          },
        });
      }
    }
    return null;
  };

  const handleBootstrap = async (username: string, password: string): Promise<string | null> => {
    const clean = username.trim().toLowerCase();
    const { data, error } = await supabase.functions.invoke("admin-users?action=create", {
      method: "POST",
      body: { username: clean, password },
    });
    if (error || data?.error) return data?.error ?? error?.message ?? "Erreur";
    const email = `${clean}@${EMAIL_DOMAIN}`;
    await supabase.auth.signInWithPassword({ email, password });
    setNeedsBootstrap(false);
    navigate("/mfa-setup", {
      state: { message: "Bienvenue ! Activez Google Authenticator pour sécuriser votre compte." },
    });
    return null;
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
    return (
      <LoginForm
        isBootstrap={needsBootstrap}
        onLogin={handleLogin}
        onBootstrap={handleBootstrap}
      />
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/mfa-setup")}
            className="gap-2"
            title="Configurer le 2FA"
          >
            <Shield size={16} />
            <span className="hidden sm:inline">2FA</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut size={16} />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="flex flex-wrap gap-1 border-b-0 bg-transparent p-0 justify-start w-full relative z-10 rounded-none mb-0">
            <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
            <TabsTrigger value="bookings">Inscriptions & Contacts</TabsTrigger>
            <TabsTrigger value="trips">Voyages</TabsTrigger>
            <TabsTrigger value="gallery">Galerie</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <div className="bg-cream-card rounded-b-[24px] rounded-tr-[24px] border border-border shadow-sm relative z-0 mt-[-1px] p-6 sm:p-8">
            <TabsContent value="dashboard" className="mt-0 focus-visible:outline-none">
              <AdminDashboard />
            </TabsContent>
            <TabsContent value="bookings" className="mt-0 focus-visible:outline-none">
              <AdminBookings />
            </TabsContent>
            <TabsContent value="trips" className="mt-0 focus-visible:outline-none">
              <AdminTrips />
            </TabsContent>
            <TabsContent value="gallery" className="mt-0 focus-visible:outline-none">
              <AdminGallery />
            </TabsContent>
            <TabsContent value="admins" className="mt-0 focus-visible:outline-none">
              <AdminUsers />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
