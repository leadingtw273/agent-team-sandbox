export interface VisualManifestArtifact {
  readonly path: string;
  readonly mediaType: string;
  readonly sha256: string;
  readonly title: string;
  readonly acceptanceCriteria: readonly string[];
}

export interface VisualManifestEnvironment {
  readonly runner: string;
  readonly operatingSystem: string;
  readonly applicationVersion?: string;
  readonly viewport?: {
    readonly width: number;
    readonly height: number;
    readonly deviceScaleFactor: number;
  };
}

export interface BuildVisualManifestInput {
  readonly issueId: string;
  readonly commitSha: string;
  readonly generatedAt: string;
  readonly environment: VisualManifestEnvironment;
  readonly artifacts: readonly VisualManifestArtifact[];
}

export interface VisualManifest {
  readonly schemaVersion: 1;
  readonly issueId: string;
  readonly commitSha: string;
  readonly generatedAt: string;
  readonly environment: VisualManifestEnvironment;
  readonly artifacts: readonly VisualManifestArtifact[];
}

/**
 * Pure assembler for a Visual Manifest v1 document (schema mirrored at
 * fixtures/schemas/visual-manifest-v1.schema.json, copied from Agent Team
 * core's `visualManifestSchema` -- see fixtures/schemas/SOURCE.md).
 *
 * Deliberately does no I/O and applies no defaults: callers must supply
 * already-computed SHA-256 hashes, a real commit SHA and a real timestamp.
 * That keeps this function a deterministic, easily unit-tested translation
 * from "artifacts we have on disk" to "a manifest shaped exactly like
 * F008's contract" -- all the impure parts (reading files, hashing them,
 * calling `git rev-parse`) live in src/scripts/generate-manifest.ts.
 */
export function buildVisualManifest(input: BuildVisualManifestInput): VisualManifest {
  return {
    schemaVersion: 1,
    issueId: input.issueId,
    commitSha: input.commitSha,
    generatedAt: input.generatedAt,
    environment: { ...input.environment },
    artifacts: input.artifacts.map((artifact) => ({
      ...artifact,
      acceptanceCriteria: [...artifact.acceptanceCriteria],
    })),
  };
}
