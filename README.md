# agent-team-sandbox

A minimal, standalone Node.js project managed by [Agent Team](https://github.com/leadingtw273/agent-team)
for probing GitHub registration, CI wiring, and end-to-end workflows.

This repository is **not** part of Agent Team's core codebase and contains no core logic and no
secrets. It exists purely as a small, safe target that Agent Team's own automation can register,
watch, and (later) intentionally break/repair against — without any risk to a real project.

## What's here

- `src/sandbox.ts` — one pure, observable function: `getSandboxStatus(mode)`, returning a
  deterministic JSON status payload.
- `src/failure-switch.ts` — reads and validates `failure-switch.json` against a closed set of
  modes (`"none" | "status_corrupt"`).
- `src/cli.ts` — a tiny CLI (`agent-team-sandbox status`) that prints the status payload as JSON.
- `tests/` — unit tests covering both the healthy and failure-injected states.
- `.github/workflows/ci.yml` — install → lint → typecheck → test → build. The job is named `CI`
  exactly, because Agent Team's registration probe treats a required check named `CI` as a hard
  contract.

## Running locally

Requires Node 24 and pnpm 10.

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
node dist/cli.js status
```

`node dist/cli.js status` prints deterministic JSON, e.g.:

```json
{
  "service": "agent-team-sandbox",
  "version": "0.1.0",
  "status": "ok",
  "checks": { "core": "pass" }
}
```

## The failure switch

`failure-switch.json` at the repo root controls a deterministic failure-injection mode for this
sandbox's own status output:

```json
{ "mode": "none" }
```

- `"none"` (the only value ever committed to `main`) — everything reports healthy.
- `"status_corrupt"` — `getSandboxStatus()` returns a controlled error payload
  (`status: "error"`, `checks.core: "fail"`) instead of the healthy one.

This switch exists so a later Agent Team end-to-end case can flip it (on a disposable branch/PR,
never on `main`) to deterministically make this project's own CI fail, in order to exercise a
managed CI-failure-repair workflow. Flipping it can only ever affect **this sandbox's own** status
output and test suite — it has no dependency on, or reach into, any other repository, credential,
or system. The unit tests in `tests/` exercise both switch states by passing the mode directly
into `getSandboxStatus()`/via a fixture file, not by editing the committed switch, so this
project's CI stays green under normal operation.
