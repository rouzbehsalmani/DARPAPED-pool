import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useMenuStore } from "../../store/menuStore";
import MaterialIcon from "../MaterialIcon/MaterialIcon";
import { COLORS, FONTS } from "../../theme/theme";

// 3-zone header, rendered for every screen via Stack's screenOptions.header:
//   left   -> hamburger + the word "Menu" (unambiguous - only this opens AppMenu)
//   center -> brand mark (logo + "SpinVault" wordmark), tap to go home
//   right  -> the current screen's name (secondary, quiet styling)
const AppHeader = ({ options }) => {
  const toggle = useMenuStore((s) => s.toggle);
  const router = useRouter();
  const title = options?.title || "";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggle}
        style={styles.menuButton}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.hamburger}>
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </View>
        <Text style={styles.menuLabel}>Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.brand} activeOpacity={0.7} onPress={() => router.push("/")}>
        <MaterialIcon type="arpg" size={20} />
        <Text style={styles.brandText}>SpinVault</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  menuButton: { flexDirection: "row", alignItems: "center", flex: 1 },
  hamburger: { width: 18, height: 13, justifyContent: "space-between", marginRight: 6 },
  bar: { height: 2, borderRadius: 2, backgroundColor: COLORS.gold, width: "100%" },
  menuLabel: { color: COLORS.gold, fontFamily: FONTS.medium, fontSize: 12 },
  brand: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 0 },
  brandText: { color: COLORS.textPrimary, fontFamily: FONTS.bold, fontSize: 15 },
  pageTitle: { flex: 1, color: COLORS.textMuted, fontFamily: FONTS.regular, fontSize: 11, textAlign: "right" }
});

export default AppHeader;

// FILE LOCATION: src/components/AppHeader/AppHeader.js (REPLACE existing file)
