import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useEconomyStore } from "../src/store/economyStore";

export default function MegaPoolRoute() {
  const megaPoolAccumulated = useEconomyStore((s) => s.megaPoolAccumulated);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <Text style={styles.title}>Mega Pool Wheel</Text>

        <View style={styles.card}>
          <Text style={styles.poolLabel}>Global Pool Balance</Text>
          <Text style={styles.poolValue}>${megaPoolAccumulated.toFixed(4)}</Text>
          <Text style={styles.note}>
            Prizes: $1.00 / $2.00 / $5.00 / $10.00. One spin every 24 hours. If the
            pool can't cover a prize, the wheel lands on "Try Again Tomorrow".
          </Text>
        </View>

        <TouchableOpacity style={styles.disabledButton} disabled>
          <Text style={styles.disabledText}>Spin the Wheel - Coming in Phase 7</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FFD700"
  },
  poolLabel: { color: "#AAAAC0", fontSize: 12, marginBottom: 6 },
  poolValue: { color: "#FFD700", fontSize: 28, fontWeight: "800", marginBottom: 12 },
  note: { color: "#77779A", fontSize: 12, textAlign: "center", lineHeight: 18 },
  disabledButton: {
    backgroundColor: "#26264A",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    opacity: 0.6
  },
  disabledText: { color: "#AAAAC0", fontWeight: "700", fontSize: 13 }
});

// FILE LOCATION: app/mega-pool.js
