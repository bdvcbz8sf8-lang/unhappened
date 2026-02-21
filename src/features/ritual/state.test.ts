import {
  getNextPhaseOnArm,
  getNextPhaseOnHoldCancel,
  getNextPhaseOnHoldStart,
  getReleaseHint,
} from "./state";

describe("ritual state transitions", () => {
  it("arms only when there is input and not released", () => {
    expect(getNextPhaseOnArm("idle", true)).toBe("armed");
    expect(getNextPhaseOnArm("idle", false)).toBe("idle");
    expect(getNextPhaseOnArm("released", true)).toBe("released");
  });

  it("starts hold only from armed", () => {
    expect(getNextPhaseOnHoldStart("armed")).toBe("holding");
    expect(getNextPhaseOnHoldStart("idle")).toBe("idle");
  });

  it("returns to armed only when hold is canceled before release", () => {
    expect(getNextPhaseOnHoldCancel("holding", false)).toBe("armed");
    expect(getNextPhaseOnHoldCancel("holding", true)).toBe("holding");
    expect(getNextPhaseOnHoldCancel("idle", false)).toBe("idle");
  });
});

describe("ritual hints", () => {
  it("returns copy by phase", () => {
    expect(getReleaseHint("idle")).toBe("UNSAID, UNDONE, UNSENT");
    expect(getReleaseHint("holding")).toBe("The words will fade as you let them go...");
    expect(getReleaseHint("released")).toBe("It stays, quietly.");
  });
});
