import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

/**
 * Returns the lowercase hex SHA-256 digest of a file's bytes, in the exact
 * form the Visual Manifest v1 schema expects (`^[0-9a-f]{64}$`).
 */
export function sha256File(absolutePath: string): string {
  const bytes = readFileSync(absolutePath);
  return createHash("sha256").update(bytes).digest("hex");
}
