import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient, getAuthedUser } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Mirrors src/config/economyConfig.js AD_REVENUE_BY_TIER / REVENUE_SPLIT -
// the core 30/30/10/30 split, applied server-side every time a rewarded ad
// finishes.
//
// CHANGED: the 30% "cash" cut no longer credits wallet_cash_balance
// directly. It now credits cash_prize_budget_total instead - the pool that
// src/../_shared/cashPrizeBudget.ts draws from when a mini-game rolls a
// cash-type prize. The user's real, withdrawable wallet balance now only
// grows when they actually WIN a cash prize inside a game (or the Mega
// Pool), matching the original "30% Direct Cash Pool: users WIN cash
// rewards in tiers" design - watching an ad earns the CHANCE at that cash,
// it doesn't hand it over directly anymore.
const AD_REVENUE_BY_TIER: Record<string, number> = {
  TIER_1: 0.02,
  TIER_2: 0.01,
  TIER_3: 0.004
};
const SPLIT = { cash: 0.3, arpg: 0.3, platform: 0.1, megaPool: 0.3 };
const ARPG_TRIGGER_THRESHOLD = 0.02;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = getServiceClient();
  const user = await getAuthedUser(req, supabase);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const providerId = body.providerId || "unknown";

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return new Response(JSON.stringify({ error: "No profile" }), { status: 404, headers: corsHeaders });

  const tier = profile.ad_tier || "TIER_2";
  const revenue = AD_REVENUE_BY_TIER[tier] ?? AD_REVENUE_BY_TIER.TIER_2;

  const cashCut = revenue * SPLIT.cash;
  const arpgCut = revenue * SPLIT.arpg;
  const megaPoolCut = revenue * SPLIT.megaPool;

  const newShare = Number(profile.arpg_share_accumulated) + arpgCut;
  const tokensEarned = Math.floor(newShare / ARPG_TRIGGER_THRESHOLD);
  const remainder = newShare - tokensEarned * ARPG_TRIGGER_THRESHOLD;

  await supabase
    .from("profiles")
    .update({
      cash_prize_budget_total: Number(profile.cash_prize_budget_total ?? 0) + cashCut,
      arpg_share_accumulated: remainder,
      arpg: profile.arpg + tokensEarned
    })
    .eq("id", user.id);

  const { data: pool } = await supabase.from("mega_pool").select("*").eq("id", 1).single();
  if (pool) {
    await supabase.from("mega_pool").update({ balance: Number(pool.balance) + megaPoolCut }).eq("id", 1);
  }

  await supabase.from("platform_ledger").insert({
    user_id: user.id,
    kind: "ad_view",
    amount_usd: revenue,
    meta: { providerId, tier, cashCutAddedToBudget: cashCut }
  });

  return new Response(JSON.stringify({ success: true, revenue, tier }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/ad-reward/index.ts (REPLACE existing file)
