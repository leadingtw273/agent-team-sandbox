import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function nonEmptyLines(path: string): string[] {
  return readFileSync(path, "utf8")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

describe("format policy", () => {
  it("excludes only the canonical trusted project config path from Prettier", () => {
    const ignoreEntries = nonEmptyLines(".prettierignore");

    expect(ignoreEntries.filter((entry) => entry === ".agent-team/project.json")).toHaveLength(1);
    expect(ignoreEntries).not.toContain(".agent-team/");
    expect(ignoreEntries).not.toContain(".agent-team/**");
  });

  it("runs the repository format check exactly once in the required CI job", () => {
    const workflow = readFileSync(".github/workflows/ci.yml", "utf8");

    expect(workflow.match(/^\s+- name: Format check$/gmu)).toHaveLength(1);
    expect(workflow.match(/^\s+run: pnpm format:check$/gmu)).toHaveLength(1);
  });
});
