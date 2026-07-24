import React from "react";
import Svg from "react-native-svg";
import { getGameIconShapes } from "./gameIconShapes";

// gameId: "spin-wheel" | "scratch-card" | "slot-machine" | "lucky-chests"
// locked: renders in a muted grayscale palette instead of the gold accent
const GameIcon = ({ gameId, size = 30, locked = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {getGameIconShapes(gameId, locked)}
  </Svg>
);

export default GameIcon;

// FILE LOCATION: src/components/GameIcon/GameIcon.js (NEW file)
