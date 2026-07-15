import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";
import { COLORS, RADIUS, FONTS, SPACING } from "../../theme/theme";

// Small "i" badge that opens a modal with explanatory text - keeps game
// screens uncluttered while still giving the player full transparency on
// request (odds, cooldowns, what a "pool" is, etc).
const InfoButton = ({ title = "You should know", text }) => {
  const [visible, setVisible] = useState(false);
  if (!text) return null;

  return (
    <>
      <TouchableOpacity style={styles.badge} onPress={() => setVisible(true)} activeOpacity={0.75}>
        <Text style={styles.badgeText}>i</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView style={styles.scroll}>
              <Text style={styles.body}>{text}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)} activeOpacity={0.85}>
              <Text style={styles.closeText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.4,
    borderColor: COLORS.textMuted,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: { color: COLORS.textMuted, fontFamily: FONTS.bold, fontSize: 12 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", alignItems: "center", padding: SPACING.lg },
  card: {
    width: "100%",
    maxWidth: 340,
    maxHeight: "70%",
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  title: { color: COLORS.gold, fontFamily: FONTS.semiBold, fontSize: 15, marginBottom: 10 },
  scroll: { marginBottom: 14 },
  body: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 13, lineHeight: 20 },
  closeButton: { backgroundColor: COLORS.gold, borderRadius: RADIUS.md, paddingVertical: 10, alignItems: "center" },
  closeText: { color: "#1A1A2E", fontFamily: FONTS.semiBold, fontSize: 13 }
});

export default InfoButton;

// FILE LOCATION: src/components/InfoButton/InfoButton.js (NEW file)
