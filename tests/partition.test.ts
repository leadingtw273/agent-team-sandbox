import { describe, expect, it } from "vitest";
import { partition } from "../src/util/partition.js";

describe("partition", () => {
  it("splits numbers into matching and non-matching groups", () => {
    const [even, odd] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
    expect(even).toEqual([2, 4]);
    expect(odd).toEqual([1, 3, 5]);
  });

  it("preserves the relative order of each group from the original input", () => {
    const [matches, rest] = partition([5, 3, 8, 1, 4, 2], (n) => n > 3);
    expect(matches).toEqual([5, 8, 4]);
    expect(rest).toEqual([3, 1, 2]);
  });

  it("returns two empty arrays for an empty input", () => {
    const [matches, rest] = partition<number>([], () => true);
    expect(matches).toEqual([]);
    expect(rest).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3];
    const snapshot = [...input];
    partition(input, (n) => n > 1);
    expect(input).toEqual(snapshot);
  });

  it("calls the predicate exactly once per item with the correct item and index", () => {
    const input = ["a", "b", "c"];
    const calls: [string, number][] = [];

    partition(input, (item, index) => {
      calls.push([item, index]);
      return index % 2 === 0;
    });

    expect(calls).toEqual([
      ["a", 0],
      ["b", 1],
      ["c", 2],
    ]);
  });

  it("works with object elements", () => {
    interface User {
      name: string;
      active: boolean;
    }

    const users: User[] = [
      { name: "alice", active: true },
      { name: "bob", active: false },
      { name: "carol", active: true },
    ];

    const [active, inactive] = partition(users, (user) => user.active);
    expect(active).toEqual([
      { name: "alice", active: true },
      { name: "carol", active: true },
    ]);
    expect(inactive).toEqual([{ name: "bob", active: false }]);
  });

  it("infers generic element types correctly", () => {
    const items: (string | number)[] = [1, "a", 2, "b"];
    const [strings, numbers] = partition(items, (item) => typeof item === "string");
    expect(strings).toEqual(["a", "b"]);
    expect(numbers).toEqual([1, 2]);
  });
});
