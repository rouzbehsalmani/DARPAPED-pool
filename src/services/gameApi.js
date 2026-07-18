// src/services/gameApi.js
//
// Thin wrapper around the Supabase Edge Functions in supabase/functions/*.
// Once Supabase is configured, each mini-game route passes one of these as
// a `resolveWinner`/prize resolver instead of letting the game component
// pick its own random winner locally - the SERVER decides the prize, the
// client only plays the animation. Returns null when Supabase isn't
// configured yet, so every call site's existing local-random fallback
// keeps working exactly as it does today.

import { supabase, isSupabaseConfigured } from "./supabaseClient";

async function callFunction(name, body = {}) {
  if (!isSupabaseConfigured) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) return null;

  const { data, error } = await supabase.functions.invoke(name, {
    body,
    headers: { Authorization: `Bearer ${token}` }
  });
  if (error) {
    console.warn(`gameApi.${name} failed:`, error.message);
    return null;
  }
  return data;
}

export const spinWheelRemote = () => callFunction("spin-wheel");
export const megaPoolSpinRemote = () => callFunction("mega-pool-spin");
export const scratchCardRemote = (isVip) => callFunction("scratch-card", { isVip });
export const slotMachineRemote = (isVip) => callFunction("slot-machine", { isVip });
export const luckyChestsRemote = (isVip) => callFunction("lucky-chests", { isVip });
export const adRewardRemote = (providerId) => callFunction("ad-reward", { providerId });
export const requestWithdrawalRemote = (amountUsd, methodId, destination) =>
  callFunction("request-withdrawal", { amountUsd, methodId, destination });

// FILE LOCATION: src/services/gameApi.js (NEW file)
