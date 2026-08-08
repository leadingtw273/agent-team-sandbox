import { describe, expect, it } from "vitest";
import { uniqueBy } from "../src/util/unique-by.js";

describe("uniqueBy", () => {
  it("returns an empty array for an empty input", () => {
    expect(uniqueBy([], (item: number) => item)).toEqual([]);
  });

  it("returns all items unchanged when there are no duplicates", () => {
    const input = [1, 2, 3];
    expect(uniqueBy(input, (item) => item)).toEqual([1, 2, 3]);
  });

  it("keeps the first occurrence when duplicates exist", () => {
    const input = [
      { id: 1, label: "first" },
      { id: 2, label: "second" },
      { id: 1, label: "duplicate" },
    ];
    expect(uniqueBy(input, (item) => item.id)).toEqual([
      { id: 1, label: "first" },
      { id: 2, label: "second" },
    ]);
  });

  it("supports keys that are object references", () => {
    const keyA = {};
    const keyB = {};
    const itemA1 = { key: keyA };
    const itemA2 = { key: keyA };
    const itemB = { key: keyB };

    expect(uniqueBy([itemA1, itemA2, itemB], (item) => item.key)).toEqual([itemA1, itemB]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 1, 3] as const;
    const inputCopy = [...input];

    uniqueBy(input, (item) => item);

    expect(input).toEqual(inputCopy);
  });
});
