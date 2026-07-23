import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient, getAuthedUser } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getAvailableCashBudget, buildCashClaimPatch } from "../_shared/cashPrizeBudget.ts";

// Mirrors src/config/economyConfig.js SCRATCH_ICONS / VIP_SCRATCH_ICONS /
// SCRATCH_ICON_PRIZES.
const PRIZES: Record<string, { type: string; amount: number }> = {
  gold: { type: "gold", amount: 1 },
  diamond: { type: "diamond", amount: 1 },
  silver3: { type: "silver", amount: 3 },
  cash01: { type: "cash", amount: 0.01 },
  silver1: { type: "silver", amount: 1 },
  cash0001: { type: "cash", amount: 0.001 }
};
const ICONS = Object.keys(PRIZES);
const VIP_ICONS = ["gold", "diamond", "silver3"];
const ENERGY_PER_PLAY = 15;
const ZONE_COUNT = 6;

function randomIcon(pool: string[]) {
  return pool[Math.floor(Math.random() * pool.length)];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = getServiceClient();
  const user = await getAuthedUser(req, supabase);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const isVip = !!body.isVip;
  const pool = isVip ? VIP_ICONS : ICONS;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return new Response(JSON.stringify({ error: "No profile" }), { status: 404, headers: corsHeaders });
  if (Number(profile.energy) < ENERGY_PER_PLAY) {
    return new Response(JSON.stringify({ error: "Not enough energy" }), { status: 400, headers: corsHeaders });
  }

  // Cash icons the user's budget can't currently cover are pulled out of
  // the draw pool entirely for this play - they simply can't be landed on,
  // the same way a "dud" card just wouldn't have that icon on it at all.
  const availableBudget = getAvailableCashBudget(profile);
  const drawPool = pool.filter((icon) => {
    const prize = PRIZES[icon];
    return prize.type !== "cash" || prize.amount <= availableBudget;
  });
  const effectivePool = drawPool.length > 0 ? drawPool : pool.filter((icon) => PRIZES[icon].type !== "cash");

  const zones = Array.from({ length: ZONE_COUNT }, () => randomIcon(effectivePool));
  const counts: Record<string, number> = {};
  zones.forEach((icon) => {
    counts[icon] = (counts[icon] || 0) + 1;
  });
  const matchIcon = Object.keys(counts).find((icon) => counts[icon] >= 3);

  let prize: { type: string; amount: number };
  if (matchIcon) {
    prize = PRIZES[matchIcon];
  } else if (isVip) {
    prize = PRIZES[randomIcon(effectivePool)];
  } else {
    prize = { type: "dud", amount: 0 };
  }

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
    meta: { game: "scratch-card", zones, prize, availableBudget }
  });

  return new Response(JSON.stringify({ zones, prize }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/scratch-card/index.ts (REPLACE existing file)
