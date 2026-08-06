import { describe, expect, it } from "vitest";
import { buildVisualManifest } from "../src/manifest/build-visual-manifest.js";

const baseInput = {
  issueId: "issue_00000000-0000-4000-8000-000000000000",
  commitSha: "a".repeat(40),
  generatedAt: "2026-08-06T00:00:00.000Z",
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
      sha256: "b".repeat(64),
      title: "Sandbox status page - healthy",
      acceptanceCriteria: ["sandbox-e2e:E101:AC1"],
    },
  ],
};

describe("buildVisualManifest", () => {
  it("is a pure function of its input (no clock, no I/O, no randomness)", () => {
    expect(buildVisualManifest(baseInput)).toStrictEqual(buildVisualManifest(baseInput));
  });

  it("sets schemaVersion to the literal 1 required by F008", () => {
    expect(buildVisualManifest(baseInput).schemaVersion).toBe(1);
  });

  it("passes every input field through without silently dropping or defaulting anything", () => {
    const manifest = buildVisualManifest(baseInput);
    expect(manifest.issueId).toBe(baseInput.issueId);
    expect(manifest.commitSha).toBe(baseInput.commitSha);
    expect(manifest.generatedAt).toBe(baseInput.generatedAt);
    expect(manifest.environment).toStrictEqual(baseInput.environment);
    expect(manifest.artifacts).toStrictEqual(baseInput.artifacts);
  });

  it("defensively copies nested arrays/objects instead of aliasing the input", () => {
    const input = structuredClone(baseInput);
    const manifest = buildVisualManifest(input);

    const [inputArtifact] = input.artifacts;
    if (!inputArtifact) {
      throw new Error("expected baseInput to have at least one artifact");
    }
    inputArtifact.acceptanceCriteria.push("sandbox-e2e:mutated:AC9");

    const [manifestArtifact] = manifest.artifacts;
    expect(manifestArtifact?.acceptanceCriteria).toStrictEqual(["sandbox-e2e:E101:AC1"]);
  });
});
