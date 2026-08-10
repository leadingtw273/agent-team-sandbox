import { describe, expect, it } from "vitest";
import { isEven } from "../src/util/isEven.js";

describe("isEven", () => {
  it("returns true for an even number", () => {
    expect(isEven(4)).toBe(true);
  });

  it("returns false for an odd number", () => {
    expect(isEven(3)).toBe(false);
  });

  it("returns true for zero", () => {
    expect(isEven(0)).toBe(true);
  });

  it("returns false for a negative odd number", () => {
    expect(isEven(-3)).toBe(false);
  });

  it("returns true for a negative even number", () => {
    expect(isEven(-4)).toBe(true);
  });
});
