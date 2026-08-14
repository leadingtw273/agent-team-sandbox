import { describe, expect, it } from "vitest";
import { isPositiveInteger } from "../src/util/is-positive-integer.js";

describe("isPositiveInteger", () => {
  it.each([1, 42])("returns true for positive integer %p", (value) => {
    expect(isPositiveInteger(value)).toBe(true);
  });

  it.each([0, -1, 1.5, NaN, Infinity, "1", null, undefined])("returns false for %p", (value) => {
    expect(isPositiveInteger(value)).toBe(false);
  });
});
