export type RitualPhase = "idle" | "armed" | "holding" | "released";

export function getNextPhaseOnArm(current: RitualPhase, hasInput: boolean): RitualPhase {
  if (!hasInput || current === "released") return current;
  return "armed";
}

export function getNextPhaseOnHoldStart(current: RitualPhase): RitualPhase {
  if (current !== "armed") return current;
  return "holding";
}

export function getNextPhaseOnHoldCancel(current: RitualPhase, isReleasing: boolean): RitualPhase {
  if (isReleasing) return current;
  if (current !== "holding") return current;
  return "armed";
}

export function getReleaseHint(current: RitualPhase): string {
  if (current === "holding") return "The words will fade as you let them go...";
  if (current === "released") return "It stays, quietly.";
  return "UNSAID, UNDONE, UNSENT";
}
