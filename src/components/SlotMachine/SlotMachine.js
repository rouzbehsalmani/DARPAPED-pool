import React, { useRef, useState } from "react";
import { View, Text, Animated, Easing, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { pickWeighted } from "../../utils/weightedRandom";
import { FONTS } from "../../theme/theme";

const WIN_CHANCE = 0.22;
const RESULT_SUSPENSE_MS = 350;
const ITEM_HEIGHT = 80;
const TICK_MS = 150; // slower, smoother steps than before

// symbolWeights: [{ symbol, weight }]   prizeMap: { [symbol]: prize }
// zeroDud: if true, every pull is forced into a 3-match (VIP variant).
//
// Each reel is a real ANIMATED scrolling strip - a fixed array of 4 symbols
// [hidden-above, top, middle, bottom] that smoothly slides down by exactly
// one slot per tick (via Animated.timing, not an instant state swap): the
// bottom symbol exits, middle becomes bottom, top becomes middle, and the
// hidden-above symbol slides into view as the new top. A brand new random
// symbol is then queued into the hidden slot for the next tick. This is
// what gives the "fixed symbols flowing past a window" feel instead of
// everything flickering to new random values every frame.
const SlotMachine = ({ symbolWeights, prizeMap, onResult, zeroDud, disabled }) => {
  const symbols = symbolWeights.map((s) => s.symbol);
  const randomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];
  const weightedSymbol = () =>
    pickWeighted(symbolWeights.map((s) => ({ value: s.symbol, weight: s.weight })));

  const [reels, setReels] = useState([
    [symbols[0], symbols[0], symbols[0], symbols[0]],
    [symbols[0], symbols[0], symbols[0], symbols[0]],
    [symbols[0], symbols[0], symbols[0], symbols[0]]
  ]);
  const [spinning, setSpinning] = useState(false);
  const scrollAnims = useRef([
    new Animated.Value(-ITEM_HEIGHT),
    new Animated.Value(-ITEM_HEIGHT),
    new Animated.Value(-ITEM_HEIGHT)
  ]).current;

  // Runs one reel's full spin: a series of smooth one-slot shifts, landing
  // `finalSymbol` in the middle exactly two ticks before the reel stops
  // (since a value queued into the hidden slot takes two shifts to reach
  // the middle position).
  const runReel = (reelIndex, finalSymbol, duration, onSettled) => {
    const totalTicks = Math.max(4, Math.round(duration / TICK_MS));
    let tick = 0;

    const stepOnce = () => {
      tick += 1;
      const isInjectTick = tick === totalTicks - 2;
      const isLastTick = tick === totalTicks;
      const nextValue = isInjectTick ? finalSymbol : randomSymbol();

      scrollAnims[reelIndex].setValue(-ITEM_HEIGHT);
      Animated.timing(scrollAnims[reelIndex], {
        toValue: 0,
        duration: TICK_MS,
        easing: Easing.linear,
        useNativeDriver: true
      }).start(() => {
        setReels((prev) => {
          const next = [...prev];
          next[reelIndex] = [nextValue, ...prev[reelIndex].slice(0, 3)];
          return next;
        });
        scrollAnims[reelIndex].setValue(-ITEM_HEIGHT);

        if (isLastTick) {
          onSettled();
        } else {
          stepOnce();
        }
      });
    };

    stepOnce();
  };

  const pull = () => {
    if (spinning || disabled) return;
    setSpinning(true);

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

    let settledCount = 0;
    const onReelSettled = () => {
      settledCount += 1;
      if (settledCount === 3) {
        setTimeout(() => {
          setSpinning(false);
          const isWin = finalMiddles[0] === finalMiddles[1] && finalMiddles[1] === finalMiddles[2];
          if (isWin) {
            onResult(prizeMap[finalMiddles[0]], { symbol: finalMiddles[0] });
          } else {
            onResult({ type: "dud", amount: 0 }, null);
          }
        }, RESULT_SUSPENSE_MS);
      }
    };

    [0, 1, 2].forEach((reelIndex) => {
      const duration = 1400 + reelIndex * 700;
      runReel(reelIndex, finalMiddles[reelIndex], duration, onReelSettled);
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.reelsRow}>
        {reels.map((strip, i) => (
          <View key={i} style={styles.reel}>
            <View style={styles.viewport}>
              <Animated.View style={{ transform: [{ translateY: scrollAnims[i] }] }}>
                {strip.map((sym, idx) => (
                  <View key={idx} style={styles.itemSlot}>
                    <Text style={styles.symbolText}>{sym}</Text>
                  </View>
                ))}
              </Animated.View>
              <View style={styles.paylineOverlay} pointerEvents="none" />
            </View>
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
    height: ITEM_HEIGHT * 3 + 30,
    backgroundColor: "#26264A",
    borderRadius: 14,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#FFD700",
    paddingVertical: 15,
    overflow: "hidden"
  },
  viewport: { height: ITEM_HEIGHT * 3, width: "100%", overflow: "hidden" },
  itemSlot: { height: ITEM_HEIGHT, alignItems: "center", justifyContent: "center" },
  symbolText: { fontSize: 34 },
  paylineOverlay: {
    position: "absolute",
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: "rgba(255,215,0,0.10)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,215,0,0.35)"
  },
  lever: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 16 },
  leverDisabled: { opacity: 0.5 },
  leverText: { color: "#FFFFFF", fontFamily: FONTS.bold, fontSize: 15 }
});

export default SlotMachine;

// FILE LOCATION: src/components/SlotMachine/SlotMachine.js (REPLACE existing file)
