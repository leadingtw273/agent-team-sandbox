export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n|\r/g, "\n");
}
