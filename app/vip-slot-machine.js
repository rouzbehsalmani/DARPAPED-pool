import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import TopBar from "../src/components/TopBar/TopBar";
import SlotMachine from "../src/components/SlotMachine/SlotMachine";
import PrizeResultModal from "../src/components/PrizeResultModal/PrizeResultModal";
import VipLockedNotice from "../src/components/VipLockedNotice/VipLockedNotice";
import { useEconomyStore } from "../src/store/economyStore";
import { useSettingsStore } from "../src/store/settingsStore";
import { VIP_SLOT_SYMBOLS, SLOT_SYMBOL_PRIZES } from "../src/config/economyConfig";

export default function VipSlotMachineRoute() {
  const arpgCounterRef = useRef(null);
  const isVip = useSettingsStore((s) => s.isVip);
  const awardPrize = useEconomyStore((s) => s.awardPrize);
  const [resultPrize, setResultPrize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleResult = (prize) => {
    awardPrize(prize);
    setResultPrize(prize);
    setModalVisible(true);
  };

  if (!isVip) {
    return <VipLockedNotice arpgCounterRef={arpgCounterRef} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar arpgCounterRef={arpgCounterRef} />
      <View style={styles.body}>
        <Text style={styles.title}>VIP Slot Machine</Text>
        <Text style={styles.subtitle}>Guaranteed winning lines</Text>
        <SlotMachine
          symbols={VIP_SLOT_SYMBOLS}
          prizeMap={SLOT_SYMBOL_PRIZES}
          onResult={handleResult}
          zeroDud={true}
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
  title: { color: "#FFD700", fontSize: 18, fontWeight: "700", marginBottom: 4, alignSelf: "flex-start" },
  subtitle: { color: "#77779A", fontSize: 12, marginBottom: 8, alignSelf: "flex-start" }
});

// FILE LOCATION: app/vip-slot-machine.js (NEW file)
