import React, { useRef, useState } from "react";
import { View, Text, Animated, Easing, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { pickWeightedIndex } from "../../utils/weightedRandom";
import MaterialIcon from "../MaterialIcon/MaterialIcon";
import { COLORS, GRADIENTS, FONTS } from "../../theme/theme";

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 6;
const LABEL_RADIUS = RADIUS * 0.82;
const LABEL_BOX = 40;

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeWedge = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

// A real circular wheel with EQUAL-SIZED wedges. Odds live only in each
// segment's `weight`.
//
// resolveWinner (optional): an async function returning { winnerIndex,
// prize } from a server (see src/services/gameApi.js) - when provided and
// it returns a result, THAT winner is used and its `prize` is what gets
// awarded (server-authoritative). When absent, not configured yet, or the
// call fails, falls back to the same local weighted pick as always, so
// nothing breaks before you wire up a backend.
const SpinWheel = ({ segments, onResult, disabled, resolveWinner }) => {
  const [spinning, setSpinning] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const currentRotationRef = useRef(0);

  const sliceAngle = 360 / segments.length;
  const wedges = segments.map((seg, i) => ({
    ...seg,
    startAngle: i * sliceAngle,
    endAngle: (i + 1) * sliceAngle
  }));

  const spin = async () => {
    if (spinning || disabled) return;
    setSpinning(true);

    let winnerIndex;
    let remotePrize = null;
    if (resolveWinner) {
      const remote = await resolveWinner();
      if (remote && typeof remote.winnerIndex === "number") {
        winnerIndex = remote.winnerIndex;
        remotePrize = remote.prize;
      }
    }
    if (winnerIndex === undefined) {
      winnerIndex = pickWeightedIndex(segments.map((s) => s.weight));
    }

    const winner = wedges[winnerIndex];
    const midAngle = winner.startAngle + sliceAngle / 2;

    const currentVisual = ((currentRotationRef.current % 360) + 360) % 360;
    const desiredVisual = (360 - midAngle) % 360;
    let delta = desiredVisual - currentVisual;
    if (delta < 0) delta += 360;

    const extraSpins = 7;
    const target = currentRotationRef.current + extraSpins * 360 + delta;

    Animated.timing(rotation, {
      toValue: target,
      duration: 6200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(() => {
      currentRotationRef.current = target;
      setSpinning(false);
      onResult(remotePrize || winner.prize, winner);
    });
  };

  const spinDeg = rotation.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "360deg"] });
  const counterSpinDeg = rotation.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "-360deg"] });

  return (
    <View style={styles.wrapper}>
      <View style={styles.wheelArea}>
        <View style={styles.pointer} />
        <Animated.View style={{ transform: [{ rotate: spinDeg }] }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {wedges.map((seg, i) => (
              <Path
                key={i}
                d={describeWedge(CENTER, CENTER, RADIUS, seg.startAngle, seg.endAngle)}
                fill={seg.color}
                stroke="#0F0F1E"
                strokeWidth={2}
              />
            ))}
          </Svg>

          {wedges.map((seg, i) => {
            const mid = seg.startAngle + sliceAngle / 2;
            const pos = polarToCartesian(CENTER, CENTER, LABEL_RADIUS, mid);
            return (
              <Animated.View
                key={i}
                style={[
                  styles.labelBox,
                  { left: pos.x - LABEL_BOX / 2, top: pos.y - LABEL_BOX / 2, transform: [{ rotate: counterSpinDeg }] }
                ]}
                pointerEvents="none"
              >
                <MaterialIcon type={seg.icon} size={18} />
                {seg.amount != null && <Text style={styles.labelAmount}>{seg.amount}</Text>}
              </Animated.View>
            );
          })}
        </Animated.View>
        <View style={styles.hub}>
          <Text style={styles.hubText}>SPIN</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={spin}
        disabled={spinning || disabled}
        activeOpacity={0.85}
        style={(spinning || disabled) && styles.spinButtonDisabled}
      >
        <LinearGradient colors={GRADIENTS.gold} style={styles.spinButton}>
          <Text style={styles.spinButtonText}>{spinning ? "Spinning..." : "Spin the Wheel"}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  wheelArea: { width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  pointer: {
    position: "absolute",
    top: -4,
    zIndex: 5,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COLORS.gold
  },
  labelBox: { position: "absolute", width: LABEL_BOX, height: LABEL_BOX, alignItems: "center", justifyContent: "center" },
  labelAmount: { color: "#0F0F1E", fontFamily: FONTS.bold, fontSize: 11, marginTop: 1 },
  hub: {
    position: "absolute",
    top: SIZE / 2 - 28,
    left: SIZE / 2 - 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0F0F1E",
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center"
  },
  hubText: { color: COLORS.gold, fontFamily: FONTS.bold, fontSize: 11 },
  spinButton: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 16 },
  spinButtonDisabled: { opacity: 0.5 },
  spinButtonText: { color: "#1A1A2E", fontFamily: FONTS.bold, fontSize: 15 }
});

export default SpinWheel;

// FILE LOCATION: src/components/SpinWheel/SpinWheel.js (REPLACE existing file)
