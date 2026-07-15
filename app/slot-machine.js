import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import SlotMachine from "../src/components/SlotMachine/SlotMachine";
import { SLOT_SYMBOL_WEIGHTS, SLOT_SYMBOL_PRIZES } from "../src/config/economyConfig";

const INFO_TEXT =
  "Pull the lever to spin all 3 reels. Only the highlighted middle row is the real payline - match all 3 " +
  "symbols on that row to win. The symbols above and below are just for looks.";

export default function SlotMachineRoute() {
  return (
    <GameScreenShell title="Slot Machine" infoText={INFO_TEXT}>
      {(handleResult) => (
        <SlotMachine
          symbolWeights={SLOT_SYMBOL_WEIGHTS}
          prizeMap={SLOT_SYMBOL_PRIZES}
          onResult={handleResult}
          zeroDud={false}
        />
      )}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/slot-machine.js (REPLACE existing file)
