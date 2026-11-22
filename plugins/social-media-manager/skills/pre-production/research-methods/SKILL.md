---
name: research-methods
description: Market research for TDM clients (competitors, ads, reviews, trends, Instagram outliers) into an insight sheet later stages use. Use to research a client, refresh research or run queued browser steps.
---
# research-methods

> Work in progress (Group 2a, M3): the method modules in `references/` are written; the full flow, templates, checklist, examples and the `market-researcher` subagent arrive in M4. The `research` stage stays a placeholder in `stages.yaml` until then.

## Purpose

Keep an up-to-date insight sheet for each client (`${CLAUDE_PLUGIN_ROOT}/library/contracts/insight.schema.json`) and hand its downstream block to the `research` stage.

## Reads

`client` (brand brief, competitors, festival calendar), `request` (the job goal), the previous insight sheet, config (`research_caps`, `freshness_days`, `apify_enabled`).

## Writes

`research` (`${CLAUDE_PLUGIN_ROOT}/library/contracts/research.schema.json`); insight and task records through the storage layer (`${CLAUDE_PLUGIN_ROOT}/library/storage/README.md`).

## Steps

1. Tool check and method choice: `${CLAUDE_SKILL_DIR}/references/router.md` and `${CLAUDE_SKILL_DIR}/references/methods-registry.md`.
2. Competitors: `${CLAUDE_SKILL_DIR}/references/competitor-discovery.md`.
3. Run the chosen `m-*.md` modules within `${CLAUDE_SKILL_DIR}/references/caps.md`.
4. Mark every finding with `${CLAUDE_SKILL_DIR}/references/confidence-rules.md`.
5. Triggers, queue and schedule: `${CLAUDE_SKILL_DIR}/references/automation.md`.

## Quality bar

Every finding has a source and a confidence mark; no invented numbers; outliers judged against each account's own median; no commenter or reviewer identities stored.

## Gate

None after the stage. Paid Apify runs above `research_auto_approve_limit` need the admin first (`spend` gate).

## If it fails

Missing tools remove their methods with a one-line note; attended methods without a browser are queued; nothing blocks the job.
