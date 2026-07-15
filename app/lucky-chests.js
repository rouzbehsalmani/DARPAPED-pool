import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import LuckyChests from "../src/components/LuckyChests/LuckyChests";
import { CHEST_PRIZE_WEIGHTS } from "../src/config/economyConfig";

const INFO_TEXT =
  "Pick 1 of the 9 chests. Every chest is drawn independently from the same odds table, so it never matters " +
  "which one you pick - they're all equally likely to hold any given prize.";

export default function LuckyChestsRoute() {
  return (
    <GameScreenShell title="Lucky Chests" subtitle="Pick 1 of 9 chests" infoText={INFO_TEXT}>
      {(handleResult) => <LuckyChests prizeWeights={CHEST_PRIZE_WEIGHTS} onResult={handleResult} />}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/lucky-chests.js (REPLACE existing file)
