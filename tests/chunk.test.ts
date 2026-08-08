import { describe, expect, it } from "vitest";
import { chunk } from "../src/util/chunk.js";

describe("chunk", () => {
  it("returns an empty array for an empty input", () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it("splits evenly when length is divisible by size", () => {
    expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it("keeps a shorter trailing chunk when length is not divisible by size", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns each item in its own chunk when size is 1", () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  it("returns a single chunk when size is greater than the input length", () => {
    expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
  });

  it("throws a RangeError when size is zero", () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
  });

  it("throws a RangeError when size is negative", () => {
    expect(() => chunk([1, 2, 3], -1)).toThrow(RangeError);
  });

  it("throws a RangeError when size is not an integer", () => {
    expect(() => chunk([1, 2, 3], 1.5)).toThrow(RangeError);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4, 5] as const;
    const inputCopy = [...input];

    chunk(input, 2);

    expect(input).toEqual(inputCopy);
  });
});
