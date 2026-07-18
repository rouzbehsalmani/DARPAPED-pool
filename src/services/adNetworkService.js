// src/services/adNetworkService.js
//
// PHASE 10 INTEGRATION POINT + multi-provider rotation + server sync.
// Every screen in the app talks to the ad network ONLY through the
// functions exported here. Internally, this rotates through AD_PROVIDERS
// (./adProviders/index.js) in a strict round-robin (shuffled once per app
// session), then - once Supabase is configured - reports the completed
// view to the ad-reward Edge Function so the 30/30/10/30 split happens
// server-side. Falls back to fully local simulation until then.

import { detectAdTier } from "./geoTierService";
import { AD_PROVIDERS } from "./adProviders";
import { adRewardRemote } from "./gameApi";

let initialized = false;
let rotationOrder = [...AD_PROVIDERS];
let rotationIndex = 0;

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function initAdNetwork() {
  rotationOrder = shuffle(AD_PROVIDERS);
  rotationIndex = 0;
  initialized = true;
  return { initialized: true, order: rotationOrder.map((p) => p.id) };
}

export function isAdNetworkReady() {
  return initialized;
}

export function getAdTier() {
  return detectAdTier();
}

export function peekNextProvider() {
  if (rotationOrder.length === 0) return null;
  return rotationOrder[rotationIndex % rotationOrder.length];
}

// Shows a rewarded ad from whichever provider is next in the rotation, then
// (if Supabase is configured) asks the server to apply the 30/30/10/30
// split for this view and returns ITS revenue/tier; otherwise returns the
// provider's own simulated revenue so local demo mode keeps working.
export function showRewardedAd() {
  if (rotationOrder.length === 0) {
    return Promise.resolve({ success: false, revenue: 0 });
  }
  const provider = rotationOrder[rotationIndex % rotationOrder.length];
  rotationIndex = (rotationIndex + 1) % rotationOrder.length;

  return provider.showRewardedAd().then(async (localResult) => {
    if (!localResult.success) return localResult;

    const remote = await adRewardRemote(provider.id);
    if (remote && remote.success) {
      // Server already applied the split to the user's real balance -
      // GameScreenShell's processAdResult() call after this just mirrors
      // the same numbers into local state for an instant UI update.
      return { success: true, revenue: remote.revenue, tier: remote.tier, providerId: provider.id };
    }
    return localResult;
  });
}

// FILE LOCATION: src/services/adNetworkService.js (REPLACE existing file)
