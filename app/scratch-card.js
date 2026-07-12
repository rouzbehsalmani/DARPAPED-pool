import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import ScratchCard from "../src/components/ScratchCard/ScratchCard";
import { SCRATCH_ICONS, SCRATCH_ICON_PRIZES } from "../src/config/economyConfig";

export default function ScratchCardRoute() {
  return (
    <GameScreenShell title="Scratch Card" subtitle="Drag to scratch - match 3 icons to win">
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
