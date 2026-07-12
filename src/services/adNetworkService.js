// src/services/adNetworkService.js
//
// PHASE 10 INTEGRATION POINT.
// Every screen in the app talks to the ad network ONLY through the three
// functions exported here (initAdNetwork, getAdTier, showRewardedAd). Today
// they are fully simulated. When you have a real AdMob / Unity Ads account,
// swap the internals below - no other file in the app needs to change.
//
// TODO(Phase 10 - real SDK), roughly:
//   import mobileAds, { RewardedAd, TestIds } from 'react-native-google-mobile-ads';
//   await mobileAds().initialize();
//   const rewarded = RewardedAd.createForAdRequest(process.env.EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID);
//   ...load it, show it, resolve showRewardedAd() from its onAdEarnedReward callback.
// Env var placeholders already exist in .env.example.

import { detectAdTier } from "./geoTierService";
import { AD_REVENUE_BY_TIER } from "../config/economyConfig";

let initialized = false;

export async function initAdNetwork() {
  // TODO(Phase 10): mobileAds().initialize() / UnityAds.initialize(gameId, ...)
  initialized = true;
  return { initialized: true };
}

export function isAdNetworkReady() {
  return initialized;
}

export function getAdTier() {
  // TODO(Phase 10): replace the locale-based guess in geoTierService with
  // the real geo/eCPM tier the ad SDK reports for this device/session.
  return detectAdTier();
}

// Simulates watching a rewarded ad. Resolves after a short delay with the
// revenue generated for this single view, using the same TIER_1/2/3 rates
// already used everywhere else in the economy.
//
// Real integration: call the SDK's "show" API, await its reward callback,
// and resolve with whatever revenue figure the network reports (falling
// back to AD_REVENUE_BY_TIER if the network doesn't report exact revenue).
export function showRewardedAd() {
  const { tier } = getAdTier();
  const revenue = AD_REVENUE_BY_TIER[tier] ?? AD_REVENUE_BY_TIER.TIER_2;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, tier, revenue });
    }, 400);
  });
}

// FILE LOCATION: src/services/adNetworkService.js (NEW file)
