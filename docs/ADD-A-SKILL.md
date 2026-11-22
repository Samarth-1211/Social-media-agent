# Add a skill

## 1. Create it

```bash
node scripts/new-skill.mjs <group> <skill-name>
# e.g. node scripts/new-skill.mjs pre-production brief
```

This creates `plugins/social-media-manager/skills/<group>/<skill-name>/` with `SKILL.md` (from `docs/skill-template.md`) and `CHANGELOG.md`. It refuses an unknown group or a name already used in any group.

Rules for the name:
- kebab-case;
- unique across **all** groups, because the command is `/social-media-manager:<skill-name>`;
- not the same as a group name.

## 2. Write SKILL.md

- **Frontmatter:** `name` must equal the folder name.
  - `description` is **one line, third person, at most 200 characters**: what it does and when to use it.
  - Every description sits in Claude's context on every turn, so keep it tight.
  - Only use the keys claude.ai accepts: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`.
- **Sections:** keep all seven: Purpose, Reads, Writes, Steps, Quality bar, Gate, If it fails.
  - Reads and Writes must match the stage's entry in `stages.yaml`.
- **Size:** at most 200 lines. Move detail into the skill's own subfolders, and create only the ones it needs:

| Folder | For |
|---|---|
| `references/` | know-how only this skill uses |
| `prompts/` | prompt templates the skill fills in |
| `templates/` | exact output formats |
| `examples/` | gold-standard outputs and known bad ones |
| `checklists/` | self-checks before showing anything |
| `scripts/` | code, only for technical skills |

- **Links:**
  - to the skill's own files: `${CLAUDE_SKILL_DIR}/references/x.md`;
  - to shared files: `${CLAUDE_PLUGIN_ROOT}/library/...`. Only for material shared by 3 or more skills.
- **Borrowed material** goes through `vendor/` (see its README).

## 3. Wire it up

1. **Register the group.** If it isn't registered yet, add `"./skills/<group>"` to `"skills"` in `plugins/social-media-manager/.claude-plugin/plugin.json`. Unregistered groups don't load.
2. **Update `stages.yaml`.** Point the stage's `skill` at the new folder and set `status` to `active`. Check `reads`, `writes` and `gate`.
3. **Release.** Bump `version` in `plugin.json` and add an entry to the plugin `CHANGELOG.md` and to the skill's `CHANGELOG.md`.

## 4. Check it

```bash
node scripts/validate.mjs
claude --plugin-dir plugins/social-media-manager   # then run /social-media-manager:<skill-name>
```

If the skill produces creative output, add test briefs and a rubric in `evals/` and record a results file (see `evals/README.md`).

## What the validator checks

| # | Check |
|---|---|
| 1 | Manifests valid, names kebab-case, marketplace entry name = plugin name |
| 2 | Every skill folder has `SKILL.md`: frontmatter `name` = folder, real `description`, all 7 sections |
| 3 | Skill folder names unique across groups |
| 4 | Registered groups exist and have skills; every group with skills is registered |
| 5 | `active` stages point to an existing skill in their group; every stage has `credit_spend` true or false; optional stage keys (`freshness_days`, `skippable_if_urgent`, `non_blocking_partial`, `spend_gate`) have valid values; unknown keys are rejected |
| 6 | Each `reads` field is written earlier on every (job type, track) path, or is `client` |
| 7 | All schemas compile; every `examples/*.example.json` validates against its schema; presets validate against `_preset.schema.json` |
| 8 | `${CLAUDE_PLUGIN_ROOT}/library/...` and `/skills/...` links point to real files |
| 9 | `SKILL.md` at most 200 lines; description at most 200 characters, one line |
| 10 | Frontmatter keys limited to those claude.ai accepts |
| 11 | Storage: the sheet layout covers every schema field; examples and sample data survive the Sheets round trip; research records agree with each other (job copies, insight ids, the handoff block); generated setup and sample files are current; tracker page stages match `stages.yaml` |
| 12 | Brief: each text field agrees with its `*_detail` (price, action and channel, audience); platform variants match the master; research, readiness and question rules hold; the `BriefQuestions` mirror matches each brief |
| + | `claude plugin validate` on the marketplace and the plugin (if the CLI is installed) |
