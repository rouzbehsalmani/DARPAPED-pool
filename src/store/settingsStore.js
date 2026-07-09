import { create } from "zustand";

export const useSettingsStore = create((set) => ({
  sfxEnabled: true,
  musicEnabled: true,
  isVip: false,

  setSfxEnabled: (value) => set({ sfxEnabled: value }),
  setMusicEnabled: (value) => set({ musicEnabled: value }),
  setVipStatus: (value) => set({ isVip: value })
}));

// FILE LOCATION: src/store/settingsStore.js
