import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface ConfirmationMFAProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ConfirmationMFA = ({ open, onOpenChange, onSuccess }: ConfirmationMFAProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setCode("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.find(f => f.status === "verified");
      if (!totp) throw new Error("Aucun facteur 2FA configuré");

      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: totp.id,
        code,
      });
      if (error) throw error;

      onSuccess();
    } catch {
      setError("Code invalide, réessayez");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmation de sécurité</DialogTitle>
          <DialogDescription>
            Entrez votre code Google Authenticator pour confirmer cette action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
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

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={code.length !== 6 || loading}
              className="flex-1 bg-primary text-primary-foreground"
            >
              {loading ? "Vérification..." : "Confirmer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationMFA;
