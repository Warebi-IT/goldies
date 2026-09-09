/**
 * Security utilities for Goldies Travel application.
 * Provides defensive input sanitization, safe URL redirect validation, and MFA state evaluation.
 */

/**
 * Validates that a payment or external redirect URL is safe (https:// or http:// only).
 * Prevents javascript:, data:, vbscript:, and malicious schemes.
 */
export function isValidRedirectUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Block dangerous schemes explicitly
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Safely redirects the browser to an external URL only if verified safe.
 * Returns true if redirect was triggered, false otherwise.
 */
export function safeRedirect(url: string | null | undefined, fallbackMessage?: string): boolean {
  if (isValidRedirectUrl(url)) {
    window.location.href = url!.trim();
    return true;
  }
  if (fallbackMessage) {
    alert(fallbackMessage);
  }
  return false;
}

/**
 * Validates email format strictly.
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  // Standard RFC 5322 compatible regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed) && trimmed.length <= 254;
}

/**
 * Sanitizes and truncates user-supplied text inputs to prevent payload bloat and DoS.
 */
export function sanitizeTextInput(input: string | null | undefined, maxLength = 1000): string {
  if (!input || typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

/**
 * Evaluates the MFA state for an administrative session.
 * Enforces Zero-Trust: If not enrolled -> needs_setup; if enrolled but aal1 -> needs_verification.
 */
export type MfaState = "verified" | "needs_setup" | "needs_verify";

export function evaluateMfaState(
  factors: { totp?: Array<{ status: string }> } | null | undefined,
  aal: { currentLevel?: string; nextLevel?: string } | null | undefined
): MfaState {
  const hasVerifiedTotp = !!factors?.totp?.some((f) => f.status === "verified");

  if (!hasVerifiedTotp) {
    return "needs_setup";
  }

  if (aal?.currentLevel === "aal2") {
    return "verified";
  }

  return "needs_verify";
}

/**
 * Normalizes an administrative username or email address.
 * If no '@' is present, appends the provided default domain (e.g. goldies.local).
 */
export function normalizeAuthIdentifier(
  input: string | null | undefined,
  defaultDomain = "goldies.local"
): string {
  if (!input || typeof input !== "string") return "";
  const clean = input.trim().toLowerCase();
  if (!clean) return "";
  return clean.includes("@") ? clean : `${clean}@${defaultDomain}`;
}

/**
 * Validates whether an authentication identifier (email or username) is safe and well-formed.
 * Prevents command/SQL injection patterns and invalid characters.
 */
export function isValidAuthIdentifier(input: string | null | undefined): boolean {
  if (!input || typeof input !== "string") return false;
  const clean = input.trim().toLowerCase();
  if (!clean || clean.length > 254) return false;

  if (clean.includes("@")) {
    return isValidEmail(clean);
  }

  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  return usernameRegex.test(clean);
}

/**
 * Formats a clean password recovery redirect URL targeting /set-password.
 */
export function formatPasswordRecoveryRedirect(origin: string | null | undefined): string {
  if (!origin || typeof origin !== "string") return "/set-password";
  const base = origin.trim().replace(/\/+$/, "");
  return `${base}/set-password`;
}

export interface ParsedAuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
  type: string | null;
  code: string | null;
  errorCode: string | null;
  errorDescription: string | null;
}

/**
 * Safely parses auth tokens or error fragments from URL hash and search query.
 * Handles both Implicit flow (#access_token=...) and PKCE flow (?code=...).
 */
export function parseAuthTokensFromUrl(
  hash: string | null | undefined,
  search: string | null | undefined
): ParsedAuthTokens {
  const cleanHash = (hash || "").replace(/^[#?]/, "");
  const cleanSearch = (search || "").replace(/^[#?]/, "");

  const hashParams = new URLSearchParams(cleanHash);
  const searchParams = new URLSearchParams(cleanSearch);

  return {
    accessToken: hashParams.get("access_token") || searchParams.get("access_token"),
    refreshToken: hashParams.get("refresh_token") || searchParams.get("refresh_token"),
    type: hashParams.get("type") || searchParams.get("type"),
    code: searchParams.get("code") || hashParams.get("code"),
    errorCode:
      hashParams.get("error_code") ||
      searchParams.get("error_code") ||
      hashParams.get("error") ||
      searchParams.get("error"),
    errorDescription:
      hashParams.get("error_description") || searchParams.get("error_description"),
  };
}


