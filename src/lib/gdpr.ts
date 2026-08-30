/**
 * GDPR Data Lifecycle & Retention Management for Goldies Travel.
 * Implements French & EU regulatory rules for data lifecycle:
 * - Active data: Prospects kept 3 years max
 * - Unpaid/abandoned bookings: Kept 90 days max
 * - Health/Allergies data: Sensitive data under Art. 9 GDPR, cleared after 1 year post-trip
 * - Accounting/Billing records: Kept 10 years (Code de commerce Art. L. 123-22)
 * - Beyond 10 years: Irreversible anonymization for statistical analytics
 */

export interface GdprRetentionSummary {
  prospectsPurged: number;
  unpaidBookingsPurged: number;
  sensitiveHealthDataCleared: number;
  oldBookingsAnonymized: number;
}

/**
 * Calculates if a contact message has exceeded the 3-year prospect retention limit.
 */
export function isProspectExpired(createdAt: Date | string, referenceDate = new Date()): boolean {
  const created = new Date(createdAt);
  const threeYearsAgo = new Date(referenceDate);
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
  return created.getTime() < threeYearsAgo.getTime();
}

/**
 * Calculates if an unpaid booking has exceeded the 90-day abandon limit.
 */
export function isUnpaidBookingExpired(createdAt: Date | string, referenceDate = new Date()): boolean {
  const created = new Date(createdAt);
  const ninetyDaysAgo = new Date(referenceDate);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  return created.getTime() < ninetyDaysAgo.getTime();
}

/**
 * Calculates if sensitive health/allergies data should be purged (1 year after creation/stay).
 */
export function isHealthDataRetentionExpired(createdAt: Date | string, referenceDate = new Date()): boolean {
  const created = new Date(createdAt);
  const oneYearAgo = new Date(referenceDate);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return created.getTime() < oneYearAgo.getTime();
}

/**
 * Calculates if a booking record has exceeded the 10-year legal accounting preservation period.
 */
export function isAccountingPreservationExpired(createdAt: Date | string, referenceDate = new Date()): boolean {
  const created = new Date(createdAt);
  const tenYearsAgo = new Date(referenceDate);
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  return created.getTime() < tenYearsAgo.getTime();
}

/**
 * Anonymizes client personal information for statistical retention beyond legal obligations.
 */
export function anonymizeBookingRecord<T extends { id: string; nom: string; prenom: string; email: string; telephone: string; allergies?: string | null; autre?: string | null }>(
  booking: T
): T {
  return {
    ...booking,
    nom: "ANONYMISÉ",
    prenom: "CLIENT_ARCHIVÉ",
    email: `archive_${booking.id.slice(0, 8)}@goldies.anonymized`,
    telephone: "0000000000",
    allergies: "[PURGÉ_RGPD]",
    autre: null,
  };
}
