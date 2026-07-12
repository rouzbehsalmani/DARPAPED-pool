import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSettingsStore } from "../src/store/settingsStore";
import { getVipPlans, purchaseVip, restorePurchases } from "../src/services/iapService";

const formatExpiry = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString();
};

export default function SubscriptionRoute() {
  const isVip = useSettingsStore((s) => s.isVip);
  const vipPlanId = useSettingsStore((s) => s.vipPlanId);
  const vipExpiresAt = useSettingsStore((s) => s.vipExpiresAt);
  const activateVip = useSettingsStore((s) => s.activateVip);
  const cancelVip = useSettingsStore((s) => s.cancelVip);
  const checkVipExpiry = useSettingsStore((s) => s.checkVipExpiry);

  const [purchasingPlanId, setPurchasingPlanId] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const plans = getVipPlans();

  useEffect(() => {
    checkVipExpiry();
  }, []);

  const handlePurchase = (planId) => {
    if (purchasingPlanId) return;
    setPurchasingPlanId(planId);
    purchaseVip(planId).then((result) => {
      setPurchasingPlanId(null);
      if (result.success) {
        activateVip(result.planId, result.expiresAt);
      }
    });
  };

  const handleRestore = () => {
    if (restoring) return;
    setRestoring(true);
    restorePurchases().then(() => {
      setRestoring(false);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <Text style={styles.title}>VIP Pass</Text>

        <View style={styles.card}>
          <Text style={styles.statusLabel}>Current Status</Text>
          <Text style={[styles.statusValue, { color: isVip ? "#FFD700" : "#AAAAC0" }]}>
            {isVip ? "VIP ACTIVE" : "STANDARD"}
          </Text>
          {isVip && vipExpiresAt && (
            <Text style={styles.expiryNote}>
              Plan: {vipPlanId} - renews/expires {formatExpiry(vipExpiresAt)}
            </Text>
          )}
          <Text style={styles.note}>
            VIP Pass removes ads and unlocks zero-dud versions of every mini-game.
          </Text>
        </View>

        {!isVip &&
          plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, !!purchasingPlanId && styles.planCardDisabled]}
              onPress={() => handlePurchase(plan.id)}
              disabled={!!purchasingPlanId}
            >
              <View>
                <Text style={styles.planLabel}>{plan.label}</Text>
                <Text style={styles.planPrice}>{plan.priceLabel}</Text>
              </View>
              {purchasingPlanId === plan.id ? (
                <ActivityIndicator color="#1A1A2E" />
              ) : (
                <Text style={styles.planCta}>Subscribe</Text>
              )}
            </TouchableOpacity>
          ))}

        {isVip && (
          <TouchableOpacity style={styles.dangerButton} onPress={cancelVip}>
            <Text style={styles.actionText}>Cancel VIP Pass</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={restoring}>
          <Text style={styles.restoreText}>{restoring ? "Restoring..." : "Restore Purchases"}</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          TEST MODE - purchases are simulated locally. Real billing (App Store / Play
          Store / RevenueCat) plugs into src/services/iapService.js in Phase 9/10.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { flex: 1, padding: 20 },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFD700"
  },
  statusLabel: { color: "#AAAAC0", fontSize: 12, marginBottom: 6 },
  statusValue: { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  expiryNote: { color: "#77779A", fontSize: 11, marginBottom: 10 },
  note: { color: "#77779A", fontSize: 12, lineHeight: 18 },
  planCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#26264A"
  },
  planCardDisabled: { opacity: 0.7 },
  planLabel: { color: "#FFD700", fontSize: 15, fontWeight: "700" },
  planPrice: { color: "#AAAAC0", fontSize: 12, marginTop: 2 },
  planCta: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10
  },
  dangerButton: {
    backgroundColor: "#E05555",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12
  },
  actionText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  restoreButton: { alignItems: "center", paddingVertical: 10, marginBottom: 16 },
  restoreText: { color: "#77779A", fontSize: 13, fontWeight: "600", textDecorationLine: "underline" },
  disclaimer: { color: "#77779A", fontSize: 11, textAlign: "center" }
});

// FILE LOCATION: app/subscription.js (REPLACE existing file)
