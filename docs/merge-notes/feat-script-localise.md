# Merge notes: feat/script-localise

Branch `feat/script-localise` from `main` at `c62ed16` (0.3.0-alpha.1 + integration fixes), worktree `../tdm-script`. **Mode A:** `research-methods`, `brief`, `concept` and `hooks` are on `main`, so this branch reads their real `downstream` fields. No version bump, no tag on this branch.

## 1. Decisions (admin, 2026-11-23)

| # | Decision |
|---|---|
| D1 | `client-script-approval` becomes `active`, run by the `localise` skill (group `pre-production`). Its approval step shows the WhatsApp review message; the producer opens the `client` gate as for any client gate; the client's reply goes through `client-feedback`. A future `delivery/client-messenger` may take the stage back. |
| D2 | Changes to protected files are written here as proposed diffs and **applied at merge**: (i) a generic `gate_label` rule in the producer, replacing the `creative-pick` special case; (ii) `client-feedback` revision-policy routing: wording/language → `localise`, structure/content → `script`; (iii) the video quick path count 15 → 16 in the producer and `docs/STAGE-CONTRACT.md`. |
| D3 | IndicXlit: both modes built; only the fallback is tested now (`script_check: unverified`). A Python 3.10 environment for the real path only if the admin says "run" at M7. |

Defaults stated at planning and not objected to: field name stays `localised_script` (schema `localised_script.schema.json`); `localise` gate `none`, tracks quick + full; `script.schema.json` x-version 2 with `lines` made optional; config x-version 4; client x-version 3 (`pronunciation[]`); sheet layout v5 (no new tabs); validator check 13; the script writes Hindi/Hinglish in Roman letters and `localise` converts to the brief's `writing_script`; no `persuasion-ethics.md` (dropped 2026-11-22); eval files and READMEs treated as allowed additions.

## 2. Regression baseline (M1, on `c62ed16`)

| Check | Result |
|---|---|
| `node scripts/validate.mjs` (with `claude plugin validate`) | all 12 checks pass; video/quick 15 stages, video/full 22, poster 7 + 7; 15 schemas, 10 examples; 150 links |
| `node evals/brief-fixtures.mjs check` | pass (2 clients, 17 scenario jobs, 2 past jobs, 1 research output, 8 replies, 1 bad brief) |
| `node evals/concept-hooks-fixtures.mjs check` | pass (3 clients, 7 scenario jobs, 1 past job, 2 research outputs, 6 briefs, 9 pick replies) |
| `node evals/research/validator-faults.cjs` | 18/18 planted faults caught |
| `node evals/research/methods-consistency.cjs` | pass |
| `run-scenarios.mjs --check-only` (research, concept-hooks) | not applicable: needs the git-ignored local run outputs, which this worktree doesn't have |
| Headless Claude runners | not run (they spend Claude usage); only at M7 if the admin says "run" |

M7 repeats these and shows `git diff --stat main` touches no protected path.

## 3. Shared-file changes (additions only)

