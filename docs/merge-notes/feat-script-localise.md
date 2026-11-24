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
| `library/contracts/stages.yaml` (M3) | `script` → `active` (skill folder `skills/pre-production/script/` exists). |
| `library/contracts/stages.yaml` (M4) | `localise` → `active` (skill folder `skills/pre-production/localise/` exists). |
| `library/contracts/examples/localised_script.example.json`, `library/knowledge/voiceover-pacing.md` (M4) | Roman spelling of 99 unified to "ninyaanave" (as `transliterate.py` prints it). |
| `library/contracts/stages.yaml` (M5) | `client-script-approval` → `active` (run by `localise`, D1). |

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

### P7. Producer: say what to send at the script approval (optional, wording only)

The client gate works without this. With it, the board and the gate message name the thing to send instead of a field name.

- `skills/control/producer/references/gate-rules.md` §1 step 3, the `client` bullet. After "<assignee name> to send <what> to <client decision maker> and record the reply", add: "For `client-script-approval`, <what> is "the script review message (shown above)"."
- `skills/control/producer/templates/gate-message.md`, "Client gate": after `To send: {field} v{version}…`, add the line: `{for client-script-approval: "The message to send is just above: copy it as it is."}`.

### P8. client-feedback: close the items a re-run handled (optional)

Today nobody sets `client_feedback[].items[].status` to `done`, so an item stays `open` after the routed stage has re-run. Proposed, in `skills/brand/client-feedback/SKILL.md` step 3 (quote ledger), add: "Before splitting a new reply about the same job, mark the earlier entry's `in_scope` items `done` when the stage they were routed to has a newer approved version (or `declined` if the admin declined them), and say so in one line." That way the next triage knows what was already fixed, and the `old_version` check stays accurate.

## 4a. Client script approval: how it runs (M5)

No protected file changes are needed for it to work. P2 improves the routing, and P7 and P8 are optional polish.

**The stage.** `client-script-approval` (group `pre-production`, skill `localise`, gate `client`, reads `script`, optional `localised_script`, writes nothing).

**Approved path** (traced against `producer/references/stage-running.md` §§2, 5–7 and `gate-rules.md` §§1, 2, 5):
1. `localise` saves `localised_script` v1 (no gate) → the producer runs on in the same turn.
2. The producer starts `client-script-approval`, an `active` stage. §2 check: `reads: [script]` is present ✓, and the skill folder exists ✓. §5: it opens `localise/SKILL.md`, which goes to its approval step.
3. The approval step checks `self_check.passed` and that no placeholder fact would reach the client, shows the review message ready to copy plus the send-and-paste line, and returns no outputs.
4. §6 verify: there are no writes to check. §7 `client` gate: `record_gate` request with `shown_outputs` `{script: <v>, localised_script: <v>}` (§1: approval stages show their reads and optional reads). `waiting_on: client`; `next_action` "<assignee> to send <what> to <decision maker> and record the reply". The gate message is shown.
5. The assignee sends the message on WhatsApp and pastes "client approved: haan theek hai, final karo". `gate-rules.md` §5: clear approval → `approved`, note "client (<decision maker>): <short quote>". The job runs on to `style-bible` (full) or `storyboard` (quick).

**Changes path:**
1. The assignee pastes "client feedback: …". `gate-rules.md` §5 hands it to `client-feedback`, which quotes, labels and routes each item (`revision-policy.md` §3).
   - Today: "spoken words, voice-over lines, claims" → `script`.
   - With P2: what is said → `script`; how it is said → `localise`.
