// src/services/iapService.js
//
// PHASE 9/10 INTEGRATION POINT for real In-App Purchases / subscriptions.
// The Subscription screen only ever calls getVipPlans / purchaseVip /
// restorePurchases - today these are fully simulated (no store account
// needed). Swap the internals for a real IAP SDK later without touching
// app/subscription.js.
//
// TODO(Phase 9/10 - real SDK), roughly (RevenueCat example):
//   import Purchases from 'react-native-purchases';
//   await Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY });
//   const offerings = await Purchases.getOfferings();
//   const result = await Purchases.purchasePackage(pkg);
// Env var placeholder already exists in .env.example.

export const VIP_PLANS = [
  { id: "vip_monthly", label: "Monthly", priceLabel: "$4.99 / month", durationDays: 30 },
  { id: "vip_yearly", label: "Yearly", priceLabel: "$39.99 / year", durationDays: 365 }
];

export function getVipPlans() {
  // TODO(Phase 9/10): fetch real, localized store prices via the IAP SDK
  // instead of the hardcoded priceLabel strings above.
  return VIP_PLANS;
}

export function purchaseVip(planId) {
  const plan = VIP_PLANS.find((p) => p.id === planId);
  if (!plan) {
    return Promise.reject(new Error("Unknown plan: " + planId));
  }

  // TODO(Phase 9/10): replace with a real purchase call, e.g.
  //   const result = await Purchases.purchasePackage(offeringPackage);
  //   const expiresAt = result.customerInfo.entitlements.active.vip.expirationDate;
  return new Promise((resolve) => {
    setTimeout(() => {
      const expiresAt = Date.now() + plan.durationDays * 24 * 60 * 60 * 1000;
      resolve({ success: true, planId, expiresAt });
    }, 900);
  });
}

export function restorePurchases() {
  // TODO(Phase 9/10): replace with a real restore call, e.g.
  //   const result = await Purchases.restorePurchases();
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, activePlanId: null }), 600);
  });
}

// FILE LOCATION: src/services/iapService.js (NEW file)
