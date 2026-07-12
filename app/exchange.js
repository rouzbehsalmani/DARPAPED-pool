import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { useEconomyStore } from "../src/store/economyStore";
import { CONVERSION_RATES } from "../src/config/economyConfig";

// Manual material conversion screen. Conversion is intentionally NOT
// automatic - the player must come here and tap "Convert" (matches the
// documented design: materials only move up the chain on user action).
export default function ExchangeRoute() {
  const silver = useEconomyStore((s) => s.silver);
  const gold = useEconomyStore((s) => s.gold);
  const diamond = useEconomyStore((s) => s.diamond);
  const arpg = useEconomyStore((s) => s.arpg);
  const convertSilverToGold = useEconomyStore((s) => s.convertSilverToGold);
  const convertGoldToDiamond = useEconomyStore((s) => s.convertGoldToDiamond);
  const convertDiamondToArpg = useEconomyStore((s) => s.convertDiamondToArpg);

  const rows = [
    {
      key: "silver-gold",
      label: `${CONVERSION_RATES.SILVER_TO_GOLD} Silver -> 1 Gold`,
      have: silver,
      need: CONVERSION_RATES.SILVER_TO_GOLD,
      onPress: convertSilverToGold
    },
    {
      key: "gold-diamond",
      label: `${CONVERSION_RATES.GOLD_TO_DIAMOND} Gold -> 1 Diamond`,
      have: gold,
      need: CONVERSION_RATES.GOLD_TO_DIAMOND,
      onPress: convertGoldToDiamond
    },
    {
      key: "diamond-arpg",
      label: `${CONVERSION_RATES.DIAMOND_TO_ARPG} Diamond -> 1 ARPG`,
      have: diamond,
      need: CONVERSION_RATES.DIAMOND_TO_ARPG,
      onPress: convertDiamondToArpg
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Exchange</Text>
        <Text style={styles.subtitle}>Convert materials up the token chain</Text>

        <View style={styles.balancesRow}>
          <Text style={styles.balanceItem}>Silver: {silver}</Text>
          <Text style={styles.balanceItem}>Gold: {gold}</Text>
          <Text style={styles.balanceItem}>Diamond: {diamond}</Text>
          <Text style={styles.balanceItem}>ARPG: {arpg}</Text>
        </View>

        {rows.map((row) => {
          const possible = Math.floor(row.have / row.need);
          const canConvert = possible > 0;
          return (
            <View key={row.key} style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowSub}>
                  {canConvert
                    ? `${possible} conversion${possible > 1 ? "s" : ""} available`
                    : `Need ${row.need - row.have} more`}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.button, !canConvert && styles.buttonDisabled]}
                onPress={row.onPress}
                disabled={!canConvert}
              >
                <Text style={[styles.buttonText, !canConvert && styles.buttonTextDisabled]}>Convert</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { padding: 20 },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: "#77779A", fontSize: 12, marginBottom: 16 },
  balancesRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  balanceItem: {
    color: "#FFD700",
    backgroundColor: "#1A1A2E",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "700",
    marginRight: 8,
    marginBottom: 8
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#26264A"
  },
  rowInfo: { flex: 1, paddingRight: 12 },
  rowLabel: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  rowSub: { color: "#77779A", fontSize: 11 },
  button: { backgroundColor: "#FFD700", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  buttonDisabled: { backgroundColor: "#26264A" },
  buttonText: { color: "#1A1A2E", fontWeight: "700", fontSize: 13 },
  buttonTextDisabled: { color: "#77779A" }
});

// FILE LOCATION: app/exchange.js (NEW file)
