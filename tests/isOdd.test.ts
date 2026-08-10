import { describe, expect, it } from "vitest";
import { isOdd } from "../src/util/isOdd.js";

describe("isOdd", () => {
  it("returns true for a positive odd number", () => {
    expect(isOdd(3)).toBe(true);
  });

  it("returns false for a positive even number", () => {
    expect(isOdd(4)).toBe(false);
  });

  it("returns false for zero", () => {
    expect(isOdd(0)).toBe(false);
  });

  it("returns true for a negative odd number", () => {
    expect(isOdd(-3)).toBe(true);
  });

  it("returns false for a negative even number", () => {
    expect(isOdd(-4)).toBe(false);
  });
});
