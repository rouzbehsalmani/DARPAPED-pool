import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import TopBar from "../src/components/TopBar/TopBar";
import SpinWheel from "../src/components/SpinWheel/SpinWheel";
import PrizeResultModal from "../src/components/PrizeResultModal/PrizeResultModal";
import { useEconomyStore } from "../src/store/economyStore";
import { SPIN_WHEEL_SEGMENTS } from "../src/config/economyConfig";

export default function SpinWheelRoute() {
  const arpgCounterRef = useRef(null);
  const awardPrize = useEconomyStore((s) => s.awardPrize);
  const [resultPrize, setResultPrize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleResult = (prize) => {
    awardPrize(prize);
    setResultPrize(prize);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar arpgCounterRef={arpgCounterRef} />
      <View style={styles.body}>
        <Text style={styles.title}>Spin the Wheel</Text>
        <SpinWheel segments={SPIN_WHEEL_SEGMENTS} onResult={handleResult} />
      </View>
      <PrizeResultModal
        visible={modalVisible}
        prize={resultPrize}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { flex: 1, padding: 20, alignItems: "center" },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 8, alignSelf: "flex-start" }
});

// FILE LOCATION: app/spin-wheel.js (NEW file)
