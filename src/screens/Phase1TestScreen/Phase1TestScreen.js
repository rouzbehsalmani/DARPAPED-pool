// src/screens/Phase1TestScreen/Phase1TestScreen.js

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from "react-native";
import TopBar from "../../components/TopBar/TopBar";
import SimulateAdButton from "../../components/SimulateAdButton/SimulateAdButton";
import ARPGCongratsModal from "../../components/ARPGCongratsModal/ARPGCongratsModal";
import FloatingArpgText from "../../components/FloatingArpgText/FloatingArpgText";
import { useEconomyStore } from "../../store/economyStore";
import { AUTO_SIMULATE_INTERVAL_MS } from "../../config/economyConfig";

const TIERS = ["TIER_1", "TIER_2", "TIER_3"];

const Phase1TestScreen = () => {
  const showArpgCongrats = useEconomyStore((s) => s.showArpgCongrats);
  const dismissArpgCongrats = useEconomyStore((s) => s.dismissArpgCongrats);
  const confirmArpgAward = useEconomyStore((s) => s.confirmArpgAward);
  const simulateAdView = useEconomyStore((s) => s.simulateAdView);

  const totalAdsWatched = useEconomyStore((s) => s.totalAdsWatched);
  const walletCashBalance = useEconomyStore((s) => s.walletCashBalance);
  const megaPoolAccumulated = useEconomyStore((s) => s.megaPoolAccumulated);
  const arpgShareAccumulated = useEconomyStore((s) => s.arpgShareAccumulated);
  const currentAdTier = useEconomyStore((s) => s.currentAdTier);
  const setAdTier = useEconomyStore((s) => s.setAdTier);
  const isAutoSimulating = useEconomyStore((s) => s.isAutoSimulating);
  const setAutoSimulating = useEconomyStore((s) => s.setAutoSimulating);

  const topBarArpgRef = useRef(null);
  const [floatAnim, setFloatAnim] = useState(null);

  useEffect(() => {
    if (!isAutoSimulating) return;
    const interval = setInterval(() => {
      simulateAdView();
    }, AUTO_SIMULATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAutoSimulating]);

  const handleOkPress = (okButtonNode) => {
    dismissArpgCongrats();

    if (!okButtonNode || !topBarArpgRef.current) {
      confirmArpgAward();
      return;
    }

    okButtonNode.measureInWindow((okX, okY, okW, okH) => {
      topBarArpgRef.current.measureInWindow((tbX, tbY, tbW, tbH) => {
        setFloatAnim({
          fromX: okX + okW / 2,
          fromY: okY + okH / 2,
          toX: tbX + tbW / 2,
          toY: tbY + tbH / 2
        });
      });
    });
  };

  const handleFloatComplete = () => {
    confirmArpgAward();
    setFloatAnim(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar arpgCounterRef={topBarArpgRef} />

      <View style={styles.body}>
        <Text style={styles.debugTitle}>Phase 1 - Tokenomics Debug Panel</Text>

        <Text style={styles.sectionLabel}>Ad Revenue Tier (simulates user's country)</Text>
        <View style={styles.tierRow}>
          {TIERS.map((tier) => (
            <TouchableOpacity
              key={tier}
              style={[
                styles.tierButton,
                currentAdTier === tier && styles.tierButtonActive
              ]}
              onPress={() => setAdTier(tier)}
            >
              <Text style={styles.tierButtonText}>{tier.replace("_", " ")}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>Ads Watched</Text>
          <Text style={styles.debugValue}>{totalAdsWatched}</Text>
        </View>
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>Wallet Cash (30%)</Text>
          <Text style={styles.debugValue}>${walletCashBalance.toFixed(4)}</Text>
        </View>
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>ARPG Progress (30%)</Text>
          <Text style={styles.debugValue}>
            ${arpgShareAccumulated.toFixed(4)} / $0.20
          </Text>
        </View>
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>Mega Pool (30%)</Text>
          <Text style={styles.debugValue}>${megaPoolAccumulated.toFixed(4)}</Text>
        </View>

        <View style={styles.autoRow}>
          <Text style={styles.debugLabel}>Auto Simulate (every 2s)</Text>
          <Switch value={isAutoSimulating} onValueChange={setAutoSimulating} />
        </View>

        <SimulateAdButton />
      </View>

      <ARPGCongratsModalWithMeasure
        visible={showArpgCongrats}
        onOkPress={handleOkPress}
      />

      {floatAnim && (
        <FloatingArpgText
          fromX={floatAnim.fromX}
          fromY={floatAnim.fromY}
          toX={floatAnim.toX}
          toY={floatAnim.toY}
          onComplete={handleFloatComplete}
        />
      )}
    </SafeAreaView>
  );
};

const ARPGCongratsModalWithMeasure = ({ visible, onOkPress }) => {
  const okRef = useRef(null);

  return (
    <ARPGCongratsModal
      visible={visible}
      onOkPress={() => onOkPress(okRef.current)}
      okRef={okRef}
    />
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F0F1E"
  },
  body: {
    flex: 1,
    padding: 20
  },
  debugTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16
  },
  sectionLabel: {
    color: "#AAAAC0",
    fontSize: 12,
    marginBottom: 8
  },
  tierRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8
  },
  tierButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#26264A"
  },
  tierButtonActive: {
    backgroundColor: "#FFD700"
  },
  tierButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12
  },
  debugRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#26264A"
  },
  debugLabel: {
    color: "#AAAAC0",
    fontSize: 13
  },
  debugValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600"
  },
  autoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12
  }
});

export default Phase1TestScreen;
