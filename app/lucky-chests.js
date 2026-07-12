import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import LuckyChests from "../src/components/LuckyChests/LuckyChests";
import { CHEST_PRIZE_WEIGHTS } from "../src/config/economyConfig";

export default function LuckyChestsRoute() {
  return (
    <GameScreenShell title="Lucky Chests" subtitle="Pick 1 of 9 chests">
      {(handleResult) => <LuckyChests prizeWeights={CHEST_PRIZE_WEIGHTS} onResult={handleResult} />}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/lucky-chests.js (REPLACE existing file)
