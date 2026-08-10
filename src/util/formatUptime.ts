export function formatUptime(startedAt: Date): string {
  const elapsedSeconds = Math.floor((Date.now() - startedAt.getTime()) / 1000);
  return `uptime: ${String(elapsedSeconds)}s`;
}
