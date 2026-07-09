import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { useEconomyStore } from "../src/store/economyStore";

export default function WalletRoute() {
  const walletCashBalance = useEconomyStore((s) => s.walletCashBalance);

  const notImplemented = (feature) =>
    Alert.alert("Coming Soon", `${feature} will be available in Phase 9.`);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <Text style={styles.title}>Wallet</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Cash Balance</Text>
          <Text style={styles.balanceValue}>${walletCashBalance.toFixed(4)}</Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => notImplemented("Top-ups")}
        >
          <Text style={styles.actionText}>Top Up Balance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => notImplemented("Withdrawal requests")}
        >
          <Text style={styles.actionText}>Request Withdrawal</Text>
        </TouchableOpacity>

        <Text style={styles.emptyState}>No withdrawal requests yet.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { flex: 1, padding: 20 },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 20 },
  balanceCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FFD700"
  },
  balanceLabel: { color: "#AAAAC0", fontSize: 12, marginBottom: 6 },
  balanceValue: { color: "#FFD700", fontSize: 28, fontWeight: "800" },
  actionButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12
  },
  secondaryButton: { backgroundColor: "#26264A" },
  actionText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  emptyState: { color: "#77779A", fontSize: 12, textAlign: "center", marginTop: 20 }
});

// FILE LOCATION: app/wallet.js
