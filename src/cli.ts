#!/usr/bin/env node
import { loadFailureMode } from "./failure-switch.js";
import { getSandboxStatus } from "./sandbox.js";

function main(argv: readonly string[]): number {
  const [command] = argv;

  if (command !== "status") {
    process.stderr.write(`Usage: agent-team-sandbox status\n`);
    return 1;
  }

  const mode = loadFailureMode();
  const result = getSandboxStatus(mode);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  return result.status === "ok" ? 0 : 1;
}

process.exitCode = main(process.argv.slice(2));
