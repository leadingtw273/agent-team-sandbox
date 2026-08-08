export function uniqueBy<T>(items: readonly T[], selectKey: (item: T) => unknown): T[] {
  const seenKeys = new Set<unknown>();
  const result: T[] = [];

  for (const item of items) {
    const key = selectKey(item);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push(item);
    }
  }

  return result;
}
