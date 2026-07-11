import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSettingsStore } from "../src/store/settingsStore";

const VIP_GAMES = [
  { key: "vip-scratch-card", label: "VIP Scratch Card (zero-dud)", route: "/vip-scratch-card" },
  { key: "vip-slot-machine", label: "VIP Slot Machine (guaranteed lines)", route: "/vip-slot-machine" },
  { key: "vip-spin-wheel", label: "VIP Spin the Wheel (no empty segments)", route: "/vip-spin-wheel" },
  { key: "vip-lucky-chests", label: "VIP Lucky Chests (zero-dud)", route: "/vip-lucky-chests" }
];

export default function VipGamesRoute() {
  const isVip = useSettingsStore((s) => s.isVip);
  const router = useRouter();

  if (!isVip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <Text style={styles.title}>VIP Games</Text>
          <View style={styles.lockedCard}>
            <Text style={styles.lockedText}>
              This section is available only with an active VIP Pass.
            </Text>
            <TouchableOpacity
              style={styles.upsellButton}
              onPress={() => router.push("/subscription")}
            >
              <Text style={styles.upsellText}>Go to VIP Pass</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <Text style={styles.title}>VIP Games</Text>
        {VIP_GAMES.map((game) => (
          <TouchableOpacity
            key={game.key}
            style={styles.gameRow}
            activeOpacity={0.8}
            onPress={() => router.push(game.route)}
          >
            <Text style={styles.gameName}>{game.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { flex: 1, padding: 20 },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 20 },
  lockedCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 20,
    alignItems: "center"
  },
  lockedText: { color: "#AAAAC0", fontSize: 13, textAlign: "center", marginBottom: 16 },
  upsellButton: {
    backgroundColor: "#FFD700",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  upsellText: { color: "#1A1A2E", fontWeight: "700", fontSize: 13 },
  gameRow: {
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  gameName: { color: "#FFD700", fontSize: 14, fontWeight: "700" }
});

// FILE LOCATION: app/vip-games.js (REPLACE existing file)
