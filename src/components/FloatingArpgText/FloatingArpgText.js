import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";

const FloatingArpgText = ({ fromX, fromY, toX, toY, amount, onComplete }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true
    }).start(() => {
      onComplete && onComplete();
    });
  }, []);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [fromX, toX] });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [fromY, toY] });
  const scale = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.3, 0.6] });
  const opacity = progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { transform: [{ translateX }, { translateY }, { scale }], opacity }
      ]}
    >
      <Text style={styles.text}>+{amount} ARPG</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { position: "absolute", zIndex: 999 },
  text: { color: "#FFD700", fontWeight: "800", fontSize: 16 }
});

export default FloatingArpgText;
