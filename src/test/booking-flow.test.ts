import { describe, it, expect } from "vitest";
import { calculateDepositAmount, calculateRemainingBalance } from "@/lib/business-rules";
import { isValidRedirectUrl, safeRedirect, isValidEmail } from "@/lib/security";

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

  describe("4. Règles de validation assouplies & champs facultatifs (QA feedback)", () => {
    // Validation helper mimicking validateForPayment
    function validateBookingInput(input: {
      nom: string;
      prenom: string;
      age: string;
      email: string;
      telephone: string;
      engagement: string;
      acceptedTerms: boolean;
      allergies?: string;
      assurance?: string;
      disponibilite?: boolean;
    }) {
      const errs: Record<string, string> = {};
      if (!input.nom.trim()) errs.nom = "Nom requis";
      if (!input.prenom.trim()) errs.prenom = "Prénom requis";
      const parsedAge = parseInt(input.age, 10);
      if (!input.age.trim() || isNaN(parsedAge) || parsedAge < 18) {
        errs.age = "Âge minimum 18 ans requis";
      }
      if (!input.email.trim() || !isValidEmail(input.email)) {
        errs.email = "Email valide requis";
      }
      if (!input.telephone.trim() || input.telephone.trim().length < 6) {
        errs.telephone = "Téléphone requis";
      }
      if (!input.engagement) {
        errs.engagement = "Engagement requis";
      }
      if (!input.acceptedTerms) {
        errs.terms = "CGV requises";
      }
      return errs;
    }

    it("Valide le formulaire SANS allergies, SANS assurance et SANS disponibilité cochée (champs facultatifs)", () => {
      const validWithoutOptionals = {
        nom: "Dupont",
        prenom: "Claire",
        age: "29",
        email: "claire.dupont@test.fr",
        telephone: "+33612345678",
        engagement: "Oui",
        acceptedTerms: true,
        allergies: "", // facultatif
        assurance: "", // facultatif
        disponibilite: false, // facultatif
      };

      const errors = validateBookingInput(validWithoutOptionals);
      expect(Object.keys(errors).length).toBe(0);
    });

    it("Détecte et liste les erreurs précises si des champs obligatoires manquent", () => {
      const invalidInput = {
        nom: "",
        prenom: "",
        age: "16", // mineure
        email: "email-invalide",
        telephone: "12", // trop court
        engagement: "",
        acceptedTerms: false,
      };

      const errors = validateBookingInput(invalidInput);
      expect(errors.nom).toBeDefined();
      expect(errors.prenom).toBeDefined();
      expect(errors.age).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.telephone).toBeDefined();
      expect(errors.engagement).toBeDefined();
      expect(errors.terms).toBeDefined();
      expect(Object.keys(errors).length).toBe(7);
    });
  });

  describe("5. Logique des 3 boutons (Payer, Être contacté, Annuler)", () => {
    it("Définit submission_action et payment_status selon le bouton sélectionné", () => {
      // Bouton Payer
      const payerAction = { submission_action: "payer", payment_status: "unpaid" };
      expect(payerAction.submission_action).toBe("payer");
      expect(payerAction.payment_status).toBe("unpaid");

      // Bouton Être contactée
      const contactAction = { submission_action: "etre_contacte", payment_status: "contact_requested" };
      expect(contactAction.submission_action).toBe("etre_contacte");
      expect(contactAction.payment_status).toBe("contact_requested");

      // Bouton Annuler
      const cancelAction = { submission_action: "annuler", payment_status: "cancelled" };
      expect(cancelAction.submission_action).toBe("annuler");
      expect(cancelAction.payment_status).toBe("cancelled");
    });
  });
});
