import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import TopBar from "../TopBar/TopBar";
import PrizeResultModal from "../PrizeResultModal/PrizeResultModal";
import AdBreakModal from "../AdBreakModal/AdBreakModal";
import VipLockedNotice from "../VipLockedNotice/VipLockedNotice";
import { useEconomyStore } from "../../store/economyStore";
import { useSettingsStore } from "../../store/settingsStore";
import { showRewardedAd } from "../../services/adNetworkService";

// Shared shell used by every mini-game route. Centralizes:
// - TopBar + title
// - VIP gating (requireVip)
// - Prize award + result modal
// - Simulated ad-break cadence: on trigger, calls the Phase 10 ad network
//   abstraction (showRewardedAd) and feeds its reported revenue into the
//   economy split (processAdResult) - swapping in a real ad SDK later only
//   means changing adNetworkService.js, not this file.
//
// Usage:
//   <GameScreenShell title="Spin the Wheel">
//     {(handleResult) => <SpinWheel segments={...} onResult={handleResult} />}
//   </GameScreenShell>
const GameScreenShell = ({ title, subtitle, accentColor = "#FFFFFF", requireVip = false, children }) => {
  const arpgCounterRef = useRef(null);
  const isVip = useSettingsStore((s) => s.isVip);
  const awardPrize = useEconomyStore((s) => s.awardPrize);
  const registerGamePlay = useEconomyStore((s) => s.registerGamePlay);
  const adBreakPending = useEconomyStore((s) => s.adBreakPending);
  const clearAdBreak = useEconomyStore((s) => s.clearAdBreak);
  const processAdResult = useEconomyStore((s) => s.processAdResult);

  const [resultPrize, setResultPrize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleResult = (prize) => {
    awardPrize(prize);
    setResultPrize(prize);
    setModalVisible(true);
    registerGamePlay();
  };

  const handleAdBreakComplete = () => {
    showRewardedAd().then((result) => {
      if (result.success) {
        processAdResult(result.revenue);
      }
      clearAdBreak();
    });
  };

  if (requireVip && !isVip) {
    return <VipLockedNotice arpgCounterRef={arpgCounterRef} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar arpgCounterRef={arpgCounterRef} />
      <View style={styles.body}>
        <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children(handleResult)}
      </View>

      <PrizeResultModal
        visible={modalVisible}
        prize={resultPrize}
        onClose={() => setModalVisible(false)}
      />

      <AdBreakModal visible={adBreakPending} onComplete={handleAdBreakComplete} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4, alignSelf: "flex-start" },
  subtitle: { color: "#77779A", fontSize: 12, marginBottom: 8, alignSelf: "flex-start" }
});

export default GameScreenShell;

// FILE LOCATION: src/components/GameScreenShell/GameScreenShell.js (REPLACE existing file)
