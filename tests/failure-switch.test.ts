import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadFailureMode, parseFailureMode } from "../src/failure-switch.js";

describe("parseFailureMode", () => {
  it("accepts 'none'", () => {
    expect(parseFailureMode({ mode: "none" })).toBe("none");
  });

  it("accepts 'status_corrupt'", () => {
    expect(parseFailureMode({ mode: "status_corrupt" })).toBe("status_corrupt");
  });

  it("rejects modes outside the closed union", () => {
    expect(() => parseFailureMode({ mode: "delete_everything" })).toThrow(
      /Invalid failure-switch payload/,
    );
  });

  it("rejects malformed payloads", () => {
    expect(() => parseFailureMode(null)).toThrow(/Invalid failure-switch payload/);
    expect(() => parseFailureMode({})).toThrow(/Invalid failure-switch payload/);
    expect(() => parseFailureMode({ mode: 1 })).toThrow(/Invalid failure-switch payload/);
  });
});

describe("loadFailureMode", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "agent-team-sandbox-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("reads a valid switch file from a fixture path, without touching the repo's own switch", () => {
    const fixturePath = path.join(dir, "failure-switch.json");
    writeFileSync(fixturePath, JSON.stringify({ mode: "status_corrupt" }), "utf-8");

    expect(loadFailureMode(fixturePath)).toBe("status_corrupt");
  });

  it("loads the repository's own failure-switch.json as 'none'", () => {
    // This exercises the real default path used by the CLI. It must stay
    // "none" for CI to remain green.
    expect(loadFailureMode()).toBe("none");
  });
});
