import { describe, it, expect } from "vitest";
import {
  isProspectExpired,
  isUnpaidBookingExpired,
  isHealthDataRetentionExpired,
  isAccountingPreservationExpired,
  anonymizeBookingRecord,
} from "@/lib/gdpr";

describe("GDPR Data Retention Lifecycle - Given / When / Then", () => {
  const refDate = new Date("2026-08-30T12:00:00Z");

  describe("isProspectExpired", () => {
    it("Given a prospect contact older than 3 years, When evaluated, Then it returns true (purge needed)", () => {
      const oldDate = new Date("2023-08-20T12:00:00Z");
      expect(isProspectExpired(oldDate, refDate)).toBe(true);
    });

    it("Given a recent prospect contact within 3 years, When evaluated, Then it returns false (keep active)", () => {
      const recentDate = new Date("2025-01-15T12:00:00Z");
      expect(isProspectExpired(recentDate, refDate)).toBe(false);
    });
  });

  describe("isUnpaidBookingExpired", () => {
    it("Given an unpaid booking older than 90 days, When evaluated, Then it returns true (purge needed)", () => {
      const oldUnpaid = new Date("2026-05-01T12:00:00Z"); // > 90 days
      expect(isUnpaidBookingExpired(oldUnpaid, refDate)).toBe(true);
    });

    it("Given a recent unpaid booking created 10 days ago, When evaluated, Then it returns false", () => {
      const recentUnpaid = new Date("2026-08-20T12:00:00Z");
      expect(isUnpaidBookingExpired(recentUnpaid, refDate)).toBe(false);
    });
  });

  describe("isHealthDataRetentionExpired", () => {
    it("Given a booking completed over 1 year ago, When evaluated, Then health data should be purged", () => {
      const oldTripDate = new Date("2025-06-01T12:00:00Z");
      expect(isHealthDataRetentionExpired(oldTripDate, refDate)).toBe(true);
    });

    it("Given a recent booking created 2 months ago, When evaluated, Then health data remains active", () => {
      const recentTripDate = new Date("2026-06-30T12:00:00Z");
      expect(isHealthDataRetentionExpired(recentTripDate, refDate)).toBe(false);
    });
  });

  describe("isAccountingPreservationExpired", () => {
    it("Given a paid booking older than 10 years, When evaluated, Then accounting period is expired", () => {
      const ancientBooking = new Date("2015-01-01T12:00:00Z");
      expect(isAccountingPreservationExpired(ancientBooking, refDate)).toBe(true);
    });

    it("Given a paid booking 4 years old, When evaluated, Then it must still be kept for 10-year accounting proof", () => {
      const fourYearOldBooking = new Date("2022-06-01T12:00:00Z");
      expect(isAccountingPreservationExpired(fourYearOldBooking, refDate)).toBe(false);
    });
  });

  describe("anonymizeBookingRecord", () => {
    it("Given a booking beyond legal retention, When anonymized, Then personal identifying details are wiped while retaining aggregate sales structure", () => {
      const originalBooking = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        nom: "Dupont",
        prenom: "Marie",
        email: "marie.dupont@example.com",
        telephone: "+33612345678",
        allergies: "Arachides et gluten",
        autre: "Note personnelle",
        payment_status: "paid",
        trip_id: "trip-senegal-2026",
      };

      const anonymized = anonymizeBookingRecord(originalBooking);

      expect(anonymized.nom).toBe("ANONYMISÉ");
      expect(anonymized.prenom).toBe("CLIENT_ARCHIVÉ");
      expect(anonymized.email).toBe("archive_550e8400@goldies.anonymized");
      expect(anonymized.telephone).toBe("0000000000");
      expect(anonymized.allergies).toBe("[PURGÉ_RGPD]");
      expect(anonymized.autre).toBeNull();
      expect(anonymized.payment_status).toBe("paid");
      expect(anonymized.trip_id).toBe("trip-senegal-2026");
    });
  });
});
