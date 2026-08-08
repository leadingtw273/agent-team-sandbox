export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError("min must not be greater than max");
  }
  if (Number.isNaN(value)) {
    return NaN;
  }
  return Math.min(Math.max(value, min), max);
}
