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

