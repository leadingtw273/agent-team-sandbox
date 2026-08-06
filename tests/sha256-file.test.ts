import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { sha256File } from "../src/util/sha256-file.js";

describe("sha256File", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "agent-team-sandbox-sha256-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("matches an independently computed digest of the same bytes", () => {
    const filePath = path.join(dir, "sample.bin");
    const bytes = Buffer.from("agent-team-sandbox visual manifest fixture", "utf-8");
    writeFileSync(filePath, bytes);

    const expected = createHash("sha256").update(bytes).digest("hex");
    expect(sha256File(filePath)).toBe(expected);
    expect(sha256File(filePath)).toMatch(/^[0-9a-f]{64}$/);
  });

  it("changes when the file's bytes change", () => {
    const filePath = path.join(dir, "sample.bin");
    writeFileSync(filePath, "one");
    const first = sha256File(filePath);
    writeFileSync(filePath, "two");
    const second = sha256File(filePath);
    expect(first).not.toBe(second);
  });
});
