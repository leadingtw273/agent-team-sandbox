import { describe, expect, it } from "vitest";
import { negate } from "../src/util/negate.js";

describe("negate", () => {
  it("negates a positive number", () => {
    expect(negate(5)).toBe(-5);
  });

  it("negates a negative number", () => {
    expect(negate(-3)).toBe(3);
  });

  it("negates zero", () => {
    expect(negate(0)).toBe(0);
  });
});
