import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, PanResponder, Image } from "react-native";
import { COLORS, RADIUS, FONTS } from "../../theme/theme";
import coverImage from "../../../assets/scratch-covers/default-cover.png";

const CARD_WIDTH = 270;
const CARD_HEIGHT = 200;
const ZONE_COLS = 3;
const ZONE_ROWS = 2;
const ZONE_COUNT = ZONE_COLS * ZONE_ROWS;
const ZONE_WIDTH = CARD_WIDTH / ZONE_COLS;
const ZONE_HEIGHT = CARD_HEIGHT / ZONE_ROWS;

// Fine grid of "foil" tiles laid over the cover image - each tile crops the
// SAME image (via an oversized Image shifted with a negative offset,
// clipped by the tile's own overflow:hidden box), so removing a tile
// reveals the real image underneath at that exact spot instead of just a
// flat color. A circular brush (BRUSH_RADIUS) clears every tile it passes
// over as the finger/mouse drags, like scratching real foil.
const MASK_COLS = 15;
const MASK_ROWS = 11;
const TILE_WIDTH = CARD_WIDTH / MASK_COLS;
const TILE_HEIGHT = CARD_HEIGHT / MASK_ROWS;
const BRUSH_RADIUS = 26;
const COMPLETE_THRESHOLD = 0.62; // card auto-finishes once this much foil is cleared

const buildZones = (icons) => {
  const pool = [];
  while (pool.length < ZONE_COUNT) {
    pool.push(icons[Math.floor(Math.random() * icons.length)]);
  }
  return pool.sort(() => Math.random() - 0.5);
};

