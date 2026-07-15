import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONTS } from "../../theme/theme";

// Self-promotion slot - NOT a third-party ad network placement. Cycles
// through whatever's listed in PROMO_SLOTS so you can cross-promote your
// other apps/products here. Edit this array to point at your own startups.
const PROMO_SLOTS = [
  { emoji: "🚀", title: "More from us", subtitle: "Check our other apps" }
];

const ROTATE_MS = 5000;

const InternalAdBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (PROMO_SLOTS.length < 2) return undefined;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % PROMO_SLOTS.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  const slot = PROMO_SLOTS[index];

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{slot.emoji}</Text>
      <Text style={styles.title}>{slot.title}</Text>
      <Text style={styles.subtitle}>{slot.subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4
  },
  emoji: { fontSize: 16, marginBottom: 4 },
  title: { color: COLORS.textSecondary, fontFamily: FONTS.semiBold, fontSize: 9, textAlign: "center" },
  subtitle: { color: COLORS.textMuted, fontFamily: FONTS.regular, fontSize: 8, textAlign: "center", marginTop: 2 }
});

export default InternalAdBanner;

// FILE LOCATION: src/components/InternalAdBanner/InternalAdBanner.js (NEW file)
