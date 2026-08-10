import { describe, expect, it } from "vitest";
import { describeRange } from "../src/util/describeRange.js";

describe("describeRange", () => {
  it("returns a range description", () => {
    expect(describeRange(1, 5)).toBe("range: 1..5");
  });

  it("returns a single-value range when min equals max", () => {
    expect(describeRange(3, 3)).toBe("range: 3..3");
  });

  it("supports negative numbers", () => {
    expect(describeRange(-2, 2)).toBe("range: -2..2");
  });

  it("throws a RangeError when min is greater than max", () => {
    expect(() => describeRange(5, 1)).toThrow(RangeError);
  });
});
