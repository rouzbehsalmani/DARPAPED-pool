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

// Simulated ad break: every N completed mini-game rounds (across any game),
// the player is shown a simulated ad and one simulateAdView() ad-revenue
// tick is triggered. Swap this trigger for a real Ad Network SDK in Phase 10.
export const GAMEPLAY_AD_INTERVAL = 4;

// ---------------------------------------------------------------------------
// Phase 3-8: Mini-game prize configuration
// Every prize table below is WEIGHT-BASED: each entry carries a `weight`
// (relative likelihood, not a percentage) so lower-value outcomes are common
// and higher-value outcomes are rare. Prize shape: { type, amount }
// type is one of "silver" | "gold" | "diamond" | "cash" | "dud"
// ---------------------------------------------------------------------------

// Spin Wheel - exactly 8 segments, wedge size on screen is proportional to
// `weight`, and the winning wedge is chosen with that same weight so the
// wheel's visuals always match the real odds.
export const SPIN_WHEEL_WEIGHTED_PRIZES = [
  { label: "Try Again", weight: 30, color: "#3A3A55", prize: { type: "dud", amount: 0 } },
  { label: "1 Silver", weight: 20, color: "#8C8C9A", prize: { type: "silver", amount: 1 } },
  { label: "3 Silver", weight: 14, color: "#A0A0AE", prize: { type: "silver", amount: 3 } },
  { label: "$0.001", weight: 13, color: "#4CAF50", prize: { type: "cash", amount: 0.001 } },
  { label: "1 Gold", weight: 9, color: "#D4AF37", prize: { type: "gold", amount: 1 } },
  { label: "1 Diamond", weight: 5, color: "#59C7F2", prize: { type: "diamond", amount: 1 } },
  { label: "$0.01", weight: 5, color: "#2E9E4F", prize: { type: "cash", amount: 0.01 } },
  { label: "5 Silver", weight: 4, color: "#8C8C9A", prize: { type: "silver", amount: 5 } }
];

// VIP wheel - zero-dud, still weighted so jackpot-tier cash is rare.
export const VIP_SPIN_WHEEL_WEIGHTED_PRIZES = [
  { label: "3 Gold", weight: 28, color: "#D4AF37", prize: { type: "gold", amount: 3 } },
  { label: "5 Gold", weight: 20, color: "#D4AF37", prize: { type: "gold", amount: 5 } },
  { label: "1 Diamond", weight: 20, color: "#59C7F2", prize: { type: "diamond", amount: 1 } },
  { label: "2 Diamond", weight: 14, color: "#59C7F2", prize: { type: "diamond", amount: 2 } },
  { label: "$0.01", weight: 10, color: "#2E9E4F", prize: { type: "cash", amount: 0.01 } },
  { label: "3 Diamond", weight: 5, color: "#59C7F2", prize: { type: "diamond", amount: 3 } },
  { label: "$0.05", weight: 2, color: "#2E9E4F", prize: { type: "cash", amount: 0.05 } },
  { label: "$0.10", weight: 1, color: "#2E9E4F", prize: { type: "cash", amount: 0.10 } }
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

// Slot Machine symbol odds - lower-value symbols come up far more often.
export const SLOT_SYMBOL_WEIGHTS = [
  { symbol: "🍋", weight: 34 },
  { symbol: "🍒", weight: 26 },
  { symbol: "🔔", weight: 18 },
  { symbol: "⭐", weight: 12 },
  { symbol: "💎", weight: 7 },
  { symbol: "7️⃣", weight: 3 }
];

export const VIP_SLOT_SYMBOL_WEIGHTS = [
  { symbol: "🔔", weight: 40 },
  { symbol: "⭐", weight: 30 },
  { symbol: "💎", weight: 20 },
  { symbol: "7️⃣", weight: 10 }
];

export const SLOT_SYMBOL_PRIZES = {
  "🍒": { type: "silver", amount: 2 },
  "🍋": { type: "silver", amount: 1 },
  "🔔": { type: "gold", amount: 1 },
  "⭐": { type: "cash", amount: 0.001 },
  "💎": { type: "diamond", amount: 1 },
  "7️⃣": { type: "cash", amount: 0.10 }
};

// Lucky Chests - 9 chests, each drawn independently from this weighted table
// (rather than a fixed shuffled pool), so the odds stay consistent no
// matter which single chest the player opens.
export const CHEST_PRIZE_WEIGHTS = [
  { weight: 34, prize: { type: "dud", amount: 0 } },
  { weight: 24, prize: { type: "silver", amount: 2 } },
  { weight: 14, prize: { type: "silver", amount: 5 } },
  { weight: 12, prize: { type: "cash", amount: 0.001 } },
  { weight: 9, prize: { type: "gold", amount: 1 } },
  { weight: 5, prize: { type: "cash", amount: 0.01 } },
  { weight: 2, prize: { type: "diamond", amount: 1 } }
];

export const VIP_CHEST_PRIZE_WEIGHTS = [
  { weight: 30, prize: { type: "gold", amount: 2 } },
  { weight: 22, prize: { type: "gold", amount: 3 } },
  { weight: 20, prize: { type: "diamond", amount: 1 } },
  { weight: 14, prize: { type: "diamond", amount: 2 } },
  { weight: 8, prize: { type: "cash", amount: 0.01 } },
  { weight: 4, prize: { type: "diamond", amount: 3 } },
  { weight: 1.5, prize: { type: "cash", amount: 0.05 } },
  { weight: 0.5, prize: { type: "gold", amount: 5 } }
];

// FILE LOCATION: src/config/economyConfig.js (REPLACE existing file)
