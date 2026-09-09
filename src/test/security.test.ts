import { describe, it, expect } from "vitest";
import {
  isValidRedirectUrl,
  isValidEmail,
  sanitizeTextInput,
  evaluateMfaState,
  normalizeAuthIdentifier,
  isValidAuthIdentifier,
  formatPasswordRecoveryRedirect,
  parseAuthTokensFromUrl,
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

  describe("Password Recovery & Identifier Normalization - Given / When / Then", () => {
    it("Given a raw email, When normalized, Then it trims and converts to lowercase", () => {
      expect(normalizeAuthIdentifier("  User.Admin@Domain.COM ")).toBe("user.admin@domain.com");
    });

    it("Given a bare username without domain, When normalized, Then it appends default domain", () => {
      expect(normalizeAuthIdentifier("yancouba")).toBe("yancouba@goldies.local");
      expect(normalizeAuthIdentifier("admin.master", "custom.domain")).toBe("admin.master@custom.domain");
    });

    it("Given empty or blank input, When normalized, Then it returns empty string", () => {
      expect(normalizeAuthIdentifier("")).toBe("");
      expect(normalizeAuthIdentifier("   ")).toBe("");
    });

    it("Given a valid email or valid username, When checked with isValidAuthIdentifier, Then returns true", () => {
      expect(isValidAuthIdentifier("admin@goldies-travel.com")).toBe(true);
      expect(isValidAuthIdentifier("yancouba.diatta")).toBe(true);
      expect(isValidAuthIdentifier("admin_2026")).toBe(true);
    });

    it("Given an invalid identifier with illegal characters or script tags, When checked, Then returns false", () => {
      expect(isValidAuthIdentifier("admin<script>")).toBe(false);
      expect(isValidAuthIdentifier("user;drop table")).toBe(false);
      expect(isValidAuthIdentifier("")).toBe(false);
      expect(isValidAuthIdentifier("   ")).toBe(false);
    });

    it("Given an origin URL, When formatting recovery redirect, Then it returns clean /set-password target", () => {
      expect(formatPasswordRecoveryRedirect("https://goldies-travel.com")).toBe("https://goldies-travel.com/set-password");
      expect(formatPasswordRecoveryRedirect("https://goldies-travel.com/")).toBe("https://goldies-travel.com/set-password");
      expect(formatPasswordRecoveryRedirect("http://localhost:8080")).toBe("http://localhost:8080/set-password");
    });
  });

  describe("Recovery URL Token Parsing (parseAuthTokensFromUrl) - Given / When / Then", () => {
    it("Given a recovery hash with access_token and refresh_token, When parsed, Then extracts tokens correctly", () => {
      const hash = "#access_token=token123&refresh_token=refresh456&type=recovery";
      const result = parseAuthTokensFromUrl(hash, "");
      expect(result.accessToken).toBe("token123");
      expect(result.refreshToken).toBe("refresh456");
      expect(result.type).toBe("recovery");
      expect(result.errorCode).toBeNull();
    });

    it("Given an expired recovery hash with error_code=otp_expired, When parsed, Then captures error details", () => {
      const hash = "#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired";
      const result = parseAuthTokensFromUrl(hash, "");
      expect(result.accessToken).toBeNull();
      expect(result.errorCode).toBe("otp_expired");
      expect(result.errorDescription).toBe("Email link is invalid or has expired");
    });

    it("Given a PKCE search query with code parameter, When parsed, Then extracts code", () => {
      const search = "?code=pkce-auth-code-789";
      const result = parseAuthTokensFromUrl("", search);
      expect(result.code).toBe("pkce-auth-code-789");
    });

    it("Given empty hash and search strings, When parsed, Then returns null values safely", () => {
      const result = parseAuthTokensFromUrl("", "");
      expect(result.accessToken).toBeNull();
      expect(result.refreshToken).toBeNull();
      expect(result.code).toBeNull();
      expect(result.errorCode).toBeNull();
    });
  });
});


