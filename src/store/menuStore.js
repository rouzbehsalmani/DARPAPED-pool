import { create } from "zustand";

// Controls the hamburger-triggered menu overlay (see AppHeader / AppMenu).
// Deliberately tiny and separate from economy/settings state.
export const useMenuStore = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen }))
}));

// FILE LOCATION: src/store/menuStore.js (NEW file)
