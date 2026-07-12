import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import LuckyChests from "../src/components/LuckyChests/LuckyChests";
import { VIP_CHEST_PRIZE_WEIGHTS } from "../src/config/economyConfig";

export default function VipLuckyChestsRoute() {
  return (
    <GameScreenShell
      title="VIP Lucky Chests"
      subtitle="Zero-dud - every chest pays out"
      accentColor="#FFD700"
      requireVip
    >
      {(handleResult) => <LuckyChests prizeWeights={VIP_CHEST_PRIZE_WEIGHTS} onResult={handleResult} />}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/vip-lucky-chests.js (REPLACE existing file)
