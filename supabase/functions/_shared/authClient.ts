import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Every Edge Function uses the SERVICE ROLE key (bypasses Row Level
// Security) so it can read/update any user's profile after verifying the
// caller's own auth token below - the client itself never gets write
// access to profiles directly (see supabase/schema.sql).
export function getServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

export async function getAuthedUser(req: Request, supabase: ReturnType<typeof createClient>) {
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

// Same weighted-pick used throughout the client (src/utils/weightedRandom.js)
// - kept identical here so both sides agree on how odds work.
export function pickWeightedIndex(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    if (r < weights[i]) return i;
    r -= weights[i];
  }
  return weights.length - 1;
}

// FILE LOCATION: supabase/functions/_shared/authClient.ts (NEW file)
