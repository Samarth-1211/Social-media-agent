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
| M5 | `skills/pre-production/hooks/**` (new) | The hooks skill: SKILL.md (with the creative-pick gate), 8 references (formula catalogue H01–H30, India hook bank 91 hooks, three layers, Reels specifics, language rules, anti-patterns, scoring, critique pass), 2 templates, checklist HC1–HC10, 3 examples, CHANGELOG. |
| M5 | `library/contracts/stages.yaml` | hooks `status: placeholder` → `active`. |
| M5 | `skills/pre-production/README.md` | hooks row: planned → active (unreleased). |
| M6 | `skills/pre-production/hooks/SKILL.md` | At the pick: record the gate decision **first**, then save `pick` + `downstream` as `hooks` version + 1 (so gate-rules §3's version check passes). |
| M6 | `library/contracts/examples/job.example.json` | SHL-01 `outputs.hooks` → version 2 (v1 shown at the pick, v2 records it); sample data regenerated. |
| M6 | `skills/pre-production/README.md` | New section "Concept and hooks handoff": what script, localise, storyboard / shot sourcing and the learning loop read from `hooks.data.downstream`. |
| M7 | `evals/fixtures/concept-hooks/**`, `evals/concept-hooks-fixtures.mjs`, `evals/scenarios/concept-hooks.md`, `evals/rubrics/concept-hooks.md` (new) | Fixtures (3 clients, 6 briefs incl. a planted bad brief, 2 research outputs, 7 scenario jobs + 1 past job, 9 pick replies), check/seed tool, scenarios C1–F1, rubric. Written, not run. |
| M7 | `evals/README.md` | One line pointing to the concept + hooks suite. |
| M7 | `skills/pre-production/hooks/SKILL.md` | Gate table: plain approval ("ok", "theek hai") = the recommended pair. |
| M7 | concept and hooks `examples/*.md` | Fictional research ids renamed to the real `F<n>` pattern. |
| M8 | `plugins/social-media-manager/README.md` | Status lines, skills table (concept, hooks), "Concepts and hooks" command block, approvals table (concept off the admin list; creative pick = editor), layout v4 upgrade line, `library/knowledge/` in "What's inside". Version string unchanged. |
| M8 | `plugins/social-media-manager/CHANGELOG.md` | New `[Unreleased] - feat/concept-hooks` section above 0.2.0-alpha.2. At merge: rename it to the released version and bump `plugin.json`. |
| M8 | concept and hooks `CHANGELOG.md` | Final "Unreleased" entries. |

## 2. Proposals for protected files

> **Applied 2026-11-22 (P1–P6), at the admin's request, in the last commit before the merge.** P7 (sample history clean-up) left as optional.

Proposed text for files this branch may not touch. **Without P4 the creative pick still works** when the editor replies inside a hooks session (the hooks skill records the decision itself); P4 makes it work when the reply reaches the producer.

### P1 `docs/STAGE-CONTRACT.md`
- Path table: video/quick "skips hooks, localise, …" → "skips **concept**, localise, style-bible, casting, production-plan, audio-mix, resolve-export" (14 stages, unchanged); poster: one fewer stage (no concept).
- "Optional stage keys": add `gate_label`: "kebab-case name for a gate that decides more than its own stage's output; only with a gate other than none. Today: `hooks` → `creative-pick` (decision 0006)."

### P2 `docs/ADD-A-SKILL.md`
- In the list of stage keys, add `gate_label` (same wording as P1).

### P3 producer examples and job card
- `examples/good-full-run.md` line 33: "approve → *(concept placeholder; admin gate)* … approve → *(script …)*" → "approve → *(concept: 3 concepts, no gate)* → *(hooks: creative pick; editor gate)* **Ravi:** 2B → *(script placeholder; editor gate …)*". Path line 85: `✓intake ✓research ✓brief ✓concept ✓hooks ✓script …` for full; quick paths show `✓hooks` instead of `✓concept`.
- `examples/bad-skipped-gate.md`: "concept stops at its own admin gate" → "hooks stops at the creative-pick gate"; table row "Ran concept without stopping at its admin gate" → "Ran past the creative pick without the editor's reply".
- `templates/job-card.md` line 28 (quick): `✓intake ✓brief ⏸hooks script …`.

### P4 producer: creative pick and auto-pick
- `references/gate-rules.md` §1 step 4, add: "If the stage's skill has its own gate message (the `hooks` stage, `gate_label: creative-pick` → `skills/pre-production/hooks/templates/creative-pick.md`), show that instead. For `creative-pick`, `shown_outputs` = `{hooks: <v>}` plus `concept: <v>` on the full track."
- `references/gate-rules.md` §3, before the decision table: "**Creative pick.** A reply on a pending gate with `gate_label: creative-pick` goes to `${CLAUDE_PLUGIN_ROOT}/skills/pre-production/hooks/SKILL.md` §Gate, which reads it ('2B', '1 with 3A', 'mix 1 and 3', 'more like 2A', 'none, …'), records the decision and saves the pick. Plain approval ('ok', 'theek hai', 'approve') = the recommended pair. The pick's own version bump of `hooks` after the decision is expected and needs no new gate."
- `references/stage-running.md` §7 table, add a row: "`editor` with `gate_label: creative-pick` | as above, but show the skill's creative-pick message".
- `SKILL.md` step 1 (or `commands.md`, before acting on any job): "**Auto-pick check.** If the job's pending gate is a creative pick, `config.creative_auto_pick_after_hours` is set, and `get_now` − `requested_at` ≥ that many hours, run hooks §Gate auto-pick first, then continue."

### P5 tracker
- `references/status-views.md` after line 21: "If the pending gate has `gate_label: creative-pick`, write the stage as 'Creative pick (concept + hook)' and name the assignee."
- `references/catch-up.md` step 2: same label; if `creative_auto_pick_after_hours` is set, add one line "Auto-pick at <requested_at + n h> if no reply". During catch-up, if that time has passed, run the producer's auto-pick check (P4) before showing the card.
- `examples/good-catch-up.md`: "Last done: concept by Ravi … concept approved by samarth (admin)" → a hooks / creative-pick example.

### P6 client-feedback `references/revision-policy.md`
- Line 37: "The idea or story itself | `concept` | `concept`" → "| The idea or story itself | `concept` (full track) or `hooks` (quick track) | same |"; add "| The opening / first seconds | `hooks` | `hooks` |".
- Line 50: "before an approved admin gate (`brief`, `concept`)" → "before an approved admin gate (`brief`) **or the approved creative pick** (`hooks`, editor): it's a `change_request`, and only the admin confirms it."
- `labels.md` line 17: "(brief, concept, script approved …)" → "(brief, the creative pick, script approved …)".

### P7 sample history (optional)
SHL-01 (quick) and the poster sample in `scripts/build-sample-data.mjs` still show a `concept` stage with the old admin gate, from before decision 0006. Remove those entries if a clean sample matters; validation passes either way.

## 3. Reads

Final reads are already in `stages.yaml` (see §1); nothing left for the merge.

## 4. Storage

- **No new Sheet tabs.** Concept and hooks are job outputs in the existing **Outputs** tab (`data` JSON), plus the full records in Drive.
- **Layout v4:** three new Learnings columns and three Config rows. The TEST sheet (on v3) needs the v3 → v4 upgrade (`google-sheets.md` §7) before the combined test phase.
- Sizes: the SHL-01 quick-track hooks record is about 8,200 characters; a full-track record (3 concepts × 8–10 hooks) can pass 30,000.

## 5. Fallbacks (reviewed in M6)

| Missing input | concept | hooks |
|---|---|---|
| Brief placeholder or missing | Request + profile; `fallback_used.brief` | Same; `fallback_used.brief` |
| Research skipped / no sheet / `no_fresh_research` | Brief + profile; clichés become assumptions; `fallback_used.research` | No outlier formulas or research phrases; profile `customer_words` instead; `fallback_used.research` |
| Research `partial` or `widened` | Use what exists; lower confidence one step | Same |
| `concept` missing on the full track | (n/a) | Hooks for the brief's angle as one concept (`concept_ref: null`); says the concept stage didn't run |
| No reusable format on the quick track | (n/a) | Brief `creative_format`, then profile (`quick-track-reuse.md`) |

Each fallback is said in one line in the reply and recorded in `fallback_used`.

## 6. Merge and test-phase checklist

1. ~~Merge `feat/concept-hooks` into `main` and apply P1–P6.~~ Done 2026-11-22 (P7 optional, not applied).
2. Version: suggest **0.3.0-alpha.1** (plugin.json, CHANGELOG, both skill CHANGELOGs from "Unreleased").
3. Upgrade the TEST sheet v3 → v4 (`google-sheets.md` §7, `upgrades[2]`).
4. Run the validator, then the scenarios in `evals/scenarios/concept-hooks.md` (written in M7) on the fixtures in `evals/fixtures/concept-hooks/`.
5. Delete the local branch `backup/concept-hooks-on-v0.1.0`.
