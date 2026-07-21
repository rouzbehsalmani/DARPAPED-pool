// src/services/profileSync.js
//
// Fetches the caller's row from `profiles` and hydrates BOTH economyStore
// (balances) and settingsStore (VIP status) from it. Call this once a
// Supabase session exists (see app/_layout.js) and again any time you want
// to force a refresh (e.g. right after a purchase or a big win, instead of
// only trusting the local optimistic mirror).

import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { useEconomyStore } from "../store/economyStore";
import { useSettingsStore } from "../store/settingsStore";

export async function syncProfile() {
  if (!isSupabaseConfigured) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) return null;

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error || !profile) {
    console.warn("profileSync failed:", error?.message);
    return null;
  }

  useEconomyStore.getState().hydrateFromProfile(profile);
  useSettingsStore.getState().hydrateFromProfile(profile);
  return profile;
}

// FILE LOCATION: src/services/profileSync.js (NEW file)
