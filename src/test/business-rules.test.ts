import { describe, it, expect } from "vitest";
import {
  detectMedicalAlert,
  calculateSpotsLeft,
  isTripSoldOut,
  calculateBalanceDueDate,
  canHardDeleteTrip,
  evaluateInsuranceCompliance,
  calculateDepositAmount,
  calculateRemainingBalance,
} from "@/lib/business-rules";

describe("Business Rules Engine - Given / When / Then", () => {
  describe("Règle 1: Verrouillage Anti-Suppression des Voyages (Soft-Delete)", () => {
    it("Given a trip with 0 bookings, When evaluated for hard deletion, Then it is allowed", () => {
      const result = canHardDeleteTrip(0);
      expect(result.allowed).toBe(true);
    });

    it("Given a trip with 3 active bookings, When evaluated for hard deletion, Then it is strictly forbidden", () => {
      const result = canHardDeleteTrip(3);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("3 inscription(s)");
    });
  });

  describe("Règle 2: Gestion des Capacités et Détection Complet", () => {
    it("Given a capacity of 12 and 8 bookings, When calculating spots left, Then 4 spots remain", () => {
      expect(calculateSpotsLeft(12, 8)).toBe(4);
      expect(isTripSoldOut(12, 8)).toBe(false);
    });

    it("Given a capacity of 10 and 10 bookings, When calculating spots left, Then 0 spots remain and isTripSoldOut is true", () => {
      expect(calculateSpotsLeft(10, 10)).toBe(0);
      expect(isTripSoldOut(10, 10)).toBe(true);
    });

    it("Given an edge case where bookings exceed capacity, When calculating spots left, Then it clamps safely to 0", () => {
      expect(calculateSpotsLeft(10, 12)).toBe(0);
      expect(isTripSoldOut(10, 12)).toBe(true);
    });
  });

  describe("Règle 5: Échéancier de Paiement du Solde (J-45)", () => {
    it("Given a departure date of 2026-10-15, When calculating balance due date, Then it returns exactly 45 days before (2026-08-31)", () => {
      const departure = "2026-10-15T00:00:00Z";
      const dueDate = calculateBalanceDueDate(departure, 45);
      expect(dueDate).not.toBeNull();
      expect(dueDate?.toISOString().slice(0, 10)).toBe("2026-08-31");
    });
  });

  describe("Règle 6: Calcul de l'Acompte et du Solde Restant", () => {
    it("Given a total price of 1500 and no configured deposit, When calculating deposit, Then it defaults to 30% (450 €)", () => {
      const deposit = calculateDepositAmount(1500, null);
      expect(deposit).toBe(450);
      const remaining = calculateRemainingBalance(1500, deposit);
      expect(remaining).toBe(1050);
    });

    it("Given a total price of 1500 and a custom configured deposit of 500 €, When calculating deposit, Then it returns 500 €", () => {
      const deposit = calculateDepositAmount(1500, 500);
      expect(deposit).toBe(500);
      const remaining = calculateRemainingBalance(1500, deposit);
      expect(remaining).toBe(1000);
    });

    it("Given zero or invalid prices, When calculating deposit and balance, Then it handles edge cases gracefully", () => {
      expect(calculateDepositAmount(0, null)).toBe(0);
      expect(calculateDepositAmount(null, null)).toBe(0);
      expect(calculateRemainingBalance(0, 0)).toBe(0);
    });
  });

  describe("Règle 7: Détection Automatique des Alertes Médicales", () => {
    it("Given a benign allergy input ('aucune', 'RAS'), When analyzed, Then no medical alert is flagged", () => {
      expect(detectMedicalAlert("Aucune")).toBe(false);
      expect(detectMedicalAlert("ras")).toBe(false);
      expect(detectMedicalAlert("")).toBe(false);
      expect(detectMedicalAlert(null)).toBe(false);
    });

    it("Given a high-risk medical condition (arachide, asthme, diabète), When analyzed, Then it flags a medical alert", () => {
      expect(detectMedicalAlert("Allergie sévère aux arachides")).toBe(true);
      expect(detectMedicalAlert("Asthmatique avec Ventoline")).toBe(true);
      expect(detectMedicalAlert("Diabète de type 1")).toBe(true);
      expect(detectMedicalAlert("Enceinte de 3 mois")).toBe(true);
    });
  });

  describe("Règle 8: Contrôle de Conformité de l'Assurance", () => {
    it("Given a client declaring 'Oui', When evaluated without manual attestation, Then status is verified", () => {
      expect(evaluateInsuranceCompliance("Oui")).toBe("verified");
    });

    it("Given a client declaring 'Je vais en faire une', When evaluated, Then status is pending_attestation", () => {
      expect(evaluateInsuranceCompliance("Je vais en faire une")).toBe("pending_attestation");
    });

    it("Given a client with pending attestation who uploads/submits proof, When isAttestationProvided is true, Then status becomes verified", () => {
      expect(evaluateInsuranceCompliance("Je vais en faire une", true)).toBe("verified");
    });
  });
});
