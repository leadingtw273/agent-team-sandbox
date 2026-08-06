import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv2020 } from "ajv/dist/2020.js";
import type { AnySchemaObject, ValidateFunction } from "ajv/dist/2020.js";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSchemaPath = path.join(
  moduleDir,
  "..",
  "..",
  "fixtures",
  "schemas",
  "visual-manifest-v1.schema.json",
);

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

let cachedValidator: ValidateFunction | undefined;

function loadValidator(schemaPath: string): ValidateFunction {
  if (schemaPath === defaultSchemaPath && cachedValidator) {
    return cachedValidator;
  }

  const schema = JSON.parse(readFileSync(schemaPath, "utf-8")) as AnySchemaObject;
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validator = ajv.compile(schema);

  if (schemaPath === defaultSchemaPath) {
    cachedValidator = validator;
  }

  return validator;
}

function collectDuplicateArtifactPaths(candidate: { artifacts?: unknown }): string[] {
  if (!Array.isArray(candidate.artifacts)) {
    return [];
  }

  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const artifact of candidate.artifacts) {
    if (typeof artifact !== "object" || artifact === null || !("path" in artifact)) {
      continue;
    }
    const value = (artifact as { path: unknown }).path;
    if (typeof value !== "string") {
      continue;
    }
    if (seen.has(value)) {
      duplicates.push(value);
    }
    seen.add(value);
  }
  return duplicates;
}

function collectArtifactsWithDuplicateAcceptanceCriteria(candidate: {
  artifacts?: unknown;
}): number[] {
  if (!Array.isArray(candidate.artifacts)) {
    return [];
  }

  const indexes: number[] = [];
  candidate.artifacts.forEach((artifact: unknown, index: number) => {
    if (typeof artifact !== "object" || artifact === null || !("acceptanceCriteria" in artifact)) {
      return;
    }
    const value = artifact.acceptanceCriteria;
    if (!Array.isArray(value)) {
      return;
    }
    if (new Set(value).size !== value.length) {
      indexes.push(index);
    }
  });
  return indexes;
}

/**
 * Validates a candidate manifest against the copied Visual Manifest v1
 * JSON Schema, then applies two supplementary structural checks that the
 * core repo's `visualManifestSchema` enforces via Zod `.superRefine` but
 * that its exported JSON Schema does not encode (see fixtures/schemas/
 * SOURCE.md "Known gap"):
 *
 * - no two artifacts may share the same `path`
 * - no single artifact's `acceptanceCriteria` may contain duplicates
 *
 * `schemaPath` is overridable purely for tests that want to point at a
 * fixture schema instead of the real one.
 */
export function validateVisualManifest(
  candidate: unknown,
  schemaPath: string = defaultSchemaPath,
): ValidationResult {
  const validate = loadValidator(schemaPath);
  const structurallyValid = validate(candidate);
  const errors: string[] = [];

  if (!structurallyValid) {
    for (const error of validate.errors ?? []) {
      errors.push(`${error.instancePath || "(root)"} ${error.message ?? "is invalid"}`);
    }
  }

  if (typeof candidate === "object" && candidate !== null) {
    const record = candidate as { artifacts?: unknown };

    for (const duplicatePath of collectDuplicateArtifactPaths(record)) {
      errors.push(`artifacts must have unique paths, duplicate: "${duplicatePath}"`);
    }

    for (const index of collectArtifactsWithDuplicateAcceptanceCriteria(record)) {
      errors.push(`artifacts[${String(index)}].acceptanceCriteria must not contain duplicates`);
    }
  }

  return { valid: errors.length === 0, errors };
}
