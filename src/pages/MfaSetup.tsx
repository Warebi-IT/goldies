import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

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

  useEffect(() => {
    const enroll = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/gestion-goldies");
        return;
      }

      // Nettoyer les facteurs non vérifiés précédents pour éviter les doublons dus au double-render de React 18
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const unverifiedFactors = factors?.totp?.filter(f => f.status === "unverified") || [];
      for (const factor of unverifiedFactors) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
      if (error || !data) {
        toast({
          title: "Erreur",
          description: error?.message ?? "Impossible d'initialiser le 2FA",
          variant: "destructive",
        });
        navigate("/gestion-goldies");
        return;
      }

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
      setEnrolling(false);
    };
    enroll();
  }, [navigate]);

  const handleVerify = async () => {
    if (code.length !== 6 || !factorId) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
      if (error) throw error;
      toast({ title: "2FA activé", description: "Google Authenticator configuré avec succès" });
      navigate("/gestion-goldies");
    } catch {
      setError("Code invalide, réessayez");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  if (enrolling) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Initialisation du 2FA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <img src={logo} alt="Goldies Travel" className="h-10 w-10" />
          <span className="font-serif text-xl font-bold text-foreground">Activer le 2FA</span>
        </div>

        {message && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-primary">{message}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground text-center">
              Scannez ce QR code avec Google Authenticator
            </p>
            <div className="border rounded-xl p-3 bg-white">
              <img src={qrCode} alt="QR Code 2FA" className="w-44 h-44" />
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Code secret (saisie manuelle)
            </p>
            <p className="font-mono text-sm break-all select-all text-foreground">{secret}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-center text-foreground">
              Entrez le code à 6 chiffres pour confirmer
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
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
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/gestion-goldies")} className="flex-1">
              Annuler
            </Button>
            <Button
              onClick={handleVerify}
              disabled={code.length !== 6 || loading}
              className="flex-1 bg-primary text-primary-foreground"
            >
              {loading ? "Vérification..." : "Activer le 2FA"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaSetup;
