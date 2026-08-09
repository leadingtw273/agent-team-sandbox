import { describe, expect, it } from "vitest";
import { clampInt } from "../src/util/clampInt.js";

describe("clampInt", () => {
  it("returns the value when it is within the range", () => {
    expect(clampInt(5, 0, 10)).toBe(5);
  });

  it("clamps to min when the value is below the range", () => {
    expect(clampInt(-3, 0, 10)).toBe(0);
  });

  it("clamps to max when the value is above the range", () => {
    expect(clampInt(15, 0, 10)).toBe(10);
  });

  it("returns min (equal to max) when min equals max", () => {
    expect(clampInt(5, 3, 3)).toBe(3);
  });

  it("rounds non-integer values before clamping", () => {
    expect(clampInt(2.6, 0, 10)).toBe(3);
  });
});
