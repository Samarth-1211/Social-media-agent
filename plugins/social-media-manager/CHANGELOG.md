# Changelog

All notable changes to the `social-media-manager` plugin. Versions follow semver (see `docs/ARCHITECTURE.md`, Versioning).

## [Unreleased] - feat/brief

Group 2a, agent 2: the brief. The version number is set when this branch merges with the market researcher (`docs/merge-notes/feat-brief.md`).

### Added
- `pre-production/brief` skill:
  - drafts the brief by itself from the request, profile, research (once merged), past jobs, festival calendar and defaults;
  - asks only blocking essentials (team, client or express mode, at most `brief_max_questions`), in plain Hinglish, Hindi or English;
  - one WhatsApp message for client-only questions, and reads the client's reply while the brief is `awaiting-client`;
  - self-check "could an editor start without asking"; admin gate with optional auto-approve.

  `./skills/pre-production` registered; the `brief` stage is `active`.
- Contracts (`x-version` 2, all additive):
  - `brief.schema.json`: `status`, `changelog`, `job_kind`, `objective_label`, `*_detail` pairs, `proof_points`, `creative_format`, master format, `writing_script`, `research`, `confidence`, `client_questions`, `self_check`, `downstream`, `deliverables[].changes_from_master`;
  - `config.schema.json`: `brief_auto_approve_repeat` (false), `brief_max_questions` (5), `client_question_reminder_hours` (24);
  - `job.schema.json`: gate `decided_by_role` `system`.
- Storage layout v2: `BriefQuestions` mirror tab, Dashboard block "Brief: waiting for client reply", brief Config rows, per-version brief files `Jobs/<id>/brief/brief-v<n>.json`, files-mode `brief/` folder, and `sheet-setup.json` `upgrades["2"]` for existing databases.
- Validator check 12 (brief text/detail pairs, variants vs master, research and readiness rules, mirror); `x-version` keyword registered. Decision records 0004 (field pairs) and 0005 (shared-rules consolidation, proposed).
- Evals (written, not run): `evals/fixtures/brief/`, `evals/brief-fixtures.mjs`, `evals/scenarios/brief.md` (B1–B15), `evals/rubrics/brief.md`.

### Changed
- Sample data: SHL-03 (brief waiting on the client); SHL `next_job_number` 4.

### Not yet tested
- B1–B15 and the regression run happen in the combined test phase after the merge.

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
