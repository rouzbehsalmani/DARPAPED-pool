import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONTS } from "../../theme/theme";

// Self-promotion strip - NOT a third-party ad network placement. Cycles
// through whatever's listed in PROMO_SLOTS so you can cross-promote your
// other apps/products here. Edit this array to point at your own startups.
const PROMO_SLOTS = [
  { emoji: "🚀", title: "More from us", subtitle: "Check out our other apps" }
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
    <View style={[styles.container, { userSelect: "none" }]}>
      <Text style={styles.emoji}>{slot.emoji}</Text>
      <View style={styles.textCol}>
        <Text style={styles.title}>{slot.title}</Text>
        <Text style={styles.subtitle}>{slot.subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14
  },
  emoji: { fontSize: 20, marginRight: 10 },
  textCol: { flex: 1 },
  title: { color: COLORS.textSecondary, fontFamily: FONTS.semiBold, fontSize: 12 },
  subtitle: { color: COLORS.textMuted, fontFamily: FONTS.regular, fontSize: 11, marginTop: 2 }
});

export default InternalAdBanner;

// FILE LOCATION: src/components/InternalAdBanner/InternalAdBanner.js (REPLACE existing file)
