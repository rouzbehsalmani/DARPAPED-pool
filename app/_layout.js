import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, useRouter, useSegments } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from "@expo-google-fonts/poppins";
import { initAdNetwork } from "../src/services/adNetworkService";
import { supabase, isSupabaseConfigured } from "../src/services/supabaseClient";
import { syncProfile } from "../src/services/profileSync";
import AppHeader from "../src/components/AppHeader/AppHeader";
import AppMenu from "../src/components/AppMenu/AppMenu";
import { COLORS } from "../src/theme/theme";

// Auth gate: only active once Supabase keys exist (see .env.example). Until
// then this resolves immediately with session=null and every screen behaves
// exactly like local demo mode.
function useAuthGate() {
  const [session, setSession] = useState(isSupabaseConfigured ? undefined : null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || session === undefined) return;
    const inAuthGroup = segments[0] === "login" || segments[0] === "sign-up";
    if (!session && !inAuthGroup) {
      router.replace("/login");
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
    if (session) {
      // Pulls the REAL persisted balance/VIP status down from Supabase -
      // this is what makes numbers survive a refresh instead of always
      // starting back at 0 (see src/services/profileSync.js).
      syncProfile();
    }
  }, [session, segments]);

  return session;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold
  });
  const session = useAuthGate();

  useEffect(() => {
    initAdNetwork();
  }, []);

  if (!fontsLoaded || (isSupabaseConfigured && session === undefined)) {
    return <View style={styles.loadingScreen} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.frameOuter}>
        <View style={[styles.frameInner, { userSelect: "none" }]}>
          <Stack screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ title: "Main Game Selection" }} />
            <Stack.Screen name="wallet" options={{ title: "Wallet" }} />
            <Stack.Screen name="exchange" options={{ title: "Exchange" }} />
            <Stack.Screen name="subscription" options={{ title: "VIP Pass" }} />
            <Stack.Screen name="mega-pool" options={{ title: "Mega Pool Wheel" }} />
            <Stack.Screen name="vip-games" options={{ title: "VIP Games" }} />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
            <Stack.Screen name="spin-wheel" options={{ title: "Spin the Wheel" }} />
            <Stack.Screen name="scratch-card" options={{ title: "Scratch Card" }} />
            <Stack.Screen name="slot-machine" options={{ title: "Slot Machine" }} />
            <Stack.Screen name="lucky-chests" options={{ title: "Lucky Chests" }} />
            <Stack.Screen name="vip-spin-wheel" options={{ title: "VIP Spin the Wheel" }} />
            <Stack.Screen name="vip-scratch-card" options={{ title: "VIP Scratch Card" }} />
            <Stack.Screen name="vip-slot-machine" options={{ title: "VIP Slot Machine" }} />
            <Stack.Screen name="vip-lucky-chests" options={{ title: "VIP Lucky Chests" }} />
          </Stack>
          <AppMenu />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDeep },
  loadingScreen: { flex: 1, backgroundColor: COLORS.bgDeep },
  frameOuter: { flex: 1, alignItems: "center" },
  frameInner: { flex: 1, width: "100%", maxWidth: 460, backgroundColor: COLORS.bgDark }
});

// FILE LOCATION: app/_layout.js (REPLACE existing file)
// NOTE: "debug" screen removed from this Stack. Delete app/debug.js from
// your project too (see the PowerShell command in the reply) - just
// removing it from this list stops it from being a Stack.Screen entry with
// custom options, but expo-router still auto-routes any file under app/,
// so the file itself needs to go for /debug to truly disappear.
