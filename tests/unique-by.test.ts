import { describe, expect, it } from "vitest";
import { uniqueBy } from "../src/util/unique-by.js";

describe("uniqueBy", () => {
  it("returns empty array for empty input", () => {
    expect(uniqueBy([], (x: number) => x)).toEqual([]);
  });

  it("returns all items when there are no duplicates", () => {
    expect(uniqueBy([1, 2, 3], (x) => x)).toEqual([1, 2, 3]);
  });

  it("keeps the first occurrence when duplicates exist", () => {
    const items = [
      { id: 1, label: "a" },
      { id: 2, label: "b" },
      { id: 1, label: "c" },
    ];
    expect(uniqueBy(items, (item) => item.id)).toEqual([
      { id: 1, label: "a" },
      { id: 2, label: "b" },
    ]);
  });

  it("preserves object reference identity for kept items", () => {
    const first = { id: 1, label: "a" };
    const duplicate = { id: 1, label: "c" };
    const result = uniqueBy([first, duplicate], (item) => item.id);
    expect(result[0]).toBe(first);
  });

  it("does not mutate the input array", () => {
    const items = [1, 2, 2, 3];
    const snapshot = [...items];
    uniqueBy(items, (x) => x);
    expect(items).toEqual(snapshot);
  });
});
