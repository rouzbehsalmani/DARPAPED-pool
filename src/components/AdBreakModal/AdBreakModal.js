import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";

const AD_DURATION_SECONDS = 3;

// Stands in for a real Ad Network SDK interstitial (Phase 10). Shown
// automatically every GAMEPLAY_AD_INTERVAL mini-game rounds; on completion
// it fires one simulateAdView() tick so the ad-revenue economy loop stays
// connected to actual play, not just the manual debug button.
const AdBreakModal = ({ visible, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION_SECONDS);

  useEffect(() => {
    if (!visible) return undefined;
    setSecondsLeft(AD_DURATION_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="fade">
      <View style={styles.container}>
        <Text style={styles.brand}>DARPAPED</Text>
        <Text style={styles.label}>Simulated Ad Break</Text>
        <View style={styles.adBox}>
          <Text style={styles.adText}>Your ad revenue is being generated...</Text>
        </View>
        <Text style={styles.countdown}>Continuing in {secondsLeft}s</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F1E", alignItems: "center", justifyContent: "center", padding: 20 },
  brand: { color: "#FFD700", fontSize: 22, fontWeight: "800", marginBottom: 4 },
  label: { color: "#77779A", fontSize: 12, marginBottom: 24 },
  adBox: {
    width: "100%",
    maxWidth: 320,
    height: 180,
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#26264A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  adText: { color: "#AAAAC0", fontSize: 13, textAlign: "center", paddingHorizontal: 16 },
  countdown: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" }
});

export default AdBreakModal;

// FILE LOCATION: src/components/AdBreakModal/AdBreakModal.js (NEW file)
