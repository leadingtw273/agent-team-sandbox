import { describe, expect, it } from "vitest";
import { getSandboxStatus } from "../src/sandbox.js";
import { renderStatusPage, STATUS_PAGE_VIEWPORT } from "../src/ui/index.js";

describe("renderStatusPage", () => {
  it("is a pure function: identical input renders byte-identical output", () => {
    const first = renderStatusPage(getSandboxStatus("none"));
    const second = renderStatusPage(getSandboxStatus("none"));
    expect(first).toBe(second);
  });

  it("renders visibly different markup for healthy vs. failure-injected status", () => {
    const healthy = renderStatusPage(getSandboxStatus("none"));
    const corrupt = renderStatusPage(getSandboxStatus("status_corrupt"));

    expect(healthy).not.toBe(corrupt);
    expect(healthy).toContain("panel ok");
    expect(healthy).toContain(">OK<");
    expect(corrupt).toContain("panel error");
    expect(corrupt).toContain(">ERROR<");
  });

  it("echoes the status payload's own service/version/core fields in the footer", () => {
    const status = getSandboxStatus("none");
    const html = renderStatusPage(status);
    expect(html).toContain(status.service);
    expect(html).toContain(status.version);
    expect(html).toContain(status.checks.core);
  });

  it("loads no external resources (no network URLs, no <link> tags)", () => {
    const html = renderStatusPage(getSandboxStatus("none"));
    expect(html).not.toMatch(/https?:\/\//i);
    expect(html).not.toMatch(/<link[\s>]/i);
    expect(html).not.toMatch(/<script[\s>]/i);
  });

  it("fixes the viewport contract used by the screenshot script", () => {
    expect(STATUS_PAGE_VIEWPORT).toStrictEqual({
      width: 800,
      height: 400,
      deviceScaleFactor: 1,
    });
  });
});
