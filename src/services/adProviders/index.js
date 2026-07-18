// src/services/adProviders/index.js
//
// One entry per ad network. `admobProvider` is a REAL integration that only
// activates once you've installed react-native-google-mobile-ads, set its
// env vars, and done a native EAS build (see admob.js). The rest are still
// simulated stubs - swap each one's showRewardedAd() for that network's
// real SDK (Unity Ads, AppLovin MAX, ironSource, etc.) the same way, using
// admob.js as the template. The rotation logic in ../adNetworkService.js
// never has to change - it only ever calls provider.showRewardedAd()
// through this same interface.

import { AD_REVENUE_BY_TIER } from "../../config/economyConfig";
import { detectAdTier } from "../geoTierService";
import { admobProvider, isAdmobAvailable } from "./admob";

function makeStubProvider(id) {
  return {
    id,
    showRewardedAd: () => {
      const { tier } = detectAdTier();
      const revenue = AD_REVENUE_BY_TIER[tier] ?? AD_REVENUE_BY_TIER.TIER_2;
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, tier, revenue, providerId: id }), 400);
      });
    }
  };
}

// TODO(Phase 10): rename/replace these placeholders with your actual chosen
// networks (Unity Ads, AppLovin MAX, ironSource, Mintegral, Pangle, InMobi,
// Meta Audience Network - see .env.example), following admob.js as the
// pattern for a real one vs. makeStubProvider for a not-yet-wired one.
export const AD_PROVIDERS = [
  ...(isAdmobAvailable ? [admobProvider] : []),
  makeStubProvider("provider_b"),
  makeStubProvider("provider_c")
];

// FILE LOCATION: src/services/adProviders/index.js (REPLACE existing file)
