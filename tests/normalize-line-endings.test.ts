import { describe, expect, it } from "vitest";
import { normalizeLineEndings } from "../src/util/normalize-line-endings.js";

describe("normalizeLineEndings", () => {
  it("leaves text with only LF unchanged", () => {
    expect(normalizeLineEndings("a\nb\nc")).toBe("a\nb\nc");
  });

  it("converts CRLF to LF", () => {
    expect(normalizeLineEndings("a\r\nb\r\nc")).toBe("a\nb\nc");
  });

  it("converts a lone CR to LF", () => {
    expect(normalizeLineEndings("a\rb\rc")).toBe("a\nb\nc");
  });

  it("converts mixed line endings to LF", () => {
    expect(normalizeLineEndings("a\r\nb\rc\nd")).toBe("a\nb\nc\nd");
  });

  it("returns an empty string for an empty string", () => {
    expect(normalizeLineEndings("")).toBe("");
  });
});
