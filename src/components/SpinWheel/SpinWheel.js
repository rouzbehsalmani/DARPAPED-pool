import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RADIUS = 105;

// Renders a circular 8-segment wheel using positioned chips (no external
// SVG dependency required). "Spinning" is simulated by cycling the
// highlighted segment with an accelerating-then-decelerating interval that
// lands exactly on a randomly pre-selected winning segment.
const SpinWheel = ({ segments, onResult, disabled }) => {
  const [spinning, setSpinning] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const timeoutRef = useRef(null);

  const spin = () => {
    if (spinning || disabled) return;
    setSpinning(true);

    const winnerIndex = Math.floor(Math.random() * segments.length);
    const fullLoops = segments.length * 3;
    const totalSteps = fullLoops + winnerIndex;
    let steps = 0;
    let delay = 55;

    const tick = () => {
      setHighlightIndex((prev) => (prev + 1) % segments.length);
      steps += 1;
      if (steps >= totalSteps) {
        setSpinning(false);
        const winner = segments[winnerIndex];
        onResult(winner.prize, winner);
        return;
      }
      const remaining = totalSteps - steps;
      delay += remaining < 8 ? 28 : 4;
      timeoutRef.current = setTimeout(tick, delay);
    };
    timeoutRef.current = setTimeout(tick, delay);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.wheelArea}>
        {segments.map((seg, i) => {
          const angle = (i / segments.length) * 2 * Math.PI - Math.PI / 2;
          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);
          const active = i === highlightIndex;
          return (
            <View
              key={seg.id}
              style={[
                styles.segment,
                {
                  backgroundColor: seg.color,
                  transform: [{ translateX: x }, { translateY: y }],
                  opacity: active ? 1 : 0.55,
                  borderWidth: active ? 3 : 0
                }
              ]}
            >
              <Text style={styles.segmentText} numberOfLines={2}>{seg.label}</Text>
            </View>
          );
        })}
        <View style={styles.hub}>
          <Text style={styles.hubText}>SPIN</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.spinButton, (spinning || disabled) && styles.spinButtonDisabled]}
        onPress={spin}
        disabled={spinning || disabled}
        activeOpacity={0.85}
      >
        <Text style={styles.spinButtonText}>{spinning ? "Spinning..." : "Spin the Wheel"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  wheelArea: { width: 260, height: 260, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  segment: {
    position: "absolute",
    width: 78,
    height: 62,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#FFFFFF",
    paddingHorizontal: 4
  },
  segmentText: { color: "#0F0F1E", fontWeight: "700", fontSize: 11, textAlign: "center" },
  hub: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0F0F1E",
    borderWidth: 2,
    borderColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center"
  },
  hubText: { color: "#FFD700", fontWeight: "800", fontSize: 12 },
  spinButton: { backgroundColor: "#FFD700", paddingHorizontal: 36, paddingVertical: 14, borderRadius: 16 },
  spinButtonDisabled: { opacity: 0.5 },
  spinButtonText: { color: "#1A1A2E", fontWeight: "800", fontSize: 15 }
});

export default SpinWheel;

// FILE LOCATION: src/components/SpinWheel/SpinWheel.js (NEW file)
