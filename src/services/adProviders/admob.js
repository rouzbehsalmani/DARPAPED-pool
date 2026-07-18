// src/services/adProviders/admob.js
//
// REAL AdMob provider - only activates on a native build (iOS/Android)
// where react-native-google-mobile-ads is actually installed and linked;
// on web, or before you've run `npx expo install react-native-google-mobile-ads`
// and done a native EAS build, this quietly stays unavailable and the app
// falls back to the simulated stub providers in ./index.js. You cannot
// test this in Expo Go or the web preview - it needs a custom dev client
// (`eas build --profile development`) since it's a native module.
//
// Double-check the exact API against the library's current docs when you
// do your first native build - ad SDKs change their APIs between versions
// and this hasn't been runtime-verified here.

import { Platform } from "react-native";

let RewardedAd, RewardedAdEventType, AdEventType, mobileAdsInit;
if (Platform.OS !== "web") {
  try {
    // eslint-disable-next-line global-require
    const mod = require("react-native-google-mobile-ads");
    RewardedAd = mod.RewardedAd;
    RewardedAdEventType = mod.RewardedAdEventType;
    AdEventType = mod.AdEventType;
    mobileAdsInit = mod.default;
  } catch (e) {
    // Native module not present yet - stays unavailable, no crash.
  }
}

function getUnitId() {
  return Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID_IOS
    : process.env.EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID_ANDROID;
}

export const isAdmobAvailable = Boolean(RewardedAd && getUnitId());

let initPromise = null;
function ensureInit() {
  if (!mobileAdsInit) return Promise.resolve();
  if (!initPromise) initPromise = mobileAdsInit().initialize();
  return initPromise;
}

export const admobProvider = {
  id: "admob",
  showRewardedAd: () => {
    if (!isAdmobAvailable) {
      return Promise.resolve({ success: false, revenue: 0 });
    }
    return ensureInit().then(
      () =>
        new Promise((resolve) => {
          const rewarded = RewardedAd.createForAdRequest(getUnitId());
          let earned = false;

          const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            rewarded.show();
          });
          const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
            earned = true;
          });
          const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
            unsubscribeLoaded();
            unsubscribeEarned();
            unsubscribeClosed();
            // AdMob doesn't report exact revenue per view in the free tier -
            // ad-reward Edge Function fills in the actual $ amount from the
            // user's ad_tier once this resolves as success:true.
            resolve({ success: earned, revenue: 0, providerId: "admob" });
          });

          rewarded.load();
        })
    );
  }
};

// FILE LOCATION: src/services/adProviders/admob.js (NEW file)
