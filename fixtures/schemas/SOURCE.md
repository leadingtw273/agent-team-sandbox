# Provenance: Visual Manifest v1 fixtures

The three JSON files in this directory are **data copies**, not code, taken from the Agent Team
core repository (`leadingtw273/agent-team`, read-only reference for this sandbox):

| File here                                 | Copied from (core repo)                           |
| ----------------------------------------- | ------------------------------------------------- |
| `visual-manifest-v1.schema.json`          | `schemas/visual-manifest-v1.json`                 |
| `visual-manifest-v1.valid.json`           | `fixtures/domain/visual-manifest-v1.valid.json`   |
| `visual-manifest-v1.invalid-patches.json` | `fixtures/domain/visual-manifest-v1.invalid.json` |

- Core repo commit at copy time: `21a6ba0c80a50573cfdc4eff05ba6f96ff6d37c5`.
- The schema file was last modified there at commit `44be180dbad523e66090f8068ab7afe0e6769939`.
- Source of truth is `src/domain/checkpoint/schema.ts` (`visualManifestSchema`, roughly lines
  151-175 as of the commit above), a Zod schema exported to JSON Schema (`z.toJSONSchema`,
  draft 2020-12) as `visualManifestJsonSchema`. This directory's `.schema.json` is that generated
  output, byte-for-byte except for one added `$comment` key noting it is a copy.
- `schemaVersion` is pinned to `1` ("Visual Manifest v1"); F008 in `docs/plan.md` is the task that
  defined it.

## Known gap: business rules not encoded in the JSON Schema

Zod's `visualManifestSchema` also has a `.superRefine` that rejects duplicate `artifacts[].path`
values, and `visualArtifactSchema` has its own `.superRefine` rejecting duplicate
`acceptanceCriteria` entries _within one artifact_. `z.toJSONSchema` does not lower `superRefine`
into JSON Schema keywords, so plain JSON Schema validation (e.g. via ajv here) cannot see those two
rules. `src/manifest/validate-visual-manifest.ts` in this sandbox adds them back as small
supplementary checks alongside the ajv/JSON-Schema check, so this sandbox's validator matches the
core schema's full behavior, not just its JSON Schema projection. If the core schema ever adds more
non-representable business rules, this sandbox's validator will silently miss them until someone
re-reads `schema.ts` and updates the supplementary checks -- flagged here so a future reader knows
where the seam is.

## Maintenance

If F008's schema changes in the core repo, re-copy these three files (and bump the commit
references above) rather than hand-editing them, so this sandbox stays a faithful mirror of a
schema it does not own.
