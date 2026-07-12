import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: "#1A1A2E" },
          headerTintColor: "#FFD700",
          headerTitleStyle: { fontWeight: "700" },
          drawerActiveTintColor: "#FFD700",
          drawerInactiveTintColor: "#AAAAC0",
          drawerActiveBackgroundColor: "#26264A",
          drawerStyle: { backgroundColor: "#0F0F1E", width: 260 },
          drawerLabelStyle: { fontSize: 14, fontWeight: "600" }
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ drawerLabel: "Main Game Selection", title: "DARPAPED" }}
        />
        <Drawer.Screen
          name="wallet"
          options={{ drawerLabel: "Wallet", title: "Wallet" }}
        />
        <Drawer.Screen
          name="exchange"
          options={{ drawerLabel: "Exchange (Convert Materials)", title: "Exchange" }}
        />
        <Drawer.Screen
          name="subscription"
          options={{ drawerLabel: "VIP Pass (Subscription)", title: "VIP Pass" }}
        />
        <Drawer.Screen
          name="mega-pool"
          options={{ drawerLabel: "Mega Pool Wheel", title: "Mega Pool Wheel" }}
        />
        <Drawer.Screen
          name="vip-games"
          options={{ drawerLabel: "VIP Games", title: "VIP Games" }}
        />
        <Drawer.Screen
          name="debug"
          options={{ drawerLabel: "Debug / Economy Test", title: "Debug Panel" }}
        />
        <Drawer.Screen
          name="settings"
          options={{ drawerLabel: "Settings", title: "Settings" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

// FILE LOCATION: app/_layout.js (REPLACE existing file)
