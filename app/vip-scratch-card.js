import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import ScratchCard from "../src/components/ScratchCard/ScratchCard";
import { VIP_SCRATCH_ICONS, SCRATCH_ICON_PRIZES } from "../src/config/economyConfig";

export default function VipScratchCardRoute() {
  return (
    <GameScreenShell
      title="VIP Scratch Card"
      subtitle="Zero-dud - guaranteed Gold or Diamond"
      accentColor="#FFD700"
      requireVip
    >
      {(handleResult) => (
        <ScratchCard
          icons={VIP_SCRATCH_ICONS}
          prizeMap={SCRATCH_ICON_PRIZES}
          onResult={handleResult}
          zeroDud={true}
        />
      )}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/vip-scratch-card.js (REPLACE existing file)
