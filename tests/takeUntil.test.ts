import { describe, expect, it } from "vitest";
import { takeUntil } from "../src/util/takeUntil.js";

describe("takeUntil", () => {
  it("returns the items before the first matching item", () => {
    expect(takeUntil([1, 2, 3, 4], (item) => item >= 3)).toEqual([1, 2]);
  });

  it("returns an empty array when the first item matches", () => {
    expect(takeUntil([1, 2, 3], (item) => item === 1)).toEqual([]);
  });

  it("returns an equal but distinct array when no item matches", () => {
    const input = [1, 2, 3];
    const result = takeUntil(input, () => false);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("passes each item and its zero-based index, then stops after a match", () => {
    const calls: [number, number][] = [];

    const result = takeUntil([10, 20, 30, 40], (item, index) => {
      calls.push([item, index]);
      return item === 30;
    });

    expect(result).toEqual([10, 20]);
    expect(calls).toEqual([
      [10, 0],
      [20, 1],
      [30, 2],
    ]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4];
    const snapshot = [...input];

    takeUntil(input, (item) => item === 3);

    expect(input).toEqual(snapshot);
  });

  it("returns an empty array for an empty input", () => {
    expect(takeUntil<number>([], () => true)).toEqual([]);
  });
});
