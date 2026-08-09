import { describe, expect, it } from "vitest";
import { clampInt } from "../src/util/clampInt.js";

describe("clampInt", () => {
  it("returns the value when within the range", () => {
    expect(clampInt(5, 0, 10)).toBe(5);
  });

  it("clamps to min when value is below min", () => {
    expect(clampInt(-5, 0, 10)).toBe(0);
  });

  it("clamps to max when value is above max", () => {
    expect(clampInt(15, 0, 10)).toBe(10);
  });

  it("returns the fixed value when min equals max", () => {
    expect(clampInt(7, 3, 3)).toBe(3);
  });

  it("rounds a non-integer value before clamping", () => {
    expect(clampInt(5.6, 0, 10)).toBe(6);
  });
});
