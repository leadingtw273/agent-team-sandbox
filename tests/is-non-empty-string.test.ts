import { describe, expect, it } from "vitest";
import { isNonEmptyString } from "../src/util/is-non-empty-string.js";

describe("isNonEmptyString", () => {
  it.each(["a", " ", "\t"])("returns true for non-empty string %p", (value) => {
    expect(isNonEmptyString(value)).toBe(true);
  });

  it.each([
    "",
    1,
    true,
    null,
    undefined,
    {},
    [],
    Symbol("value"),
    1n,
    () => "value",
    new String("value"),
  ])("returns false for non-string or empty value %p", (value) => {
    expect(isNonEmptyString(value)).toBe(false);
  });
});
