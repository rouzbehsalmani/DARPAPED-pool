// src/services/adProviders/index.js
//
// One entry per ad network. Today every provider is a simulated stub with
// identical behavior - only `id` differs. Later, replace each provider's
// showRewardedAd() body with that specific network's real SDK call (AdMob,
// Unity Ads, IronSource, AppLovin MAX, Meta Audience Network, etc.). The
// rotation logic in ../adNetworkService.js never has to change, since it
// only ever calls provider.showRewardedAd() through this same interface.
//
// To add/remove a network, just add/remove an entry in AD_PROVIDERS below.
// TODO(Phase 10): rename these three placeholders to your actual chosen
// networks and swap each showRewardedAd() body for that SDK's real call.

import { AD_REVENUE_BY_TIER } from "../../config/economyConfig";
import { detectAdTier } from "../geoTierService";

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

export const AD_PROVIDERS = [
  makeStubProvider("provider_a"),
  makeStubProvider("provider_b"),
  makeStubProvider("provider_c")
];

// FILE LOCATION: src/services/adProviders/index.js (NEW file)
