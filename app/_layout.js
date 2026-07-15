import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from "@expo-google-fonts/poppins";
import { initAdNetwork } from "../src/services/adNetworkService";
import { COLORS } from "../src/theme/theme";

// Every route file under app/ becomes a navigable screen automatically
// (expo-router file-based routing) - that part is fine and desired. But
// the Drawer would ALSO list every one of them in the visible menu unless
// told not to. These mini-game routes are only ever reached via
// router.push() from Main Game Selection / VIP Games, so they're hidden
// from the drawer's own list with drawerItemStyle height:0 below.
const HIDDEN_ROUTE_NAMES = [
  "spin-wheel",
  "scratch-card",
  "slot-machine",
  "lucky-chests",
  "vip-spin-wheel",
  "vip-scratch-card",
  "vip-slot-machine",
  "vip-lucky-chests"
];

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
          into a "website" shape. */}
      <View style={styles.frameOuter}>
        <View style={styles.frameInner}>
          <Drawer
            screenOptions={{
              // Force the classic slide-in/overlay drawer (hamburger icon
              // toggles it) on EVERY screen size, instead of react-
              // navigation's default of pinning it open as a permanent
              // sidebar on wide viewports.
              drawerType: "front",
              headerStyle: { backgroundColor: COLORS.bgCard },
              headerTintColor: COLORS.gold,
              headerTitleStyle: { fontFamily: "Poppins_600SemiBold", fontSize: 16 },
              drawerActiveTintColor: COLORS.gold,
              drawerInactiveTintColor: COLORS.textSecondary,
              drawerActiveBackgroundColor: COLORS.bgChip,
              drawerStyle: { backgroundColor: COLORS.bgDark, width: 270 },
              drawerLabelStyle: { fontFamily: "Poppins_500Medium", fontSize: 14 },
              drawerItemStyle: { borderRadius: 12, marginHorizontal: 8 }
            }}
          >
            <Drawer.Screen
              name="index"
              options={{ drawerLabel: "🎮  Main Game Selection", title: "DARPAPED" }}
            />
            <Drawer.Screen
              name="wallet"
              options={{ drawerLabel: "💰  Wallet", title: "Wallet" }}
            />
            <Drawer.Screen
              name="exchange"
              options={{ drawerLabel: "🔄  Exchange (Convert Materials)", title: "Exchange" }}
            />
            <Drawer.Screen
              name="subscription"
              options={{ drawerLabel: "👑  VIP Pass (Subscription)", title: "VIP Pass" }}
            />
            <Drawer.Screen
              name="mega-pool"
              options={{ drawerLabel: "🎡  Mega Pool Wheel", title: "Mega Pool Wheel" }}
            />
            <Drawer.Screen
              name="vip-games"
              options={{ drawerLabel: "⭐  VIP Games", title: "VIP Games" }}
            />
            <Drawer.Screen
              name="debug"
              options={{ drawerLabel: "🐞  Debug / Economy Test", title: "Debug Panel" }}
            />
            <Drawer.Screen
              name="settings"
              options={{ drawerLabel: "⚙️  Settings", title: "Settings" }}
            />
            {HIDDEN_ROUTE_NAMES.map((name) => (
              <Drawer.Screen
                key={name}
                name={name}
                options={{
                  title: name,
                  drawerItemStyle: { height: 0, marginVertical: 0, padding: 0 },
                  drawerLabel: () => null,
                  drawerIcon: () => null
                }}
              />
            ))}
          </Drawer>
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
