import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import ScratchCard from "../src/components/ScratchCard/ScratchCard";
import { VIP_SCRATCH_ICONS, SCRATCH_ICON_PRIZES } from "../src/config/economyConfig";

const INFO_TEXT =
  "Zero-dud: even if you don't scratch a 3-match, you're still guaranteed a Gold or Diamond prize once the " +
  "card is fully scratched.";

export default function VipScratchCardRoute() {
  return (
    <GameScreenShell
      title="VIP Scratch Card"
      subtitle="Zero-dud - guaranteed Gold or Diamond"
      accentColor="#FFD700"
      requireVip
      infoText={INFO_TEXT}
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
