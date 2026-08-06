import { describe, expect, it } from "vitest";
import { getSandboxStatus } from "../src/sandbox.js";

describe("getSandboxStatus", () => {
  it("returns a deterministic healthy payload for the default (none) mode", () => {
    expect(getSandboxStatus()).toStrictEqual({
      service: "agent-team-sandbox",
      version: "0.1.0",
      status: "ok",
      checks: { core: "pass" },
    });
  });

  it("returns the same payload when explicitly given mode 'none'", () => {
    expect(getSandboxStatus("none")).toStrictEqual(getSandboxStatus());
  });

  it("returns a controlled error payload when the failure switch is injected as 'status_corrupt'", () => {
    // Injected directly as a function argument -- this does NOT read or
    // mutate the repository's failure-switch.json, which must stay "none"
    // so this project's own CI remains green.
    expect(getSandboxStatus("status_corrupt")).toStrictEqual({
      service: "agent-team-sandbox",
      version: "0.1.0",
      status: "error",
      checks: { core: "fail" },
    });
  });
});
