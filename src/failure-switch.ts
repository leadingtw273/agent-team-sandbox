import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Closed union of deterministic failure-injection modes.
 *
 * "none" is the only mode that must ever be committed to the repository's
 * `failure-switch.json`. Additional modes exist purely so later Agent Team
 * end-to-end cases can flip the switch (in a disposable branch/PR, never on
 * `main`) to deterministically break this sandbox's own tests and observe a
 * managed CI-failure-repair workflow. Flipping the switch can only ever
 * affect this sandbox project's own status output and test suite — it has
 * no reach into any other repository, secret, or system.
 */
export type FailureMode = "none" | "status_corrupt";

const FAILURE_MODES: ReadonlySet<FailureMode> = new Set(["none", "status_corrupt"]);

export interface FailureSwitchFile {
  mode: string;
}

/**
 * Validates an arbitrary parsed JSON value against the closed
 * {@link FailureMode} union. Throws on anything else so a malformed switch
 * file fails loudly instead of silently degrading to a default.
 */
export function parseFailureMode(value: unknown): FailureMode {
  if (
    typeof value === "object" &&
    value !== null &&
    "mode" in value &&
    typeof (value as FailureSwitchFile).mode === "string" &&
    FAILURE_MODES.has((value as FailureSwitchFile).mode as FailureMode)
  ) {
    return (value as FailureSwitchFile).mode as FailureMode;
  }

  throw new Error(
    `Invalid failure-switch payload: expected { "mode": ${[...FAILURE_MODES]
      .map((mode) => `"${mode}"`)
      .join(" | ")} }`,
  );
}

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSwitchPath = path.join(moduleDir, "..", "failure-switch.json");

/**
 * Reads and validates `failure-switch.json` from the repository root.
 * Defaults to the file next to the built package unless a path is supplied
 * (used by tests to point at fixtures without touching the real switch).
 */
export function loadFailureMode(switchPath: string = defaultSwitchPath): FailureMode {
  const raw = readFileSync(switchPath, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  return parseFailureMode(parsed);
}