// icons: string[]   prizeMap: { [icon]: prize }
// zeroDud: if true and no 3-match occurs once the card is fully scratched,
// a guaranteed fallback prize is still awarded (VIP variant - no dud states).
const ScratchCard = ({ icons, prizeMap, onResult, zeroDud, disabled }) => {
  const [zones, setZones] = useState(() => buildZones(icons));
  const [, setTick] = useState(0);
  const maskRef = useRef(null);
  if (maskRef.current === null) {
    maskRef.current = Array(MASK_COLS * MASK_ROWS).fill(true); // true = still covered
  }
  const revealedCountRef = useRef(0);
  const finishedRef = useRef(false);

  const forceRender = () => setTick((t) => t + 1);

  const resolve = () => {
    const counts = {};
    zones.forEach((icon) => {
      counts[icon] = (counts[icon] || 0) + 1;
    });
    const matchIcon = Object.keys(counts).find((icon) => counts[icon] >= 3);

    if (matchIcon) {
      onResult(prizeMap[matchIcon], { icon: matchIcon });
    } else if (zeroDud) {
      const guaranteed = icons[Math.floor(Math.random() * icons.length)];
      onResult(prizeMap[guaranteed], { icon: guaranteed, guaranteed: true });
    } else {
      onResult({ type: "dud", amount: 0 }, null);
    }
  };

  const scratchAt = (x, y) => {
    if (disabled || finishedRef.current) return;
    const totalTiles = MASK_COLS * MASK_ROWS;
    let changed = false;

    const colMin = Math.max(0, Math.floor((x - BRUSH_RADIUS) / TILE_WIDTH));
    const colMax = Math.min(MASK_COLS - 1, Math.floor((x + BRUSH_RADIUS) / TILE_WIDTH));
    const rowMin = Math.max(0, Math.floor((y - BRUSH_RADIUS) / TILE_HEIGHT));
    const rowMax = Math.min(MASK_ROWS - 1, Math.floor((y + BRUSH_RADIUS) / TILE_HEIGHT));

    for (let row = rowMin; row <= rowMax; row++) {
      for (let col = colMin; col <= colMax; col++) {
        const idx = row * MASK_COLS + col;
        if (!maskRef.current[idx]) continue;
        const cx = col * TILE_WIDTH + TILE_WIDTH / 2;
        const cy = row * TILE_HEIGHT + TILE_HEIGHT / 2;
        const dist = Math.hypot(cx - x, cy - y);
        if (dist <= BRUSH_RADIUS) {
          maskRef.current[idx] = false;
          revealedCountRef.current += 1;
          changed = true;
        }
      }
    }

    if (!changed) return;
    forceRender();

    if (!finishedRef.current && revealedCountRef.current / totalTiles >= COMPLETE_THRESHOLD) {
      finishedRef.current = true;
      maskRef.current = maskRef.current.map(() => false); // clear the rest for a clean finish
      forceRender();
      resolve();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      // Claim the responder immediately and don't let a child (the foil
      // tile <Image>s) steal it - this is what was letting the browser's
      // native "drag this image" gesture hijack the touch instead of our
      // scratch logic. onStartShouldSetPanResponderCapture (capture phase,
      // fires before children) plus pointerEvents="none" on the tiles
      // below is the actual fix.
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt) => scratchAt(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
      onPanResponderMove: (evt) => scratchAt(evt.nativeEvent.locationX, evt.nativeEvent.locationY)
    })
  ).current;

  const resetCard = () => {
    setZones(buildZones(icons));
    maskRef.current = Array(MASK_COLS * MASK_ROWS).fill(true);
    revealedCountRef.current = 0;
    finishedRef.current = false;
    forceRender();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card} {...panResponder.panHandlers}>
        {/* Revealed content: 6 prize zones + thin divider lines */}
        {zones.map((icon, i) => {
          const col = i % ZONE_COLS;
          const row = Math.floor(i / ZONE_COLS);
          return (
            <View
              key={i}
              pointerEvents="none"
              style={[
                styles.zone,
                { left: col * ZONE_WIDTH, top: row * ZONE_HEIGHT, width: ZONE_WIDTH, height: ZONE_HEIGHT }
              ]}
            >
              <Text style={styles.zoneIcon}>{icon}</Text>
            </View>
          );
        })}
        <View pointerEvents="none" style={[styles.dividerV, { left: ZONE_WIDTH }]} />
        <View pointerEvents="none" style={[styles.dividerV, { left: ZONE_WIDTH * 2 }]} />
        <View pointerEvents="none" style={[styles.dividerH, { top: ZONE_HEIGHT }]} />

        {/* Foil mask: small tiles cropping the SAME cover image, removed one
            by one as scratched. pointerEvents="none" is critical here - it
            stops these <Image> tiles from ever receiving the touch/mouse
            event themselves (which is what was triggering the browser's
            native image-drag instead of our scratch gesture). */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: MASK_ROWS }).map((_, row) =>
            Array.from({ length: MASK_COLS }).map((_, col) => {
              const idx = row * MASK_COLS + col;
              if (!maskRef.current[idx]) return null;
              return (
                <View
                  key={idx}
                  style={[
                    styles.maskTile,
                    { left: col * TILE_WIDTH, top: row * TILE_HEIGHT, width: TILE_WIDTH, height: TILE_HEIGHT }
                  ]}
                >
                  <Image
                    source={coverImage}
                    resizeMode="cover"
                    draggable={false}
                    style={{
                      position: "absolute",
                      width: CARD_WIDTH,
                      height: CARD_HEIGHT,
                      left: -col * TILE_WIDTH,
                      top: -row * TILE_HEIGHT
                    }}
                  />
                </View>
              );
            })
          )}
        </View>
      </View>
      <Text style={styles.hint}>Drag across the card to scratch it off</Text>
      {finishedRef.current && (
        <TouchableOpacity style={styles.newCardButton} onPress={resetCard} activeOpacity={0.85}>
          <Text style={styles.newCardText}>Get New Card</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", paddingVertical: 32 },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.bgCard
  },
  zone: { position: "absolute", alignItems: "center", justifyContent: "center" },
  zoneIcon: { fontSize: 30 },
  dividerV: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,255,255,0.12)" },
  dividerH: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.12)" },
  maskTile: { position: "absolute", overflow: "hidden" },
  hint: { color: COLORS.textMuted, fontFamily: FONTS.regular, fontSize: 11, marginTop: 10 },
  newCardButton: { marginTop: 12, backgroundColor: COLORS.success, borderRadius: RADIUS.md, paddingVertical: 12, paddingHorizontal: 28 },
  newCardText: { color: "#FFFFFF", fontFamily: FONTS.semiBold, fontSize: 14 }
});

export default ScratchCard;

// FILE LOCATION: src/components/ScratchCard/ScratchCard.js (REPLACE existing file)
