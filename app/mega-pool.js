import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import SpinWheel from "../src/components/SpinWheel/SpinWheel";
import PrizeResultModal from "../src/components/PrizeResultModal/PrizeResultModal";
import InfoButton from "../src/components/InfoButton/InfoButton";
import { useEconomyStore } from "../src/store/economyStore";
import { MEGA_POOL_WHEEL_WEIGHTED_PRIZES, MEGA_POOL_MIN_POOL_TO_SPIN } from "../src/config/economyConfig";
import { megaPoolSpinRemote } from "../src/services/gameApi";
import { COLORS, FONTS, RADIUS, SPACING } from "../src/theme/theme";

const formatCooldown = (ms) => {
  if (ms <= 0) return "Ready";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
};

const INFO_TEXT =
  "The Mega Pool is a shared jackpot funded by 30% of everyone's ad-view revenue across the whole app - " +
  "the more the community plays, the bigger it gets. The wheel only unlocks once the pool has built up to " +
  `at least $${MEGA_POOL_MIN_POOL_TO_SPIN.toFixed(2)}, since that's also the top prize on it. You can spin ` +
  "once every 24 hours. Odds: $10 (1%), $5 (2%), $1 (4%), $0.50 (6%), $0.25 (10%), $0.15 (15%), $0.10 (24%), $0.05 (38%).";

export default function MegaPoolRoute() {
  const megaPoolAccumulated = useEconomyStore((s) => s.megaPoolAccumulated);
  const lastMegaPoolSpinAt = useEconomyStore((s) => s.lastMegaPoolSpinAt);
  const claimMegaPoolPrize = useEconomyStore((s) => s.claimMegaPoolPrize);

  const [now, setNow] = useState(Date.now());
  const [resultPrize, setResultPrize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cooldownRemaining = Math.max(0, 24 * 60 * 60 * 1000 - (now - lastMegaPoolSpinAt));
  const cooldownReady = cooldownRemaining <= 0;
  const poolFunded = megaPoolAccumulated >= MEGA_POOL_MIN_POOL_TO_SPIN;
  const canSpin = cooldownReady && poolFunded;

  const handleResult = (prize) => {
    // In local demo mode this applies the split client-side. Once Supabase
    // is configured, megaPoolSpinRemote() already applied it server-side -
    // this local call just keeps the on-screen numbers in sync immediately
    // instead of waiting on a refetch.
    claimMegaPoolPrize(prize.amount);
    setResultPrize(prize);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Mega Pool Wheel</Text>
          <InfoButton text={INFO_TEXT} />
        </View>

        <View style={styles.card}>
          <Text style={styles.poolLabel}>Global Pool Balance</Text>
          <Text style={styles.poolValue}>${megaPoolAccumulated.toFixed(4)}</Text>
        </View>

        {!poolFunded ? (
          <Text style={styles.lockedNote}>Locked until the pool reaches ${MEGA_POOL_MIN_POOL_TO_SPIN.toFixed(2)}</Text>
        ) : !cooldownReady ? (
          <Text style={styles.lockedNote}>Next spin in {formatCooldown(cooldownRemaining)}</Text>
        ) : null}

        <SpinWheel
          segments={MEGA_POOL_WHEEL_WEIGHTED_PRIZES}
          onResult={handleResult}
          disabled={!canSpin}
          resolveWinner={megaPoolSpinRemote}
        />
      </View>

      <PrizeResultModal visible={modalVisible} prize={resultPrize} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDark },
  body: { flex: 1, padding: SPACING.lg, alignItems: "center" },
  titleRow: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 8, marginBottom: 16 },
  title: { color: COLORS.textPrimary, fontFamily: FONTS.bold, fontSize: 18 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
    width: "100%"
  },
  poolLabel: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 12, marginBottom: 6 },
  poolValue: { color: COLORS.gold, fontFamily: FONTS.bold, fontSize: 28 },
  lockedNote: { color: COLORS.textMuted, fontFamily: FONTS.medium, fontSize: 12, marginBottom: 8 }
});

// FILE LOCATION: app/mega-pool.js (REPLACE existing file)
