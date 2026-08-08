import { describe, expect, it } from "vitest";
import { double } from "../src/util/double.js";

describe("double", () => {
  it("doubles a positive number", () => {
    expect(double(3)).toBe(6);
  });

  it("doubles zero", () => {
    expect(double(0)).toBe(0);
  });

  it("doubles a negative number", () => {
    expect(double(-2)).toBe(-4);
  });

  it("doubles a decimal number", () => {
    expect(double(1.5)).toBe(3);
  });
});
