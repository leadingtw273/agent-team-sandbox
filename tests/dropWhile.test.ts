import { describe, expect, it } from "vitest";
import { dropWhile } from "../src/util/dropWhile.js";

describe("dropWhile", () => {
  it("returns the items from the first item that does not satisfy the predicate", () => {
    expect(dropWhile([1, 2, 3, 4], (item) => item < 3)).toEqual([3, 4]);
  });

  it("returns an empty array when every item satisfies the predicate", () => {
    expect(dropWhile([1, 2, 3], () => true)).toEqual([]);
  });

  it("returns an equal but distinct array when the first item does not satisfy the predicate", () => {
    const input = [1, 2, 3];
    const result = dropWhile(input, () => false);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("passes each item and its zero-based index, then stops after the first non-match", () => {
    const calls: [number, number][] = [];

    const result = dropWhile([10, 20, 30, 40], (item, index) => {
      calls.push([item, index]);
      return item < 30;
    });

    expect(result).toEqual([30, 40]);
    expect(calls).toEqual([
      [10, 0],
      [20, 1],
      [30, 2],
    ]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4];
    const snapshot = [...input];

    dropWhile(input, (item) => item < 3);

    expect(input).toEqual(snapshot);
  });

  it("returns an empty array for an empty input", () => {
    expect(dropWhile<number>([], () => true)).toEqual([]);
  });
});
