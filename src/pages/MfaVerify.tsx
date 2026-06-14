import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import logo from "@/assets/logo.png";

const MfaVerify = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/gestion-goldies");
        return;
      }

      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.find(f => f.status === "verified");

      if (!totp) {
        navigate("/mfa-setup", {
          state: {
            message:
              "Vous devez activer Google Authenticator pour accéder au back-office",
          },
        });
        return;
      }

      setFactorId(totp.id);
      setChecking(false);
    };
    init();
  }, [navigate]);

  const handleVerify = async () => {
    if (!factorId || code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
      if (error) throw error;
      navigate("/gestion-goldies");
    } catch {
      setError("Code invalide, réessayez");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Vérification...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <img src={logo} alt="Goldies Travel" className="h-10 w-10" />
          <span className="font-serif text-xl font-bold text-foreground">Vérification 2FA</span>
        </div>

        <div className="space-y-5">
          <p className="text-sm text-muted-foreground text-center">
            Entrez le code à 6 chiffres de votre application Google Authenticator
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

          <Button
            onClick={handleVerify}
            disabled={code.length !== 6 || loading}
            className="w-full bg-primary text-primary-foreground"
          >
            {loading ? "Vérification..." : "Confirmer"}
          </Button>

          <Button
            variant="ghost"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/gestion-goldies");
            }}
            className="w-full text-muted-foreground"
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MfaVerify;
