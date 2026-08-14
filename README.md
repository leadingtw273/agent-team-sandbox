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
- `src/manifest/` + `src/scripts/generate-manifest.ts` — `pnpm run manifest`: turns the PNGs in
  `artifacts/` into a Visual Manifest v1 document validated against a schema copied from Agent
  Team core (see "Visual Manifest generator" below).
- `tests/` — unit tests covering both the healthy and failure-injected states, the status page
  renderer, the manifest pipeline, and (local-only) screenshot determinism.
- `.github/workflows/ci.yml` — install → format check → lint → typecheck → test → build. The job is
  named `CI` exactly, because Agent Team's registration probe treats a required check named `CI`
  as a hard contract.

## Running locally

Requires Node 24 and pnpm 10.

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
node dist/cli.js status
```

`.agent-team/project.json` is deliberately excluded from Prettier. Agent Team writes that trusted
configuration in its canonical serialized form and binds its exact content digest during project
activation; formatting it as presentation JSON would invalidate the activation without changing
the configuration's meaning.

For the screenshot/manifest tooling (optional — not required for `pnpm test`/CI to pass):

```bash
pnpm exec playwright install chromium   # one-time, downloads a local Chromium build
pnpm run screenshot                     # artifacts/status-none.png + SHA-256 on stdout
pnpm run manifest                       # artifacts/visual-manifest.json, schema-validated (requires screenshot output)
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
is what the manifest generator and the local-only stability test use to get both a "healthy" and a
"corrupt" screenshot in one run:

```bash
node dist/scripts/screenshot.js --mode=status_corrupt
```

**Determinism contract**: running `pnpm run screenshot` twice _on the same machine, with the same
installed Chromium build_, for the same mode, must print the same SHA-256. That guarantee is
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

## Visual Manifest generator

`pnpm run manifest` scans `artifacts/*.png`, hashes each file, and assembles a **Visual Manifest
v1** JSON document — the format F008 defines in Agent Team core for attaching visual evidence to
an issue/PR. This sandbox does not own that schema; it keeps a read-only **data copy** of it (see
`fixtures/schemas/SOURCE.md` for exact provenance/commit references) and validates every generated
manifest against that copy before writing it.

```bash
pnpm run screenshot                              # produces artifacts/status-none.png
node dist/scripts/screenshot.js --mode=status_corrupt  # produces artifacts/status-status_corrupt.png
pnpm run manifest                                # produces artifacts/visual-manifest.json
```

The generator refuses to write a manifest that fails schema validation. Each artifact's
`sha256` is a fresh digest of the actual file on disk at generation time (not copied from the
screenshot script's own printed output), so a manifest's SHA and the real file are guaranteed to
agree — `tests/manifest-pipeline.test.ts` asserts this same guarantee at the unit level with a
synthetic fixture image (no Chromium required).

**Acceptance-criteria (AC) mapping placeholders**: this sandbox has no real registered GitHub
issue or Linear issue (that's E004, out of scope here), so `acceptanceCriteria` entries use a
sandbox-local placeholder scheme instead of real Linear/GitHub identifiers:

```
sandbox-e2e:<caseId>:<acId>
```

`<caseId>` names one of the plan's `E1xx` end-to-end cases an artifact will eventually support
(e.g. `E101`); `<acId>` is a short local label. `issueId` is similarly a fixed placeholder UUID
(`issue_00000000-0000-4000-8000-000000000000`) satisfying F008's `issue_<uuid>` pattern. When this
sandbox is later registered (E004) and wired into real E1xx cases, these placeholders are meant to
be replaced by real ids, not treated as permanent.

**CI decision**: unlike the screenshot-determinism suite, the manifest pipeline and
schema-validation tests (`tests/manifest-pipeline.test.ts`, `tests/validate-visual-manifest.test.ts`,
`tests/build-visual-manifest.test.ts`) need no browser — they run in CI unconditionally as part of
`pnpm test`, since schema conformance and SHA/AC integrity are the actual contract F008 cares
about, independent of how the screenshots themselves were captured.
