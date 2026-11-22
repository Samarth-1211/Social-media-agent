# Changelog

All notable changes to the `social-media-manager` plugin. Versions follow semver (see `docs/ARCHITECTURE.md`, Versioning).

## [0.2.0-alpha.1] - 2026-11-22

Group 2a: the market researcher. Research keeps an insight sheet per client with as little human work as possible and hands it to later stages. Contracts change additively; v1 sheets upgrade in place.

### Added
- `pre-production/research-methods` skill: method registry (11 methods), router, automation (triggers, unattended vs attended, task queue, weekly schedule, learning loop), caps, confidence rules, competitor discovery, one module per method; templates (plan, insight sheet, chat summary, pending browser task), before-saving checklist, examples. `./skills/pre-production` registered.
- `agents/market-researcher.md`: the first subagent. It runs the unattended part on Sonnet, in its own context, with limited tools, and returns only a summary. claude.ai chat (which ignores plugin agents) runs the same steps inline.
- Installed Instagram skills (`ig-viral`, `ig-audit`, `ig-audience-insights`, `ig-hook-extractor`) and `marketing:competitive-brief` are used by name when present, with our own fallback steps. Apify is optional, off by default, and admin-approved above a limit.
- Contracts: `research` stage (after intake; reused while fresh, skipped on urgent jobs, never blocks); optional stage keys `freshness_days`, `skippable_if_urgent`, `non_blocking_partial`, `spend_gate`; new `insight`, `research` and `task` schemas; client `own_handle`, `competitors`, `meta`, `latest_insight_id`; job `urgent`, `research_status`, `insight_id`; ledger `provider` and `currency`; gate kind `spend`; eight research config keys.
- Storage layout v2: Insights, InsightFindings and Tasks tabs; new columns at the end of Jobs, Clients and Credits; files-mode `insights/` and `tasks.json`; an in-place v1 → v2 upgrade (`sheet-setup.json` → `upgrades`, `google-sheets.md` §7).
- Tracker page: read-only "Latest insights" panel per client.
- Scheduled research: weekly cloud (or Cowork) task; setup and the exact prompt in the README.
- Evals: research fixtures for two fictional clients, headless scenario runner, scenarios R1–R16 and rubric, validator fault injection, method consistency and tracker page render checks. Results: `evals/results/2026-11-22_v0.2.0-alpha.1.md`.

### Changed
- `producer`: handles the optional stage keys, `urgent` at intake, the spend gate, and the research output with its job copies; path counts are now video quick 15, full 22, poster 8.
- `tracker`: research queue at session start (festival runs, one offer of pending Instagram reads), research view; credit totals count only Higgsfield credits (research money is shown separately).
- `brand-keeper`: a new client queues its first research run.
- Validator: checks the new stage keys, cross-schema references, research record consistency, and round-trips insights and tasks.

### Migration
Nothing breaks. Old jobs simply have no research output, old ledger rows count as credits, and old clients have no competitors yet. A sheet built with 0.1.0 needs the one-time upgrade (admin; `library/storage/google-sheets.md` §7) before research can save; everything else keeps working without it.

### Tested
- R1–R16 pass on fixtures (82/82 checks); validator, 18 planted faults, method consistency and tracker page render pass. Not covered: live Sheets upgrade, live smoke test, Claude app (see the results file).

## [0.1.0] - 2026-11-22

Group 1: control and brand. Jobs run from intake to delivery with real gates; every creative stage is a placeholder.

### Added
- Contracts v2: stages as placeholders with gate owners and credit_spend; final job, client, brief schemas; new request, team, config schemas; examples.
- Storage layer on Google Sheets + Drive: operations, setup, backup, sheet layout, tracker page with mock mode.
- `control/tracker` skill: status board, overdue, per client, per assignee, credits, catch-up card, team and backup actions. `./skills/control` registered.
- `control/producer` skill: runs jobs through stages and gates from `stages.yaml`, placeholder stages, gate permissions, budget gate, commands. `intake` is now `active`.
- `brand/brand-keeper` skill: onboarding from material or interview, confidence marks with basis, open questions with recommendations, client code, festival calendar suggestions, versions and changelog, learnings, brand brief. `./skills/brand` registered.
- `brand/client-feedback` skill: quote ledger, labels, conflict rules (contradiction, old version, multiple voices), Hinglish vague-note decoder, revision rounds and cap, routing table, change-list and WhatsApp message templates, three examples.
- Evals: two eval clients, Group 1 rubric and scenario scripts (S1–S11, with the S10 Claude-app checklist), results `evals/results/2026-11-22_v0.1.0.md`.
- Files mode keeps the full log in `jobs/<id>/log-full.json`; exports leave out empty cells; client-feedback asks producer to refresh `next_action` after saving feedback.
- Storage: `get_now` clock cell (`Config!D1:E1`); every timestamp comes from the sheet, not a guess. Sample data: SHL `next_job_number` 3; SHL-02 brief and concept outputs and NRH-01 request output added (the validator now checks that every stage a sample job marks done has its outputs).

### Tested
- Scenarios S1–S9 and S11 pass (`evals/results/2026-11-22_v0.1.0.md`); S10 is a checklist for the Claude app.

## [0.0.1] - 2026-11-21

### Added
- Plugin scaffold: manifest, Higgsfield remote MCP server, seven skill group folders with planned skills.
- Stage registry `library/contracts/stages.yaml` (21 video stages, 3 poster stages, all `planned`).
- Contract schemas: `job`, `client`, `brief` (drafted); `script`, `storyboard`, `package` (stubs).
- Preset schema `library/presets/_preset.schema.json`.
