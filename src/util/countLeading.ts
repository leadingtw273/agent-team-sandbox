/**
 * Counts the consecutive leading items that satisfy the predicate.
 */
export function countLeading<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): number {
  for (const [index, item] of items.entries()) {
    if (!predicate(item, index)) {
      return index;
    }
  }

  return items.length;
}
