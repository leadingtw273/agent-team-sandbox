import { describe, expect, it } from "vitest";
import { capitalize } from "../src/util/capitalize.js";

describe("capitalize", () => {
  it("capitalizes the first character of a lowercase word", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("leaves an already-capitalized word unchanged", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });

  it("uppercases a single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("leaves a string starting with a digit unchanged", () => {
    expect(capitalize("1abc")).toBe("1abc");
  });

  it("leaves a string starting with a symbol unchanged", () => {
    expect(capitalize("!abc")).toBe("!abc");
  });
});
