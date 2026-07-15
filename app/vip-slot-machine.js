import React from "react";
import GameScreenShell from "../src/components/GameScreenShell/GameScreenShell";
import SlotMachine from "../src/components/SlotMachine/SlotMachine";
import { VIP_SLOT_SYMBOL_WEIGHTS, SLOT_SYMBOL_PRIZES } from "../src/config/economyConfig";

const INFO_TEXT = "Zero-dud: every pull is a guaranteed winning line on the middle payline row.";

export default function VipSlotMachineRoute() {
  return (
    <GameScreenShell
      title="VIP Slot Machine"
      subtitle="Guaranteed winning lines"
      accentColor="#FFD700"
      requireVip
      infoText={INFO_TEXT}
    >
      {(handleResult) => (
        <SlotMachine
          symbolWeights={VIP_SLOT_SYMBOL_WEIGHTS}
          prizeMap={SLOT_SYMBOL_PRIZES}
          onResult={handleResult}
          zeroDud={true}
        />
      )}
    </GameScreenShell>
  );
}

// FILE LOCATION: app/vip-slot-machine.js (REPLACE existing file)
