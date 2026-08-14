export function takeUntil<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): T[] {
  for (const [index, item] of items.entries()) {
    if (predicate(item, index)) {
      return items.slice(0, index);
    }
  }

  return items.slice();
}
