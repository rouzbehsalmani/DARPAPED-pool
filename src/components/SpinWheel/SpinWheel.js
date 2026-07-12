import React, { useRef, useState } from "react";
import { View, Text, Animated, Easing, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";
import { pickWeightedIndex } from "../../utils/weightedRandom";

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 6;

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

// A real circular wheel drawn with SVG wedges. Each wedge's visual size is
// proportional to its `weight`, and the winning wedge is selected using the
// exact same weights - so what the player sees always matches the real odds.
// segments: [{ label, color, weight, prize }]
const SpinWheel = ({ segments, onResult, disabled }) => {
  const [spinning, setSpinning] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const currentRotationRef = useRef(0);

  const totalWeight = segments.reduce((sum, s) => sum + s.weight, 0);
  let cumulative = 0;
  const wedges = segments.map((seg) => {
    const startAngle = cumulative;
    const angleSize = (seg.weight / totalWeight) * 360;
    cumulative += angleSize;
    return { ...seg, startAngle, endAngle: cumulative, angleSize };
  });

  const spin = () => {
    if (spinning || disabled) return;
    setSpinning(true);

    const winnerIndex = pickWeightedIndex(segments.map((s) => s.weight));
    const winner = wedges[winnerIndex];
    const midAngle = winner.startAngle + winner.angleSize / 2;

    const extraSpins = 5;
    const normalizedTarget = (360 - midAngle) % 360;
    const target = currentRotationRef.current + extraSpins * 360 + normalizedTarget;

    Animated.timing(rotation, {
      toValue: target,
      duration: 3600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(() => {
      currentRotationRef.current = target;
      setSpinning(false);
      onResult(winner.prize, winner);
    });
  };

  const spinDeg = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.wheelArea}>
        <View style={styles.pointer} />
        <Animated.View style={{ transform: [{ rotate: spinDeg }] }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {wedges.map((seg, i) => {
              const mid = seg.startAngle + seg.angleSize / 2;
              const labelPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.62, mid);
              return (
                <React.Fragment key={i}>
                  <Path
                    d={describeWedge(CENTER, CENTER, RADIUS, seg.startAngle, seg.endAngle)}
                    fill={seg.color}
                    stroke="#0F0F1E"
                    strokeWidth={2}
                  />
                  <SvgText
                    x={labelPos.x}
                    y={labelPos.y}
                    fill="#0F0F1E"
                    fontSize="10"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {seg.label}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </Animated.View>
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
    borderTopColor: "#FFD700"
  },
  hub: {
    position: "absolute",
    top: SIZE / 2 - 28,
    left: SIZE / 2 - 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0F0F1E",
    borderWidth: 2,
    borderColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center"
  },
  hubText: { color: "#FFD700", fontWeight: "800", fontSize: 11 },
  spinButton: { backgroundColor: "#FFD700", paddingHorizontal: 36, paddingVertical: 14, borderRadius: 16 },
  spinButtonDisabled: { opacity: 0.5 },
  spinButtonText: { color: "#1A1A2E", fontWeight: "800", fontSize: 15 }
});

export default SpinWheel;

// FILE LOCATION: src/components/SpinWheel/SpinWheel.js (REPLACE existing file)
// REQUIRES: react-native-svg (see setup command in the reply)
