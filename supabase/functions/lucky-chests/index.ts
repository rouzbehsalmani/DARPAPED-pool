import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient, getAuthedUser, pickWeightedIndex } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getAvailableCashBudget, filterSegmentsByCashEligibility, buildCashClaimPatch } from "../_shared/cashPrizeBudget.ts";

// Mirrors src/config/economyConfig.js CHEST_PRIZE_WEIGHTS / VIP_CHEST_PRIZE_WEIGHTS.
const CHEST_PRIZE_WEIGHTS = [
  { weight: 34, prize: { type: "dud", amount: 0 } },
  { weight: 24, prize: { type: "silver", amount: 2 } },
  { weight: 14, prize: { type: "silver", amount: 5 } },
  { weight: 12, prize: { type: "cash", amount: 0.001 } },
  { weight: 9, prize: { type: "gold", amount: 1 } },
  { weight: 5, prize: { type: "cash", amount: 0.01 } },
  { weight: 2, prize: { type: "diamond", amount: 1 } }
];
const VIP_CHEST_PRIZE_WEIGHTS = [
  { weight: 30, prize: { type: "gold", amount: 2 } },
  { weight: 22, prize: { type: "gold", amount: 3 } },
  { weight: 20, prize: { type: "diamond", amount: 1 } },
  { weight: 14, prize: { type: "diamond", amount: 2 } },
  { weight: 8, prize: { type: "cash", amount: 0.01 } },
  { weight: 4, prize: { type: "diamond", amount: 3 } },
  { weight: 1.5, prize: { type: "cash", amount: 0.05 } },
  { weight: 0.5, prize: { type: "gold", amount: 5 } }
];
const ENERGY_PER_PLAY = 15;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = getServiceClient();
  const user = await getAuthedUser(req, supabase);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const isVip = !!body.isVip;
  const table = isVip ? VIP_CHEST_PRIZE_WEIGHTS : CHEST_PRIZE_WEIGHTS;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return new Response(JSON.stringify({ error: "No profile" }), { status: 404, headers: corsHeaders });
  if (Number(profile.energy) < ENERGY_PER_PLAY) {
    return new Response(JSON.stringify({ error: "Not enough energy" }), { status: 400, headers: corsHeaders });
  }

  const availableBudget = getAvailableCashBudget(profile);
  const affordable = filterSegmentsByCashEligibility(table, availableBudget);

  const winnerIndex = pickWeightedIndex(affordable.map((t) => t.weight));
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
    meta: { game: "lucky-chests", prize, availableBudget }
  });

  return new Response(JSON.stringify({ prize }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/lucky-chests/index.ts (REPLACE existing file)
