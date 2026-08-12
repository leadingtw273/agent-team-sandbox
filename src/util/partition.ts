export function partition<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [T[], T[]] {
  const matches: T[] = [];
  const rest: T[] = [];

  items.forEach((item, index) => {
    if (predicate(item, index)) {
      matches.push(item);
    } else {
      rest.push(item);
    }
  });

  return [matches, rest];
}
