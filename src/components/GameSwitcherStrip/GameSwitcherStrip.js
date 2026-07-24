import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Platform, Alert } from "react-native";
import { useRouter, usePathname } from "expo-router";
import GameIcon from "../GameIcon/GameIcon";
import { useSettingsStore } from "../../store/settingsStore";
import { COLORS, RADIUS, FONTS } from "../../theme/theme";

const LOCKED_MESSAGE = "برای باز کردن این‌ها باید اشتراک VIP بگیرید";

// Standard game first, its VIP counterpart right next to it - so switching
// between a game and its own VIP version is a single adjacent tap too.
const GAMES = [
  { gameId: "spin-wheel", label: "Spin", route: "/spin-wheel" },
  { gameId: "spin-wheel", label: "VIP Spin", route: "/vip-spin-wheel", vip: true },
  { gameId: "scratch-card", label: "Scratch", route: "/scratch-card" },
  { gameId: "scratch-card", label: "VIP Scratch", route: "/vip-scratch-card", vip: true },
  { gameId: "slot-machine", label: "Slots", route: "/slot-machine" },
  { gameId: "slot-machine", label: "VIP Slots", route: "/vip-slot-machine", vip: true },
  { gameId: "lucky-chests", label: "Chests", route: "/lucky-chests" },
  { gameId: "lucky-chests", label: "VIP Chests", route: "/vip-lucky-chests", vip: true }
];

// Sits between TopBar and the game/ad/energy area on every mini-game
// screen (mounted once inside GameScreenShell) - lets the player jump
// straight to any other game (or its VIP version) in a single tap, instead
// of going back out to the menu and back in.
const GameSwitcherStrip = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isVip = useSettingsStore((s) => s.isVip);
  const [hoveredRoute, setHoveredRoute] = useState(null);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.strip}
    >
      {GAMES.map((g) => {
        const locked = g.vip && !isVip;
        const active = pathname === g.route;

        const handlePress = () => {
          if (locked) {
            if (Platform.OS === "web") return; // hover tooltip already explains it
            Alert.alert("VIP Pass required", LOCKED_MESSAGE, [
              { text: "Cancel", style: "cancel" },
              { text: "Go to VIP Pass", onPress: () => router.push("/subscription") }
            ]);
            return;
          }
          if (!active) router.replace(g.route);
        };

        return (
          <Pressable
            key={g.route}
            onPress={handlePress}
            onHoverIn={() => setHoveredRoute(g.route)}
            onHoverOut={() => setHoveredRoute(null)}
            style={[styles.tile, active && styles.tileActive, locked && styles.tileLocked]}
          >
            <GameIcon gameId={g.gameId} size={22} locked={locked} />
            {locked && <Text style={styles.lockBadge}>🔒</Text>}
            {locked && hoveredRoute === g.route && Platform.OS === "web" && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{LOCKED_MESSAGE}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  strip: { flexGrow: 0, backgroundColor: COLORS.bgCard, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  row: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 8, gap: 8 },
  tile: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgChip,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  tileActive: { borderColor: COLORS.gold, borderWidth: 1.5 },
  tileLocked: { opacity: 0.6 },
  lockBadge: { position: "absolute", top: -4, right: -4, fontSize: 10 },
  tooltip: {
    position: "absolute",
    top: 46,
    left: -60,
    width: 150,
    backgroundColor: COLORS.bgDark,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 6,
    paddingHorizontal: 8,
    zIndex: 30
  },
  tooltipText: { color: COLORS.gold, fontFamily: FONTS.medium, fontSize: 10, textAlign: "center" }
});

export default GameSwitcherStrip;

// FILE LOCATION: src/components/GameSwitcherStrip/GameSwitcherStrip.js (NEW file)
