import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(testDir, "..");
const scriptPath = path.join(repoRoot, "dist", "scripts", "screenshot.js");

function chromiumAvailable(): boolean {
  try {
    return existsSync(chromium.executablePath());
  } catch {
    return false;
  }
}

const isCi = process.env["CI"] === "true" || process.env["CI"] === "1";
const canRun = !isCi && chromiumAvailable();

interface ScreenshotResult {
  readonly mode: string;
  readonly path: string;
  readonly sha256: string;
}

function runScreenshot(mode: string, outDir: string): ScreenshotResult {
  const stdout = execFileSync("node", [scriptPath, `--mode=${mode}`, `--out=${outDir}`], {
    encoding: "utf-8",
  });
  return JSON.parse(stdout) as ScreenshotResult;
}

/**
 * This suite is intentionally **local-only**: it is skipped automatically
 * whenever `CI=true`/`1` (GitHub Actions sets this) or whenever a
 * Chromium build isn't present on disk (e.g. before the one-time
 * `pnpm exec playwright install chromium`). See README "CI decision" for
 * why this determinism guarantee is verified locally rather than in CI.
 *
 * When it *does* run (a developer machine with Chromium installed,
 * outside CI), it holds `pnpm run screenshot` to its actual contract:
 * same mode, same machine, same browser build -> identical SHA-256.
 */
describe.skipIf(!canRun)("screenshot determinism (local-only, requires Chromium)", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(path.join(tmpdir(), "agent-team-sandbox-screenshot-"));
  });

  afterEach(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  it("produces an identical SHA-256 across two consecutive runs of the same mode", () => {
    const first = runScreenshot("none", outDir);
    const second = runScreenshot("none", outDir);

    expect(first.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(second.sha256).toBe(first.sha256);
  }, 30_000);

  it("produces a different SHA-256 when the failure switch mode differs", () => {
    const healthy = runScreenshot("none", outDir);
    const corrupt = runScreenshot("status_corrupt", outDir);

    expect(healthy.sha256).not.toBe(corrupt.sha256);
  }, 30_000);
});

describe.skipIf(canRun)("screenshot determinism (skip reason)", () => {
  it(`is skipped here because: ${isCi ? "CI environment" : "Chromium is not installed locally"}`, () => {
    expect(canRun).toBe(false);
  });
});
