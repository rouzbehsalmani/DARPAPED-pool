import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pickWeighted } from "../../utils/weightedRandom";
import { FONTS } from "../../theme/theme";

const WIN_CHANCE = 0.22;
const RESULT_SUSPENSE_MS = 350; // brief pause after the last reel stops, before the result fires

// symbolWeights: [{ symbol, weight }]   prizeMap: { [symbol]: prize }
// zeroDud: if true, every pull is forced into a 3-match (VIP variant).
//
// Each reel is a real scrolling strip, not 3 independently-randomized
// slots: every tick shifts the whole strip down by one - the bottom symbol
// exits, the middle symbol becomes the new bottom, the top symbol becomes
// the new middle, and one fresh symbol enters at the top. That's what
// gives it the "fixed symbols flowing past a window" feel of a real
// mechanical reel instead of random flicker.
const SlotMachine = ({ symbolWeights, prizeMap, onResult, zeroDud, disabled }) => {
  const symbols = symbolWeights.map((s) => s.symbol);
  const randomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];
  const weightedSymbol = () =>
    pickWeighted(symbolWeights.map((s) => ({ value: s.symbol, weight: s.weight })));

  const [reels, setReels] = useState([
    [symbols[0], symbols[0], symbols[0]],
    [symbols[0], symbols[0], symbols[0]],
    [symbols[0], symbols[0], symbols[0]]
  ]);
  const [spinning, setSpinning] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  // Shifts one reel's strip down by one slot: new symbol enters at top,
  // everything else moves down one, old bottom symbol exits.
  const shiftDown = (strip, newTop) => [newTop, strip[0], strip[1]];

  const pull = () => {
    if (spinning || disabled) return;
    setSpinning(true);
    clearTimers();

    let finalMiddles;
    if (zeroDud || Math.random() < WIN_CHANCE) {
      const winningSymbol = weightedSymbol();
      finalMiddles = [winningSymbol, winningSymbol, winningSymbol];
    } else {
      finalMiddles = [0, 1, 2].map(() => randomSymbol());
      if (finalMiddles[0] === finalMiddles[1] && finalMiddles[1] === finalMiddles[2]) {
        finalMiddles[2] = symbols[(symbols.indexOf(finalMiddles[2]) + 1) % symbols.length];
      }
    }

    [0, 1, 2].forEach((reelIndex) => {
      const spinDuration = 900 + reelIndex * 600;
      const interval = 90;
      let elapsed = 0;

      const cycle = () => {
        elapsed += interval;

        if (elapsed >= spinDuration) {
          // Final shift places the real result into the middle slot, still
          // continuing the same downward-flowing motion (no jarring jump).
          setReels((prev) => {
            const next = [...prev];
            next[reelIndex] = shiftDown(prev[reelIndex], randomSymbol());
            next[reelIndex][1] = finalMiddles[reelIndex];
            return next;
          });
          if (reelIndex === 2) {
            timers.current.push(
              setTimeout(() => {
                setSpinning(false);
                const isWin = finalMiddles[0] === finalMiddles[1] && finalMiddles[1] === finalMiddles[2];
                if (isWin) {
                  onResult(prizeMap[finalMiddles[0]], { symbol: finalMiddles[0] });
                } else {
                  onResult({ type: "dud", amount: 0 }, null);
                }
              }, RESULT_SUSPENSE_MS)
            );
          }
          return;
        }

        setReels((prev) => {
          const next = [...prev];
          next[reelIndex] = shiftDown(prev[reelIndex], randomSymbol());
          return next;
        });
        timers.current.push(setTimeout(cycle, interval));
      };
      timers.current.push(setTimeout(cycle, interval));
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.reelsRow}>
        {reels.map((strip, i) => (
          <View key={i} style={styles.reel}>
            <Text style={styles.symbolGhost}>{strip[0]}</Text>
            <View style={styles.paylineRow}>
              <Text style={styles.symbolMain}>{strip[1]}</Text>
            </View>
            <Text style={styles.symbolGhost}>{strip[2]}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={pull}
        disabled={spinning || disabled}
        activeOpacity={0.85}
        style={(spinning || disabled) && styles.leverDisabled}
      >
        <LinearGradient colors={["#F16B6B", "#C23E3E"]} style={styles.lever}>
          <Text style={styles.leverText}>{spinning ? "Spinning..." : "Pull Lever"}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", paddingVertical: 20 },
  reelsRow: { flexDirection: "row", marginBottom: 24 },
  reel: {
    width: 78,
    height: 270,
    backgroundColor: "#26264A",
    borderRadius: 14,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FFD700",
    paddingVertical: 14,
    overflow: "hidden"
  },
  symbolGhost: { fontSize: 30, opacity: 0.35 },
  paylineRow: {
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "rgba(255,215,0,0.10)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,215,0,0.35)"
  },
  symbolMain: { fontSize: 40 },
  lever: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 16 },
  leverDisabled: { opacity: 0.5 },
  leverText: { color: "#FFFFFF", fontFamily: FONTS.bold, fontSize: 15 }
});

export default SlotMachine;

// FILE LOCATION: src/components/SlotMachine/SlotMachine.js (REPLACE existing file)
