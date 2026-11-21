# Changelog

All notable changes to the `social-media-manager` plugin. Versions follow semver (see `docs/ARCHITECTURE.md`, Versioning).

## [Unreleased] - Group 1 in progress

### Added
- Contracts v2: stages as placeholders with gate owners and credit_spend; final job, client, brief schemas; new request, team, config schemas; examples.
- Storage layer on Google Sheets + Drive: operations, setup, backup, sheet layout, tracker page with mock mode.
- `control/tracker` skill: status board, overdue, per client, per assignee, credits, catch-up card, team and backup actions. `./skills/control` registered.
- `control/producer` skill: runs jobs through stages and gates from `stages.yaml`, placeholder stages, gate permissions, budget gate, commands. `intake` is now `active`.
- `brand/brand-keeper` skill: onboarding from material or interview, confidence marks with basis, open questions with recommendations, client code, festival calendar suggestions, versions and changelog, learnings, brand brief. `./skills/brand` registered.
- Storage: `get_now` clock cell (`Config!D1:E1`); every timestamp comes from the sheet, not a guess. Sample data: SHL `next_job_number` 3.

## [0.0.1] - 2026-11-21

### Added
- Plugin scaffold: manifest, Higgsfield remote MCP server, seven skill group folders with planned skills.
- Stage registry `library/contracts/stages.yaml` (21 video stages, 3 poster stages, all `planned`).
- Contract schemas: `job`, `client`, `brief` (drafted); `script`, `storyboard`, `package` (stubs).
- Preset schema `library/presets/_preset.schema.json`.
