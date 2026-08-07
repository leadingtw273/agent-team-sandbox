/**
 * Returns true only if `value` is a number that is a positive integer
 * (excludes 0, negatives, decimals, NaN, Infinity, and non-number types).
 */
export function isPositiveInteger(value: unknown): boolean {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}
