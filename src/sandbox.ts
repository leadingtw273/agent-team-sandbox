import type { FailureMode } from "./failure-switch.js";

export const SANDBOX_SERVICE_NAME = "agent-team-sandbox";
export const SANDBOX_VERSION = "0.1.0";

export const SANDBOX_SCHEMA_VERSION = 1;

export interface SandboxStatus {
  schemaVersion: number;
  service: string;
  version: string;
  status: "ok" | "error";
  checks: {
    core: "pass" | "fail";
  };
}

/**
 * Returns a deterministic status payload for this sandbox project.
 *
 * This is intentionally the sandbox's only "observable feature": a pure
 * function with no I/O, no clock, and no randomness, so both its normal
 * output and its failure-injected output are exact-match testable and safe
 * to expose over the CLI as deterministic JSON.
 *
 * `mode` defaults to "none" (healthy). Passing "status_corrupt" simulates a
 * controlled failure — used by tests and, later, by Agent Team end-to-end
 * cases that exercise a CI-failure-repair workflow — without ever needing
 * to mutate the repository's own `failure-switch.json`.
 */
export function getSandboxStatus(mode: FailureMode = "none"): SandboxStatus {
  if (mode === "status_corrupt") {
    return {
      schemaVersion: SANDBOX_SCHEMA_VERSION,
      service: SANDBOX_SERVICE_NAME,
      version: SANDBOX_VERSION,
      status: "error",
      checks: {
        core: "fail",
      },
    };
  }

  return {
    schemaVersion: SANDBOX_SCHEMA_VERSION,
    service: SANDBOX_SERVICE_NAME,
    version: SANDBOX_VERSION,
    status: "ok",
    checks: {
      core: "pass",
    },
  };
}
