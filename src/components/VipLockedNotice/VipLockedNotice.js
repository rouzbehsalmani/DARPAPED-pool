import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import TopBar from "../TopBar/TopBar";

const VipLockedNotice = ({ arpgCounterRef }) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar arpgCounterRef={arpgCounterRef} />
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.text}>This game is available only with an active VIP Pass.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/subscription")}>
            <Text style={styles.buttonText}>Go to VIP Pass</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { flex: 1, padding: 20, justifyContent: "center" },
  card: { backgroundColor: "#1A1A2E", borderRadius: 16, padding: 20, alignItems: "center" },
  text: { color: "#AAAAC0", fontSize: 13, textAlign: "center", marginBottom: 16 },
  button: { backgroundColor: "#FFD700", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 },
  buttonText: { color: "#1A1A2E", fontWeight: "700", fontSize: 13 }
});

export default VipLockedNotice;

// FILE LOCATION: src/components/VipLockedNotice/VipLockedNotice.js (NEW file)
