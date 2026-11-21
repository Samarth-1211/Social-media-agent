# Architecture

**Repo vs plugin.** `tdm-plugins` is our plugin marketplace (`.claude-plugin/marketplace.json`). Each plugin lives in `plugins/<name>/`, and only that folder ships to users. Development material (`evals/`, `scripts/`, `docs/`, CI) stays outside it, so it never ships and never costs context.

**Groups and self-contained skills.** Skills live in `skills/<group>/<skill>/SKILL.md`. Groups follow the production line: control, brand, pre-production, generation, quality, post-production, delivery. A skill folder holds everything that skill needs (references, prompts, templates, examples, checklists, scripts), so changing one skill never touches another. The command name comes from the skill folder (`/social-media-manager:<skill>`), so skill names are unique across groups.
Claude Code only scans `skills/<name>/SKILL.md` one level deep. Each group folder must therefore be listed in `plugin.json` `"skills"`, and only once it holds a real skill. We tested this: an unregistered group's skills don't load. `validate.mjs` fails if a group with skills is unregistered.

**Thin producer + stage registry.** `library/contracts/stages.yaml` lists every stage in order: its skill, status (planned, placeholder or active), declared reads and writes, gate owner, tracks and job types. The `producer` skill only walks this list: it runs a stage, checks its outputs and records the gate. It holds no creative rules. Adding a stage or swapping a skill is a registry edit, not a producer edit.

**Contracts.** Stages pass work to each other only through named contract fields stored in `job.outputs.<field>`, validated by JSON Schemas (draft 2020-12) in `library/contracts/`. See `STAGE-CONTRACT.md`.

**Library rule.** `library/` holds only material shared by **3 or more skills**. Anything used by one or two skills stays in those skills. Skills link to library files as `${CLAUDE_PLUGIN_ROOT}/library/...`. Claude Code substitutes this inside skill content, and we verified it. The variable is *not* set in Bash commands.

**Vendor rule.** Borrowed third-party material goes in `vendor/`, copied from a pinned commit with its licence, recorded in `ATTRIBUTION.md` and never edited. We adapt it in our own skills. See `plugins/social-media-manager/vendor/README.md`.

**Storage.** Skills save clients and jobs only through the storage layer (`library/storage/`).
- The data store is a **Google Sheet ("TDM Studio Database") in a Google Drive folder**, shared with the team and editable from mobile.
- A read-only tracker page in the Claude app shows the same data.
- Local `.tdm-studio/` files are for backup only.
- Data never goes inside the plugin folder, because it is replaced on update.
- Details: `STORAGE.md` and `decisions/0002-storage-google-sheets.md`.

**Skill handoffs.** The docs describe no way for one skill to invoke another. Skills share work through:
- storage operations in `library/storage/`;
- shared templates in `library/templates/`;
- for a full handoff, an instruction to read and follow another skill's file, e.g. `${CLAUDE_PLUGIN_ROOT}/skills/brand/brand-keeper/SKILL.md`. The validator checks these links.

**Credits.** Generation follows a cheapest-first credit policy with per-job budgets. See `decisions/0003-credit-policy.md`.

**Versioning.**
- **Plugin:** semver in `plugin.json` plus `CHANGELOG.md`. Users stay on the installed version until `version` changes, so **every release bumps it**.
  - Minor bump per finished group: 0.1.0 = Group 1.
  - Patch bump for fixes.
  - 1.0.0 when the full video pipeline is active.
- **Skills:** each has its own `CHANGELOG.md`.
- **Contracts:** a breaking schema change bumps the plugin minor version and must say in the CHANGELOG how old records are migrated.

**Where it runs.**
- **Claude Code (primary):** full support.
- **Desktop app and claude.ai:** they install the same plugin format, but a different set of components loads there.
  - Skill frontmatter is limited to keys claude.ai accepts (validator check 10).
  - The Higgsfield server is remote, so it can be offered as a connector.
  - **Open point:** check that `${CLAUDE_PLUGIN_ROOT}` library links resolve there before relying on them. Self-contained skills limit the risk.
