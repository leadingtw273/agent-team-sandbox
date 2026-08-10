import { describe, expect, it } from "vitest";
import { clampToZero } from "../src/util/clampToZero.js";

describe("clampToZero", () => {
  it("returns 0 for a negative number", () => {
    expect(clampToZero(-5)).toBe(0);
  });

  it("returns 0 for zero", () => {
    expect(clampToZero(0)).toBe(0);
  });

  it("returns the original value for a positive number", () => {
    expect(clampToZero(7)).toBe(7);
  });
});
