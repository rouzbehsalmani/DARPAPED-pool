import React, { useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import TopBar from "../src/components/TopBar/TopBar";
import { COLORS, RADIUS, FONTS, SPACING } from "../src/theme/theme";

const GAMES = [
  { key: "spin-wheel", label: "Spin the Wheel", desc: "8-segment fortune wheel - materials + small cash", route: "/spin-wheel" },
  { key: "scratch-card", label: "Scratch Card", desc: "Drag to scratch - match 3 icons to win", route: "/scratch-card" },
  { key: "slot-machine", label: "Slot Machine", desc: "3-reel classic slots with lever pull", route: "/slot-machine" },
  { key: "lucky-chests", label: "Lucky Chests", desc: "Pick 1 of 9 chests for a random prize", route: "/lucky-chests" }
];

// Deliberately simple: the home screen just gets you INTO a game. Once
// you're inside any game, GameSwitcherStrip (mounted inside
// GameScreenShell, right below the balances bar) lets you jump to any
// other game or its VIP version in one tap - that quick-switch grid lives
// there, not here, so it doesn't need duplicating on this screen too.
export default function MainGameSelectionRoute() {
  const arpgCounterRef = useRef(null);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar arpgCounterRef={arpgCounterRef} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Choose a Game</Text>

        {GAMES.map((game) => (
          <TouchableOpacity
            key={game.key}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(game.route)}
          >
            <Text style={styles.cardTitle}>{game.label}</Text>
            <Text style={styles.cardDesc}>{game.desc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDark },
  body: { padding: SPACING.lg },
  title: { color: COLORS.textPrimary, fontFamily: FONTS.bold, fontSize: 18, marginBottom: 16 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  cardTitle: { color: COLORS.gold, fontFamily: FONTS.semiBold, fontSize: 16, marginBottom: 4 },
  cardDesc: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 12 }
});

// FILE LOCATION: app/index.js (REPLACE existing file)
