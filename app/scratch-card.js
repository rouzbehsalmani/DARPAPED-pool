import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import ScratchCard from "../src/components/ScratchCard/ScratchCard";
import { SCRATCH_ICONS, SCRATCH_ICON_PRIZES } from "../src/config/economyConfig";

const INFO_TEXT =
  "Drag your finger or mouse across the card like a real scratch ticket - a small brush clears the foil " +
  "wherever it passes. The card is divided into 6 zones; match 3 of the same icon among them to win that prize.";

export default function ScratchCardRoute() {
  return (
    <GameScreenShell title="Scratch Card" subtitle="Drag to scratch - match 3 icons to win" infoText={INFO_TEXT}>
      {(handleResult) => (
        <ScratchCard
          icons={SCRATCH_ICONS}
          prizeMap={SCRATCH_ICON_PRIZES}
          onResult={handleResult}
          zeroDud={false}
        />
      )}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/scratch-card.js (REPLACE existing file)
