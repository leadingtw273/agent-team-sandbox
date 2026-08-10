import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatUptime } from "../src/util/formatUptime.js";

describe("formatUptime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0s when just started", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    vi.setSystemTime(now);
    expect(formatUptime(now)).toBe("uptime: 0s");
  });

  it("returns the elapsed seconds after tens of seconds", () => {
    const startedAt = new Date("2026-01-01T00:00:00.000Z");
    vi.setSystemTime(new Date("2026-01-01T00:00:42.000Z"));
    expect(formatUptime(startedAt)).toBe("uptime: 42s");
  });

  it("floors and supports elapsed time over a minute", () => {
    const startedAt = new Date("2026-01-01T00:00:00.000Z");
    vi.setSystemTime(new Date("2026-01-01T00:01:30.999Z"));
    expect(formatUptime(startedAt)).toBe("uptime: 90s");
  });
});
