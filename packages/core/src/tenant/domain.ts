import { DOMAIN_SUFFIXES_TO_STRIP, WELL_KNOWN_SCHOOLS } from "./constants";

/**
 * Extract the email domain from a full email address.
 *
 * @param email - Full email address (e.g., "user@fpt.edu.vn")
 * @returns Domain part (e.g., "fpt.edu.vn") or `null` if invalid
 *
 * @example
 * ```ts
 * extractSchoolDomain("student@abc.edu.vn"); // "abc.edu.vn"
 * extractSchoolDomain("invalid-email");       // null
 * ```
 */
export function extractSchoolDomain(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf("@");

  if (atIndex === -1 || atIndex === 0 || atIndex === trimmed.length - 1) {
    return null;
  }

  const domain = trimmed.slice(atIndex + 1);

  // Basic domain validation: must contain at least one dot
  if (!domain.includes(".")) {
    return null;
  }

  return domain;
}

/**
 * Derive a short school identifier from a full domain.
 *
 * Strips known suffixes (`.edu.vn`, `.edu`, `.com.vn`, etc.) to produce
 * a concise school name. Checks well-known mappings for display names.
 *
 * @param domain - Full domain (e.g., "fpt.edu.vn")
 * @returns Short name (e.g., "fpt") or the original domain as fallback
 *
 * @example
 * ```ts
 * resolveSchoolName("fpt.edu.vn");     // "fpt"
 * resolveSchoolName("abc.edu.vn");     // "abc"
 * resolveSchoolName("school.ac.uk");   // "school.ac.uk" (no match, fallback)
 * ```
 */
export function resolveSchoolName(domain: string): string {
  const d = domain.trim().toLowerCase();

  for (const suffix of DOMAIN_SUFFIXES_TO_STRIP) {
    if (d.endsWith(suffix)) {
      const name = d.slice(0, -suffix.length);
      if (name.length > 0) {
        return name;
      }
    }
  }

  // No suffix matched — return domain as-is
  return d;
}

/**
 * Get a human-friendly display name for a school domain.
 *
 * First resolves the short name, then checks the well-known mapping.
 * Falls back to the short name (uppercased first letter).
 *
 * @param domain - Full domain (e.g., "fpt.edu.vn")
 * @returns Display name (e.g., "FPT")
 */
export function getSchoolDisplayName(domain: string): string {
  const shortName = resolveSchoolName(domain);
  return WELL_KNOWN_SCHOOLS[shortName] ?? shortName;
}

/**
 * Full pipeline: extract domain from email → resolve to display name.
 *
 * @param email - Full email address
 * @returns Display name or `null` if email is invalid
 */
export function resolveSchoolFromEmail(email: string): string | null {
  const domain = extractSchoolDomain(email);
  if (!domain) return null;
  return getSchoolDisplayName(domain);
}
