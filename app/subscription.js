import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useSettingsStore } from "../src/store/settingsStore";

export default function SubscriptionRoute() {
  const isVip = useSettingsStore((s) => s.isVip);
  const setVipStatus = useSettingsStore((s) => s.setVipStatus);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <Text style={styles.title}>VIP Pass</Text>

        <View style={styles.card}>
          <Text style={styles.statusLabel}>Current Status</Text>
          <Text style={[styles.statusValue, { color: isVip ? "#FFD700" : "#AAAAC0" }]}>
            {isVip ? "VIP ACTIVE" : "STANDARD"}
          </Text>
          <Text style={styles.note}>
            VIP Pass removes ads and unlocks zero-dud versions of every mini-game.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, isVip && styles.dangerButton]}
          onPress={() => setVipStatus(!isVip)}
        >
          <Text style={styles.actionText}>
            {isVip ? "Cancel VIP Pass (test)" : "Activate VIP Pass (test)"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Real in-app purchase flow will be wired up in Phase 9/10. This toggle is a
          local placeholder for testing VIP-gated features.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { flex: 1, padding: 20 },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FFD700"
  },
  statusLabel: { color: "#AAAAC0", fontSize: 12, marginBottom: 6 },
  statusValue: { fontSize: 22, fontWeight: "800", marginBottom: 10 },
  note: { color: "#77779A", fontSize: 12, lineHeight: 18 },
  actionButton: {
    backgroundColor: "#FFD700",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16
  },
  dangerButton: { backgroundColor: "#E05555" },
  actionText: { color: "#1A1A2E", fontWeight: "700", fontSize: 14 },
  disclaimer: { color: "#77779A", fontSize: 11, textAlign: "center" }
});

// FILE LOCATION: app/subscription.js
