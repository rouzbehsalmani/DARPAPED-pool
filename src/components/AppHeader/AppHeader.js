import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useMenuStore } from "../../store/menuStore";
import { COLORS, FONTS } from "../../theme/theme";

// Custom header rendered for every screen (wired in app/_layout.js via
// Stack's screenOptions.header). Replaces react-navigation's Drawer header
// entirely - the hamburger here ONLY ever toggles our own AppMenu overlay,
// nothing is permanently visible on screen.
const AppHeader = ({ options, navigation }) => {
  const toggle = useMenuStore((s) => s.toggle);
  const title = options?.title || "";
  const canGoBack = navigation && typeof navigation.canGoBack === "function" && navigation.canGoBack();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggle}
        style={styles.hamburger}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <View style={styles.bar} />
        <View style={styles.bar} />
        <View style={styles.bar} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {canGoBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  hamburger: { width: 22, height: 16, justifyContent: "space-between", marginRight: 14 },
  bar: { height: 2.4, borderRadius: 2, backgroundColor: COLORS.gold, width: "100%" },
  title: { color: COLORS.gold, fontFamily: FONTS.semiBold, fontSize: 16, flex: 1 },
  spacer: { width: 22 },
  backButton: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  backText: { color: COLORS.gold, fontSize: 24, marginTop: -3 }
});

export default AppHeader;

// FILE LOCATION: src/components/AppHeader/AppHeader.js (NEW file)
