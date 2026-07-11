import React, { useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import TopBar from "../src/components/TopBar/TopBar";

const GAMES = [
  { key: "spin-wheel", label: "Spin the Wheel", desc: "8-segment fortune wheel - materials + small cash", route: "/spin-wheel" },
  { key: "scratch-card", label: "Scratch Card", desc: "Reveal a grid of icons, match 3 to win", route: "/scratch-card" },
  { key: "slot-machine", label: "Slot Machine", desc: "3-reel classic slots with lever pull", route: "/slot-machine" },
  { key: "lucky-chests", label: "Lucky Chests", desc: "Pick 1 of 9 chests for a random prize", route: "/lucky-chests" }
];

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
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { padding: 20 },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 },
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#26264A"
  },
  cardTitle: { color: "#FFD700", fontSize: 16, fontWeight: "700", marginBottom: 4 },
  cardDesc: { color: "#AAAAC0", fontSize: 12 }
});

// FILE LOCATION: app/index.js (REPLACE existing file)
