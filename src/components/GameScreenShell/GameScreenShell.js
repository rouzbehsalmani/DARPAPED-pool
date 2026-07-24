import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TopBar from "../TopBar/TopBar";
import GameSwitcherStrip from "../GameSwitcherStrip/GameSwitcherStrip";
import PrizeResultModal from "../PrizeResultModal/PrizeResultModal";
import AdBreakModal from "../AdBreakModal/AdBreakModal";
import VipLockedNotice from "../VipLockedNotice/VipLockedNotice";
import EnergyBar from "../EnergyBar/EnergyBar";
import InternalAdBanner from "../InternalAdBanner/InternalAdBanner";
import InfoButton from "../InfoButton/InfoButton";
import { useEconomyStore } from "../../store/economyStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useEnergyStore } from "../../store/energyStore";
import { showRewardedAd } from "../../services/adNetworkService";
import { COLORS, GRADIENTS, RADIUS, FONTS, SPACING } from "../../theme/theme";

const formatCountdown = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

// Shared shell used by every mini-game route. Centralizes:
// - TopBar (balances) + GameSwitcherStrip (one-tap jump to any other game
//   or its VIP version, right below the balances - this is what lets the
//   player switch games without ever going back out to the menu)
// - title + per-game "You should know" info popup
// - VIP gating (requireVip)
// - Prize award + result modal
// - Simulated ad-break cadence
// - Energy/stamina cooldown gate
//
// Layout, top to bottom: TopBar -> GameSwitcherStrip -> [game column | energy
// column], with the game column itself split 75/25 into the actual game
// and an internal self-promo banner. Adding the switcher strip above this
// took a bit of the game column's own vertical room, which is intentional -
// the strip is deliberately compact (a single row of small icons) so it
// doesn't crowd out the game itself.
//
// Usage:
//   <GameScreenShell title="Spin the Wheel" infoText="...">
//     {(handleResult) => <SpinWheel segments={...} onResult={handleResult} />}
//   </GameScreenShell>
const GameScreenShell = ({
  title,
  subtitle,
  accentColor = COLORS.textPrimary,
  requireVip = false,
  infoTitle = "You should know",
  infoText,
  children
}) => {
  const arpgCounterRef = useRef(null);
  const isVip = useSettingsStore((s) => s.isVip);
  const awardPrize = useEconomyStore((s) => s.awardPrize);
  const registerGamePlay = useEconomyStore((s) => s.registerGamePlay);
  const adBreakPending = useEconomyStore((s) => s.adBreakPending);
  const clearAdBreak = useEconomyStore((s) => s.clearAdBreak);
  const processAdResult = useEconomyStore((s) => s.processAdResult);

  const hasEnergyForPlay = useEnergyStore((s) => s.hasEnergyForPlay);
  const msUntilNextPlay = useEnergyStore((s) => s.msUntilNextPlay);
  const consumeEnergy = useEnergyStore((s) => s.consumeEnergy);

  const [resultPrize, setResultPrize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResult = (prize) => {
    awardPrize(prize);
    setResultPrize(prize);
    setModalVisible(true);
    registerGamePlay();
    consumeEnergy();
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

  const canPlay = hasEnergyForPlay();

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar arpgCounterRef={arpgCounterRef} />
      <GameSwitcherStrip />
      <LinearGradient colors={GRADIENTS.background} style={styles.bodyRow}>
        <View style={styles.gameColumn}>
          <View style={styles.gameArea}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
              <InfoButton title={infoTitle} text={infoText} />
            </View>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

            {canPlay ? (
              children(handleResult)
            ) : (
              <View style={styles.rechargeCard}>
                <Text style={styles.rechargeTitle}>Recharging...</Text>
                <Text style={styles.rechargeSubtitle}>
                  Come back in {formatCountdown(msUntilNextPlay())} for your next play
                </Text>
                {isVip && <Text style={styles.rechargeVipNote}>VIP: 2x faster recharge</Text>}
              </View>
            )}
          </View>

          <View style={styles.adArea}>
            <InternalAdBanner />
          </View>
        </View>

        <View style={styles.energyColumn}>
          <EnergyBar />
        </View>
      </LinearGradient>

      <PrizeResultModal visible={modalVisible} prize={resultPrize} onClose={() => setModalVisible(false)} />
      <AdBreakModal visible={adBreakPending} onComplete={handleAdBreakComplete} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDark },
  bodyRow: { flex: 1, flexDirection: "row", padding: SPACING.lg },
  gameColumn: { flex: 1 },
  gameArea: { flex: 3, alignItems: "center" },
  adArea: { flex: 1, paddingTop: SPACING.sm },
  energyColumn: { width: 50, paddingLeft: SPACING.sm },
  titleRow: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 8, marginBottom: 4 },
  title: { fontFamily: FONTS.bold, fontSize: 19 },
  subtitle: { color: COLORS.textMuted, fontFamily: FONTS.regular, fontSize: 12, marginBottom: 8, alignSelf: "flex-start" },
  rechargeCard: {
    marginTop: 40,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    width: "100%"
  },
  rechargeTitle: { color: COLORS.gold, fontFamily: FONTS.semiBold, fontSize: 16, marginBottom: 8 },
  rechargeSubtitle: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 13, textAlign: "center" },
  rechargeVipNote: { color: COLORS.gold, fontFamily: FONTS.semiBold, fontSize: 11, marginTop: 10 }
});

export default GameScreenShell;

// FILE LOCATION: src/components/GameScreenShell/GameScreenShell.js (REPLACE existing file)
