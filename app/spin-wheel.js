import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import SpinWheel from "../src/components/SpinWheel/SpinWheel";
import { SPIN_WHEEL_WEIGHTED_PRIZES } from "../src/config/economyConfig";
import { spinWheelRemote } from "../src/services/gameApi";

const INFO_TEXT =
  "All 8 slices look the same size, but the real odds behind them are not equal - lower-value prizes (and " +
  "Try Again) come up far more often than Gold or Diamond. Each spin costs a bit of energy (see the bar on the right).";

export default function SpinWheelRoute() {
  return (
    <GameScreenShell title="Spin the Wheel" infoText={INFO_TEXT}>
      {(handleResult) => (
        <SpinWheel segments={SPIN_WHEEL_WEIGHTED_PRIZES} onResult={handleResult} resolveWinner={spinWheelRemote} />
      )}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/spin-wheel.js (REPLACE existing file)
