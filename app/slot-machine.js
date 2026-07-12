import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import SlotMachine from "../src/components/SlotMachine/SlotMachine";
import { SLOT_SYMBOL_WEIGHTS, SLOT_SYMBOL_PRIZES } from "../src/config/economyConfig";

export default function SlotMachineRoute() {
  return (
    <GameScreenShell title="Slot Machine">
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
