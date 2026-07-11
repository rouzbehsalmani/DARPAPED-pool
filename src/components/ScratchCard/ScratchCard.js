import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CELL_COUNT = 6;

const buildCard = (icons) => {
  const pool = [];
  while (pool.length < CELL_COUNT) {
    pool.push(icons[Math.floor(Math.random() * icons.length)]);
  }
  return pool.sort(() => Math.random() - 0.5);
};

// icons: string[]  prizeMap: { [icon]: prize }
// zeroDud: if true and no 3-match occurs, a guaranteed fallback prize is
// still awarded (used by the VIP variant to eliminate empty outcomes).
const ScratchCard = ({ icons, prizeMap, onResult, zeroDud, disabled }) => {
  const [cells, setCells] = useState(() => buildCard(icons));
  const [revealed, setRevealed] = useState(() => Array(CELL_COUNT).fill(false));
  const [finished, setFinished] = useState(false);

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

  const revealCell = (index) => {
    if (disabled || finished || revealed[index]) return;
    const next = [...revealed];
    next[index] = true;
    setRevealed(next);
    if (next.every(Boolean)) {
      setFinished(true);
      resolve();
    }
  };

  const resetCard = () => {
    setCells(buildCard(icons));
    setRevealed(Array(CELL_COUNT).fill(false));
    setFinished(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {cells.map((icon, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.cell, revealed[index] && styles.cellRevealed]}
            onPress={() => revealCell(index)}
            activeOpacity={0.8}
            disabled={disabled || finished}
          >
            <Text style={styles.cellText}>{revealed[index] ? icon : "?"}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {finished && (
        <TouchableOpacity style={styles.newCardButton} onPress={resetCard} activeOpacity={0.85}>
          <Text style={styles.newCardText}>Get New Card</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", paddingVertical: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", width: 260, justifyContent: "space-between" },
  cell: {
    width: 78,
    height: 78,
    borderRadius: 14,
    backgroundColor: "#26264A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3A3A55"
  },
  cellRevealed: { backgroundColor: "#1A1A2E", borderColor: "#FFD700" },
  cellText: { fontSize: 28 },
  newCardButton: { marginTop: 12, backgroundColor: "#4CAF50", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 28 },
  newCardText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 }
});

export default ScratchCard;

// FILE LOCATION: src/components/ScratchCard/ScratchCard.js (NEW file)
