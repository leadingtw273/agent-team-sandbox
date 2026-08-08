import { describe, expect, it } from "vitest";
import { clamp } from "../src/util/clamp.js";

describe("clamp", () => {
  it("returns the value unchanged when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns min when value is below min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("returns max when value is above max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("returns min when value equals min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("returns max when value equals max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("throws RangeError when min is greater than max", () => {
    expect(() => clamp(5, 10, 0)).toThrow(RangeError);
  });

  it("returns NaN when value is NaN", () => {
    expect(clamp(NaN, 0, 10)).toBeNaN();
  });
});
