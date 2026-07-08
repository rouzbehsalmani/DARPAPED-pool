import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ARPGCongratsModal = ({ visible, onOkPress, okRef, count }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.subtitle}>
            You earned {count} ARPG Token{count === 1 ? "" : "s"}
          </Text>
          <TouchableOpacity
            ref={okRef}
            collapsable={false}
            style={styles.okButton}
            onPress={onOkPress}
            activeOpacity={0.8}
          >
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  card: { width: 280, backgroundColor: "#1A1A2E", borderRadius: 20, paddingVertical: 28, paddingHorizontal: 20, alignItems: "center", borderWidth: 1, borderColor: "#FFD700" },
  title: { fontSize: 20, fontWeight: "700", color: "#FFD700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#FFFFFF", marginBottom: 20 },
  okButton: { backgroundColor: "#FFD700", paddingHorizontal: 32, paddingVertical: 10, borderRadius: 12 },
  okText: { color: "#1A1A2E", fontWeight: "700", fontSize: 15 }
});

export default ARPGCongratsModal;
