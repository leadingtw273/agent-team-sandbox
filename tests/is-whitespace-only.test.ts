import { describe, expect, it } from "vitest";
import { isWhitespaceOnly } from "../src/util/is-whitespace-only.js";

describe("isWhitespaceOnly", () => {
  it.each([" ", "\t", "\n  \r\n"])(
    "returns true for non-empty whitespace-only string %p",
    (value) => {
      expect(isWhitespaceOnly(value)).toBe(true);
    },
  );

  it.each(["", "a", "  hello  ", "0"])(
    "returns false for empty or non-whitespace string %p",
    (value) => {
      expect(isWhitespaceOnly(value)).toBe(false);
    },
  );
});
