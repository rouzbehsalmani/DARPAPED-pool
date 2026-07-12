import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { pickWeighted } from "../../utils/weightedRandom";

const WIN_CHANCE = 0.22;

// symbolWeights: [{ symbol, weight }]   prizeMap: { [symbol]: prize }
// zeroDud: if true, every pull is forced into a 3-match (VIP variant).
const SlotMachine = ({ symbolWeights, prizeMap, onResult, zeroDud, disabled }) => {
  const symbols = symbolWeights.map((s) => s.symbol);
  const [reels, setReels] = useState([symbols[0], symbols[0], symbols[0]]);
  const [spinning, setSpinning] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  const randomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];
  const weightedSymbol = () =>
    pickWeighted(symbolWeights.map((s) => ({ value: s.symbol, weight: s.weight })));

  const pull = () => {
    if (spinning || disabled) return;
    setSpinning(true);
    clearTimers();

    let finalReels;
    if (zeroDud || Math.random() < WIN_CHANCE) {
      const winningSymbol = weightedSymbol();
      finalReels = [winningSymbol, winningSymbol, winningSymbol];
    } else {
      finalReels = [0, 1, 2].map(() => randomSymbol());
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        finalReels[2] = symbols[(symbols.indexOf(finalReels[2]) + 1) % symbols.length];
      }
    }

    [0, 1, 2].forEach((reelIndex) => {
      const spinDuration = 600 + reelIndex * 350;
      const interval = 70;
      let elapsed = 0;

      const cycle = () => {
        elapsed += interval;
        setReels((prev) => {
          const next = [...prev];
          next[reelIndex] = randomSymbol();
          return next;
        });

        if (elapsed >= spinDuration) {
          setReels((prev) => {
            const next = [...prev];
            next[reelIndex] = finalReels[reelIndex];
            return next;
          });
          if (reelIndex === 2) {
            setSpinning(false);
            const isWin = finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2];
            if (isWin) {
              onResult(prizeMap[finalReels[0]], { symbol: finalReels[0] });
            } else {
              onResult({ type: "dud", amount: 0 }, null);
            }
          }
          return;
        }
        timers.current.push(setTimeout(cycle, interval));
      };
      timers.current.push(setTimeout(cycle, interval));
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.reelsRow}>
        {reels.map((symbol, i) => (
          <View key={i} style={styles.reel}>
            <Text style={styles.reelText}>{symbol}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.lever, (spinning || disabled) && styles.leverDisabled]}
        onPress={pull}
        disabled={spinning || disabled}
        activeOpacity={0.85}
      >
        <Text style={styles.leverText}>{spinning ? "Spinning..." : "Pull Lever"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", paddingVertical: 20 },
  reelsRow: { flexDirection: "row", marginBottom: 24 },
  reel: {
    width: 78,
    height: 90,
    backgroundColor: "#26264A",
    borderRadius: 14,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFD700"
  },
  reelText: { fontSize: 34 },
  lever: { backgroundColor: "#E05555", paddingHorizontal: 36, paddingVertical: 14, borderRadius: 16 },
  leverDisabled: { opacity: 0.5 },
  leverText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 }
});

export default SlotMachine;

// FILE LOCATION: src/components/SlotMachine/SlotMachine.js (REPLACE existing file)
