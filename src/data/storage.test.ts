import { getPreview } from "../features/traces/preview";

describe("getPreview", () => {
  it("returns empty string for whitespace input", () => {
    expect(getPreview("   \n\t  ")).toBe("");
  });

  it("returns full text if seven words or fewer", () => {
    expect(getPreview("The letter I never sent")).toBe("The letter I never sent");
  });

  it("limits preview to first seven words with ellipsis", () => {
    expect(getPreview("I kept carrying this quiet weight for too long")).toBe(
      "I kept carrying this quiet weight for...",
    );
  });

  it("normalizes extra spaces and line breaks", () => {
    expect(getPreview("I   forgot\n to buy flowers")).toBe("I forgot to buy flowers");
  });
});
