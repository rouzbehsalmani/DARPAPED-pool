import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient, getAuthedUser, pickWeightedIndex } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Mirrors src/config/economyConfig.js MEGA_POOL_WHEEL_WEIGHTED_PRIZES.
const SEGMENTS = [
  { amount: 10, weight: 1 },
  { amount: 5, weight: 2 },
  { amount: 1, weight: 4 },
  { amount: 0.5, weight: 6 },
  { amount: 0.25, weight: 10 },
  { amount: 0.15, weight: 15 },
  { amount: 0.1, weight: 24 },
  { amount: 0.05, weight: 38 }
];
const MIN_POOL_TO_SPIN = 10;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const ARPG_TRIGGER_THRESHOLD = 0.02;
const SPLIT = { team: 0.1, userCash: 0.5, userArpg: 0.4 };

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = getServiceClient();
  const user = await getAuthedUser(req, supabase);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: pool } = await supabase.from("mega_pool").select("*").eq("id", 1).single();
  if (!profile || !pool) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: corsHeaders });
  }

  if (profile.last_mega_pool_spin_at) {
    const elapsed = Date.now() - new Date(profile.last_mega_pool_spin_at).getTime();
    if (elapsed < COOLDOWN_MS) {
      return new Response(
        JSON.stringify({ error: "Cooldown active", msRemaining: COOLDOWN_MS - elapsed }),
        { status: 400, headers: corsHeaders }
      );
    }
  }
  if (Number(pool.balance) < MIN_POOL_TO_SPIN) {
    return new Response(JSON.stringify({ error: "Pool not funded yet" }), { status: 400, headers: corsHeaders });
  }

  const winnerIndex = pickWeightedIndex(SEGMENTS.map((s) => s.weight));
  const amount = Math.min(SEGMENTS[winnerIndex].amount, Number(pool.balance));

  const teamCut = amount * SPLIT.team;
  const userCashCut = amount * SPLIT.userCash;
  const userArpgCut = amount * SPLIT.userArpg;

  const newShare = Number(profile.arpg_share_accumulated) + userArpgCut;
  const tokensEarned = Math.floor(newShare / ARPG_TRIGGER_THRESHOLD);
  const remainder = newShare - tokensEarned * ARPG_TRIGGER_THRESHOLD;

  await supabase
    .from("profiles")
    .update({
      wallet_cash_balance: Number(profile.wallet_cash_balance) + userCashCut,
      arpg_share_accumulated: remainder,
      arpg: profile.arpg + tokensEarned,
      last_mega_pool_spin_at: new Date().toISOString()
    })
    .eq("id", user.id);

  await supabase.from("mega_pool").update({ balance: Number(pool.balance) - amount }).eq("id", 1);

  await supabase.from("platform_ledger").insert([
    { user_id: user.id, kind: "mega_pool_win", amount_usd: userCashCut, meta: { winnerIndex, amount } },
    { user_id: null, kind: "mega_pool_win_team_cut", amount_usd: teamCut, meta: { winnerIndex } }
  ]);

  return new Response(JSON.stringify({ winnerIndex, prize: { type: "cash", amount } }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/mega-pool-spin/index.ts (NEW file)
