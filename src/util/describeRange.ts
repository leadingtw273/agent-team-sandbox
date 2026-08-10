export function describeRange(min: number, max: number): string {
  if (min > max) {
    throw new RangeError(`min (${min}) must not be greater than max (${max})`);
  }
  return `range: ${min}..${max}`;
}