2. The routed stage is the one that made what was shown, so the producer records `sent_back` to it. It never records `changes_requested` on `client-script-approval` itself: re-running an approval stage only re-shows the same message.
3. **Sent back to `script`:** script SKILL step 15 applies only the script items to the picked version, re-checks the changed scenes, saves a new version and shows the client-changes form of the script pick. The editor approves. `localise` re-runs (step 16 picks up the script's changes and any `localise` items), writes the "after changes" client message, and the client gate is asked again.
4. **Sent back to `localise`:** localise step 16 applies the wording or language items, re-checks, writes the "after changes" message; the client gate is asked again.
5. Revision rounds, caps, change orders and admin-only routes stay with `client-feedback` (unchanged).

**Checked against the protected files, no edits:**
- `client_feedback[].items[].target_stage` and `routing.proposed_stage` take any stage id, so `localise` and `script` are valid targets.
- `client-feedback/SKILL.md` step 8 hands approval-only replies back to the producer.
- `revision-policy.md` §3 "If the earliest stage is the one just shown → `sent_back` to that stage" covers routing to the stage that made the localised script.

## 5. Integration notes (Mode A, M6)

**Upstream fields, real ones (read-only).**
- `script` reads `hooks.data.pick` (must be `picked`) and `hooks.data.downstream`:
  - `concept` (logline, insight, angle, format, story spine, levers with proof, producibility, risks, `mix_note`);
  - `hook`, `backup_hooks`, `script_notes`, `implied_assets`, `language`, `writing_script`, `learning`;
  - `reused_format` on the quick track.
- From `brief.data`, `script` reads:
  - `downstream.script` and `downstream.localise.keep_as_is`;
  - `offer_detail`, `cta_detail`, `proof_points`;
  - `duration_sec`, `deliverables`, `platforms`;
  - `language`, `writing_script`, `mandatories`, `avoid`, `tone`, `audience_detail`, `creative_format`, `style_preset`, `confidence`.
- From `research.data`, `script` reads `research_status`, `insight_id`, `flags`, `downstream.script.proof_points`, `downstream.localise.customer_phrases` and `downstream.brief.pain_points`.
- `localise` reads `script.data.downstream`, the brief's `downstream.localise`, the hook's layers and research `customer_phrases`.
- Mapping and fallbacks: `skills/pre-production/script/references/upstream-input.md`. No field was renamed or added upstream.

**Downstream blocks (for later groups).** `script.downstream` and `localised_script.downstream`, described in `skills/pre-production/README.md`, "Script and localise handoff".
- The draft `storyboard.schema.json` already has `shots[].script_beat`. It maps to our scene `n`, so the storyboard group can build one shot per scene from `shot_list_seed`.
- `voice-music` reads `localised_script.downstream.vo_lines` and `tts_language_code`. When it measures real durations, it writes `config.pace_overrides` (`voiceover-pacing.md` §8).

**What behaves differently until the protected diffs are applied:**

| Without | Effect | Fixed by |
|---|---|---|
| P1 (producer `gate_label` rule) | After `script`, the producer shows its generic editor gate message. "A", "B" and edits are read as approve or "changes", not handed to the script skill. | P1 |
| P2 (routing) | All wording and language feedback routes to `script`: it works, with one extra editor check. | P2 |
| P3 (path counts) | The producer docs say 15 quick-track stages; the validator counts 16. | P3 |
| P5 (tracker labels) | A pending script pick shows as "script · waiting on editor". | P5 |

**Known limits (state them in the release notes):**
- **IndicXlit isn't verified on this machine:** fairseq won't install on Python 3.14. The fallback is tested (11/11), and its Devanagari is always `unverified`.
- **The Hindi and Hinglish speaking paces are working defaults,** not published figures; they get calibrated when `voice-music` exists.
- **No live run of either skill yet** (M7 writes the tests; they run only on "run").

## 6. Merge and test checklist

1. **Merge.** `main` is still at `c62ed16`, an ancestor of this branch, so it fast-forwards or merges with `--no-ff` without conflicts. Re-check with `git merge-base --is-ancestor main feat/script-localise` first.
2. **Apply the protected diffs (D2): P1–P6.** Ask the admin about the optional P7 and P8. Then run `node scripts/validate.mjs`.
3. **Version** (admin's call): suggest **0.4.0-alpha.1** (Group 2a agents 5 + 6).
   - `plugin.json` `version`.
   - Plugin `CHANGELOG.md`: move "[Unreleased]" items and add the script, localise and client-approval lines from the two skill CHANGELOGs.
   - The two skill CHANGELOGs: "Unreleased" → the version.
   - The pre-production README statuses.
   - Tag `v0.4.0-alpha.1`.
4. **Storage on the TEST sheet:** run the v3 → v4 upgrade if it's still pending (open from 0.3.0-alpha.1), then v4 → v5 (`google-sheets.md` §7, `upgrades[2]` and `upgrades[3]`). Check that the Clients tab has `pronunciation` and Config has the 4 new rows.
5. **Offline tests:**
   - the validator (13 checks);
   - `python -I plugins/social-media-manager/skills/pre-production/localise/scripts/transliterate.py --self-test`;
   - the script-localise fixture check and the planted-fault test (M7);
   - the M1 baseline commands (section 2).
6. **Live tests (on "run"):** `evals/scenarios/script-localise.md` S1–S6, L1–L7, A1 and R1, plus one end-to-end run (intake → … → hooks pick → script pick → localise → client approval), headless, files mode.
7. **Regression:** `git diff --stat main` must show no protected path (`skills/control/**`, `skills/brand/**`, `research-methods/`, `agents/market-researcher.md`, `brief/`, `concept/`, `hooks/`, existing `library/knowledge/*`, and existing evals and fixtures) other than the applied P-diffs.
8. **Clean up:** after the merge, remove the worktree `../tdm-script` and the branch (ask first).
