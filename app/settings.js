import React from "react";
import { View, Text, Switch, StyleSheet, SafeAreaView } from "react-native";
import { useSettingsStore } from "../src/store/settingsStore";

export default function SettingsRoute() {
  const sfxEnabled = useSettingsStore((s) => s.sfxEnabled);
  const musicEnabled = useSettingsStore((s) => s.musicEnabled);
  const setSfxEnabled = useSettingsStore((s) => s.setSfxEnabled);
  const setMusicEnabled = useSettingsStore((s) => s.setMusicEnabled);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Sound Effects (SFX)</Text>
          <Switch value={sfxEnabled} onValueChange={setSfxEnabled} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Music</Text>
          <Switch value={musicEnabled} onValueChange={setMusicEnabled} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { flex: 1, padding: 20 },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12
  },
  label: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" }
});

// FILE LOCATION: app/settings.js
