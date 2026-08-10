import { describe, expect, it } from "vitest";
import { clampInt } from "../src/util/clampInt.js";

describe("clampInt", () => {
  it("returns the value when within range", () => {
    expect(clampInt(5, 0, 10)).toBe(5);
  });

  it("clamps to min when value is below range", () => {
    expect(clampInt(-5, 0, 10)).toBe(0);
  });

  it("clamps to max when value is above range", () => {
    expect(clampInt(15, 0, 10)).toBe(10);
  });

  it("returns that value when min equals max", () => {
    expect(clampInt(5, 3, 3)).toBe(3);
  });

  it("rounds non-integer values before clamping", () => {
    expect(clampInt(5.6, 0, 10)).toBe(6);
  });
});
