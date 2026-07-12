import { create } from "zustand";
import {
  AD_REVENUE_BY_TIER,
  DEFAULT_AD_TIER,
  REVENUE_SPLIT,
  ARPG_TRIGGER_THRESHOLD,
  MEGA_POOL_WIN_SPLIT,
  MEGA_POOL_PRIZES,
  MEGA_POOL_SPIN_COOLDOWN_MS,
  GAMEPLAY_AD_INTERVAL
} from "../config/economyConfig";

function applyArpgShare(state, amountUsd) {
  const newShare = state.arpgShareAccumulated + amountUsd;
  const tokensEarned = Math.floor(newShare / ARPG_TRIGGER_THRESHOLD);
  const remainder = newShare - tokensEarned * ARPG_TRIGGER_THRESHOLD;

  if (tokensEarned > 0) {
    return {
      arpgShareAccumulated: remainder,
      pendingArpgAwards: state.pendingArpgAwards + tokensEarned,
      showArpgCongrats: true
    };
  }
  return { arpgShareAccumulated: newShare };
}

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
  pendingArpgAwards: 0,

  lastMegaPoolSpinAt: 0,

  gamePlayCount: 0,
  adBreakPending: false,

  withdrawalRequests: [],

  setDetectedTier: (tier, region) =>
    set({ currentAdTier: tier, detectedRegion: region }),
  setAutoSimulating: (value) => set({ isAutoSimulating: value }),

  // Core 30/30/10/30 revenue split, driven by a single ad-view's reported
  // revenue. This is the ONLY place that logic lives - both the manual
  // debug button (simulateAdView) and the real ad network integration
  // (Phase 10 - src/services/adNetworkService.js, wired via GameScreenShell)
  // funnel through here.
  processAdResult: (revenueUsd) => {
    const cashCut = revenueUsd * REVENUE_SPLIT.CASH_SHARE;
    const arpgCut = revenueUsd * REVENUE_SPLIT.ARPG_SHARE;
    const platformCut = revenueUsd * REVENUE_SPLIT.PLATFORM_SHARE;
    const megaPoolCut = revenueUsd * REVENUE_SPLIT.MEGA_POOL_SHARE;

    set((state) => {
      const arpgPatch = applyArpgShare(state, arpgCut);
      return {
        totalAdsWatched: state.totalAdsWatched + 1,
        totalAdRevenueGenerated: state.totalAdRevenueGenerated + revenueUsd,
        walletCashBalance: state.walletCashBalance + cashCut,
        platformRevenueTotal: state.platformRevenueTotal + platformCut,
        megaPoolAccumulated: state.megaPoolAccumulated + megaPoolCut,
        ...arpgPatch
      };
    });
  },

  // Manual debug button (Phase1TestScreen) - uses the locally detected tier
  // for a quick, no-network test of the split logic above.
  simulateAdView: () => {
    const { currentAdTier, processAdResult } = get();
    const revenue = AD_REVENUE_BY_TIER[currentAdTier];
    processAdResult(revenue);
  },

  resolveMegaPoolWin: (wonAmountUsd) => {
    set((state) => {
      const amount = Math.min(wonAmountUsd, state.megaPoolAccumulated);
      const teamCut = amount * MEGA_POOL_WIN_SPLIT.TEAM_SHARE;
      const userCashCut = amount * MEGA_POOL_WIN_SPLIT.USER_CASH_SHARE;
      const userArpgCut = amount * MEGA_POOL_WIN_SPLIT.USER_ARPG_SHARE;

      const arpgPatch = applyArpgShare(state, userArpgCut);

      return {
        megaPoolAccumulated: state.megaPoolAccumulated - amount,
        platformRevenueTotal: state.platformRevenueTotal + teamCut,
        walletCashBalance: state.walletCashBalance + userCashCut,
        ...arpgPatch
      };
    });
  },

  // Generic mini-game prize resolver.
  // prize: { type: "silver" | "gold" | "diamond" | "cash" | "dud", amount }
  awardPrize: (prize) => {
    if (!prize || prize.type === "dud" || !prize.amount) return;
    set((state) => {
      switch (prize.type) {
        case "silver":
          return { silver: state.silver + prize.amount };
        case "gold":
          return { gold: state.gold + prize.amount };
        case "diamond":
          return { diamond: state.diamond + prize.amount };
        case "cash":
          return { walletCashBalance: state.walletCashBalance + prize.amount };
        default:
          return {};
      }
    });
  },

  // Called by every mini-game once a round finishes. Drives the simulated
  // ad-break cadence (see GAMEPLAY_AD_INTERVAL / AdBreakModal).
  registerGamePlay: () =>
    set((state) => {
      const nextCount = state.gamePlayCount + 1;
      const shouldShowAd = nextCount % GAMEPLAY_AD_INTERVAL === 0;
      return {
        gamePlayCount: nextCount,
        adBreakPending: state.adBreakPending || shouldShowAd
      };
    }),

  clearAdBreak: () => set({ adBreakPending: false }),

  canSpinMegaPool: () => {
    const { lastMegaPoolSpinAt } = get();
    return Date.now() - lastMegaPoolSpinAt >= MEGA_POOL_SPIN_COOLDOWN_MS;
  },

  spinMegaPoolWheel: () => {
    const { megaPoolAccumulated, canSpinMegaPool } = get();
    if (!canSpinMegaPool()) {
      return { result: "COOLDOWN" };
    }
    set({ lastMegaPoolSpinAt: Date.now() });

    const affordablePrizes = MEGA_POOL_PRIZES.filter((p) => p <= megaPoolAccumulated);
    if (affordablePrizes.length === 0) {
      return { result: "TRY_AGAIN" };
    }
    const won = affordablePrizes[Math.floor(Math.random() * affordablePrizes.length)];
    get().resolveMegaPoolWin(won);
    return { result: "WIN", amount: won };
  },

  dismissArpgCongrats: () => set({ showArpgCongrats: false }),

  confirmArpgAward: () =>
    set((state) => ({
      arpg: state.arpg + state.pendingArpgAwards,
      pendingArpgAwards: 0,
      showArpgCongrats: false
    })),

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
    }),

  // Phase 9 - Wallet. Backed by src/services/paymentService.js (currently
  // simulated). Withdrawal deducts the balance immediately as "pending";
  // a real backend would only deduct once the payout is confirmed.
  requestWithdrawal: (amountUsd, methodId, destination) => {
    const { walletCashBalance } = get();
    if (!amountUsd || amountUsd <= 0 || amountUsd > walletCashBalance) {
      return { success: false, error: "Invalid amount" };
    }
    set((state) => ({
      walletCashBalance: state.walletCashBalance - amountUsd,
      withdrawalRequests: [
        {
          id: `wd_${Date.now()}`,
          amountUsd,
          methodId,
          destination,
          status: "pending",
          createdAt: Date.now()
        },
        ...state.withdrawalRequests
      ]
    }));
    return { success: true };
  },

  topUpBalance: (amountUsd) =>
    set((state) => ({ walletCashBalance: state.walletCashBalance + amountUsd }))
}));

// FILE LOCATION: src/store/economyStore.js (REPLACE existing file)
