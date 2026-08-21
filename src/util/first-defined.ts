/**
 * Returns the first value that is not `undefined`.
 */
export function firstDefined<T>(values: readonly (T | undefined)[]): T | undefined {
  for (const value of values) {
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}
