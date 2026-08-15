import { describe, expect, it } from "vitest";
import { countTrailing } from "../src/util/countTrailing.js";

describe("countTrailing", () => {
  it("counts the consecutive matching items at the end of the array", () => {
    expect(countTrailing([1, 2, 3, 4], (item) => item >= 3)).toBe(2);
  });

  it("returns the array length when every item matches", () => {
    expect(countTrailing([1, 2, 3], () => true)).toBe(3);
  });

  it("returns zero when the last item does not match", () => {
    expect(countTrailing([1, 2, 3], (item) => item > 3)).toBe(0);
  });

  it("returns zero for an empty input", () => {
    expect(countTrailing<number>([], () => true)).toBe(0);
  });

  it("passes zero-based indexes in reverse order and stops at the first non-match", () => {
    const calls: [number, number][] = [];

    const result = countTrailing([10, 20, 30, 40], (item, index) => {
      calls.push([item, index]);
      return item >= 30;
    });

    expect(result).toBe(2);
    expect(calls).toEqual([
      [40, 3],
      [30, 2],
      [20, 1],
    ]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4];
    const snapshot = [...input];

    countTrailing(input, (item) => item >= 3);

    expect(input).toEqual(snapshot);
  });
});
