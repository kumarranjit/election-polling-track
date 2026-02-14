// Central mapping of party name -> logo image source.
// Extend this object with any additional parties your app needs.
// Recommended: keep logo assets under `public/party-logos` and reference them here.

/** Maps normalized party names to logo image paths. */
export const PARTY_LOGO_SRC: Record<string, string> = {
  ///Examples (update paths to match your assets):
  "DMK": "dmklogo.webp",
  "AIADMK": "/party-logos/aiadmk.svg",
  "BJP": "/party-logos/bjp.svg",
  "INC": "/party-logos/inc.svg",
};

/** Maps normalized party names to Tailwind text color classes (flag/brand colors). */
export const PARTY_COLOR_CLASSES: Record<string, string> = {
  "DMK": "text-red-600 dark:text-red-400",
  "AIADMK": "text-emerald-600 dark:text-emerald-400",
  "BJP": "text-amber-600 dark:text-amber-400",
  "INC": "text-blue-600 dark:text-blue-400",
};

/**
 * Given a party name string, returns the corresponding logo src.
 *
 * - Trims whitespace
 * - Normalizes to upper-case key lookup
 * - Returns `undefined` if no mapping is found
 */
export function getPartyLogoSrc(partyName?: string | null): string | undefined {
  if (!partyName) return undefined;

  const key = partyName.trim().toUpperCase();
  if (!key) return undefined;

  return PARTY_LOGO_SRC[key];
}

const DEFAULT_HEADING_COLOR = "text-slate-800 dark:text-slate-100";

/**
 * Returns Tailwind text color classes for a party (flag/brand color).
 * Use for candidate heading when party is known. Falls back to default slate if unknown.
 */
export function getPartyColorClass(partyName?: string | null): string {
  if (!partyName) return DEFAULT_HEADING_COLOR;
  const key = partyName.trim().toUpperCase();
  if (!key) return DEFAULT_HEADING_COLOR;
  return PARTY_COLOR_CLASSES[key] ?? DEFAULT_HEADING_COLOR;
}

