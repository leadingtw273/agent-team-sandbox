export function countTrailing<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): number {
  let count = 0;

  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!predicate(items[index]!, index)) {
      break;
    }

    count += 1;
  }

  return count;
}
