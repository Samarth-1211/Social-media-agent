# Changelog

All notable changes to the `social-media-manager` plugin. Versions follow semver (see `docs/ARCHITECTURE.md`, Versioning).

## [Unreleased]

### Fixed (found by the first integration runs, `evals/results/2026-11-22_v0.3.0-alpha.1.md`)
- Auto-pick runs whoever opens a job past the limit (the editor included), unless their message is itself a pick.
- Gate records keep only the job schema's fields (`gate_label` stays in `stages.yaml`); concept and hooks name their log kinds.
- Concept removes pressure words from the brief's CTA and accepts a stock limit only with the client's confirmation.
- Hooks keep the creative pick varied: no formula leads two concepts, no duplicate lines, the lead fits the angle; a learnings boost lifts a formula without cloning it.

### Added
- `evals/concept-hooks/run-scenarios.mjs`: headless runner for the concept + hooks scenarios and an end-to-end intake-to-script run.

### Added: script + localise (Group 2a agents 5 + 6, branch `feat/script-localise`, decision 0007)
- `script` skill (`pre-production/script`, stage `script`, both video tracks, editor gate `script-pick`): two versions with different structures from the picked hook, written in the brief's language; a timed, storyboard-ready scene table, caption and one CTA; timing, fact-guard, payoff, critique, humanizer and limits passes; natural replies at the pick ("A", "A with scene 3 from B", "scene 4 line: …", "shorter by 5 sec"); re-runs after client feedback change only the picked version.
- `localise` skill (`pre-production/localise`, stage `localise`, both video tracks, no gate; also runs `client-script-approval`): transcreation into Roman Hinglish, Devanagari Hindi or English; `scripts/transliterate.py` (IndicXlit when installed, otherwise a flagged fallback; Hindi number words); spoken numbers; voiceover script with clean TTS text; SRT captions; caption post; back-translation check; WhatsApp client review message; extra-language variants; pronunciation proposals.
- Shared knowledge: `library/knowledge/voiceover-pacing.md` (pace per language, spoken-word counting, reading time, machine-readable defaults) and `library/knowledge/ai-tells.md` (English and Hinglish/Hindi AI tells, the screenshot test).
- Contracts: `script.schema.json` x-version 2 (versions, scene table, checks, pick, downstream; `lines` no longer required); new `localised_script.schema.json`; `config` x-version 4 (`script_versions`, `pace_overrides`, `localise_variant_languages`, `caption_max_chars_per_line`); `client` x-version 3 (`pronunciation[]`). Examples for SHL-01.
- Storage: sheet layout v5 (Clients `pronunciation` column, 4 Config rows, upgrade v4 → v5); script and localise files in Drive (`Jobs/<id>/script/`, `Jobs/<id>/localise/`).
- Validator check 13 (`scripts/lib/script-checks.mjs`): scene times, spoken pace, card reading time, pick and downstream, SRT cues, client-message facts.
- Evals: `evals/fixtures/script-localise/`, `evals/script-localise-fixtures.mjs`, `evals/script-localise/run-scenarios.mjs`, `check-faults.mjs`, scenarios and rubric. First live run: 18 of 19 pass (`evals/results/2026-11-24_feat-script-localise.md`).

### Changed: script + localise
- `stages.yaml`: `localise` runs on the quick track too (video quick path 15 → 16 stages) and has no gate; `client-script-approval` is run by `localise` (was `delivery/client-messenger`); `script` reads research when present and its gate is labelled `script-pick`.
- Migration: none needed. Old placeholder script records stay valid; existing sheets upgrade v4 → v5 (`google-sheets.md` §7).
- Applied at the merge (merge notes P1–P9): the producer's general `gate_label` rule, client-feedback routing to `localise`, path counts, tracker labels, and the producer's placeholder-output fix.

## [0.3.0-alpha.1] - 2026-11-22

Group 2a, agents 3 + 4: concept and hooks, the India-first creative engine (`docs/merge-notes/feat-concept-hooks.md`, merge-notes P1–P6 applied). Contracts change additively; v3 sheets upgrade in place to layout v4.

