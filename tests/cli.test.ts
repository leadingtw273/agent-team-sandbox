import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(testDir, "..", "dist", "cli.js");

describe("cli status", () => {
  it("prints deterministic JSON and exits 0 when the repo failure switch is 'none'", () => {
    const output = execFileSync("node", [cliPath, "status"], { encoding: "utf-8" });

    expect(JSON.parse(output)).toStrictEqual({
      schemaVersion: 1,
      service: "agent-team-sandbox",
      version: "0.1.0",
      status: "ok",
      checks: { core: "pass" },
    });
  });

  it("prints usage and exits 1 for an unknown command", () => {
    expect(() => execFileSync("node", [cliPath, "bogus"], { encoding: "utf-8" })).toThrow();
  });
});
