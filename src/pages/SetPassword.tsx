import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { parseAuthTokensFromUrl } from "@/lib/security";
import { AlertCircle, CheckCircle2, Lock, ArrowLeft } from "lucide-react";

const SetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [expiredReason, setExpiredReason] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const setupSession = async () => {
      // 1. Extraction défensive des jetons ou de l'erreur dans l'URL (hash ou search)
      const tokens = parseAuthTokensFromUrl(window.location.hash, window.location.search);

      // Si Supabase a renvoyé une erreur explicite dans l'URL (ex: otp_expired)
      if (tokens.errorCode || tokens.errorDescription) {
        if (isMounted) {
          if (tokens.errorCode === "otp_expired") {
            setExpiredReason(
              "Le lien de récupération a expiré ou a déjà été utilisé. Par mesure de sécurité, chaque lien est à usage unique."
            );
          } else {
            setExpiredReason(tokens.errorDescription || "Ce lien est invalide ou a expiré.");
          }
          setHasSession(false);
          setLoading(false);
        }
        return;
      }

      // 2. Si le hash contient access_token et refresh_token, initialiser la session immédiatement
      if (tokens.accessToken && tokens.refreshToken) {
        try {
          const { data, error: sessionErr } = await supabase.auth.setSession({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
          });
          if (data?.session && isMounted) {
            setHasSession(true);
            setLoading(false);
            return;
          }
          if (sessionErr) {
            console.warn("[Auth] Erreur lors de setSession:", sessionErr.message);
          }
        } catch (err) {
          console.warn("[Auth] Exception setSession:", err);
        }
      }

      // 3. Si l'URL contient un code PKCE
      if (tokens.code) {
        try {
          const { data, error: codeErr } = await supabase.auth.exchangeCodeForSession(tokens.code);
          if (data?.session && isMounted) {
            setHasSession(true);
            setLoading(false);
            return;
          }
          if (codeErr) {
            console.warn("[Auth] Erreur exchangeCode:", codeErr.message);
          }
        } catch (err) {
          console.warn("[Auth] Exception exchangeCode:", err);
        }
      }

      // 4. Session déjà existante en cache local
      const { data } = await supabase.auth.getSession();
      if (data?.session && isMounted) {
        setHasSession(true);
        setLoading(false);
        return;
      }

      // 5. Attente courte pour laisser onAuthStateChange se déclencher avant de conclure
      const timer = setTimeout(() => {
        if (isMounted) {
          setLoading(false);
        }
      }, 1200);

      return () => clearTimeout(timer);
    };

    // Écouteur réactif des changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && isMounted) {
        setHasSession(true);
        setLoading(false);
      }
    });

    setupSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate("/gestion-goldies"), 2000);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 10) {
      setError("Le mot de passe doit contenir au moins 10 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Vérification du lien sécurisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <img src={logo} alt="Goldies Travel" className="h-10 w-10" />
          <span className="font-serif text-xl font-bold text-foreground">Admin</span>
        </div>

        {!hasSession ? (
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-1">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Lien invalide ou expiré</h2>
            <p className="text-xs text-muted-foreground leading-relaxed px-2">
              {expiredReason ||
                "Ce lien de récupération de mot de passe est invalide ou a déjà été utilisé. Pour des raisons de sécurité, chaque lien est à usage unique."}
            </p>
            <div className="pt-2 space-y-2">
              <Button
                onClick={() => navigate("/gestion-goldies")}
                className="w-full rounded-full bg-primary text-primary-foreground text-xs font-medium"
              >
                Demander un nouveau lien
              </Button>
              <div>
                <a
                  href="/gestion-goldies"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Retour à l'administration
                </a>
              </div>
            </div>
          </div>
        ) : success ? (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Mot de passe enregistré !</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Votre nouveau mot de passe a été défini avec succès. Redirection vers l'administration...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Définir un nouveau mot de passe</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Choisissez un mot de passe d'au moins 10 caractères.
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Nouveau mot de passe
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={10}
                placeholder="Au moins 10 caractères"
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Confirmer le mot de passe
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={10}
                placeholder="Répétez le mot de passe"
                autoComplete="new-password"
                required
              />
            </div>
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-destructive text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary text-primary-foreground font-medium"
            >
              {submitting ? "Enregistrement..." : "Enregistrer mon nouveau mot de passe"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetPassword;
