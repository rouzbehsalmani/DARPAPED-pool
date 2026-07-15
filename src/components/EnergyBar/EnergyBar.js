import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEnergyStore } from "../../store/energyStore";
import { COLORS, FONTS } from "../../theme/theme";

// Vertical stamina/cooldown gauge - now a normal flex child (not an
// absolute overlay) so it reserves its own column and the game area next
// to it re-centers naturally instead of the energy bar floating on top.
const EnergyBar = () => {
  const getEnergy = useEnergyStore((s) => s.getEnergy);
  const [energy, setEnergy] = useState(() => getEnergy());

  useEffect(() => {
    const interval = setInterval(() => setEnergy(getEnergy()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pct = Math.round(energy);
  const fillColor = pct <= 20 ? COLORS.danger : pct <= 50 ? COLORS.goldDeep : COLORS.success;

  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={styles.bolt}>⚡</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { height: `${pct}%`, backgroundColor: fillColor }]} />
      </View>
      <Text style={styles.pct}>{pct}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", width: "100%", paddingVertical: 6 },
  bolt: { fontSize: 14, marginBottom: 6 },
  track: {
    flex: 1,
    width: 14,
    borderRadius: 7,
    backgroundColor: COLORS.bgChip,
    overflow: "hidden",
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: COLORS.border
  },
  fill: { width: "100%" },
  pct: { color: COLORS.textSecondary, fontFamily: FONTS.semiBold, fontSize: 10, marginTop: 6 }
});

export default EnergyBar;

// FILE LOCATION: src/components/EnergyBar/EnergyBar.js (REPLACE existing file)
