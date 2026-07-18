import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient, getAuthedUser } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Mirrors src/config/economyConfig.js AD_REVENUE_BY_TIER / REVENUE_SPLIT -
// the core 30/30/10/30 split, applied server-side every time a rewarded ad
// finishes (called from GameScreenShell's AdBreakModal completion).
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
      wallet_cash_balance: Number(profile.wallet_cash_balance) + cashCut,
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
    meta: { providerId, tier }
  });

  return new Response(JSON.stringify({ success: true, revenue, tier }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/ad-reward/index.ts (NEW file)
