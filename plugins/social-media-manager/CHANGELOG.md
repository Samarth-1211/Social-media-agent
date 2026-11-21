# Changelog

All notable changes to the `social-media-manager` plugin. Versions follow semver (see `docs/ARCHITECTURE.md`, Versioning).

## [Unreleased] - Group 1 in progress

### Added
- Contracts v2: stages as placeholders with gate owners and credit_spend; final job, client, brief schemas; new request, team, config schemas; examples.
- Storage layer on Google Sheets + Drive: operations, setup, backup, sheet layout, tracker page with mock mode.
- `control/tracker` skill: status board, overdue, per client, per assignee, credits, catch-up card, team and backup actions. `./skills/control` registered.

## [0.0.1] - 2026-11-21

### Added
- Plugin scaffold: manifest, Higgsfield remote MCP server, seven skill group folders with planned skills.
- Stage registry `library/contracts/stages.yaml` (21 video stages, 3 poster stages, all `planned`).
- Contract schemas: `job`, `client`, `brief` (drafted); `script`, `storyboard`, `package` (stubs).
- Preset schema `library/presets/_preset.schema.json`.
