import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, PanResponder } from "react-native";

const COLS = 3;
const ROWS = 2;
const CELL_COUNT = COLS * ROWS;
const CELL_SIZE = 82;
const GAP = 12;
const DOT_COLS = 3;
const DOT_ROWS = 2;
const DOTS_PER_CELL = DOT_COLS * DOT_ROWS;
const REVEAL_DOT_THRESHOLD = 4; // out of 6 dots per cell

const buildCard = (icons) => {
  const pool = [];
  while (pool.length < CELL_COUNT) {
    pool.push(icons[Math.floor(Math.random() * icons.length)]);
  }
  return pool.sort(() => Math.random() - 0.5);
};

const buildDotGrid = () => Array.from({ length: CELL_COUNT }, () => Array(DOTS_PER_CELL).fill(false));

// A real drag-to-scratch card: the finger/mouse must be dragged across the
// foil overlay (PanResponder tracks continuous movement). Each cell is
// covered by a small grid of foil dots; dragging over a dot clears it, and
// once enough of a cell's dots are cleared the icon underneath fully reveals.
//
// icons: string[]   prizeMap: { [icon]: prize }
// zeroDud: if true and no 3-match occurs once all cells are revealed, a
// guaranteed fallback prize is still awarded (VIP variant - no dud states).
const ScratchCard = ({ icons, prizeMap, onResult, zeroDud, disabled }) => {
  const [cells, setCells] = useState(() => buildCard(icons));
  const [, setTick] = useState(0);
  const dotsRef = useRef(buildDotGrid());
  const cellRevealedRef = useRef(Array(CELL_COUNT).fill(false));
  const finishedRef = useRef(false);

  const forceRender = () => setTick((t) => t + 1);

  const resolve = () => {
    const counts = {};
    cells.forEach((icon) => {
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

  const revealDotAt = (cellIndex, dotIndex) => {
    if (cellRevealedRef.current[cellIndex]) return;
    if (dotsRef.current[cellIndex][dotIndex]) return;
    dotsRef.current[cellIndex][dotIndex] = true;

    const revealedCount = dotsRef.current[cellIndex].filter(Boolean).length;
    if (revealedCount >= REVEAL_DOT_THRESHOLD) {
      cellRevealedRef.current[cellIndex] = true;
      if (cellRevealedRef.current.every(Boolean) && !finishedRef.current) {
        finishedRef.current = true;
        forceRender();
        resolve();
        return;
      }
    }
    forceRender();
  };

  const handleTouch = (x, y) => {
    if (disabled || finishedRef.current) return;
    const col = Math.floor(x / (CELL_SIZE + GAP));
    const row = Math.floor(y / (CELL_SIZE + GAP));
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;

    const localX = x - col * (CELL_SIZE + GAP);
    const localY = y - row * (CELL_SIZE + GAP);
    if (localX > CELL_SIZE || localY > CELL_SIZE) return;

    const dotCol = Math.min(DOT_COLS - 1, Math.max(0, Math.floor(localX / (CELL_SIZE / DOT_COLS))));
    const dotRow = Math.min(DOT_ROWS - 1, Math.max(0, Math.floor(localY / (CELL_SIZE / DOT_ROWS))));
    const cellIndex = row * COLS + col;
    const dotIndex = dotRow * DOT_COLS + dotCol;
    revealDotAt(cellIndex, dotIndex);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
      onPanResponderMove: (evt) => handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY)
    })
  ).current;

  const resetCard = () => {
    setCells(buildCard(icons));
    dotsRef.current = buildDotGrid();
    cellRevealedRef.current = Array(CELL_COUNT).fill(false);
    finishedRef.current = false;
    forceRender();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid} {...panResponder.panHandlers}>
        {cells.map((icon, index) => {
          const revealedDots = dotsRef.current[index];
          const cellDone = cellRevealedRef.current[index];
          return (
            <View key={index} style={[styles.cell, cellDone && styles.cellRevealed]}>
              <Text style={styles.cellText}>{icon}</Text>
              {!cellDone && (
                <View style={styles.overlayGrid} pointerEvents="none">
                  {revealedDots.map((isRevealed, dotIndex) => (
                    <View
                      key={dotIndex}
                      style={[styles.overlayDot, isRevealed && styles.overlayDotRevealed]}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
      <Text style={styles.hint}>Drag across the cards to scratch</Text>
      {finishedRef.current && (
        <TouchableOpacity style={styles.newCardButton} onPress={resetCard} activeOpacity={0.85}>
          <Text style={styles.newCardText}>Get New Card</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", paddingVertical: 20 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: CELL_SIZE * COLS + GAP * (COLS - 1),
    justifyContent: "space-between"
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 14,
    backgroundColor: "#1A1A2E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: GAP,
    borderWidth: 1,
    borderColor: "#3A3A55",
    overflow: "hidden"
  },
  cellRevealed: { borderColor: "#FFD700" },
  cellText: { fontSize: 30 },
  overlayGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CELL_SIZE,
    height: CELL_SIZE,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  overlayDot: {
    width: CELL_SIZE / DOT_COLS,
    height: CELL_SIZE / DOT_ROWS,
    backgroundColor: "#5A5A78",
    borderWidth: 0.5,
    borderColor: "#0F0F1E"
  },
  overlayDotRevealed: { backgroundColor: "transparent", borderColor: "transparent" },
  hint: { color: "#77779A", fontSize: 11, marginTop: 4, marginBottom: 8 },
  newCardButton: { marginTop: 12, backgroundColor: "#4CAF50", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 28 },
  newCardText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 }
});

export default ScratchCard;

// FILE LOCATION: src/components/ScratchCard/ScratchCard.js (REPLACE existing file)
