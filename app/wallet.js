import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useEconomyStore } from "../src/store/economyStore";
import {
  TOPUP_OPTIONS,
  WITHDRAWAL_METHODS,
  initiateTopUp,
  submitWithdrawal
} from "../src/services/paymentService";

export default function WalletRoute() {
  const walletCashBalance = useEconomyStore((s) => s.walletCashBalance);
  const withdrawalRequests = useEconomyStore((s) => s.withdrawalRequests);
  const topUpBalance = useEconomyStore((s) => s.topUpBalance);
  const requestWithdrawal = useEconomyStore((s) => s.requestWithdrawal);

  const [topUpLoading, setTopUpLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(WITHDRAWAL_METHODS[0].id);
  const [destination, setDestination] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);

  const handleTopUp = (amount) => {
    if (topUpLoading) return;
    setTopUpLoading(true);
    initiateTopUp(amount).then((result) => {
      setTopUpLoading(false);
      if (result.success) {
        topUpBalance(result.amountUsd);
      }
    });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    setWithdrawError(null);

    if (!amount || amount <= 0) {
      setWithdrawError("Enter a valid amount");
      return;
    }
    if (amount > walletCashBalance) {
      setWithdrawError("Amount exceeds your balance");
      return;
    }
    if (!destination.trim()) {
      setWithdrawError("Enter a destination (email / account / wallet address)");
      return;
    }

    setWithdrawLoading(true);
    submitWithdrawal(amount, selectedMethod, destination.trim()).then((result) => {
      setWithdrawLoading(false);
      if (result.success) {
        requestWithdrawal(amount, selectedMethod, destination.trim());
        setWithdrawAmount("");
        setDestination("");
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Wallet</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Cash Balance</Text>
          <Text style={styles.balanceValue}>${walletCashBalance.toFixed(4)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Top Up Balance</Text>
        <Text style={styles.testBadge}>TEST MODE - no real payment is charged</Text>
        <View style={styles.topUpRow}>
          {TOPUP_OPTIONS.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.topUpButton}
              onPress={() => handleTopUp(amount)}
              disabled={topUpLoading}
            >
              <Text style={styles.topUpButtonText}>+${amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {topUpLoading && <ActivityIndicator color="#FFD700" style={styles.spinner} />}

        <Text style={styles.sectionTitle}>Request Withdrawal</Text>
        <View style={styles.methodRow}>
          {WITHDRAWAL_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodChip, selectedMethod === method.id && styles.methodChipActive]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <Text
                style={[styles.methodChipText, selectedMethod === method.id && styles.methodChipTextActive]}
              >
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Amount (USD)"
          placeholderTextColor="#77779A"
          keyboardType="decimal-pad"
          value={withdrawAmount}
          onChangeText={setWithdrawAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination (email / account / wallet address)"
          placeholderTextColor="#77779A"
          value={destination}
          onChangeText={setDestination}
        />
        {withdrawError && <Text style={styles.errorText}>{withdrawError}</Text>}
        <TouchableOpacity
          style={[styles.actionButton, withdrawLoading && styles.actionButtonDisabled]}
          onPress={handleWithdraw}
          disabled={withdrawLoading}
        >
          <Text style={styles.actionText}>
            {withdrawLoading ? "Submitting..." : "Submit Withdrawal Request"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Withdrawal History</Text>
        {withdrawalRequests.length === 0 ? (
          <Text style={styles.emptyState}>No withdrawal requests yet.</Text>
        ) : (
          withdrawalRequests.map((req) => (
            <View key={req.id} style={styles.historyRow}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyAmount}>${req.amountUsd.toFixed(2)}</Text>
                <Text style={styles.historySub}>
                  {req.methodId} - {req.destination}
                </Text>
              </View>
              <Text style={styles.historyStatus}>{req.status}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { padding: 20 },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 20 },
  balanceCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FFD700"
  },
  balanceLabel: { color: "#AAAAC0", fontSize: 12, marginBottom: 6 },
  balanceValue: { color: "#FFD700", fontSize: 28, fontWeight: "800" },
  sectionTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", marginTop: 8, marginBottom: 8 },
  testBadge: { color: "#77779A", fontSize: 11, marginBottom: 10 },
  topUpRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 4 },
  topUpButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    marginBottom: 10
  },
  topUpButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  spinner: { marginBottom: 12 },
  methodRow: { flexDirection: "row", marginBottom: 12 },
  methodChip: {
    backgroundColor: "#1A1A2E",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#26264A"
  },
  methodChipActive: { borderColor: "#FFD700", backgroundColor: "#26264A" },
  methodChipText: { color: "#AAAAC0", fontSize: 12, fontWeight: "600" },
  methodChipTextActive: { color: "#FFD700" },
  input: {
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#26264A",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFFFFF",
    marginBottom: 10,
    fontSize: 13
  },
  errorText: { color: "#E05555", fontSize: 12, marginBottom: 10 },
  actionButton: {
    backgroundColor: "#FFD700",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24
  },
  actionButtonDisabled: { opacity: 0.6 },
  actionText: { color: "#1A1A2E", fontWeight: "700", fontSize: 14 },
  emptyState: { color: "#77779A", fontSize: 12, marginBottom: 20 },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#26264A"
  },
  historyInfo: { flex: 1, paddingRight: 12 },
  historyAmount: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  historySub: { color: "#77779A", fontSize: 11, marginTop: 2 },
  historyStatus: { color: "#FFD700", fontSize: 12, fontWeight: "700", textTransform: "uppercase" }
});

// FILE LOCATION: app/wallet.js (REPLACE existing file)
