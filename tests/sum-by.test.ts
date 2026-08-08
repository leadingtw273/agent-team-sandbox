import { describe, expect, it } from "vitest";
import { sumBy } from "../src/util/sum-by.js";

describe("sumBy", () => {
  it("returns 0 for an empty array", () => {
    expect(sumBy([], (n: number) => n)).toBe(0);
  });

  it("sums mapped values for a general case", () => {
    expect(sumBy([1, 2, 3, 4], (n) => n)).toBe(10);
  });

  it("sums negative numbers and decimals", () => {
    expect(sumBy([-1.5, 2.25, -0.75], (n) => n)).toBeCloseTo(0, 10);
  });

  it("propagates NaN when the map function returns NaN", () => {
    expect(sumBy([1, 2, 3], (n) => (n === 2 ? NaN : n))).toBeNaN();
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3] as const;
    const inputCopy = [...input];

    sumBy(input, (n) => n);

    expect(input).toEqual(inputCopy);
  });
});
