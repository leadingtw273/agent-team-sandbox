import { describe, expect, it } from "vitest";
import { capitalize } from "../src/util/capitalize.js";

describe("capitalize", () => {
  it("capitalizes the first letter of a lowercase word", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("leaves an already capitalized word unchanged", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles a single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("leaves a leading digit unchanged", () => {
    expect(capitalize("1abc")).toBe("1abc");
  });

  it("leaves a leading symbol unchanged", () => {
    expect(capitalize("!abc")).toBe("!abc");
  });
});
