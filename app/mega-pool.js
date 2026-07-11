import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useEconomyStore } from "../src/store/economyStore";
import PrizeResultModal from "../src/components/PrizeResultModal/PrizeResultModal";

const formatCooldown = (ms) => {
  if (ms <= 0) return "Ready";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
};

export default function MegaPoolRoute() {
  const megaPoolAccumulated = useEconomyStore((s) => s.megaPoolAccumulated);
  const lastMegaPoolSpinAt = useEconomyStore((s) => s.lastMegaPoolSpinAt);
  const spinMegaPoolWheel = useEconomyStore((s) => s.spinMegaPoolWheel);

  const [now, setNow] = useState(Date.now());
  const [resultPrize, setResultPrize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cooldownRemaining = Math.max(0, 24 * 60 * 60 * 1000 - (now - lastMegaPoolSpinAt));
  const canSpin = cooldownRemaining <= 0;
  const buttonDisabled = !canSpin || spinning;

  const handleSpin = () => {
    if (buttonDisabled) return;
    setSpinning(true);
    setTimeout(() => {
      const outcome = spinMegaPoolWheel();
      setSpinning(false);
      if (outcome.result === "WIN") {
        setResultPrize({ type: "cash", amount: outcome.amount });
      } else {
        setResultPrize({ type: "dud", amount: 0 });
      }
      setModalVisible(true);
    }, 1200);
  };

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

        <TouchableOpacity
          style={[styles.spinButton, buttonDisabled && styles.disabledButton]}
          onPress={handleSpin}
          disabled={buttonDisabled}
        >
          <Text style={[styles.spinButtonText, buttonDisabled && styles.spinButtonTextDisabled]}>
            {spinning ? "Spinning..." : canSpin ? "Spin the Wheel" : formatCooldown(cooldownRemaining)}
          </Text>
        </TouchableOpacity>
      </View>

      <PrizeResultModal
        visible={modalVisible}
        prize={resultPrize}
        onClose={() => setModalVisible(false)}
      />
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
  spinButton: {
    backgroundColor: "#FFD700",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center"
  },
  disabledButton: { backgroundColor: "#26264A", opacity: 0.85 },
  spinButtonText: { color: "#1A1A2E", fontWeight: "700", fontSize: 13 },
  spinButtonTextDisabled: { color: "#AAAAC0" }
});

// FILE LOCATION: app/mega-pool.js (REPLACE existing file)
