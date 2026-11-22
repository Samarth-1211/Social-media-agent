---
name: brief
description: Not ready yet (feat/brief, references only). Will draft TDM creative briefs after research and parse the client's reply to brief questions. Don't use until the stage is active.
---
# brief

> **Skeleton.** This skill is being built on branch `feat/brief`. Milestone M3 added its references; M4 writes the full instructions. The `brief` stage is still a `placeholder` in `stages.yaml`, so the producer doesn't call this skill yet.

## Purpose

Turn everything already known about a job into a production-ready creative brief (`${CLAUDE_PLUGIN_ROOT}/library/contracts/brief.schema.json`), asking only what's truly missing, in plain language.

## Reads

Defined in M4. References: `${CLAUDE_SKILL_DIR}/references/inference-rules.md`, `${CLAUDE_SKILL_DIR}/references/research-input.md`.

## Writes

Defined in M4: `brief`, through the storage layer (`${CLAUDE_PLUGIN_ROOT}/library/storage/README.md` §5).

## Steps

Defined in M4. Draft rules: `${CLAUDE_SKILL_DIR}/references/field-guide.md`, `${CLAUDE_SKILL_DIR}/references/essentials.md`, `${CLAUDE_SKILL_DIR}/references/interview-rules.md`, `${CLAUDE_SKILL_DIR}/references/layman-glossary.md`, `${CLAUDE_SKILL_DIR}/references/objective-to-format.md`, `${CLAUDE_SKILL_DIR}/references/platform-variants.md`, `${CLAUDE_SKILL_DIR}/references/proof-and-claims.md`.

## Quality bar

Defined in M4.

## Gate

Admin (`stages.yaml`). Defined in M4.

## If it fails

Defined in M4.
