import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { validateVisualManifest } from "../src/manifest/validate-visual-manifest.js";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(testDir, "..", "fixtures", "schemas");

interface InvalidPatch {
  readonly name: string;
  readonly patch?: Record<string, unknown>;
  readonly artifactPatch?: Record<string, unknown>;
}

const validManifest: unknown = JSON.parse(
  readFileSync(path.join(fixturesDir, "visual-manifest-v1.valid.json"), "utf-8"),
);
const invalidPatches = JSON.parse(
  readFileSync(path.join(fixturesDir, "visual-manifest-v1.invalid-patches.json"), "utf-8"),
) as InvalidPatch[];

function applyPatch(patch: InvalidPatch): unknown {
  const manifest = structuredClone(validManifest) as Record<string, unknown>;
  if (patch.patch) {
    Object.assign(manifest, patch.patch);
  }
  if (patch.artifactPatch) {
    const artifacts = manifest["artifacts"] as Record<string, unknown>[];
    const [firstArtifact] = artifacts;
    if (!firstArtifact) {
      throw new Error("expected the valid fixture to have at least one artifact");
    }
    Object.assign(firstArtifact, patch.artifactPatch);
  }
  return manifest;
}

describe("validateVisualManifest against the copied F008 schema", () => {
  it("accepts the core repo's own valid fixture, copied verbatim", () => {
    const result = validateVisualManifest(validManifest);
    expect(result.errors).toStrictEqual([]);
    expect(result.valid).toBe(true);
  });

  it.each(invalidPatches.map((patch) => [patch.name, patch] as const))(
    "rejects the core repo's own invalid fixture: %s",
    (_name, patch) => {
      const candidate = applyPatch(patch);
      const result = validateVisualManifest(candidate);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    },
  );

  it("rejects duplicate artifact paths (superRefine rule not present in the JSON Schema)", () => {
    const manifest = structuredClone(validManifest) as { artifacts: unknown[] };
    const [firstArtifact] = manifest.artifacts;
    manifest.artifacts.push(structuredClone(firstArtifact));
    const result = validateVisualManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((message) => message.includes("unique paths"))).toBe(true);
  });

  it("rejects duplicate acceptanceCriteria within one artifact (superRefine rule not present in the JSON Schema)", () => {
    const manifest = structuredClone(validManifest) as {
      artifacts: { acceptanceCriteria: string[] }[];
    };
    const [firstArtifact] = manifest.artifacts;
    if (!firstArtifact) {
      throw new Error("expected the valid fixture to have at least one artifact");
    }
    firstArtifact.acceptanceCriteria = ["same", "same"];
    const result = validateVisualManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((message) => message.includes("must not contain duplicates"))).toBe(
      true,
    );
  });

  it("rejects unknown additional top-level properties", () => {
    const manifest = { ...(validManifest as Record<string, unknown>), extra: "nope" };
    const result = validateVisualManifest(manifest);
    expect(result.valid).toBe(false);
  });
});
