export function describeRange(min: number, max: number): string {
  if (min > max) {
    throw new RangeError(`min (${String(min)}) must not be greater than max (${String(max)})`);
  }
  return `range: ${String(min)}..${String(max)}`;
}
