import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient, getAuthedUser, pickWeightedIndex } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Mirrors src/config/economyConfig.js SPIN_WHEEL_WEIGHTED_PRIZES - keep the
// order/weights identical. The client only uses its own JS copy to draw the
// wheel's visual wedges; the REAL winner is always decided here, so a
// tampered client can never force a win.
const SEGMENTS = [
  { type: "dud", amount: 0, weight: 30 },
  { type: "silver", amount: 1, weight: 20 },
  { type: "silver", amount: 3, weight: 14 },
  { type: "cash", amount: 0.001, weight: 13 },
  { type: "gold", amount: 1, weight: 9 },
  { type: "diamond", amount: 1, weight: 5 },
  { type: "cash", amount: 0.01, weight: 5 },
  { type: "silver", amount: 5, weight: 4 }
];
const ENERGY_PER_PLAY = 15;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = getServiceClient();
  const user = await getAuthedUser(req, supabase);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) {
    return new Response(JSON.stringify({ error: "No profile" }), { status: 404, headers: corsHeaders });
  }
  if (Number(profile.energy) < ENERGY_PER_PLAY) {
    return new Response(JSON.stringify({ error: "Not enough energy" }), { status: 400, headers: corsHeaders });
  }

  const winnerIndex = pickWeightedIndex(SEGMENTS.map((s) => s.weight));
  const prize = SEGMENTS[winnerIndex];

  const updates: Record<string, unknown> = { energy: Number(profile.energy) - ENERGY_PER_PLAY };
  if (prize.type === "silver") updates.silver = profile.silver + prize.amount;
  if (prize.type === "gold") updates.gold = profile.gold + prize.amount;
  if (prize.type === "diamond") updates.diamond = profile.diamond + prize.amount;
  if (prize.type === "cash") updates.wallet_cash_balance = Number(profile.wallet_cash_balance) + prize.amount;

  await supabase.from("profiles").update(updates).eq("id", user.id);
  await supabase.from("platform_ledger").insert({
    user_id: user.id,
    kind: "game_prize",
    amount_usd: prize.type === "cash" ? prize.amount : 0,
    meta: { game: "spin-wheel", prize }
  });

  return new Response(JSON.stringify({ winnerIndex, prize }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/spin-wheel/index.ts (NEW file)
