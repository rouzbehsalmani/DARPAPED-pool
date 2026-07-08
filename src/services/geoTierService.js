import { TIER_COUNTRY_MAP, DEFAULT_AD_TIER } from "../config/economyConfig";

export function detectAdTier() {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const parts = locale.split(/[-_]/);
    const region = parts[1] ? parts[1].toUpperCase() : null;
    if (region && TIER_COUNTRY_MAP[region]) {
      return { tier: TIER_COUNTRY_MAP[region], region };
    }
    return { tier: DEFAULT_AD_TIER, region: region || "UNKNOWN" };
  } catch (e) {
    return { tier: DEFAULT_AD_TIER, region: "UNKNOWN" };
  }
}
