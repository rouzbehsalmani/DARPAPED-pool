import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient, getAuthedUser, pickWeightedIndex } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Mirrors src/config/economyConfig.js SLOT_SYMBOL_WEIGHTS / SLOT_SYMBOL_PRIZES.
const SYMBOLS = [
  { id: "lemon", weight: 34, prize: { type: "silver", amount: 1 } },
  { id: "cherry", weight: 26, prize: { type: "silver", amount: 2 } },
  { id: "bell", weight: 18, prize: { type: "gold", amount: 1 } },
  { id: "star", weight: 12, prize: { type: "cash", amount: 0.001 } },
  { id: "diamond", weight: 7, prize: { type: "diamond", amount: 1 } },
  { id: "seven", weight: 3, prize: { type: "cash", amount: 0.1 } }
];
const VIP_IDS = ["bell", "star", "diamond", "seven"];
const WIN_CHANCE = 0.22;
const ENERGY_PER_PLAY = 15;

function weightedSymbol(pool: typeof SYMBOLS) {
  return pool[pickWeightedIndex(pool.map((s) => s.weight))];
}
function randomSymbol(pool: typeof SYMBOLS) {
  return pool[Math.floor(Math.random() * pool.length)];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = getServiceClient();
  const user = await getAuthedUser(req, supabase);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const isVip = !!body.isVip;
  const pool = isVip ? SYMBOLS.filter((s) => VIP_IDS.includes(s.id)) : SYMBOLS;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return new Response(JSON.stringify({ error: "No profile" }), { status: 404, headers: corsHeaders });
  if (Number(profile.energy) < ENERGY_PER_PLAY) {
    return new Response(JSON.stringify({ error: "Not enough energy" }), { status: 400, headers: corsHeaders });
  }

  let middles: string[];
  let prize: { type: string; amount: number };
  if (isVip || Math.random() < WIN_CHANCE) {
    const win = weightedSymbol(pool);
    middles = [win.id, win.id, win.id];
    prize = win.prize;
  } else {
    const picks = [randomSymbol(pool).id, randomSymbol(pool).id, randomSymbol(pool).id];
    if (picks[0] === picks[1] && picks[1] === picks[2]) {
      const idx = pool.findIndex((s) => s.id === picks[2]);
      picks[2] = pool[(idx + 1) % pool.length].id;
    }
    middles = picks;
    prize = { type: "dud", amount: 0 };
  }

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
    meta: { game: "slot-machine", middles, prize }
  });

  return new Response(JSON.stringify({ middles, prize }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/slot-machine/index.ts (NEW file)
