import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSettingsStore } from "../src/store/settingsStore";

const VIP_GAMES = [
  "VIP Scratch Card (zero-dud)",
  "VIP Slot Machine (guaranteed lines)",
  "VIP Spin the Wheel (no empty segments)"
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
        {VIP_GAMES.map((name) => (
          <View key={name} style={styles.gameRow}>
            <Text style={styles.gameName}>{name}</Text>
            <Text style={styles.comingSoon}>Coming in Phase 8</Text>
          </View>
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
  gameName: { color: "#FFD700", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  comingSoon: { color: "#77779A", fontSize: 11 }
});

// FILE LOCATION: app/vip-games.js
