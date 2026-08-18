import { describe, expect, it } from "vitest";
import { isNullish } from "../src/util/is-nullish.js";

describe("isNullish", () => {
  it.each([null, undefined])("returns true for %p", (value) => {
    expect(isNullish(value)).toBe(true);
  });

  it.each([
    "",
    0,
    NaN,
    false,
    Symbol("value"),
    1n,
    () => "value",
    [],
    {},
    new String("value"),
  ])("returns false for non-nullish value %p", (value) => {
    expect(isNullish(value)).toBe(false);
  });
});
