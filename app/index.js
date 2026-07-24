import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import TopBar from "../src/components/TopBar/TopBar";
import GameTile from "../src/components/GameTile/GameTile";
import { useSettingsStore } from "../src/store/settingsStore";
import { COLORS, FONTS, SPACING } from "../src/theme/theme";

// Top row: the 4 standard games, always unlocked.
// Bottom row: their VIP zero-dud counterparts - grayscale + locked unless
// the player has an active VIP Pass (see GameTile.js for the locked
// hover/tap behavior).
const STANDARD_GAMES = [
  { gameId: "spin-wheel", label: "Spin Wheel", route: "/spin-wheel" },
  { gameId: "scratch-card", label: "Scratch Card", route: "/scratch-card" },
  { gameId: "slot-machine", label: "Slot Machine", route: "/slot-machine" },
  { gameId: "lucky-chests", label: "Lucky Chests", route: "/lucky-chests" }
];
const VIP_GAMES = [
  { gameId: "spin-wheel", label: "VIP Spin Wheel", route: "/vip-spin-wheel" },
  { gameId: "scratch-card", label: "VIP Scratch Card", route: "/vip-scratch-card" },
  { gameId: "slot-machine", label: "VIP Slot Machine", route: "/vip-slot-machine" },
  { gameId: "lucky-chests", label: "VIP Lucky Chests", route: "/vip-lucky-chests" }
];

export default function MainGameSelectionRoute() {
  const isVip = useSettingsStore((s) => s.isVip);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Play a Game</Text>
        <View style={styles.grid}>
          {STANDARD_GAMES.map((g) => (
            <GameTile key={g.route} gameId={g.gameId} label={g.label} route={g.route} locked={false} />
          ))}
          {VIP_GAMES.map((g) => (
            <GameTile key={g.route} gameId={g.gameId} label={g.label} route={g.route} locked={!isVip} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDark },
  body: { padding: SPACING.lg },
  title: { color: COLORS.textPrimary, fontFamily: FONTS.bold, fontSize: 16, marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }
});

// FILE LOCATION: app/index.js (REPLACE existing file)
