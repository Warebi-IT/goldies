/**
 * Business Rules Engine for Goldies Travel.
 * Enforces data integrity, safety protocols, capacity limits, and audit requirements.
 */

export const MEDICAL_ALERT_KEYWORDS = [
  "arachide",
  "cacahuete",
  "cacahuète",
  "noix",
  "fruits a coque",
  "fruits à coque",
  "gluten",
  "coeliaque",
  "cœliaque",
  "asthme",
  "asthmatique",
  "diabete",
  "diabète",
  "insuline",
  "enceinte",
  "grossesse",
  "cardiaque",
  "coeur",
  "cœur",
  "epilepsie",
  "épilepsie",
  "anaphylaxie",
  "anaphylactique",
  "allergie severe",
  "allergie sévère",
  "medicament",
  "médicament",
  "penicilline",
  "pénicilline",
  "mobilite",
  "mobilité",
  "handicap",
];

/**
 * Analyzes health/allergies input to detect critical medical risks requiring special care.
 */
export function detectMedicalAlert(allergiesText: string | null | undefined): boolean {
  if (!allergiesText || typeof allergiesText !== "string") return false;
  const normalized = allergiesText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

  if (normalized === "aucune" || normalized === "ras" || normalized === "non" || normalized === "aucun") {
    return false;
  }

  return MEDICAL_ALERT_KEYWORDS.some((kw) => {
    const normKw = kw.normalize("NFD").replace(/[̀-ͯ]/g, "");
    return normalized.includes(normKw);
  });
}

/**
 * Calculates remaining spots given trip capacity and active bookings count.
 */
export function calculateSpotsLeft(capacity: number | null | undefined, confirmedBookingsCount: number): number {
  const cap = Math.max(capacity ?? 12, 1);
  return Math.max(cap - confirmedBookingsCount, 0);
}

/**
 * Determines whether a trip is fully booked.
 */
export function isTripSoldOut(capacity: number | null | undefined, confirmedBookingsCount: number): boolean {
  return calculateSpotsLeft(capacity, confirmedBookingsCount) === 0;
}

/**
 * Calculates the balance payment due date (typically 45 days before trip departure).
 */
export function calculateBalanceDueDate(startDateStr: string | null | undefined, daysBeforeDeparture = 45): Date | null {
  if (!startDateStr) return null;
  const departure = new Date(startDateStr);
  if (isNaN(departure.getTime())) return null;

  const dueDate = new Date(departure);
  dueDate.setDate(dueDate.getDate() - daysBeforeDeparture);
  return dueDate;
}

/**
 * Validates if a trip can be permanently deleted or if it MUST be soft-deleted (archived).
 * If bookingsCount > 0, hard deletion is forbidden.
 */
export function canHardDeleteTrip(bookingsCount: number): { allowed: boolean; reason?: string } {
  if (bookingsCount > 0) {
    return {
      allowed: false,
      reason: `Ce voyage compte ${bookingsCount} inscription(s) liée(s). Il ne peut pas être supprimé, mais vous pouvez le désactiver pour le masquer du site public.`,
    };
  }
  return { allowed: true };
}

/**
 * Evaluates insurance compliance for a booking.
 */
export type InsuranceStatus = "verified" | "pending_attestation" | "not_required";

export function evaluateInsuranceCompliance(
  assuranceChoice: string | null | undefined,
  isAttestationProvided = false
): InsuranceStatus {
  if (isAttestationProvided) return "verified";
  if (!assuranceChoice) return "pending_attestation";

  const clean = assuranceChoice.toLowerCase().trim();
  if (clean === "oui") return "verified";
  return "pending_attestation";
}

/**
 * Calculates the deposit amount for a trip.
 * If a custom deposit amount is set (and > 0), it takes precedence.
 * Otherwise, calculates a default percentage (default: 30%) of the total price.
 */
export function calculateDepositAmount(
  totalPrice: number | string | null | undefined,
  configuredDepositAmount?: number | string | null,
  defaultPercentage = 30
): number {
  if (configuredDepositAmount !== null && configuredDepositAmount !== undefined && configuredDepositAmount !== "") {
    const numDeposit = typeof configuredDepositAmount === "number" 
      ? configuredDepositAmount 
      : parseFloat(String(configuredDepositAmount));
    if (!isNaN(numDeposit) && numDeposit > 0) {
      return Math.round(numDeposit);
    }
  }

  const numericTotal = typeof totalPrice === "number" 
    ? totalPrice 
    : parseFloat(String(totalPrice || 0));

  if (isNaN(numericTotal) || numericTotal <= 0) return 0;
  return Math.round((numericTotal * defaultPercentage) / 100);
}

/**
 * Calculates the remaining balance after paying the deposit.
 */
export function calculateRemainingBalance(
  totalPrice: number | string | null | undefined,
  depositAmount: number | string | null | undefined
): number {
  const numericTotal = typeof totalPrice === "number" 
    ? totalPrice 
    : parseFloat(String(totalPrice || 0));
  const numericDeposit = typeof depositAmount === "number" 
    ? depositAmount 
    : parseFloat(String(depositAmount || 0));

  if (isNaN(numericTotal) || numericTotal <= 0) return 0;
  if (isNaN(numericDeposit) || numericDeposit <= 0) return numericTotal;

  return Math.max(Math.round(numericTotal - numericDeposit), 0);
}

