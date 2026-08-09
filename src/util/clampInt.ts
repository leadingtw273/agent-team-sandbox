export function clampInt(value: number, min: number, max: number): number {
  const rounded = Math.round(value);
  return Math.min(Math.max(rounded, min), max);
}
