import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import SpinWheel from "../src/components/SpinWheel/SpinWheel";
import { VIP_SPIN_WHEEL_WEIGHTED_PRIZES } from "../src/config/economyConfig";

const INFO_TEXT =
  "Zero-dud: every slice is a real prize, no Try Again. Odds still aren't equal - Gold is common, high-value " +
  "Diamond and cash tiers are rarer.";

export default function VipSpinWheelRoute() {
  return (
    <GameScreenShell
      title="VIP Spin the Wheel"
      subtitle="No empty segments - guaranteed reward"
      accentColor="#FFD700"
      requireVip
      infoText={INFO_TEXT}
    >
      {(handleResult) => <SpinWheel segments={VIP_SPIN_WHEEL_WEIGHTED_PRIZES} onResult={handleResult} />}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/vip-spin-wheel.js (REPLACE existing file)
