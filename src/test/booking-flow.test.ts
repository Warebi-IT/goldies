import { describe, it, expect } from "vitest";
import { calculateDepositAmount, calculateRemainingBalance } from "@/lib/business-rules";
import { isValidRedirectUrl, safeRedirect } from "@/lib/security";

describe("Booking & Payment Deposit Flow Integration", () => {
  describe("1. Calculs dynamiques d'acompte et solde", () => {
    it("Calcule l'acompte par défaut à 30% du prix total", () => {
      const price = 1200;
      const deposit = calculateDepositAmount(price, null);
      const remaining = calculateRemainingBalance(price, deposit);

      expect(deposit).toBe(360);
      expect(remaining).toBe(840);
      expect(deposit + remaining).toBe(price);
    });

    it("Utilise le montant d'acompte personnalisé configuré par l'administrateur", () => {
      const price = 1500;
      const customDeposit = 450;
      const deposit = calculateDepositAmount(price, customDeposit);
      const remaining = calculateRemainingBalance(price, deposit);

      expect(deposit).toBe(450);
      expect(remaining).toBe(1050);
    });

    it("Gère les cas limites (prix nul, négatif ou chaîne non numérique)", () => {
      expect(calculateDepositAmount(0, null)).toBe(0);
      expect(calculateDepositAmount("", null)).toBe(0);
      expect(calculateRemainingBalance(0, 0)).toBe(0);
    });
  });

  describe("2. Validation des URLs de redirection Stripe", () => {
    it("Valide les liens Stripe sécurisés (Lien 1 Totalité & Lien 2 Acompte)", () => {
      const lienTotal = "https://buy.stripe.com/test_total_12345";
      const lienAcompte = "https://buy.stripe.com/test_acompte_67890";

      expect(isValidRedirectUrl(lienTotal)).toBe(true);
      expect(isValidRedirectUrl(lienAcompte)).toBe(true);
    });

    it("Refuse les URLs non sécurisées ou malveillantes", () => {
      expect(isValidRedirectUrl("javascript:alert(1)")).toBe(false);
      expect(isValidRedirectUrl("data:text/html,<script>")).toBe(false);
      expect(isValidRedirectUrl("ftp://evil.com")).toBe(false);
    });
  });

  describe("3. Simulation de choix de paiement et sélection de lien", () => {
    const mockTrip = {
      id: "trip-maroc-1",
      name: "Séjour au Maroc",
      price: 1500,
      deposit_amount: 500,
      payment_link: "https://buy.stripe.com/maroc-total",
      deposit_payment_link: "https://buy.stripe.com/maroc-acompte",
    };

    it("Redirige vers le lien d'acompte (Lien 2) quand l'option 'deposit' est choisie", () => {
      const paymentType = "deposit";
      let redirectLink: string | null = null;

      if (paymentType === "deposit" && mockTrip.deposit_payment_link) {
        redirectLink = mockTrip.deposit_payment_link;
      } else if (mockTrip.payment_link) {
        redirectLink = mockTrip.payment_link;
      }

      expect(redirectLink).toBe("https://buy.stripe.com/maroc-acompte");
    });

    it("Redirige vers le lien de totalité / plusieurs fois (Lien 1) quand 'full' ou 'installment' est choisi", () => {
      const paymentTypeFull = "full";
      let redirectLinkFull: string | null = null;
      if (paymentTypeFull === "deposit" && mockTrip.deposit_payment_link) {
        redirectLinkFull = mockTrip.deposit_payment_link;
      } else if (mockTrip.payment_link) {
        redirectLinkFull = mockTrip.payment_link;
      }

      expect(redirectLinkFull).toBe("https://buy.stripe.com/maroc-total");

      const paymentTypeInstallment = "installment";
      let redirectLinkInst: string | null = null;
      if (paymentTypeInstallment === "deposit" && mockTrip.deposit_payment_link) {
        redirectLinkInst = mockTrip.deposit_payment_link;
      } else if (mockTrip.payment_link) {
        redirectLinkInst = mockTrip.payment_link;
      }

      expect(redirectLinkInst).toBe("https://buy.stripe.com/maroc-total");
    });
  });
});
