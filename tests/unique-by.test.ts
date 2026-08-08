import { describe, expect, it } from "vitest";
import { uniqueBy } from "../src/util/unique-by.js";

describe("uniqueBy", () => {
  it("returns an empty array for an empty input", () => {
    expect(uniqueBy([], (item: unknown) => item)).toEqual([]);
  });

  it("returns all items when there are no duplicates", () => {
    const items = [1, 2, 3];
    expect(uniqueBy(items, (item) => item)).toEqual([1, 2, 3]);
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

  it("returns items by object reference from the key selector", () => {
    const shared = { name: "shared" };
    const other = { name: "other" };
    const items = [shared, other];
    const result = uniqueBy(items, (item) => item);
    expect(result[0]).toBe(shared);
    expect(result[1]).toBe(other);
  });

  it("does not mutate the input array", () => {
    const items = [1, 2, 2, 3];
    const snapshot = [...items];
    uniqueBy(items, (item) => item);
    expect(items).toEqual(snapshot);
  });
});
