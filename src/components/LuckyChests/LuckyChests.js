import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// prizePool: prize[] (length must equal number of chests, 9)
const LuckyChests = ({ prizePool, onResult, disabled }) => {
  const [assignments, setAssignments] = useState(() => shuffle(prizePool));
  const [openedIndex, setOpenedIndex] = useState(null);

  const openChest = (index) => {
    if (disabled || openedIndex !== null) return;
    setOpenedIndex(index);
    onResult(assignments[index], { chestIndex: index });
  };

  const resetChests = () => {
    setAssignments(shuffle(prizePool));
    setOpenedIndex(null);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {assignments.map((_, index) => {
          const isOpened = openedIndex === index;
          const isLocked = openedIndex !== null && !isOpened;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.chest, isOpened && styles.chestOpened, isLocked && styles.chestLocked]}
              onPress={() => openChest(index)}
              activeOpacity={0.8}
              disabled={disabled || openedIndex !== null}
            >
              <Text style={styles.chestIcon}>{isOpened ? "📦" : "🔒"}</Text>
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
  wrapper: { alignItems: "center", paddingVertical: 20 },
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
  chestLocked: { opacity: 0.4 },
  chestIcon: { fontSize: 30 },
  resetButton: { marginTop: 12, backgroundColor: "#4CAF50", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 28 },
  resetText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 }
});

export default LuckyChests;

// FILE LOCATION: src/components/LuckyChests/LuckyChests.js (NEW file)
