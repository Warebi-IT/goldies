import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const SetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // onAuthStateChange fires when the client processes the invitation hash fragment
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
      setLoading(false);
    });

    // Fallback: session may already be stored if the hash was processed before mount
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
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
            <p className="text-sm text-destructive">Lien invalide ou expiré.</p>
            <a href="/gestion-goldies" className="text-sm text-primary underline">
              Retour à l'administration
            </a>
          </div>
        ) : success ? (
          <p className="text-sm text-center text-foreground">
            Mot de passe défini. Redirection vers l'administration...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Nouveau mot de passe
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={10}
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
                autoComplete="new-password"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary text-primary-foreground"
            >
              {submitting ? "Enregistrement..." : "Définir mon mot de passe"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetPassword;
