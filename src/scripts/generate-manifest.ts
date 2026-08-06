#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildVisualManifest,
  type VisualManifestArtifact,
} from "../manifest/build-visual-manifest.js";
import { validateVisualManifest } from "../manifest/validate-visual-manifest.js";
import { SANDBOX_VERSION } from "../sandbox.js";
import { STATUS_PAGE_VIEWPORT } from "../ui/index.js";
import { sha256File } from "../util/sha256-file.js";

// This module compiles to dist/scripts/generate-manifest.js, one directory
// below dist/, which is itself the repo root's direct child -- two up.
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(moduleDir, "..", "..");

/**
 * This sandbox has no real registered GitHub issue or Linear issue yet
 * (that is E004's job, out of scope here), so acceptance criteria are
 * mapped to placeholder ids of the form `sandbox-e2e:<caseId>:<acId>`,
 * where `<caseId>` names one of the plan's E1xx end-to-end cases this
 * artifact will eventually support and `<acId>` is a short local label.
 * README.md documents this convention. issueId is similarly a fixed
 * placeholder UUID satisfying F008's `issue_<uuid>` pattern.
 */
const PLACEHOLDER_ISSUE_ID = "issue_00000000-0000-4000-8000-000000000000";

const ARTIFACT_METADATA: Readonly<Record<string, { title: string; acceptanceCriteria: string[] }>> =
  {
    "status-none.png": {
      title: "Sandbox status page - healthy (mode=none)",
      acceptanceCriteria: ["sandbox-e2e:E101:AC1-status-page-renders-healthy"],
    },
    "status-status_corrupt.png": {
      title: "Sandbox status page - failure-injected (mode=status_corrupt)",
      acceptanceCriteria: ["sandbox-e2e:E101:AC2-status-page-renders-corrupt"],
    },
  };

const FALLBACK_ACCEPTANCE_CRITERIA = ["sandbox-e2e:unmapped:AC0-no-known-mapping-for-this-file"];

interface Args {
  readonly artifactsDir: string;
  readonly outPath: string;
}

function parseArgs(argv: readonly string[]): Args {
  let artifactsDir = "artifacts";
  let outPath = "artifacts/visual-manifest.json";

  for (const arg of argv) {
    if (arg.startsWith("--dir=")) {
      artifactsDir = arg.slice("--dir=".length);
    } else if (arg.startsWith("--out=")) {
      outPath = arg.slice("--out=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { artifactsDir, outPath };
}

function resolveFromRoot(candidate: string): string {
  return path.isAbsolute(candidate) ? candidate : path.join(repoRoot, candidate);
}

function toRepoRelativePath(absolutePath: string): string {
  return path.relative(repoRoot, absolutePath).split(path.sep).join("/");
}

function buildArtifactInput(fileName: string, absolutePath: string): VisualManifestArtifact {
  const metadata = ARTIFACT_METADATA[fileName];
  if (!metadata) {
    process.stderr.write(
      `warning: no known acceptance-criteria mapping for "${fileName}"; using fallback placeholder.\n`,
    );
  }

  return {
    path: toRepoRelativePath(absolutePath),
    mediaType: "image/png",
    sha256: sha256File(absolutePath),
    title: metadata?.title ?? fileName,
    acceptanceCriteria: metadata?.acceptanceCriteria ?? FALLBACK_ACCEPTANCE_CRITERIA,
  };
}

/**
 * Scans `artifacts/` for PNG screenshots produced by
 * `src/scripts/screenshot.ts`, hashes each one, maps each to placeholder
 * acceptance criteria, and assembles + validates a Visual Manifest v1
 * document against the copied F008 schema (fixtures/schemas/
 * visual-manifest-v1.schema.json). Refuses to write an invalid manifest.
 */
function main(argv: readonly string[]): number {
  const { artifactsDir, outPath } = parseArgs(argv);
  const resolvedArtifactsDir = resolveFromRoot(artifactsDir);
  const resolvedOutPath = resolveFromRoot(outPath);

  let entries: string[];
  try {
    entries = readdirSync(resolvedArtifactsDir).filter((name) => name.endsWith(".png"));
  } catch {
    process.stderr.write(
      `No artifacts directory at "${resolvedArtifactsDir}". Run \`pnpm run screenshot\` first.\n`,
    );
    return 1;
  }

  if (entries.length === 0) {
    process.stderr.write(
      `No PNG artifacts found in "${resolvedArtifactsDir}". Run \`pnpm run screenshot\` first.\n`,
    );
    return 1;
  }

  const artifacts = entries
    .sort()
    .map((fileName) => buildArtifactInput(fileName, path.join(resolvedArtifactsDir, fileName)));

  const commitSha = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf-8",
  }).trim();

  const manifest = buildVisualManifest({
    issueId: PLACEHOLDER_ISSUE_ID,
    commitSha,
    generatedAt: new Date().toISOString(),
    environment: {
      runner: "playwright",
      operatingSystem: `${os.platform()} ${os.release()}`,
      applicationVersion: SANDBOX_VERSION,
      viewport: STATUS_PAGE_VIEWPORT,
    },
    artifacts,
  });

  const { valid, errors } = validateVisualManifest(manifest);
  if (!valid) {
    process.stderr.write(`Generated manifest failed schema validation:\n${errors.join("\n")}\n`);
    return 1;
  }

  mkdirSync(path.dirname(resolvedOutPath), { recursive: true });
  writeFileSync(resolvedOutPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");

  process.stdout.write(
    `${JSON.stringify(
      {
        outPath: toRepoRelativePath(resolvedOutPath),
        schemaValid: true,
        artifacts: manifest.artifacts.map((artifact) => ({
          path: artifact.path,
          sha256: artifact.sha256,
          acceptanceCriteria: artifact.acceptanceCriteria,
        })),
      },
      null,
      2,
    )}\n`,
  );
  return 0;
}

process.exitCode = main(process.argv.slice(2));
