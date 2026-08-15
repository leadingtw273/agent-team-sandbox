export function countTrailing<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): number {
  let count = 0;

  for (const [index, item] of Array.from(items.entries()).reverse()) {
    if (!predicate(item, index)) {
      break;
    }

    count += 1;
  }

  return count;
}
