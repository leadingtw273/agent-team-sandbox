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
- `src/ui/render-status-page.ts` — a pure function rendering the status payload as a
  self-contained, deterministic static HTML page (see "The static status page & screenshots"
  below).
- `src/scripts/screenshot.ts` — `pnpm run screenshot`: renders that page and captures a decisive
  PNG with Playwright Chromium at a fixed viewport.
- `tests/` — unit tests covering both the healthy and failure-injected states, the status page
  renderer, and (local-only) screenshot determinism.
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

For the screenshot tooling (optional — not required for `pnpm test`/CI to pass):

```bash
pnpm exec playwright install chromium   # one-time, downloads a local Chromium build
pnpm run screenshot                     # artifacts/status-none.png + SHA-256 on stdout
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

## The static status page & screenshots

`src/ui/render-status-page.ts` renders `getSandboxStatus(mode)` as a self-contained HTML document
(inline CSS only — no external fonts, images, scripts, or network requests of any kind). Content
is deliberately almost all fixed-size geometry and flat color: a rounded panel + circular badge
that switch between green/"OK" and red/"ERROR", plus one line of text echoing the status payload's
own `service`/`version`/`checks.core` fields. Animations/transitions are disabled in CSS so a
screenshot taken any time after page load can't land mid-transition. This is the sandbox's
"observable feature" made visual — the page's only two states are exactly the CLI's two JSON
outputs (mode `"none"` vs `"status_corrupt"`), so a failure-switch flip is visibly, not just
textually, detectable.

First-time setup (once per machine):

```bash
pnpm exec playwright install chromium
```

Capture a screenshot:

```bash
pnpm run screenshot
```

This reads the repository's own `failure-switch.json` (always `"none"` on `main`), renders the
page, launches headless Chromium at a fixed 800×400 viewport / deviceScaleFactor 1, and writes
`artifacts/status-<mode>.png` (gitignored — never committed), printing its path and SHA-256 as
JSON, e.g.:

```json
{ "mode": "none", "path": "artifacts/status-none.png", "sha256": "19ba8c55...2d71" }
```

You can also render a specific mode directly, without touching the committed switch file — this
is what the local-only stability test uses to get both a "healthy" and a "corrupt" screenshot in
one run:

```bash
node dist/scripts/screenshot.js --mode=status_corrupt
```

**Determinism contract**: running `pnpm run screenshot` twice *on the same machine, with the same
installed Chromium build*, for the same mode, must print the same SHA-256. That guarantee is
verified automatically by `tests/screenshot-stability.test.ts` whenever Chromium is installed and
`CI` is unset (see "CI decision" right below). Cross-machine or cross-Chromium-version pixel
differences are a known, explicitly out-of-scope risk — this contract is same-environment
repeatability only, never a committed "golden hash" to diff against.

**CI decision**: `tests/screenshot-stability.test.ts` is **local-only** — it auto-skips whenever
`CI` is set, or whenever Chromium isn't found on disk. This repo's `CI` workflow does not install
Playwright's Chromium or its OS-level dependencies, to keep CI fast, avoid a new source of
flakiness on shared runners, and stay inside the existing 10-minute job budget. If Chromium is
ever installed in CI (e.g. a future case genuinely needs a real screenshot in the pipeline), this
same test file starts running there automatically — no code change required.
