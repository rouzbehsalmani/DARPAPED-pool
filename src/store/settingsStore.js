import { create } from "zustand";

export const useSettingsStore = create((set, get) => ({
  sfxEnabled: true,
  musicEnabled: true,

  isVip: false,
  vipPlanId: null,
  vipExpiresAt: null,

  setSfxEnabled: (value) => set({ sfxEnabled: value }),
  setMusicEnabled: (value) => set({ musicEnabled: value }),

  // Quick debug toggle (24h test pass) - not used by the real purchase flow.
  setVipStatus: (value) =>
    set(
      value
        ? { isVip: true, vipPlanId: "debug", vipExpiresAt: Date.now() + 24 * 60 * 60 * 1000 }
        : { isVip: false, vipPlanId: null, vipExpiresAt: null }
    ),

  // Called by app/subscription.js once iapService.purchaseVip() resolves.
  activateVip: (planId, expiresAt) =>
    set({ isVip: true, vipPlanId: planId, vipExpiresAt: expiresAt }),

  cancelVip: () => set({ isVip: false, vipPlanId: null, vipExpiresAt: null }),

  // Call on app start / Subscription screen mount to auto-expire a lapsed pass.
  checkVipExpiry: () => {
    const { isVip, vipExpiresAt } = get();
    if (isVip && vipExpiresAt && Date.now() > vipExpiresAt) {
      set({ isVip: false, vipPlanId: null, vipExpiresAt: null });
    }
  }
}));

// FILE LOCATION: src/store/settingsStore.js (REPLACE existing file)
