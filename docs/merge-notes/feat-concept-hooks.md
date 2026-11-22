# Merge notes: `feat/concept-hooks`

- **Base:** `main` at `fc3fde8` (0.2.0-alpha.2: Group 1 + market researcher + brief). The branch was first cut from v0.1.0; on 2026-11-22 the admin chose to **rebase onto the new main**. M1 was cherry-picked (`9fa9e06`); M2 was redone on main's files. The v0.1.0-based work is kept as local branch `backup/concept-hooks-on-v0.1.0` (`8845336`) and can be deleted after the merge.
- **No version bump, no tag on this branch.** Recommended at merge: 0.3.0-alpha.1 (or as the admin decides).

This file records every change to a shared file and every proposal for files this branch may not touch. Completed in M6.

## 1. Shared-file changes

| Milestone | File | Change |
|---|---|---|
| M1 | `ATTRIBUTION.md` | Appended a "Concept + hooks" table (11 rows) under "Ideas adapted", before "Tools used, not copied". |
| M2 | `library/contracts/stages.yaml` | Header documents `gate_label` and the concept/hooks lines. **concept:** `reads [client, brief]`, `optional_reads [research]`, `gate none`, `tracks [full]`, `job_types [video]`. **hooks:** `reads [client, brief]`, `optional_reads [concept, research]`, `gate editor`, `gate_label creative-pick`, `tracks [quick, full]`. **script:** `reads [client, brief, hooks]`, `optional_reads [concept]` (decision 0006, option 1A). **poster-drafts:** `reads [client, brief]`, `optional_reads [concept]` (option 2a). concept and hooks stay `placeholder` until M4/M5 (the validator needs the skill folders). |
| M2 | `scripts/validate.mjs` | `gate_label` added to `STAGE_KEYS`; check 5: kebab-case and only with a gate other than `none`. |
| M2 | `library/contracts/concept.schema.json`, `hooks.schema.json` (new, `x-version` 1) + `examples/concept.example.json`, `hooks.example.json` (new) | New contracts. Examples: SHL-03 wedding-season saree reel, 3 concepts × top 3 hooks, pick pending. |
| M2 | `library/contracts/config.schema.json` (`x-version` 2 → 3) + example | `concepts_count` (3), `hooks_per_concept` (8), `creative_auto_pick_after_hours` (null = off). |
| M2 | `library/contracts/client.schema.json` (now `x-version` 2) + example | Learnings items gain `hook_formula_id` (`H\d\d`), `angle_type`, `outcome` (worked / flopped / mixed / untested). Example gains one learning (H02 rejected by Neha). |
| M2 | `library/contracts/job.schema.json` | Description only: `system` role also covers `creative_auto_pick_after_hours` (`system` was already in the enum). |
| M2 | `library/contracts/examples/job.example.json` | SHL-01 gains a `hooks` stage: history entry, approved creative-pick gate, log line and a full `outputs.hooks` record (quick-reuse mode). Script `started_at` moved 12:40 → 12:44. Required because `script` now reads `hooks`. |
| M2 | `library/storage/sheet-layout.json` (layout **v4**) | Learnings: `hook_formula_id`, `angle_type`, `outcome` added at the end (`since: 4`). |
| M2 | `scripts/build-sheet-setup.mjs` | `CREATIVE_CONFIG` rows (in new sheets and in the v3 → v4 upgrade); `upgrade(3, 4)`; detection comment. |
| M2 | `library/storage/sheet-setup.json`, `tracker-page/sample-data.json` | Regenerated. `upgrades[2]` = v3 → v4. |
| M2 | `library/storage/google-sheets.md` | "Concept and hooks records" paragraph (whole record in Drive `Jobs/<id>/<field>/<field>-v<n>.json`; the cell holds it whole under 40,000 characters, else a compact form); §7 v3 detection and the v3 → v4 upgrade steps. |
| M2 | `library/storage/setup.md`, `README.md`, `files-backup.md` | Upgrade order and older-layout detection include v4; files-mode note on concept/hooks files. |
| M2 | `docs/decisions/0006-creative-pick-and-quick-track.md` (new) | Decision record. |
| M3 | `library/knowledge/india-consumer-psychology.md` (new) | Shared by concept, hooks, script, localise: dated evidence (T1–T9), insight starters, clichés to retire, levers L01–L20 with misuse limits, hypotheses HY1–HY9, audience variants, language. **`persuasion-ethics.md` was dropped by the admin (2026-11-22);** its hard limits are the lever misuse lines and hooks `anti-patterns.md`. |
| M4 | `skills/pre-production/concept/**` (new) | The concept skill: SKILL.md, 8 references, 2 templates, checklist CC1–CC10, 3 examples, CHANGELOG. |
| M4 | `library/contracts/stages.yaml` | concept `status: placeholder` → `active`. |
| M4 | `skills/pre-production/README.md` | concept row: planned → active (unreleased). The handoff section follows in M6. |
| M4 | `library/contracts/examples/concept.example.json` | Self-check items renamed to the checklist ids CC1–CC10. |

## 2. Proposals for protected files (not applied here)

| # | File | Proposal | Why |
|---|---|---|---|
| P1 | `docs/STAGE-CONTRACT.md` | Path table: video/quick now includes hooks and not concept (count unchanged), video/full unchanged, poster one stage shorter. List `gate_label` under optional stage keys. | Decision 0006; the admin chose merge-notes-only for docs. |
| P2 | `docs/ADD-A-SKILL.md` | List `gate_label` among stage keys. | Same. |
| P3 | `skills/control/producer/examples/good-full-run.md`, `bad-skipped-gate.md`, `templates/job-card.md` | Old flow (concept placeholder with an admin gate). Update to: concept (full only, no gate) → hooks (creative pick, editor). | Examples would teach the old gate. |
| P4 | `skills/control/producer` (gate handling) | Filled in M6: hand replies on a pending `creative-pick` gate to the hooks skill's pick section; auto-pick check. | Producer is protected. |
| P5 | `skills/control/tracker` | Filled in M6: status board shows "creative pick"; auto-pick check during catch-up; `good-catch-up.md` example mentions the old concept admin gate. | Tracker is protected. |
| P6 | `skills/brand/client-feedback/references/revision-policy.md` | "The idea or story itself → `concept`" and "reopen a stage before an approved admin gate (`brief`, `concept`)": concept no longer has a gate; the approved creative decision is the `hooks` creative-pick (editor) gate. Route idea/story changes to `concept` (full) or `hooks` (quick), and treat reversing an approved creative pick as a `change_request`. | client-feedback is protected. |
| P7 | Sample data (`scripts/build-sample-data.mjs`) and `job.example.json` | SHL-01 (quick) and the poster sample still show a `concept` stage with the old admin gate, from before decision 0006. Optionally remove those entries. | This branch adds; it doesn't rewrite history. |

## 3. Reads

Final reads are already in `stages.yaml` (see §1); nothing left for the merge.

## 4. Storage

- **No new Sheet tabs.** Concept and hooks are job outputs in the existing **Outputs** tab (`data` JSON), plus the full records in Drive.
- **Layout v4:** three new Learnings columns and three Config rows. The TEST sheet (on v3) needs the v3 → v4 upgrade (`google-sheets.md` §7) before the combined test phase.
- Sizes: the SHL-01 quick-track hooks record is about 8,200 characters; a full-track record (3 concepts × 8–10 hooks) can pass 30,000.
