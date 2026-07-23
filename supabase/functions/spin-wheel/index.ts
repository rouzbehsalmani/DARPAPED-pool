import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient, getAuthedUser, pickWeightedIndex } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getAvailableCashBudget, filterSegmentsByCashEligibility, buildCashClaimPatch } from "../_shared/cashPrizeBudget.ts";

// Mirrors src/config/economyConfig.js SPIN_WHEEL_WEIGHTED_PRIZES. The
// client only uses its own JS copy to draw the wheel's visual wedges (same
// wedges for every user, every tier) - the REAL winner is always decided
// here.
const SEGMENTS = [
  { type: "dud", amount: 0, weight: 30 },
  { type: "silver", amount: 1, weight: 20 },
  { type: "silver", amount: 3, weight: 14 },
  { type: "cash", amount: 0.001, weight: 13 },
  { type: "gold", amount: 1, weight: 9 },
  { type: "diamond", amount: 1, weight: 5 },
  { type: "cash", amount: 0.01, weight: 5 },
  { type: "silver", amount: 5, weight: 4 }
].map((s) => ({ weight: s.weight, prize: { type: s.type, amount: s.amount } }));
const ENERGY_PER_PLAY = 15;

// Geo-tier odds adjustment (unrelated to the cash-prize budget gate below -
// this only reshapes non-cash vs dud odds by ad-market tier, same as before).
const TIER_ODDS_MULTIPLIER: Record<string, number> = { TIER_1: 1, TIER_2: 0.6, TIER_3: 0.3 };

function tierAdjustedWeights(segments: typeof SEGMENTS, tier: string) {
  const multiplier = TIER_ODDS_MULTIPLIER[tier] ?? 1;
  let redistributed = 0;
  const weights = segments.map((s) => {
    if (s.prize.type === "dud") return s.weight;
    const reduced = s.weight * multiplier;
    redistributed += s.weight - reduced;
    return reduced;
  });
  const dudIndex = segments.findIndex((s) => s.prize.type === "dud");
  if (dudIndex >= 0) weights[dudIndex] += redistributed;
  return weights;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = getServiceClient();
  const user = await getAuthedUser(req, supabase);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return new Response(JSON.stringify({ error: "No profile" }), { status: 404, headers: corsHeaders });
  if (Number(profile.energy) < ENERGY_PER_PLAY) {
    return new Response(JSON.stringify({ error: "Not enough energy" }), { status: 400, headers: corsHeaders });
  }

  // Step 1: zero out any cash-type slice the user's ad-earned budget can't
  // cover - done BEFORE picking a winner, so an unaffordable cash prize is
  // never even a possible outcome, not just an unlikely one.
  const availableBudget = getAvailableCashBudget(profile);
  const affordable = filterSegmentsByCashEligibility(SEGMENTS, availableBudget);

  // Step 2: apply the existing geo-tier reshaping on top.
  const finalWeights = tierAdjustedWeights(affordable, profile.ad_tier || "TIER_2");

  const winnerIndex = pickWeightedIndex(finalWeights);
  const prize = affordable[winnerIndex].prize;

  const updates: Record<string, unknown> = { energy: Number(profile.energy) - ENERGY_PER_PLAY };
  if (prize.type === "silver") updates.silver = profile.silver + prize.amount;
  if (prize.type === "gold") updates.gold = profile.gold + prize.amount;
  if (prize.type === "diamond") updates.diamond = profile.diamond + prize.amount;
  if (prize.type === "cash") Object.assign(updates, buildCashClaimPatch(profile, prize.amount));

  await supabase.from("profiles").update(updates).eq("id", user.id);
  await supabase.from("platform_ledger").insert({
    user_id: user.id,
    kind: "game_prize",
    amount_usd: prize.type === "cash" ? prize.amount : 0,
    meta: { game: "spin-wheel", prize, tier: profile.ad_tier, availableBudget }
  });

  return new Response(JSON.stringify({ winnerIndex, prize }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/spin-wheel/index.ts (REPLACE existing file)