### Added
- `pre-production/concept` skill (full track, video, no gate): one sourced core insight, 6–8 raw angles from four engines (creative methods for brand films), filters for competitors-overdo, brief avoid, lever misuse and the hook test, three concepts of different angle types with story spines, levers backed by real proof, producibility and risks, a 7-criterion weighted score and one recommendation.
- `pre-production/hooks` skill (quick + full, editor gate `creative-pick`): 8–10 three-layer hooks per concept with formula, visual-led, proof and customer-phrase minimums; weighted scoring with a weakest-link cap and client learnings (worked +3, flopped/rejected −3); a critique pass; top 3 per concept; the combined creative pick from natural replies; optional auto-pick; the `downstream` handoff for script, localise and shot sourcing.
- One hook formula catalogue (H01–H30, cross-referenced to the source catalogues) and an India hook bank (91 hooks across seven niches, Hinglish, Hindi and English).
- `library/knowledge/india-consumer-psychology.md`: dated evidence on Indian (Tier 2/3) buyers, insight starters, clichés to retire, levers L01–L20 with misuse limits, hypotheses HY1–HY9, audience variants, language rules.
- Contracts: `concept.schema.json` and `hooks.schema.json` (new, `x-version` 1); `config.schema.json` (`x-version` 3): `concepts_count`, `hooks_per_concept`, `creative_auto_pick_after_hours`; `client.schema.json` (`x-version` 2): learnings carry `hook_formula_id`, `angle_type`, `outcome`.
- Stage key `gate_label` (validator check 5). Storage layout v4 (Learnings columns, creative Config rows, `upgrades` v3 → v4); full concept and hooks records in Drive `Jobs/<id>/concept|hooks/`. Decision record 0006.
- Evals (written, not run): `evals/fixtures/concept-hooks/`, `evals/concept-hooks-fixtures.mjs`, `evals/scenarios/concept-hooks.md` (C1–F1), `evals/rubrics/concept-hooks.md`.

### Changed
- Pipeline (decision 0006): `concept` runs on the full track for video only, with no gate; `hooks` runs on both video tracks with the editor's creative-pick gate; `script` reads `hooks` (concept optional); `poster-drafts` reads `concept` only optionally.
- Example SHL-01 gains a quick-track hooks record (v1 shown, v2 picked).
- `producer`: shows the hooks skill's creative-pick message, hands the editor's reply to the hooks skill (plain approval = the recommended pair), runs the auto-pick check. `tracker`: labels the creative pick and shows the auto-pick time. `client-feedback`: idea and opening changes route to `concept` / `hooks`; reversing an approved creative pick is a change request. Stage-contract docs updated.

### Not yet run
- Eval scenarios C1–F1 (`evals/scenarios/concept-hooks.md`). Existing databases need the layout v3 → v4 upgrade (`library/storage/google-sheets.md` §7) before concept and hooks can save learnings fields.

## [0.2.0-alpha.2] - 2026-11-22

Group 2a, agent 2: the brief, merged with the market researcher (`docs/merge-notes/feat-brief.md`). Contracts change additively; v2 sheets upgrade in place to layout v3.

### Added
- `pre-production/brief` skill:
  - drafts the brief by itself after research, from the request, profile, research `downstream`, past jobs, festival calendar and defaults;
  - asks only blocking essentials (team, client or express mode, at most `brief_max_questions`), in plain Hinglish, Hindi or English;
  - one WhatsApp message for client-only questions, and reads the client's reply while the brief is `awaiting-client`;
  - self-check "could an editor start without asking"; admin gate with optional auto-approve.

  The `brief` stage is `active` and reads `research` when present.
- Contracts (`x-version` 2, all additive):
  - `brief.schema.json`: `status`, `changelog`, `job_kind`, `objective_label`, `*_detail` pairs, `proof_points`, `creative_format`, master format, `writing_script`, `research`, `confidence`, `client_questions`, `self_check`, `downstream`, `deliverables[].changes_from_master`;
  - `config.schema.json`: `brief_auto_approve_repeat` (false), `brief_max_questions` (5), `client_question_reminder_hours` (24);
  - `job.schema.json`: gate `decided_by_role` `system`.
- Storage layout v3: `BriefQuestions` mirror tab, Dashboard block "Brief: waiting for client reply", brief Config rows, per-version brief files `Jobs/<id>/brief/brief-v<n>.json`, files-mode `brief/` folder, and `sheet-setup.json` → `upgrades` entry v2 → v3 for existing databases.
- Validator check 12 (brief text/detail pairs, variants vs master, research and readiness rules, mirror); `x-version` keyword registered. Decision records 0004 (field pairs) and 0005 (shared-rules consolidation, proposed).
- Evals (written, not run): `evals/fixtures/brief/`, `evals/brief-fixtures.mjs`, `evals/scenarios/brief.md` (B1–B15), `evals/rubrics/brief.md`.

