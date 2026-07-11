// src/config/economyConfig.js

export const AD_REVENUE_BY_TIER = {
  TIER_1: 0.02,
  TIER_2: 0.01,
  TIER_3: 0.004
};

export const TIER_COUNTRY_MAP = {
  US: "TIER_1", GB: "TIER_1", CA: "TIER_1", AU: "TIER_1", DE: "TIER_1", CH: "TIER_1",
  FR: "TIER_2", IT: "TIER_2", ES: "TIER_2", TR: "TIER_2", BR: "TIER_2", RU: "TIER_2",
  IR: "TIER_3", IN: "TIER_3", PK: "TIER_3", EG: "TIER_3", NG: "TIER_3"
};

export const DEFAULT_AD_TIER = "TIER_2";

export const REVENUE_SPLIT = {
  CASH_SHARE: 0.30,
  ARPG_SHARE: 0.30,
  PLATFORM_SHARE: 0.10,
  MEGA_POOL_SHARE: 0.30
};

// Applied whenever a user wins a payout from the Mega Pool Wheel.
export const MEGA_POOL_WIN_SPLIT = {
  TEAM_SHARE: 0.10,
  USER_CASH_SHARE: 0.50,
  USER_ARPG_SHARE: 0.40
};

export const CONVERSION_RATES = {
  SILVER_TO_GOLD: 10,
  GOLD_TO_DIAMOND: 10,
  DIAMOND_TO_ARPG: 10
};

export const ARPG_USD_VALUE = 0.20;
export const ARPG_TRIGGER_THRESHOLD = 0.02;

export const CASH_REWARD_TIERS = [0.001, 0.01, 0.10];

export const MEGA_POOL_PRIZES = [1.00, 2.00, 5.00, 10.00];
export const MEGA_POOL_SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const AUTO_SIMULATE_INTERVAL_MS = 2000;

// ---------------------------------------------------------------------------
// Phase 3-8: Mini-game prize configuration
// ---------------------------------------------------------------------------

// Generic prize shape: { type: "silver" | "gold" | "diamond" | "cash" | "dud", amount }

export const SPIN_WHEEL_SEGMENTS = [
  { id: "s1", label: "1 Silver", prize: { type: "silver", amount: 1 }, color: "#8C8C9A" },
  { id: "s2", label: "3 Silver", prize: { type: "silver", amount: 3 }, color: "#A0A0AE" },
  { id: "s3", label: "1 Gold", prize: { type: "gold", amount: 1 }, color: "#D4AF37" },
  { id: "s4", label: "$0.001", prize: { type: "cash", amount: 0.001 }, color: "#4CAF50" },
  { id: "s5", label: "1 Silver", prize: { type: "silver", amount: 1 }, color: "#8C8C9A" },
  { id: "s6", label: "1 Diamond", prize: { type: "diamond", amount: 1 }, color: "#59C7F2" },
  { id: "s7", label: "$0.01", prize: { type: "cash", amount: 0.01 }, color: "#2E9E4F" },
  { id: "s8", label: "Try Again", prize: { type: "dud", amount: 0 }, color: "#3A3A55" }
];

export const VIP_SPIN_WHEEL_SEGMENTS = [
  { id: "v1", label: "5 Gold", prize: { type: "gold", amount: 5 }, color: "#D4AF37" },
  { id: "v2", label: "1 Diamond", prize: { type: "diamond", amount: 1 }, color: "#59C7F2" },
  { id: "v3", label: "$0.01", prize: { type: "cash", amount: 0.01 }, color: "#2E9E4F" },
  { id: "v4", label: "3 Diamond", prize: { type: "diamond", amount: 3 }, color: "#59C7F2" },
  { id: "v5", label: "10 Gold", prize: { type: "gold", amount: 10 }, color: "#D4AF37" },
  { id: "v6", label: "$0.10", prize: { type: "cash", amount: 0.10 }, color: "#2E9E4F" },
  { id: "v7", label: "2 Diamond", prize: { type: "diamond", amount: 2 }, color: "#59C7F2" },
  { id: "v8", label: "$0.05", prize: { type: "cash", amount: 0.05 }, color: "#2E9E4F" }
];

export const SCRATCH_ICONS = ["🟡", "💎", "🥈", "💰", "⭐", "🔷"];
export const VIP_SCRATCH_ICONS = ["🟡", "💎", "🥈"];

export const SCRATCH_ICON_PRIZES = {
  "🟡": { type: "gold", amount: 1 },
  "💎": { type: "diamond", amount: 1 },
  "🥈": { type: "silver", amount: 3 },
  "💰": { type: "cash", amount: 0.01 },
  "⭐": { type: "silver", amount: 1 },
  "🔷": { type: "cash", amount: 0.001 }
};

export const SLOT_SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣"];
export const VIP_SLOT_SYMBOLS = ["🔔", "⭐", "💎", "7️⃣"];

export const SLOT_SYMBOL_PRIZES = {
  "🍒": { type: "silver", amount: 2 },
  "🍋": { type: "silver", amount: 1 },
  "🔔": { type: "gold", amount: 1 },
  "⭐": { type: "cash", amount: 0.001 },
  "💎": { type: "diamond", amount: 1 },
  "7️⃣": { type: "cash", amount: 0.10 }
};

export const CHEST_PRIZE_POOL = [
  { type: "silver", amount: 2 },
  { type: "silver", amount: 5 },
  { type: "gold", amount: 1 },
  { type: "diamond", amount: 1 },
  { type: "cash", amount: 0.001 },
  { type: "cash", amount: 0.01 },
  { type: "dud", amount: 0 },
  { type: "dud", amount: 0 },
  { type: "dud", amount: 0 }
];

export const VIP_CHEST_PRIZE_POOL = [
  { type: "gold", amount: 2 },
  { type: "diamond", amount: 1 },
  { type: "diamond", amount: 2 },
  { type: "cash", amount: 0.01 },
  { type: "cash", amount: 0.10 },
  { type: "gold", amount: 5 },
  { type: "diamond", amount: 3 },
  { type: "cash", amount: 0.05 },
  { type: "gold", amount: 3 }
];

// FILE LOCATION: src/config/economyConfig.js (REPLACE existing file)
