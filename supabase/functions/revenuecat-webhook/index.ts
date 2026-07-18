import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getServiceClient } from "../_shared/authClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Point RevenueCat's webhook (Project Settings > Integrations > Webhooks)
// at this function's URL, with the same secret as REVENUECAT_WEBHOOK_AUTH_TOKEN.
// The client must call Purchases.logIn(supabaseUserId) when configuring
// RevenueCat so `app_user_id` here matches a real profiles.id.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization") || "";
  if (authHeader !== `Bearer ${Deno.env.get("REVENUECAT_WEBHOOK_AUTH_TOKEN")}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const body = await req.json().catch(() => ({}));
  const event = body.event || {};
  const userId = event.app_user_id;
  const eventType = event.type;
  const expiresAtMs = event.expiration_at_ms;
  const productId = event.product_id;

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing app_user_id" }), { status: 400, headers: corsHeaders });
  }

  const isActive = ["INITIAL_PURCHASE", "RENEWAL", "UNCANCELLATION", "PRODUCT_CHANGE"].includes(eventType);

  const supabase = getServiceClient();
  await supabase
    .from("profiles")
    .update({
      is_vip: isActive,
      vip_plan_id: isActive ? productId : null,
      vip_expires_at: expiresAtMs ? new Date(expiresAtMs).toISOString() : null
    })
    .eq("id", userId);

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// FILE LOCATION: supabase/functions/revenuecat-webhook/index.ts (NEW file)