### Changed
- Sample data: SHL-03 (brief waiting on the client).
- `producer` and `tracker`: an active stage may wait on the client without a gate (brief `awaiting-client`); see merge notes §4.

### Fixed (found by the combined test runs)
- Brief requests its own admin gate when run directly, and finishes the producer's gate step (record, close, run on) when the admin decides in a brief session.
- Question guesses are always concrete (a price guess has a number and its own unit); team-answerable blockers are asked before any client message; `cta` contains `cta_detail.action` word for word.
- Setup and the v2 → v3 upgrade widen the Dashboard tab before writing the brief block (it reaches column AA).
- Market-researcher eval tooling registers the `x-version` keyword.

### Tested
- B1–B13 pass on fixtures (135 automated checks + B13 + B1-approve); live run on TDM Studio TEST Database: v2 → v3 upgrade, Dashboard reminder, BriefQuestions mirror, brief version file in Drive, and a full quick video job to delivery (S3, 13 gates); S7 10/10; researcher `intake` + `tracker` 21/21; researcher static checks; validator 1–12. Results: `evals/results/2026-11-22_v0.2.0-alpha.2.md`.

## [0.2.0-alpha.1] - 2026-11-22

Group 2a: the market researcher. Research keeps an insight sheet per client with as little human work as possible and hands it to later stages. Contracts change additively; v1 sheets upgrade in place.

### Added
- `pre-production/research-methods` skill: method registry (11 methods), router, automation (triggers, unattended vs attended, task queue, weekly schedule, learning loop), caps, confidence rules, competitor discovery, one module per method; templates (plan, insight sheet, chat summary, pending browser task), before-saving checklist, examples. `./skills/pre-production` registered.
- `agents/market-researcher.md`: the first subagent. It runs the unattended part on Sonnet, in its own context, with limited tools, and returns only a summary. claude.ai chat (which ignores plugin agents) runs the same steps inline.
- Installed Instagram skills (`ig-viral`, `ig-audit`, `ig-audience-insights`, `ig-hook-extractor`) and `marketing:competitive-brief` are used by name when present, with our own fallback steps. Apify is optional, off by default, and admin-approved above a limit.
- Contracts: `research` stage (after intake; reused while fresh, skipped on urgent jobs, never blocks); optional stage keys `freshness_days`, `skippable_if_urgent`, `non_blocking_partial`, `spend_gate`; new `insight`, `research` and `task` schemas; client `own_handle`, `competitors`, `meta`, `latest_insight_id`; job `urgent`, `research_status`, `insight_id`; ledger `provider` and `currency`; gate kind `spend`; eight research config keys.
- Storage layout v2: Insights, InsightFindings and Tasks tabs; new columns at the end of Jobs, Clients and Credits; files-mode `insights/` and `tasks.json`; an in-place v1 → v2 upgrade (`sheet-setup.json` → `upgrades`, `google-sheets.md` §7).
- Tracker page: read-only "Latest insights" panel per client.
- Scheduled research: weekly cloud (or Cowork) task; setup and the exact prompt in the README.
- Evals: research fixtures for two fictional clients, headless scenario runner, scenarios R1–R16 and rubric, validator fault injection, method consistency and tracker page render checks. Results: `evals/results/2026-11-22_v0.2.0-alpha.1.md`.

### Changed
- `producer`: handles the optional stage keys, `urgent` at intake, the spend gate, and the research output with its job copies; path counts are now video quick 15, full 22, poster 8.
- `tracker`: research queue at session start (festival runs, one offer of pending Instagram reads), research view; credit totals count only Higgsfield credits (research money is shown separately).
- `brand-keeper`: a new client queues its first research run.
- Validator: checks the new stage keys, cross-schema references, research record consistency, and round-trips insights and tasks.

### Migration
Nothing breaks. Old jobs simply have no research output, old ledger rows count as credits, and old clients have no competitors yet. A sheet built with 0.1.0 needs the one-time upgrade (admin; `library/storage/google-sheets.md` §7) before research can save; everything else keeps working without it.

### Tested
- R1–R16 pass on fixtures (82/82 checks); validator, 18 planted faults, method consistency and tracker page render pass. Not covered: live Sheets upgrade, live smoke test, Claude app (see the results file).

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
