import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import TopBar from "../src/components/TopBar/TopBar";
import SlotMachine from "../src/components/SlotMachine/SlotMachine";
import PrizeResultModal from "../src/components/PrizeResultModal/PrizeResultModal";
import { useEconomyStore } from "../src/store/economyStore";
import { SLOT_SYMBOLS, SLOT_SYMBOL_PRIZES } from "../src/config/economyConfig";

export default function SlotMachineRoute() {
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
        <Text style={styles.title}>Slot Machine</Text>
        <SlotMachine
          symbols={SLOT_SYMBOLS}
          prizeMap={SLOT_SYMBOL_PRIZES}
          onResult={handleResult}
          zeroDud={false}
        />
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

// FILE LOCATION: app/slot-machine.js (NEW file)
