// src/utils/weightedRandom.js

// entries: [{ value, weight }]  -> returns a randomly chosen `value`,
// with probability proportional to `weight`.
export function pickWeighted(entries) {
  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  let r = Math.random() * total;
  for (const e of entries) {
    if (r < e.weight) return e.value;
    r -= e.weight;
  }
  return entries[entries.length - 1].value;
}

// weights: number[] -> returns the index chosen, with probability
// proportional to each weight. Used by the Spin Wheel so the winning
// wedge lines up with the same distribution used to size the wedges.
export function pickWeightedIndex(weights) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    if (r < weights[i]) return i;
    r -= weights[i];
  }
  return weights.length - 1;
}

// FILE LOCATION: src/utils/weightedRandom.js (NEW file)
