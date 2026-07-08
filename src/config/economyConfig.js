// src/config/economyConfig.js

export const AD_REVENUE_BY_TIER = {
  TIER_1: 0.02,
  TIER_2: 0.01,
  TIER_3: 0.004
};

export const DEFAULT_AD_TIER = "TIER_2";

export const REVENUE_SPLIT = {
  CASH_SHARE: 0.30,
  ARPG_SHARE: 0.30,
  PLATFORM_SHARE: 0.10,
  MEGA_POOL_SHARE: 0.30
};

export const CONVERSION_RATES = {
  SILVER_TO_GOLD: 10,
  GOLD_TO_DIAMOND: 10,
  DIAMOND_TO_ARPG: 10
};

export const ARPG_USD_VALUE = 0.20;
export const ARPG_TRIGGER_THRESHOLD = 0.20;

export const CASH_REWARD_TIERS = [0.001, 0.01, 0.10];

export const MEGA_POOL_PRIZES = [1.00, 2.00, 5.00, 10.00];
export const MEGA_POOL_SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const AUTO_SIMULATE_INTERVAL_MS = 2000;
