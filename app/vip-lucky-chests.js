import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import LuckyChests from "../src/components/LuckyChests/LuckyChests";
import { VIP_CHEST_PRIZE_WEIGHTS } from "../src/config/economyConfig";

const INFO_TEXT = "Zero-dud: every chest pays out - no empty chests in the VIP prize table.";

export default function VipLuckyChestsRoute() {
  return (
    <GameScreenShell
      title="VIP Lucky Chests"
      subtitle="Zero-dud - every chest pays out"
      accentColor="#FFD700"
      requireVip
      infoText={INFO_TEXT}
    >
      {(handleResult) => <LuckyChests prizeWeights={VIP_CHEST_PRIZE_WEIGHTS} onResult={handleResult} />}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/vip-lucky-chests.js (REPLACE existing file)
