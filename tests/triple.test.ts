import { describe, expect, it } from "vitest";
import { triple } from "../src/util/triple.js";

describe("triple", () => {
  it("triples a positive number", () => {
    expect(triple(3)).toBe(9);
  });

  it("triples a negative number", () => {
    expect(triple(-2)).toBe(-6);
  });

  it("triples zero", () => {
    expect(triple(0)).toBe(0);
  });

  it("triples a decimal number", () => {
    expect(triple(1.5)).toBe(4.5);
  });
});
