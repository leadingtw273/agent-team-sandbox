import { describe, expect, it } from "vitest";
import { countLeading } from "../src/util/countLeading.js";

describe("countLeading", () => {
  it("counts the consecutive leading items that satisfy the predicate", () => {
    expect(countLeading([1, 2, 3, 4], (item) => item < 3)).toBe(2);
  });

  it("returns the array length when every item satisfies the predicate", () => {
    expect(countLeading([1, 2, 3], () => true)).toBe(3);
  });

  it("returns zero when the first item does not satisfy the predicate", () => {
    expect(countLeading([1, 2, 3], () => false)).toBe(0);
  });

  it("returns zero for an empty input", () => {
    expect(countLeading<number>([], () => true)).toBe(0);
  });

  it("passes each item and its zero-based index, then stops after the first non-match", () => {
    const calls: [number, number][] = [];

    const result = countLeading([10, 20, 30, 40], (item, index) => {
      calls.push([item, index]);
      return item < 30;
    });

    expect(result).toBe(2);
    expect(calls).toEqual([
      [10, 0],
      [20, 1],
      [30, 2],
    ]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4];
    const snapshot = [...input];

    countLeading(input, (item) => item < 3);

    expect(input).toEqual(snapshot);
  });
});
