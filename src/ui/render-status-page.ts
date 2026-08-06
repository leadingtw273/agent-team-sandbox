import type { SandboxStatus } from "../sandbox.js";

/**
 * Fixed viewport contract shared by the screenshot script and the Visual
 * Manifest generator's recorded `environment.viewport`. Keeping this in one
 * place is what lets a screenshot's manifest entry truthfully describe the
 * conditions it was captured under.
 */
export const STATUS_PAGE_VIEWPORT = {
  width: 800,
  height: 400,
  deviceScaleFactor: 1,
} as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Renders a fully self-contained, deterministic HTML document for the
 * sandbox's only visual surface: a status page mirroring
 * {@link SandboxStatus} (the same payload the CLI prints as JSON).
 *
 * Design choices exist to make rendering reproducible, not merely pretty:
 * - No network requests, no external fonts/images/scripts -- the whole
 *   document is inline markup + inline CSS.
 * - No timestamps, no randomness, no `Date.now()` -- calling this twice
 *   with the same `status` produces byte-identical output.
 * - Content is almost entirely fixed-size geometry and flat color (a
 *   rounded panel + a circular badge); the only text is the two-letter
 *   state label and a one-line footer echoing the status payload's own
 *   fields, so text-rendering variance across fonts/platforms has minimal
 *   surface area to affect a screenshot's pixels.
 * - Animations/transitions are disabled via CSS so a screenshot taken at
 *   any instant after load is not mid-transition.
 *
 * This is what makes `pnpm run screenshot` produce a stable hash on repeat
 * runs *in the same environment* -- see README's "Determinism contract".
 */
export function renderStatusPage(status: SandboxStatus): string {
  const healthy = status.status === "ok";
  const stateClass = healthy ? "ok" : "error";
  const label = healthy ? "OK" : "ERROR";
  const footer = `${escapeHtml(status.service)} v${escapeHtml(status.version)} · core:${escapeHtml(status.checks.core)}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>agent-team-sandbox status</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
  html, body {
    width: ${String(STATUS_PAGE_VIEWPORT.width)}px;
    height: ${String(STATUS_PAGE_VIEWPORT.height)}px;
    overflow: hidden;
  }
  body {
    font-family: ui-monospace, monospace;
    background: #101418;
    color: #e6e6e6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
  .panel {
    width: 640px;
    height: 260px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }
  .panel.ok { background: #1b5e20; border: 8px solid #2e7d32; }
  .panel.error { background: #7f1d1d; border: 8px solid #c62828; }
  .badge { width: 96px; height: 96px; border-radius: 50%; }
  .badge.ok { background: #66bb6a; }
  .badge.error { background: #ef5350; }
  .label { font-size: 28px; letter-spacing: 4px; }
  .footer { font-size: 14px; color: #9aa0a6; }
</style>
</head>
<body>
  <div class="panel ${stateClass}">
    <div class="badge ${stateClass}"></div>
    <div class="label">${label}</div>
  </div>
  <div class="footer">${footer}</div>
</body>
</html>
`;
}
