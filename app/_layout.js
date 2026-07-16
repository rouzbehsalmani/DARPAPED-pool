import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from "@expo-google-fonts/poppins";
import { initAdNetwork } from "../src/services/adNetworkService";
import AppHeader from "../src/components/AppHeader/AppHeader";
import AppMenu from "../src/components/AppMenu/AppMenu";
import { COLORS } from "../src/theme/theme";

// Switched from expo-router/drawer to a plain Stack + our own AppHeader/
// AppMenu. The Drawer navigator was auto-switching to a permanently-visible
// sidebar on wide viewports no matter what drawerType was set to - this
// custom menu is fully within our control: AppMenu renders nothing at all
// unless menuStore.isOpen is true, so there is no ambiguity about whether
// it can show up on its own.
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold
  });

  useEffect(() => {
    // Phase 10 - shuffles the ad-provider rotation order once per app
    // session (see src/services/adNetworkService.js / adProviders/index.js).
    initAdNetwork();
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.loadingScreen} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* Caps the app to a phone-like width and centers it - on an actual
          phone this is always wider than the screen so it has no visible
          effect; on a wide desktop browser it stops the UI from stretching
          into a "website" shape. userSelect:none also stops the browser's
          native text-selection drag from ever hijacking scratch/drag
          gestures anywhere in the app. */}
      <View style={styles.frameOuter}>
        <View style={[styles.frameInner, { userSelect: "none" }]}>
          <Stack
            screenOptions={{
              header: (props) => <AppHeader {...props} />
            }}
          >
            <Stack.Screen name="index" options={{ title: "Main Game Selection" }} />
            <Stack.Screen name="wallet" options={{ title: "Wallet" }} />
            <Stack.Screen name="exchange" options={{ title: "Exchange" }} />
            <Stack.Screen name="subscription" options={{ title: "VIP Pass" }} />
            <Stack.Screen name="mega-pool" options={{ title: "Mega Pool Wheel" }} />
            <Stack.Screen name="vip-games" options={{ title: "VIP Games" }} />
            <Stack.Screen name="debug" options={{ title: "Debug Panel" }} />
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
