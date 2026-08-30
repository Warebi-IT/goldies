import { describe, it, expect } from "vitest";
import {
  isValidRedirectUrl,
  isValidEmail,
  sanitizeTextInput,
  evaluateMfaState,
} from "@/lib/security";

describe("Security Utilities - Given / When / Then", () => {
  describe("isValidRedirectUrl", () => {
    it("Given a valid HTTPS payment link, When validated, Then it returns true", () => {
      expect(isValidRedirectUrl("https://buy.stripe.com/test12345")).toBe(true);
      expect(isValidRedirectUrl("https://goldies.local/payment")).toBe(true);
    });

    it("Given a javascript: or data: URI, When validated, Then it returns false (XSS mitigation)", () => {
      expect(isValidRedirectUrl("javascript:alert(document.cookie)")).toBe(false);
      expect(isValidRedirectUrl("javascript:/*--></title></style></textarea>*/<svg/onload=alert(1)>")).toBe(false);
      expect(isValidRedirectUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
      expect(isValidRedirectUrl("vbscript:msgbox(1)")).toBe(false);
      expect(isValidRedirectUrl("file:///etc/passwd")).toBe(false);
    });

    it("Given null, empty or invalid strings, When validated, Then it returns false", () => {
      expect(isValidRedirectUrl("")).toBe(false);
      expect(isValidRedirectUrl("   ")).toBe(false);
      expect(isValidRedirectUrl(null)).toBe(false);
      expect(isValidRedirectUrl(undefined)).toBe(false);
      expect(isValidRedirectUrl("not a url")).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    it("Given a standard valid email, When checked, Then it returns true", () => {
      expect(isValidEmail("client@example.com")).toBe(true);
      expect(isValidEmail("admin.user@goldies.local")).toBe(true);
    });

    it("Given an invalid or dangerous email string, When checked, Then it returns false", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe("sanitizeTextInput", () => {
    it("Given a long string with surrounding whitespace, When sanitized, Then it trims and truncates to maxLength", () => {
      const longInput = "   " + "A".repeat(1500) + "   ";
      const sanitized = sanitizeTextInput(longInput, 500);
      expect(sanitized.length).toBe(500);
      expect(sanitized).toBe("A".repeat(500));
    });
  });

  describe("evaluateMfaState", () => {
    it("Given a user with no verified factors, When evaluated, Then returns 'needs_setup'", () => {
      const factors = { totp: [] };
      const aal = { currentLevel: "aal1", nextLevel: "aal1" };
      expect(evaluateMfaState(factors, aal)).toBe("needs_setup");
    });

    it("Given a user with a verified factor but only aal1 session, When evaluated, Then returns 'needs_verify'", () => {
      const factors = { totp: [{ status: "verified" }] };
      const aal = { currentLevel: "aal1", nextLevel: "aal2" };
      expect(evaluateMfaState(factors, aal)).toBe("needs_verify");
    });

    it("Given a user with verified factor and active aal2 session, When evaluated, Then returns 'verified'", () => {
      const factors = { totp: [{ status: "verified" }] };
      const aal = { currentLevel: "aal2", nextLevel: "aal2" };
      expect(evaluateMfaState(factors, aal)).toBe("verified");
    });
  });
});
