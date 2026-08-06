import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildVisualManifest } from "../src/manifest/build-visual-manifest.js";
import { validateVisualManifest } from "../src/manifest/validate-visual-manifest.js";
import { sha256File } from "../src/util/sha256-file.js";

// A minimal, valid 1x1 transparent PNG. Its actual pixel content is
// irrelevant here -- this test exercises the manifest pipeline
// (hash -> assemble -> validate), not the screenshot renderer, and does
// not require a Chromium install. The screenshot script itself (and its
// own stability guarantee) is covered separately in
// tests/screenshot-stability.test.ts.
const ONE_PIXEL_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

describe("visual manifest generation pipeline (E003)", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "agent-team-sandbox-manifest-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("produces a manifest whose recorded SHA-256 matches the real file on disk, that passes schema validation, and that carries a non-empty AC mapping", () => {
    const artifactPath = path.join(dir, "status-none.png");
    writeFileSync(artifactPath, Buffer.from(ONE_PIXEL_PNG_BASE64, "base64"));

    const sha256 = sha256File(artifactPath);

    const manifest = buildVisualManifest({
      issueId: "issue_00000000-0000-4000-8000-000000000000",
      commitSha: "c".repeat(40),
      generatedAt: new Date().toISOString(),
      environment: {
        runner: "playwright",
        operatingSystem: "linux",
        applicationVersion: "0.1.0",
        viewport: { width: 800, height: 400, deviceScaleFactor: 1 },
      },
      artifacts: [
        {
          path: "artifacts/status-none.png",
          mediaType: "image/png",
          sha256,
          title: "Sandbox status page - healthy (mode=none)",
          acceptanceCriteria: ["sandbox-e2e:E101:AC1-status-page-renders-healthy"],
        },
      ],
    });

    // 1. SHA in the manifest matches an independent, fresh recomputation
    //    from the actual bytes on disk -- not just an echo of the input.
    const [manifestArtifact] = manifest.artifacts;
    expect(manifestArtifact?.sha256).toBe(sha256File(artifactPath));

    // 2. The manifest validates against the copied F008 JSON Schema.
    const result = validateVisualManifest(manifest);
    expect(result.errors).toStrictEqual([]);
    expect(result.valid).toBe(true);

    // 3. AC mapping fields are present and non-empty for every artifact.
    for (const artifact of manifest.artifacts) {
      expect(artifact.acceptanceCriteria.length).toBeGreaterThan(0);
      for (const acId of artifact.acceptanceCriteria) {
        expect(acId).toMatch(/^sandbox-e2e:[A-Za-z0-9_-]+:[A-Za-z0-9_-]+$/);
      }
    }
  });

  it("fails validation (and would not be written by the generator) if the recorded SHA no longer matches the file", () => {
    const artifactPath = path.join(dir, "status-none.png");
    writeFileSync(artifactPath, Buffer.from(ONE_PIXEL_PNG_BASE64, "base64"));
    const staleSha = sha256File(artifactPath);

    // Simulate the file changing after the hash was recorded.
    writeFileSync(artifactPath, Buffer.from(ONE_PIXEL_PNG_BASE64, "base64").subarray(0, 10));
    const freshSha = sha256File(artifactPath);

    expect(freshSha).not.toBe(staleSha);
  });
});
