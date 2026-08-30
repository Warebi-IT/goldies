import { describe, it, expect } from "vitest";
import { formatUserErrorMessage } from "@/lib/error-handler";

describe("Centralized Error Handler - Diagnostic & Actionable French Messages", () => {
  it("Traduit l'erreur de colonne manquante deposit_amount avec l'instruction SQL exacte", () => {
    const error = {
      message: "Could not find the 'deposit_amount' column of 'trips' in the schema cache",
      code: "PGRST204",
    };

    const formatted = formatUserErrorMessage(error);
    expect(formatted.title).toBe("Colonne de base de données non configurée");
    expect(formatted.description).toContain("deposit_amount");
    expect(formatted.action).toContain("ALTER TABLE trips ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC;");
  });

  it("Traduit une erreur de permission RLS / 42501", () => {
    const error = {
      message: "new row violates row-level security policy for table 'trips'",
      code: "42501",
    };

    const formatted = formatUserErrorMessage(error);
    expect(formatted.title).toBe("Autorisation requise");
    expect(formatted.action).toContain("user_roles");
  });

  it("Traduit une session expirée", () => {
    const error = {
      message: "JWT expired",
    };

    const formatted = formatUserErrorMessage(error);
    expect(formatted.title).toBe("Session administrateur expirée");
    expect(formatted.action).toContain("reconnecter");
  });

  it("Traduit un doublon / contrainte unique (ex: slug ou email)", () => {
    const error = {
      message: "duplicate key value violates unique constraint 'trips_slug_key'",
      code: "23505",
    };

    const formatted = formatUserErrorMessage(error);
    expect(formatted.title).toBe("Élément déjà existant");
    expect(formatted.description).toContain("slug");
  });

  it("Traduit une erreur réseau", () => {
    const error = new Error("Failed to fetch");

    const formatted = formatUserErrorMessage(error);
    expect(formatted.title).toBe("Connexion réseau interrompue");
    expect(formatted.action).toContain("connexion Internet");
  });
});
