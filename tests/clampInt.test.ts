import { describe, expect, it } from "vitest";
import { clampInt } from "../src/util/clampInt.js";

describe("clampInt", () => {
  it("returns the value when it is within the range", () => {
    expect(clampInt(5, 1, 10)).toBe(5);
  });

  it("clamps to min when value is below the range", () => {
    expect(clampInt(-3, 1, 10)).toBe(1);
  });

  it("clamps to max when value is above the range", () => {
    expect(clampInt(15, 1, 10)).toBe(10);
  });

  it("returns the fixed point when min equals max", () => {
    expect(clampInt(5, 7, 7)).toBe(7);
  });

  it("rounds non-integer values before clamping", () => {
    expect(clampInt(5.6, 1, 10)).toBe(6);
  });
});
