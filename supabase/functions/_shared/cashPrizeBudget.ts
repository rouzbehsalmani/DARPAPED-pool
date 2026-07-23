// supabase/functions/_shared/cashPrizeBudget.ts
//
// THE central module for tying a user's real ad-view earnings to their
// odds of winning CASH prizes inside mini-games. Every mini-game Edge
// Function (spin-wheel, scratch-card, slot-machine, lucky-chests) imports
// this and calls filterSegmentsByCashEligibility() BEFORE picking a winner -
// never after. That's what makes an outcome the user hasn't earned
// literally IMPOSSIBLE to land on, rather than just "unlikely."
//
// Does NOT apply to:
// - Silver/Gold/Diamond/ARPG prizes - untouched, their odds are exactly
//   what's already defined in each game's own weight table.
// - The Mega Pool Wheel - it already has its own separate, explicit
//   liquidity pool (the `mega_pool` table + MEGA_POOL_MIN_POOL_TO_SPIN gate)
//   and must keep using that, not this module.
//
// THE RULE (as specified): a user's available cash-prize budget is
// (cash_prize_budget_total - cash_prize_budget_claimed) - money they've
// generated via the 30% cash share of ad views, but haven't yet actually
// won inside a mini-game. For any single cash-type outcome of amount X:
//   - if available budget >= X  -> that outcome is fully possible (its
//     configured weight is left as-is)
//   - if available budget <  X  -> that outcome is IMPOSSIBLE (its weight
//     is zeroed out and folded into the "dud" outcome, or - for zero-dud
//     VIP tables with no dud slot - into the lowest-value non-cash outcome)
// This is a hard gate, not a smoothed-down probability - a user who hasn't
// watched any ads yet has exactly 0% chance of any cash prize; a user who
// has enough banked has exactly the normal (never-artificially-boosted)
// chance for that specific amount.

export interface WeightedEntry {
  weight: number;
  prize: { type: string; amount: number };
}

export function getAvailableCashBudget(profile: Record<string, unknown>): number {
  const total = Number(profile.cash_prize_budget_total ?? 0);
  const claimed = Number(profile.cash_prize_budget_claimed ?? 0);
  return Math.max(0, total - claimed);
}

// Zeroes out any cash-type entry the user's current budget can't cover,
// folding its weight into a fallback entry (first "dud" found, or - if
// there's no dud slot at all, i.e. a VIP zero-dud table - the lowest-value
// non-cash entry) so the total weight (and therefore every OTHER outcome's
// relative odds) stays unchanged.
export function filterSegmentsByCashEligibility<T extends WeightedEntry>(
  segments: T[],
  availableBudget: number
): T[] {
  const next = segments.map((s) => ({ ...s }));

  const fallbackIndex = (() => {
    const dudIdx = next.findIndex((s) => s.prize.type === "dud");
    if (dudIdx >= 0) return dudIdx;
    let lowestIdx = -1;
    let lowestValue = Infinity;
    next.forEach((s, i) => {
      if (s.prize.type === "cash") return;
      const value = s.prize.amount ?? 0;
      if (value < lowestValue) {
        lowestValue = value;
        lowestIdx = i;
      }
    });
    return lowestIdx;
  })();

  let reclaimed = 0;
  next.forEach((s, i) => {
    if (s.prize.type !== "cash") return;
    if (s.prize.amount > availableBudget) {
      reclaimed += s.weight;
      next[i] = { ...s, weight: 0 };
    }
  });

  if (reclaimed > 0 && fallbackIndex >= 0) {
    next[fallbackIndex] = { ...next[fallbackIndex], weight: next[fallbackIndex].weight + reclaimed };
  }

  return next;
}

// Applies the DB-side effect of actually winning a cash prize: moves the
// amount from "budget" into the user's real, withdrawable wallet balance.
// Call this ONLY when the winning entry's prize.type === "cash" - every
// other prize type keeps using its existing award path untouched.
export function buildCashClaimPatch(
  profile: Record<string, unknown>,
  amount: number
): Record<string, unknown> {
  return {
    cash_prize_budget_claimed: Number(profile.cash_prize_budget_claimed ?? 0) + amount,
    wallet_cash_balance: Number(profile.wallet_cash_balance ?? 0) + amount
  };
}

// FILE LOCATION: supabase/functions/_shared/cashPrizeBudget.ts (NEW file)
