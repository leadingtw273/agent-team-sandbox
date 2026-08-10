import { describe, expect, it } from "vitest";
import { lastIndex } from "../src/util/lastIndex.js";

describe("lastIndex", () => {
  it("returns 2 for a three-element array", () => {
    expect(lastIndex([1, 2, 3])).toBe(2);
  });

  it("returns 0 for a single-element array", () => {
    expect(lastIndex(["a"])).toBe(0);
  });

  it("returns -1 for an empty array", () => {
    expect(lastIndex([])).toBe(-1);
  });
});
