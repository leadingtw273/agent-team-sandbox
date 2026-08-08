export function sumBy<T>(items: readonly T[], mapFn: (item: T) => number): number {
  let total = 0;
  for (const item of items) {
    total += mapFn(item);
  }

  return total;
}
