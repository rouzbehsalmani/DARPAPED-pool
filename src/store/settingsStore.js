import { create } from "zustand";

export const useSettingsStore = create((set, get) => ({
  sfxEnabled: true,
  musicEnabled: true,

  isVip: false,
  vipPlanId: null,
  vipExpiresAt: null,

  setSfxEnabled: (value) => set({ sfxEnabled: value }),
  setMusicEnabled: (value) => set({ musicEnabled: value }),

  // Pulls the server's persisted VIP status into local state (see
  // src/services/profileSync.js). is_vip in the database is ONLY ever
  // flipped by supabase/functions/revenuecat-webhook after a REAL
  // App Store/Play Store purchase - there is deliberately no client-side
  // function left that can set isVip=true on its own anymore (that used to
  // be possible via a debug toggle here, which was the free-VIP exploit).
  hydrateFromProfile: (profile) =>
    set({
      isVip: !!profile.is_vip,
      vipPlanId: profile.vip_plan_id || null,
      vipExpiresAt: profile.vip_expires_at ? new Date(profile.vip_expires_at).getTime() : null
    }),

  // Call on app start / Subscription screen mount to auto-expire a lapsed
  // pass in the LOCAL mirror (the server's own expiry check is authoritative
  // and will correct this on the next hydrateFromProfile anyway).
  checkVipExpiry: () => {
    const { isVip, vipExpiresAt } = get();
    if (isVip && vipExpiresAt && Date.now() > vipExpiresAt) {
      set({ isVip: false, vipPlanId: null, vipExpiresAt: null });
    }
  }
}));

// FILE LOCATION: src/store/settingsStore.js (REPLACE existing file)
