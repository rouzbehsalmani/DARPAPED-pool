import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const formatCash = (amount) => {
  const fixed = amount.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  return `$${fixed}`;
};

const PRIZE_LABELS = {
  silver: (amt) => `${amt} Silver`,
  gold: (amt) => `${amt} Gold`,
  diamond: (amt) => `${amt} Diamond`,
  cash: (amt) => formatCash(amt)
};

const PrizeResultModal = ({ visible, prize, onClose }) => {
  if (!prize) return null;
  const isDud = prize.type === "dud";
  const label = !isDud && PRIZE_LABELS[prize.type] ? PRIZE_LABELS[prize.type](prize.amount) : "";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, isDud && styles.cardDud]}>
          <Text style={styles.title}>{isDud ? "No Luck This Time" : "You Won!"}</Text>
          {!isDud && <Text style={styles.prize}>{label}</Text>}
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", alignItems: "center" },
  card: {
    width: 280,
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD700"
  },
  cardDud: { borderColor: "#3A3A55" },
  title: { fontSize: 18, fontWeight: "700", color: "#FFD700", marginBottom: 10 },
  prize: { fontSize: 22, fontWeight: "800", color: "#FFFFFF", marginBottom: 20 },
  button: { backgroundColor: "#FFD700", paddingHorizontal: 32, paddingVertical: 10, borderRadius: 12, marginTop: 10 },
  buttonText: { color: "#1A1A2E", fontWeight: "700", fontSize: 14 }
});

export default PrizeResultModal;

// FILE LOCATION: src/components/PrizeResultModal/PrizeResultModal.js (unchanged)
