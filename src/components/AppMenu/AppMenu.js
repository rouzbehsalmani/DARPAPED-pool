import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useMenuStore } from "../../store/menuStore";
import { COLORS, FONTS, RADIUS } from "../../theme/theme";

const MENU_ITEMS = [
  { emoji: "🎮", label: "Main Game Selection", route: "/" },
  { emoji: "💰", label: "Wallet", route: "/wallet" },
  { emoji: "🔄", label: "Exchange (Convert Materials)", route: "/exchange" },
  { emoji: "👑", label: "VIP Pass (Subscription)", route: "/subscription" },
  { emoji: "🎡", label: "Mega Pool Wheel", route: "/mega-pool" },
  { emoji: "⭐", label: "VIP Games", route: "/vip-games" },
  { emoji: "🐞", label: "Debug / Economy Test", route: "/debug" },
  { emoji: "⚙️", label: "Settings", route: "/settings" }
];

// Renders NOTHING at all while closed - not just visually hidden, actually
// absent from the tree - so there is no permanent sidebar/list on screen
// under any circumstance. Only appears (as a dropdown/accordion panel)
// while menuStore.isOpen is true, which only the hamburger in AppHeader
// (or tapping the backdrop / picking an item) can toggle.
const AppMenu = () => {
  const isOpen = useMenuStore((s) => s.isOpen);
  const close = useMenuStore((s) => s.close);
  const router = useRouter();

  if (!isOpen) return null;

  const go = (route) => {
    close();
    router.push(route);
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      <View style={styles.panel}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity key={item.route} style={styles.item} onPress={() => go(item.route)} activeOpacity={0.75}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <Text style={styles.itemLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 999
  },
  panel: {
    backgroundColor: COLORS.bgDark,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    borderBottomWidth: 1,
    borderColor: COLORS.border
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md
  },
  itemEmoji: { fontSize: 16, marginRight: 12 },
  itemLabel: { color: COLORS.textSecondary, fontFamily: FONTS.medium, fontSize: 14 }
});

export default AppMenu;

// FILE LOCATION: src/components/AppMenu/AppMenu.js (NEW file)
