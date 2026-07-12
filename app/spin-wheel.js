import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import SpinWheel from "../src/components/SpinWheel/SpinWheel";
import { SPIN_WHEEL_WEIGHTED_PRIZES } from "../src/config/economyConfig";

export default function SpinWheelRoute() {
  return (
    <GameScreenShell title="Spin the Wheel">
      {(handleResult) => <SpinWheel segments={SPIN_WHEEL_WEIGHTED_PRIZES} onResult={handleResult} />}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/spin-wheel.js (REPLACE existing file)
