#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { loadFailureMode, parseFailureMode, type FailureMode } from "../failure-switch.js";
import { getSandboxStatus } from "../sandbox.js";
import { renderStatusPage, STATUS_PAGE_VIEWPORT } from "../ui/index.js";
import { sha256File } from "../util/sha256-file.js";

// This module compiles to dist/scripts/screenshot.js, one directory below
// dist/, which is itself the repo root's direct child -- so two levels up.
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(moduleDir, "..", "..");

interface Args {
  readonly mode: FailureMode | undefined;
  readonly outDir: string;
}

function parseArgs(argv: readonly string[]): Args {
  let mode: FailureMode | undefined;
  let outDir = "artifacts";

  for (const arg of argv) {
    if (arg.startsWith("--mode=")) {
      mode = parseFailureMode({ mode: arg.slice("--mode=".length) });
    } else if (arg.startsWith("--out=")) {
      outDir = arg.slice("--out=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { mode, outDir };
}

/**
 * Captures a single, decisive PNG screenshot of the sandbox's static status
 * page and prints its path + SHA-256 as JSON on stdout.
 *
 * Mode resolution:
 * - `--mode=<none|status_corrupt>` renders that mode directly, WITHOUT
 *   reading or touching the repository's committed `failure-switch.json`
 *   (mirrors the existing test convention in tests/sandbox.test.ts).
 * - Omitting `--mode` reads the repository's own `failure-switch.json`,
 *   so `pnpm run screenshot` with no arguments always reflects whatever
 *   is actually committed on `main` (which must stay `"none"`).
 *
 * Determinism contract: viewport, device scale factor and CSS animations
 * are all fixed (see src/ui/render-status-page.ts); the same mode
 * screenshotted twice on the same machine/browser build must hash
 * identically. Cross-machine/cross-browser-version pixel differences are a
 * known, out-of-scope risk -- this script's stability guarantee is
 * same-environment repeatability only.
 */
async function main(argv: readonly string[]): Promise<number> {
  const { mode: explicitMode, outDir } = parseArgs(argv);
  const mode = explicitMode ?? loadFailureMode();
  const status = getSandboxStatus(mode);
  const html = renderStatusPage(status);

  const resolvedOutDir = path.isAbsolute(outDir) ? outDir : path.join(repoRoot, outDir);
  mkdirSync(resolvedOutDir, { recursive: true });
  const fileName = `status-${mode}.png`;
  const outPath = path.join(resolvedOutDir, fileName);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: {
        width: STATUS_PAGE_VIEWPORT.width,
        height: STATUS_PAGE_VIEWPORT.height,
      },
      deviceScaleFactor: STATUS_PAGE_VIEWPORT.deviceScaleFactor,
    });
    await page.setContent(html, { waitUntil: "load" });
    await page.screenshot({ path: outPath, animations: "disabled" });
  } finally {
    await browser.close();
  }

  const sha256 = sha256File(outPath);
  const relativePath = path.relative(repoRoot, outPath).split(path.sep).join("/");
  process.stdout.write(`${JSON.stringify({ mode, path: relativePath, sha256 })}\n`);
  return 0;
}

main(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    process.stderr.write(
      `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
    );
    process.exitCode = 1;
  });
