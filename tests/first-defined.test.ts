import { describe, expect, it } from "vitest";
import { firstDefined } from "../src/util/first-defined.js";

describe("firstDefined", () => {
  it("returns the first value that is not undefined", () => {
    expect(firstDefined([undefined, "first", "second"])).toBe("first");
  });

  it("returns undefined when every value is undefined", () => {
    expect(firstDefined<string>([undefined, undefined])).toBeUndefined();
  });

  it("treats null as a defined value", () => {
    expect(firstDefined([undefined, null, "later"])).toBeNull();
  });
});
