import { describe, expect, it } from "vitest";
import { isBlank } from "../src/util/is-blank.js";

describe("isBlank", () => {
  it.each(["", " ", "\t\n  "])("returns true for blank string %p", (value) => {
    expect(isBlank(value)).toBe(true);
  });

  it.each(["a", "  hello  ", "0"])("returns false for non-blank string %p", (value) => {
    expect(isBlank(value)).toBe(false);
  });
});
