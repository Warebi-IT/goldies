import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { Copy, Check, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

const MfaSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(true);
  const [error, setError] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [copied, setCopied] = useState(false);

  const enrollingRef = useRef(false);

  const initEnroll = useCallback(async (forceRefresh = false) => {
    if (enrollingRef.current && !forceRefresh) return;
    enrollingRef.current = true;
    setEnrolling(true);
    setEnrollError("");
    setError("");
    setCode("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/gestion-goldies", { replace: true });
        return;
      }

      // 1. Lister tous les facteurs existants (dans factors.all pour attraper les unverified)
      const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) {
        console.warn("Error listing factors:", listError);
      }

      // Si un facteur vérifié existe déjà, rediriger vers la vérification
      const hasVerified = factors?.all?.some((f) => f.status === "verified");
      if (hasVerified && !forceRefresh) {
        navigate("/mfa-verify", { replace: true });
        return;
      }

      // 2. Nettoyer TOUS les facteurs non vérifiés précédents pour éviter les conflits (422)
      const unverifiedFactors = factors?.all?.filter((f) => f.status === "unverified") || [];
      for (const factor of unverifiedFactors) {
        try {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        } catch (unenrollErr) {
          console.warn("Could not unenroll factor:", factor.id, unenrollErr);
        }
      }

      // Si forceRefresh, on nettoie aussi tout facteur résiduel
      if (forceRefresh && factors?.all) {
        for (const factor of factors.all) {
          try {
            await supabase.auth.mfa.unenroll({ factorId: factor.id });
          } catch (e) {
            console.warn("Unenroll error on force refresh:", e);
          }
        }
      }

      // 3. Enrôler un nouveau facteur TOTP avec nom unique pour éviter mfa_factor_name_conflict
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendly_name: `Goldies Admin ${Date.now()}`,
      });

      if (error || !data) {
        console.error("MFA enroll error:", error);
        setEnrollError(error?.message ?? "Impossible d'initialiser le 2FA. Veuillez réessayer.");
        return;
      }

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
    } catch (err: any) {
      console.error("Unexpected error in MFA setup:", err);
      setEnrollError("Une erreur inattendue est survenue lors de l'initialisation du 2FA.");
    } finally {
      setEnrolling(false);
      enrollingRef.current = false;
    }
  }, [navigate]);

  useEffect(() => {
    initEnroll();
  }, [initEnroll]);

  const handleCopySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      toast({ title: "Copié !", description: "Code secret copié dans le presse-papier" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de copier automatiquement", variant: "destructive" });
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6 || !factorId) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
      if (error) throw error;
      toast({ title: "2FA activé avec succès", description: "Votre espace d'administration est maintenant sécurisé." });
      navigate("/gestion-goldies", { replace: true });
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(
        err?.message?.includes("Invalid") || err?.message?.includes("code")
          ? "Code incorrect. Assurez-vous d'utiliser le compte le plus récent dans votre application et que l'heure de votre appareil est automatique."
          : "Code invalide. Veuillez réessayer."
      );
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  if (enrolling) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Génération de votre clé 2FA sécurisée...</p>
      </div>
    );
  }

  if (enrollError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-lg p-8 text-center space-y-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 text-destructive mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Échec de configuration 2FA</h2>
            <p className="text-sm text-muted-foreground">{enrollError}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => initEnroll(true)} className="w-full bg-primary text-primary-foreground">
              <RefreshCw className="w-4 h-4 mr-2" /> Réinitialiser et générer un nouveau QR code
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/gestion-goldies", { replace: true });
              }}
              className="w-full"
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <img src={logo} alt="Goldies Travel" className="h-10 w-10" />
          <span className="font-serif text-xl font-bold text-foreground">Activer le 2FA</span>
        </div>

        {message && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-primary">{message}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground text-center">
              Scannez ce QR code avec <strong>Microsoft Authenticator</strong>, <strong>Google Authenticator</strong> ou votre gestionnaire de clés :
            </p>
            <div className="border border-border/50 rounded-2xl p-3 bg-white shadow-sm">
              {qrCode ? (
                <img src={qrCode} alt="QR Code 2FA" className="w-48 h-48 block" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-muted-foreground">
                  QR Code indisponible
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted/70 rounded-xl p-4 space-y-2 border border-border/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Code secret (saisie manuelle)
              </p>
              <button
                type="button"
                onClick={handleCopySecret}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copié" : "Copier"}
              </button>
            </div>
            <p className="font-mono text-sm break-all select-all text-foreground bg-white/70 px-2.5 py-1.5 rounded border border-border/20 font-bold tracking-wider">
              {secret}
            </p>
            <p className="text-[11px] text-muted-foreground">
              💡 Si le scan du QR code échoue, ajoutez un compte manuellement dans votre application avec ce code secret.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-center text-foreground">
              Entrez le code à 6 chiffres généré par l'application :
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={setCode} autoFocus>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
                <p className="text-xs text-destructive font-medium">{error}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/gestion-goldies", { replace: true });
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleVerify}
              disabled={code.length !== 6 || loading}
              className="flex-1 bg-primary text-primary-foreground font-semibold"
            >
              {loading ? "Vérification..." : "Confirmer le code"}
            </Button>
          </div>

          <div className="text-center pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={() => initEnroll(true)}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Générer un tout nouveau QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaSetup;
