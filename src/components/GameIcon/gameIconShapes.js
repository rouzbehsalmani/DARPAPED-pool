import React from "react";
import { Circle, Rect, Path, Line } from "react-native-svg";

// Returns the inner SVG shapes for a given mini-game, drawn inside a 24x24
// coordinate box - same convention as MaterialIcon's materialIconShapes.js.
// `locked` swaps every color to a muted gray palette (used for VIP games
// a non-VIP user can't play yet) instead of the game's normal accent color.
export function getGameIconShapes(gameId, locked) {
  const accent = locked ? "#5A5A72" : "#FFD700";
  const accentDeep = locked ? "#45455A" : "#B8860B";
  const base = locked ? "#3A3A4A" : "#26264A";
  const baseLine = locked ? "#54546A" : "#8C8C9A";

  switch (gameId) {
    case "spin-wheel":
      return (
        <>
          <Circle cx="12" cy="12" r="10" fill={base} stroke={accent} strokeWidth="1.6" />
          <Line x1="12" y1="12" x2="12" y2="2.6" stroke={baseLine} strokeWidth="1.4" />
          <Line x1="12" y1="12" x2="19.7" y2="7.3" stroke={baseLine} strokeWidth="1.4" />
          <Line x1="12" y1="12" x2="19.7" y2="16.7" stroke={baseLine} strokeWidth="1.4" />
          <Line x1="12" y1="12" x2="12" y2="21.4" stroke={baseLine} strokeWidth="1.4" />
          <Line x1="12" y1="12" x2="4.3" y2="16.7" stroke={baseLine} strokeWidth="1.4" />
          <Line x1="12" y1="12" x2="4.3" y2="7.3" stroke={baseLine} strokeWidth="1.4" />
          <Circle cx="12" cy="12" r="3.2" fill={accent} stroke={accentDeep} strokeWidth="1" />
        </>
      );
    case "scratch-card":
      return (
        <>
          <Rect x="3" y="5" width="18" height="14" rx="2.5" fill={base} stroke={accent} strokeWidth="1.4" />
          <Path d="M6 15 L11 8 L15 13 L18 9" stroke={baseLine} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="16.5" cy="7.5" r="1.4" fill={accent} />
        </>
      );
    case "slot-machine":
      return (
        <>
          <Rect x="3" y="4" width="18" height="16" rx="2.5" fill={base} stroke={accent} strokeWidth="1.4" />
          <Line x1="9" y1="4" x2="9" y2="20" stroke={baseLine} strokeWidth="1" />
          <Line x1="15" y1="4" x2="15" y2="20" stroke={baseLine} strokeWidth="1" />
          <Rect x="5" y="10" width="2.6" height="4" rx="0.5" fill={accent} />
          <Rect x="10.7" y="10" width="2.6" height="4" rx="0.5" fill={accent} />
          <Rect x="16.4" y="10" width="2.6" height="4" rx="0.5" fill={accent} />
        </>
      );
    case "lucky-chests":
      return (
        <>
          <Rect x="3.5" y="10" width="17" height="9.5" rx="1.8" fill={base} stroke={accent} strokeWidth="1.4" />
          <Path d="M3.5 10 Q12 4 20.5 10" fill={base} stroke={accent} strokeWidth="1.4" />
          <Rect x="10.5" y="10" width="3" height="5.5" fill={accentDeep} />
          <Circle cx="12" cy="12.2" r="1.1" fill={accent} />
        </>
      );
    default:
      return <Circle cx="12" cy="12" r="10" fill={base} stroke={accent} strokeWidth="1.4" />;
  }
}

// FILE LOCATION: src/components/GameIcon/gameIconShapes.js (NEW file)
