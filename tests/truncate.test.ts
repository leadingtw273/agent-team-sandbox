import { describe, expect, it } from "vitest";
import { truncate } from "../src/util/truncate.js";

describe("truncate", () => {
  it("returns the original value when not over maxLength", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates and appends the default suffix, total length within maxLength", () => {
    const result = truncate("hello world", 8);
    expect(result).toBe("hello w…");
    expect(result.length).toBeLessThanOrEqual(8);
  });

  it("supports a custom suffix", () => {
    const result = truncate("hello world", 8, "...");
    expect(result).toBe("hello...");
    expect(result.length).toBeLessThanOrEqual(8);
  });

  it("handles maxLength smaller than the suffix length", () => {
    const result = truncate("hello world", 2, "...");
    expect(result).toBe("..");
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("throws RangeError when maxLength is negative", () => {
    expect(() => truncate("hello", -1)).toThrow(RangeError);
  });

  it("returns an empty string unchanged", () => {
    expect(truncate("", 5)).toBe("");
  });
});
