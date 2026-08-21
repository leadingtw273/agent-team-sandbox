export function isWhitespaceOnly(value: string): boolean {
  return value.length > 0 && value.trim().length === 0;
}
