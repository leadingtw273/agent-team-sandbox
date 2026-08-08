import { describe, expect, it } from "vitest";
import { last } from "../src/util/last.js";

describe("last", () => {
  it("returns the last element for a general array", () => {
    expect(last([1, 2, 3, 4])).toBe(4);
  });

  it("returns the only element for a single-element array", () => {
    expect(last([42])).toBe(42);
  });

  it("returns undefined for an empty array", () => {
    expect(last([])).toBeUndefined();
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3] as const;
    const inputCopy = [...input];

    last(input);

    expect(input).toEqual(inputCopy);
  });
});