| File | Change (M2) |
|---|---|
| `library/contracts/stages.yaml` | `script`: `optional_reads` + `research`; `gate_label: script-pick`. `localise`: reads `[client, brief, script]`, optional `[hooks, research]`, **gate `none`**, **tracks `[quick, full]`**. `client-script-approval`: group `pre-production`, skill `localise` (D1). The header comment names decision 0007. All three stay `placeholder` until their skill folders exist (M3/M4/M5): the validator requires the folder for `active`. |
| `library/contracts/script.schema.json` | x-version 2. New: `client_id`, `version`, `writing_script`, `inputs`, `fallback_used`, `versions[]` (scene table, caption, CTA, `checks`), `recommended`, `pick`, `downstream` (scenes, `shot_list_seed`, `audio_cues`, caption, CTA, `keep_as_is`, `learning`), `assumptions`, `self_check`, `updated_at`. `dependentRequired`: a record with `versions` must carry all of them. `lines` is no longer required (accepting more); `hook`, `lines`, `cta` kept as deprecated v1 fields. The top level is now `additionalProperties: false` (no existing record has other keys; only placeholders exist). |
| `library/contracts/localised_script.schema.json` | **New**, x-version 1. |
| `library/contracts/config.schema.json` | x-version 4: `script_versions` (2), `pace_overrides` ({}), `localise_variant_languages` ([]), `caption_max_chars_per_line` (32). |
| `library/contracts/client.schema.json` | x-version 3: `pronunciation[]` (`term`, `say_as`, `devanagari`, `confirmed`, `note`, `source_job`). |
| `library/contracts/examples/` | New `script.example.json` (SHL-01, 2 versions, A picked with a line edit) and `localised_script.example.json` (SHL-01, Roman Hinglish). `config.example.json` gets the 4 keys; `client.example.json` gets one `pronunciation` entry. `job.example.json` is unchanged (SHL-01's script output stays a placeholder). |
| `library/knowledge/voiceover-pacing.md`, `ai-tells.md` | **New** shared knowledge (script, localise, later voice-music, captions-motion, client messages). |
| `library/storage/sheet-layout.json` | Version 5: Clients column `pronunciation` (json, `since: 5`). No new tabs. |
| `library/storage/sheet-setup.json` | Regenerated: `upgrades[3]` = v4 → v5; Config rows for the 4 new keys. `upgrades[0..2]` are identical to `main` (checked). |
| `library/storage/tracker-page/sample-data.json` | Regenerated: the SHL client has a `pronunciation` cell; Config has the 4 new rows. |
| `library/storage/google-sheets.md` | §4: "Script and localise records (layout v5)": Drive files, the compact-record rule, the SRT / voiceover / review-message files. §7: layout v4 detection and the v4 → v5 upgrade. |
| `library/storage/README.md`, `setup.md`, `files-backup.md` | Layout v4 detection; upgrade list; `outputs/script/` and `outputs/localise/` files. |
| `scripts/build-sheet-setup.mjs` | `SCRIPT_CONFIG`; `upgrade(4, 5)`. The column count per upgrade now counts only columns that exist at that layout version (`since <= to`), so a later column never changes an older upgrade. |
| `scripts/lib/script-checks.mjs` | **New**: spoken-word counter, pace check, scene-table, card, caption, pick/downstream and SRT checks. It reads the pace block from `voiceover-pacing.md` §9. Planted-fault test: 19/19 caught (kept for M7). |
| `scripts/validate.mjs` | **Check 13**: script and localised_script records in the examples, the job example and the sample data. |
| `docs/decisions/0007-script-pick-and-localise-approval.md` | **New.** |

## 4. Proposed diffs for protected files (apply at merge, D2)

Applied at merge with the admin's approval (D2), as concept + hooks P1–P6 were. Each item gives the file, the current text and the proposed text.

### P1. Producer: one rule for every `gate_label` (replaces the `creative-pick` special case)

`skills/control/producer/references/gate-rules.md` §1 step 4. Replace:
> **Exception:** a stage with `gate_label: creative-pick` (`hooks`) shows its own message, `${CLAUDE_PLUGIN_ROOT}/skills/pre-production/hooks/templates/creative-pick.md`, and its `shown_outputs` are `{hooks: <v>}` plus `concept: <v>` on the full track.

with:
> **Exception:** a stage with a `gate_label` shows its own message, `${CLAUDE_PLUGIN_ROOT}/skills/<group>/<skill>/templates/<gate_label>.md`, instead of this template. Its `shown_outputs` are what that template shows: `creative-pick` (`hooks`) = `{hooks: <v>}` plus `concept: <v>` on the full track; `script-pick` (`script`) = `{script: <v>}`.

`gate-rules.md` §3, the "Creative pick" paragraph. Replace its first sentence with:
> **Labelled gates** (`creative-pick`, `script-pick`, …). A reply on a pending gate with a `gate_label` goes to that stage's skill, `${CLAUDE_PLUGIN_ROOT}/skills/<group>/<skill>/SKILL.md` §Gate. The skill reads the reply in plain words, checks permission and versions as below, records the decision, and saves the pick. Plain approval ("ok", "theek hai", "approve") = the skill's recommendation.
> - `creative-pick` (`hooks`): "2B", "1 with 3A", "mix 1 and 3", "more like 2A", "none, …", a line edit.
> - `script-pick` (`script`): "A", "B", "A with scene 3 from B", "scene 4 line: …", "shorter by 5 sec".

The rest of the paragraph stays, with "the pick's own `hooks` version" becoming "the pick's own version of the stage's output".

`skills/control/producer/SKILL.md` step 6, the creative-pick bullet. Replace with:
> - **Labelled gates** (`gate_label` in `stages.yaml`, e.g. `creative-pick`, `script-pick`): the stage's skill shows the pick and reads the reply (`gate-rules.md` §3).

`skills/control/producer/references/stage-running.md` §7, the creative-pick row. Replace with:
> | `editor` with a `gate_label` (`hooks` → `creative-pick`, `script` → `script-pick`) | As above, but show the stage skill's `templates/<gate_label>.md`; the editor's reply goes to that skill (`gate-rules.md` §3). |

### P2. client-feedback: route wording and language to `localise`

`skills/brand/client-feedback/references/revision-policy.md` §3. Replace the row:
> | Spoken words, voice-over lines, claims | `script` (`localise` for a second-language version, full track) | — |

with two rows:
> | What is said and in what order: the story, a scene added or cut, a claim, the offer line, the CTA | `script` | — |
> | How it is said: a word or phrase, Hindi vs English, Roman vs Devanagari, a name's spelling or pronunciation, the caption wording | `localise` | — |

and add after the table's bullets:
> - **`script` or `localise`?** If the fix changes the meaning, a fact or the list of scenes, it's `script`. If the same meaning just needs different words or a different script, it's `localise`. A mixed item goes to `script` (the earlier stage); `localise` re-runs after it anyway.

`skills/brand/client-feedback/SKILL.md`, "If it fails", the row "A stage they mention isn't on the job's path (e.g. localise on the quick track)": the example goes out of date once `localise` is on both video tracks. Replace it with "(e.g. concept on the quick track)".

_(M5 may add to P2 after the wiring check.)_

### P3. Video quick path: 15 → 16 stages

- `docs/STAGE-CONTRACT.md`, "Paths and checks": `video / quick` → **16 (skips concept, style-bible, casting, production-plan, audio-mix, resolve-export)**.
- `skills/control/producer/references/stage-running.md` §1 step 2: "Video, quick: 15 stages." → "Video, quick: 16 stages."
- `skills/control/producer/references/track-selection.md`:
  - **Table row:** `| **quick** | 15: skips hooks, localise, style-bible, …` → `| **quick** | 16: skips concept, style-bible, casting, production-plan, audio-mix and resolve-export | …`. This row was already out of date: hooks has run on quick since 0.3.0-alpha.1.
  - **Row "More than one language version (localise runs only on full)":** → "A second language version that needs its own script or casting | One language, or an extra language from `localise_variant_languages`".
  - **Example:** "Full: Hindi and English versions, and localise only runs on the full track." → "Full: Hindi and English versions with different casting."
  - **Cost line:** "switching to full later adds hooks, localise, style-bible, casting and production-plan before storyboard" → "… adds concept, style-bible, casting and production-plan before storyboard (and the creative pick is asked again)".
- The validator needs no change: check 6 already reports the counts.

### P4. STAGE-CONTRACT.md: `gate_label` wording

`docs/STAGE-CONTRACT.md`, the "One decision for several outputs" bullet and the `gate_label` table row both say "Today: `hooks` → `creative-pick`". Proposed bullet:
> - **Labelled gates.** A gate with a `gate_label` is run by the stage's skill: it shows its own message (`templates/<gate_label>.md`) and reads the reply in plain words. Today: `hooks` → `creative-pick` (concept **and** hook in one reply, decision 0006) and `script` → `script-pick` (one of two script versions, with edits, decision 0007). …(rest of the bullet unchanged)

Table row: "Today: `hooks` → `creative-pick`, `script` → `script-pick`."

Also add to "Gates": "`client-script-approval` is run by `localise`: its approval step shows the client review message, and the reply is recorded through `client-feedback` (decision 0007)."

### P5. Tracker: show the script pick

- `skills/control/tracker/references/status-views.md`: after the creative-pick line, add: If the pending gate is a script pick (`script`, `gate_label: script-pick`), write the stage as "Script pick (A or B)".
- `skills/control/tracker/references/catch-up.md`: after the creative-pick paragraph, add: A pending script pick (`gate_label: script-pick`) is shown as "Script pick (A or B) · waiting on <assignee>".

### P6. Knowledge README: list the shared files

`library/knowledge/README.md` is an existing file, read-only for this branch. Append:

| File | What | Used by |
|---|---|---|
| `india-consumer-psychology.md` | Indian consumer truths, insight starters, levers L01–L20 with misuse lines, audience variants, language | concept, hooks, script, localise |
| `voiceover-pacing.md` | Spoken pace per language, counting spoken words, pauses, Devanagari vs Roman, card and caption reading time, calibration; machine-readable defaults | script, localise, voice-music, captions-motion |
| `ai-tells.md` | English and Hinglish/Hindi AI tells with fixes, how to apply them, the screenshot test | script, localise, voice-music, captions-motion, client messages |

## 5. Merge and test checklist

_Filled in at M6._
