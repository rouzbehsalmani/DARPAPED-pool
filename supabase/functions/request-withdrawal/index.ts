import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient, getAuthedUser } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

// TODO(Phase 9): after inserting the pending row below, actually call the
// chosen payout provider's API (PayPal Payouts / Payoneer / Wise /
// NOWPayments - see .env.example) using its SECRET key via Deno.env.get(),
// then update the row's status once the provider confirms the payout. Today
// this validates the balance, deducts it, and records a "pending" row -
// the real transfer step is the one piece intentionally left as a TODO
// since it depends entirely on which provider(s) you end up signing up for.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = getServiceClient();
  const user = await getAuthedUser(req, supabase);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const amountUsd = Number(body.amountUsd);
  const methodId = String(body.methodId || "");
  const destination = String(body.destination || "").trim();

  if (!amountUsd || amountUsd <= 0 || !methodId || !destination) {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: corsHeaders });
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return new Response(JSON.stringify({ error: "No profile" }), { status: 404, headers: corsHeaders });
  if (amountUsd > Number(profile.wallet_cash_balance)) {
    return new Response(JSON.stringify({ error: "Amount exceeds balance" }), { status: 400, headers: corsHeaders });
  }

  await supabase
    .from("profiles")
    .update({ wallet_cash_balance: Number(profile.wallet_cash_balance) - amountUsd })
    .eq("id", user.id);

  const { data: request } = await supabase
    .from("withdrawal_requests")
    .insert({ user_id: user.id, amount_usd: amountUsd, method_id: methodId, destination, status: "pending" })
    .select()
    .single();

  await supabase.from("platform_ledger").insert({
    user_id: user.id,
    kind: "withdrawal",
    amount_usd: amountUsd,
    meta: { methodId, destination }
  });

  return new Response(JSON.stringify({ success: true, request }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/request-withdrawal/index.ts (NEW file)
