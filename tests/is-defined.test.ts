import { describe, expect, it } from "vitest";
import { isDefined } from "../src/util/is-defined.js";

describe("isDefined", () => {
  it("returns false only for undefined", () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it.each([
    null,
    "",
    0,
    NaN,
    false,
    Symbol("value"),
    0n,
    () => undefined,
    [],
    {},
    new String(""),
  ])("returns true for %p", (value) => {
    expect(isDefined(value)).toBe(true);
  });
});
