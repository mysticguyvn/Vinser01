/**
 * Domain suffixes to strip when deriving a school name from an email domain.
 * Ordered from most specific to least specific to ensure correct matching.
 *
 * Example:
 * - `fpt.edu.vn` → strip `.edu.vn` → `fpt`
 * - `school.ac.vn` → strip `.ac.vn` → `school`
 */
export const DOMAIN_SUFFIXES_TO_STRIP = [
  ".edu.vn",
  ".ac.vn",
  ".edu",
  ".com.vn",
  ".org.vn",
  ".vn",
  ".com",
  ".org",
  ".net",
] as const;

/**
 * Well-known school domain → display name mapping.
 * Used to produce human-friendly names from raw domains.
 *
 * Can be extended or replaced with a database lookup in the future.
 */
export const WELL_KNOWN_SCHOOLS: Record<string, string> = {
  fpt: "FPT",
  hust: "HUST",
  vnu: "VNU",
  ueh: "UEH",
  hcmus: "HCMUS",
  uit: "UIT",
  tdtu: "TDTU",
  "hcm-iu": "IU",
  neu: "NEU",
  "vnu-hcm": "VNU-HCM",
};
