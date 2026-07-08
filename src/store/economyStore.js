import { create } from "zustand";
import {
  AD_REVENUE_BY_TIER,
  DEFAULT_AD_TIER,
  REVENUE_SPLIT,
  ARPG_TRIGGER_THRESHOLD
} from "../config/economyConfig";

export const useEconomyStore = create((set, get) => ({
  silver: 0,
  gold: 0,
  diamond: 0,
  arpg: 0,

  walletCashBalance: 0,
  arpgShareAccumulated: 0,
  platformRevenueTotal: 0,
  megaPoolAccumulated: 0,

  totalAdsWatched: 0,
  totalAdRevenueGenerated: 0,

  currentAdTier: DEFAULT_AD_TIER,
  detectedRegion: "UNKNOWN",
  isAutoSimulating: false,

  showArpgCongrats: false,

  setDetectedTier: (tier, region) =>
    set({ currentAdTier: tier, detectedRegion: region }),
  setAutoSimulating: (value) => set({ isAutoSimulating: value }),

  simulateAdView: () => {
    const { currentAdTier } = get();
    const revenue = AD_REVENUE_BY_TIER[currentAdTier];

    const cashCut = revenue * REVENUE_SPLIT.CASH_SHARE;
    const arpgCut = revenue * REVENUE_SPLIT.ARPG_SHARE;
    const platformCut = revenue * REVENUE_SPLIT.PLATFORM_SHARE;
    const megaPoolCut = revenue * REVENUE_SPLIT.MEGA_POOL_SHARE;

    set((state) => {
      const newArpgShare = state.arpgShareAccumulated + arpgCut;
      const arpgReady = newArpgShare >= ARPG_TRIGGER_THRESHOLD;

      return {
        totalAdsWatched: state.totalAdsWatched + 1,
        totalAdRevenueGenerated: state.totalAdRevenueGenerated + revenue,
        walletCashBalance: state.walletCashBalance + cashCut,
        platformRevenueTotal: state.platformRevenueTotal + platformCut,
        megaPoolAccumulated: state.megaPoolAccumulated + megaPoolCut,
        arpgShareAccumulated: arpgReady
          ? newArpgShare - ARPG_TRIGGER_THRESHOLD
          : newArpgShare,
        showArpgCongrats: arpgReady ? true : state.showArpgCongrats
      };
    });
  },

  dismissArpgCongrats: () => set({ showArpgCongrats: false }),
  confirmArpgAward: () => set((state) => ({ arpg: state.arpg + 1 })),

  convertSilverToGold: () =>
    set((state) => {
      if (state.silver < 10) return state;
      return { silver: state.silver - 10, gold: state.gold + 1 };
    }),
  convertGoldToDiamond: () =>
    set((state) => {
      if (state.gold < 10) return state;
      return { gold: state.gold - 10, diamond: state.diamond + 1 };
    }),
  convertDiamondToArpg: () =>
    set((state) => {
      if (state.diamond < 10) return state;
      return { diamond: state.diamond - 10, arpg: state.arpg + 1 };
    })
}));
