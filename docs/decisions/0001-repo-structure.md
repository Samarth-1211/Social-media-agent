# 0001: Repository structure

- **Date:** 2026-11-21
- **Status:** accepted

## Context

The `social-media-manager` plugin will grow for years, one group of skills at a time. Several people will work on it: the admin, video editors and a designer. They use it in Claude Code, the Claude desktop app and claude.ai. It needs to be:
- easy for a new person to navigate;
- safe to change one skill at a time;
- cheap in context, because every skill description is loaded on every turn.

## Decision

1. **The repo is a marketplace and the plugin is a subfolder.** `tdm-plugins/.claude-plugin/marketplace.json` lists `plugins/social-media-manager`. Teammates install from the marketplace. More plugins can be added later without restructuring.
2. **Only the plugin folder ships.** Evals, scripts, docs and CI live at the repo root.
3. **Skills are grouped by production phase:** `skills/<group>/<skill>/`. Each group folder is registered in `plugin.json` `"skills"` once it has a real skill.
   - Before committing to this, we tested it: a skill in a registered group loads as `/social-media-manager:<skill>`, and the same skill in an unregistered group doesn't load.
   - The fallback, flat `skills/<prefix>-<skill>/` folders, was not needed.
4. **Each skill is self-contained.** Shared material moves to `library/` only once 3 or more skills use it.
5. **A stage registry plus contracts** (`stages.yaml`, JSON Schemas) replace logic hard-coded in a producer skill.
6. **A validator** (`scripts/validate.mjs`) enforces these rules locally and in CI.

## Consequences

**Good:**
- Groups make the tree readable.
- Skills can change independently.
- The pipeline can change by editing a single file.
- Nothing from development ships to users.

**Costs:**
- Skill names must be unique across groups, because the command name ignores the group.
- Each new group needs a `plugin.json` edit. The validator catches a missed one.
- The 3-skill library threshold means some duplication until material is promoted.
- **Open risk:** `${CLAUDE_PLUGIN_ROOT}` substitution in the desktop app and claude.ai hasn't been verified yet. Self-contained skills reduce the impact.
