import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { pickWeighted } from "../../utils/weightedRandom";

const CHEST_COUNT = 9;
const OPENING_DELAY_MS = 650; // brief suspense beat before the chest reveals

// Each of the 9 chests is drawn independently from the weighted prize
// table, so the odds stay correct regardless of which single chest the
// player ends up opening (rather than relying on a hand-shuffled fixed pool).
const drawAssignments = (prizeWeights) =>
  Array.from({ length: CHEST_COUNT }, () =>
    pickWeighted(prizeWeights.map((p) => ({ value: p.prize, weight: p.weight })))
  );

// prizeWeights: [{ prize, weight }]
const LuckyChests = ({ prizeWeights, onResult, disabled }) => {
  const [assignments, setAssignments] = useState(() => drawAssignments(prizeWeights));
  const [openedIndex, setOpenedIndex] = useState(null);
  const [openingIndex, setOpeningIndex] = useState(null);
  const timerRef = useRef(null);

  const openChest = (index) => {
    if (disabled || openedIndex !== null || openingIndex !== null) return;
    setOpeningIndex(index);
    timerRef.current = setTimeout(() => {
      setOpeningIndex(null);
      setOpenedIndex(index);
      onResult(assignments[index], { chestIndex: index });
    }, OPENING_DELAY_MS);
  };

  const resetChests = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAssignments(drawAssignments(prizeWeights));
    setOpenedIndex(null);
    setOpeningIndex(null);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {assignments.map((_, index) => {
          const isOpened = openedIndex === index;
          const isOpening = openingIndex === index;
          const isLocked = (openedIndex !== null || openingIndex !== null) && !isOpened && !isOpening;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.chest,
                isOpened && styles.chestOpened,
                isOpening && styles.chestOpening,
                isLocked && styles.chestLocked
              ]}
              onPress={() => openChest(index)}
              activeOpacity={0.8}
              disabled={disabled || openedIndex !== null || openingIndex !== null}
            >
              <Text style={styles.chestIcon}>{isOpened ? "📦" : isOpening ? "✨" : "🔒"}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {openedIndex !== null && (
        <TouchableOpacity style={styles.resetButton} onPress={resetChests} activeOpacity={0.85}>
          <Text style={styles.resetText}>Try New Chests</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", paddingVertical: 36 },
  grid: { flexDirection: "row", flexWrap: "wrap", width: 260, justifyContent: "space-between" },
  chest: {
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
  chestOpened: { backgroundColor: "#1A1A2E", borderColor: "#FFD700" },
  chestOpening: { borderColor: "#FFD700", opacity: 0.85 },
  chestLocked: { opacity: 0.4 },
  chestIcon: { fontSize: 30 },
  resetButton: { marginTop: 12, backgroundColor: "#4CAF50", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 28 },
  resetText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 }
});

export default LuckyChests;

// FILE LOCATION: src/components/LuckyChests/LuckyChests.js (REPLACE existing file)
