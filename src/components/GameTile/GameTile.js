import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import GameIcon from "../GameIcon/GameIcon";
import { COLORS, RADIUS, FONTS } from "../../theme/theme";

const LOCKED_MESSAGE = "برای باز کردن این‌ها باید اشتراک VIP بگیرید";

// One tile in the home screen's game grid. `locked` (VIP game + non-VIP
// user) renders the icon grayscale and disables navigation - on web,
// hovering shows an inline tooltip; on native, tapping shows an alert with
// a shortcut straight to the Subscription screen instead of a dead end.
const GameTile = ({ gameId, label, route, locked }) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const handlePress = () => {
    if (locked) {
      if (Platform.OS === "web") return; // tooltip on hover already explains it
      Alert.alert("VIP Pass required", LOCKED_MESSAGE, [
        { text: "Cancel", style: "cancel" },
        { text: "Go to VIP Pass", onPress: () => router.push("/subscription") }
      ]);
      return;
    }
    router.push(route);
  };

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [styles.tile, locked && styles.tileLocked, pressed && !locked && styles.tilePressed]}
    >
      <GameIcon gameId={gameId} size={30} locked={locked} />
      <Text style={[styles.label, locked && styles.labelLocked]} numberOfLines={1}>
        {label}
      </Text>
      {locked && <Text style={styles.lockBadge}>🔒</Text>}
      {locked && hovered && Platform.OS === "web" && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{LOCKED_MESSAGE}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: "23.5%",
    aspectRatio: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
    position: "relative"
  },
  tilePressed: { borderColor: COLORS.gold, opacity: 0.9 },
  tileLocked: { opacity: 0.55 },
  label: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 10,
    marginTop: 6,
    textAlign: "center"
  },
  labelLocked: { color: COLORS.textMuted },
  lockBadge: { position: "absolute", top: 4, right: 6, fontSize: 11 },
  tooltip: {
    position: "absolute",
    bottom: "108%",
    left: -10,
    right: -10,
    backgroundColor: COLORS.bgDark,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 6,
    paddingHorizontal: 8,
    zIndex: 20
  },
  tooltipText: { color: COLORS.gold, fontFamily: FONTS.medium, fontSize: 10, textAlign: "center" }
});

export default GameTile;

// FILE LOCATION: src/components/GameTile/GameTile.js (NEW file)
