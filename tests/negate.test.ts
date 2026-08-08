import { describe, expect, it } from "vitest";
import { negate } from "../src/util/negate.js";

describe("negate", () => {
  it("returns the negative of a positive number", () => {
    expect(negate(5)).toBe(-5);
  });

  it("returns the positive of a negative number", () => {
    expect(negate(-3)).toBe(3);
  });

  it("returns zero for zero", () => {
    expect(negate(0)).toBe(0);
  });
});
