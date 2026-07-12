// src/services/adNetworkService.js
//
// PHASE 10 INTEGRATION POINT + multi-provider rotation.
// Every screen in the app talks to the ad network ONLY through the
// functions exported here. Internally, this rotates through AD_PROVIDERS
// (./adProviders/index.js) in a strict round-robin: every ad break uses the
// NEXT provider in line, and only comes back to a provider after every
// other provider has had a turn. This is exactly to avoid hammering one
// network back-to-back for heavy players, which some networks flag as
// abuse-like traffic.
//
// The rotation ORDER is shuffled once per app session (on initAdNetwork),
// so it doesn't feel mechanically predictable run to run, while still
// guaranteeing every provider gets a turn before any repeats.
//
// To add/remove ad networks, edit AD_PROVIDERS in ./adProviders/index.js -
// this file's rotation logic never needs to change.

import { detectAdTier } from "./geoTierService";
import { AD_PROVIDERS } from "./adProviders";

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
  // TODO(Phase 10): initialize every real SDK here (mobileAds().initialize(),
  // UnityAds.initialize(...), etc.) before any provider is used.
  rotationOrder = shuffle(AD_PROVIDERS);
  rotationIndex = 0;
  initialized = true;
  return { initialized: true, order: rotationOrder.map((p) => p.id) };
}

export function isAdNetworkReady() {
  return initialized;
}

export function getAdTier() {
  // TODO(Phase 10): replace the locale-based guess in geoTierService with
  // the real geo/eCPM tier the ad SDK reports for this device/session.
  return detectAdTier();
}

// Returns the provider that will serve the NEXT rewarded ad, without
// advancing the rotation - useful for debug/logging.
export function peekNextProvider() {
  if (rotationOrder.length === 0) return null;
  return rotationOrder[rotationIndex % rotationOrder.length];
}

// Shows a rewarded ad from whichever provider is next in the rotation,
// then advances the rotation for next time. Resolves with
// { success, tier, revenue, providerId }.
export function showRewardedAd() {
  if (rotationOrder.length === 0) {
    return Promise.resolve({ success: false, revenue: 0 });
  }
  const provider = rotationOrder[rotationIndex % rotationOrder.length];
  rotationIndex = (rotationIndex + 1) % rotationOrder.length;
  return provider.showRewardedAd();
}

// FILE LOCATION: src/services/adNetworkService.js (REPLACE existing file)
