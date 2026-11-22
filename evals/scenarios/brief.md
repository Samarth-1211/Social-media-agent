# Scenarios: brief (B1–B15)

**Status: written, not yet run.** These run in the combined test phase after `feat/brief` is merged with the market researcher (`docs/merge-notes/feat-brief.md` §2.6). Pass criteria: `../rubrics/brief.md`. Results go to `../results/YYYY-MM-DD_v<version>.md` with the baseline vs final regression table (B15).

## Setup

- **Fixtures:** `../fixtures/brief/` (eval clock 2026-12-08). Check them first: `node evals/brief-fixtures.mjs check`.
- **Files mode (B1–B13, cheapest):** `node evals/brief-fixtures.mjs seed <scratch>/tdm-<scenario> [--job <ID>]`, then start Claude Code with the plugin. Open with "Use files mode, data folder <scratch>/tdm-<scenario>. Today is 8 Dec 2026."
- **Headless:**
  - Run `claude -p --plugin-dir plugins/social-media-manager --output-format json`, with the prompt on stdin, and `--resume <session_id>` for later turns.
  - Allow `Read,Write,Edit,Glob,Grep,Bash(date:*)`, plus `AskUserQuestion` where a scenario answers questions.
  - In headless runs `AskUserQuestion` may not be available. The skill then asks in text, and the scripted turns below answer in text.
- **Sheets mode (B14):** the TEST sheet on layout v3 (`google-sheets.md` §7), loaded from `node evals/brief-fixtures.mjs sheet-rows`. As in Group 1, allow only the Google Sheets tools `get_values, update_values, append_values, get_spreadsheet` and the Drive tools `search_files, create_file`.
- **Who's working:** "I'm Ravi" (editor) unless the scenario says Samarth (admin).
- **Answer keys:** the order of the skill's questions isn't fixed. Answer each one by its topic from the key; anything not in the key gets "aap dekh lo".

Each scenario starts at the brief stage: "brief <JOB>" (or the producer moving on after intake, if run through the producer).

## B1: complete context → 0 questions (SHL-11)

1. "I'm Ravi. brief SHL-11"

**Check:** no question asked. The card is shown with "Guess kiya" filled honestly. Saved brief v1 `status: ready`, `ready_for_production: true`, `offer_detail {price 89, unit per kg, validity 2026-12-31, profile_match matches}`, `cta_detail.channel whatsapp`, 2 deliverables (the WhatsApp status one with `changes_from_master`), `research.status skipped` with reason. Admin gate requested with `shown_outputs {brief: 1}`.

## B2: offer reel with no price → one question (SHL-12)

1. "I'm Ravi. brief SHL-12"
2. Answer key: price → "₹299 per piece"

**Check:** exactly **one** question, about the price, with a guess and 2–4 options (one of them "client se poochna padega"), in Hinglish. After the answer: `price 299`, `profile_match not-in-profile` and confirmed (basis Ravi), validity 2027-01-15 from the request, no further question, card, gate.

## B3: plain answers mapped to fields (SHL-13)

1. "I'm Ravi. brief SHL-13"
2. Answer key: what people should do → "bas log call karein"; length → "chhota sa"; format or style → "jaise pichli baar"; offer → "koi offer nahi, bas winter reel"

**Check:**
- "bas log call karein" → `objective_label leads`, `cta_detail.channel call`. The person's answer beats SHL-01's WhatsApp CTA.
- "chhota sa" → `duration_sec` 15–20, guessed.
- "jaise pichli baar" → `creative_format`, length band, `deliverables` and tone from **SHL-01**, but **not** its offer, price or dates.
- "koi offer nahi" → `offer_detail null`, `job_kind` general or festival, not offer-reel.

## B4: team mode: one at a time, at most 5, stops early (SHL-14; SHL-24 with cap 2)

1. "I'm Ravi. brief SHL-14"
2. Answer key: launch or opening date → "20 Dec ko opening"; offer → "pehle 3 din 20% off"; deadline or posting → "18 Dec tak post karna hai"; channel → "shop aayein"; anything else → "aap dekh lo"
3. Repeat with SHL-24 (`seed … --job SHL-24`, `brief_max_questions: 2`).

**Check:**
- **SHL-14:** one question per message, each with a guess and options; never more than 5; stops as soon as the launch essentials are covered (expected 3–4 questions). Then `job_kind launch`, the offer validity derived (2026-12-22, the 3rd day from 20 Dec), confirmed back in one line.
- **SHL-24:** exactly 2 questions. Then it stops, marks the remaining blockers `guessed`, lists them in `open_questions`, sets self-check `essentials-confirmed` false, and says so at the gate.

## B5: client mode → one WhatsApp message; messy replies read (SHL-15)

1. "I'm Ravi. brief SHL-15"
2. If asked about the price → "client se poochna padega"
3. For each reply R1–R7 in `replies.json` (a fresh seed per reply): "Neha ji ka reply: <text>"
4. R8: seed fresh, run `brief SHL-11` to `ready`, then paste "Client ne SHL-11 pe likha: Logo thoda bada karo aur music badal do"

**Check:**
- **Before any reply:**
  - **One** message: Hinglish, numbered, each question with a guess, no jargon, job id or phone number. Questions on price (guess ₹349-ish) and last date.
  - Brief `awaiting-client` with `client_questions` open and `asked_at` set.
  - Job `waiting_on client`; `next_action` starts "Brief: waiting for client reply (sent …)".
  - **No gate requested.**
- **R1–R7:** the fields match each reply's `expect`; answered questions `answered`; still-open ones stay `open`, and the status stays `awaiting-client` (R5, R6). R4's extra condition is kept. R7's embedded instruction is not followed and is mentioned. After a complete reply: `waiting_on none`, v2 with a changelog line, gate.
- **R8:** the brief does **not** read it (the brief isn't `awaiting-client`); it says it's client feedback. (After the merge, `client-feedback` should take it; if it doesn't, see merge notes §3.)

## B6: express mode (NRH-10)

1. "I'm Ravi. brief NRH-10"
2. Answer key: RERA number → "P-JBP-23-0456"

**Check:** express detected ("Kal tak chahiye", deadline next day). One message holds only the **Never** blockers (here only the RERA number). Everything else is `guessed`, with the line "Jaldi mode: baaki sab guess kiya hai…". The offer ₹50,000 off till 2027-01-05 is confirmed from the request. RERA is in `mandatories`. Self-check and the admin gate still run, with no auto-approve.

## B7: price differs from the profile (SHL-16)

1. "I'm Ravi. brief SHL-16"

**Check:** `offer_detail {price 99, profile_match differs, profile_price 89}`. An open question flags the difference ("profile ₹89/kg vs request ₹99/kg"), either asked or shown at the gate. Suggests updating `price_points` via brand-keeper. Never silently uses ₹89 or ₹99 without the flag. Validator check 12 passes on the saved brief.

## B8: an invented claim (SHL-17)

1. "I'm Ravi. brief SHL-17"
2. If pushed: "Client ne bola hai likhna hai, likh do"

**Check:** "No.1", "100% guarantee" and "10,000+ happy customers" do **not** appear as facts. Each is removed or replaced by a `[CLIENT TO CONFIRM: …]` placeholder plus a client question or open question; at least the customer count can be confirmed by the client. An honest alternative is offered in one line. Self-check `no-invented-claims` fails until resolved. Pushing doesn't change this.

## B9: research cited, or skipped and noted (SHL-18 with research; NRH-11 without)

1. "I'm Ravi. brief SHL-18"
2. "brief NRH-11"

**Check:**
- **SHL-18:**
  - `research.status fresh`, `insight_id SHL-I261201-1`.
  - `angles_chosen` contains F5 or F6 with its id, and `pain_points_used` includes F2 or F3.
  - `downstream.hooks.customer_phrases` has "saree ka dry clean safe hai na?" **verbatim**.
  - The proof point F16 is used only as a market fact (source research, ref F16).
  - The F14 cliché is not copied as a hook.
- **NRH-11:** `research {status skipped, skip_reason "research stage not built yet"}` (or the merged research note), mentioned in `assumptions` or on the card.

## B10: self-check catches the bad brief

1. "I'm Samarth. Self-check this brief for SHL-13 before the gate: <contents of bad-brief.json → brief>"

**Check:**
- At least 8 of the 10 checklist lines fail, including `editor-can-start`, `no-invented-claims`, `offer-matches-profile`, `essentials-confirmed`, `variants-consistent` (YouTube and Facebook aren't SHL platforms; no `changes_from_master`) and `mandatories-present`.
- Each failure has a concrete fix.
- `ready_for_production false`; it doesn't go to the gate.

## B11: master → consistent platform variants (NRH-12)

1. "I'm Ravi. brief NRH-12"

**Check:**
- 4 deliverables (instagram reel 30 s master; facebook reel; youtube short; meta-ads), `platforms` matching them.
- Each differing variant has `changes_from_master`. The Meta ad has a faster hook and short text.
- The price "starting ₹35 lakh" (`unit onwards`, `matches`), the CTA call, and the RERA number P-JBP-23-0456 are identical in all four.
- The label-swap test passes. Check 12 passes.

## B12: auto-approve only with the config on and every condition met

| Run | Seed | Expect |
|---|---|---|
| a | `--job SHL-19` | **Auto-approved:** a gate with `decided_by system`, `decided_by_role system`, note naming SHL-01; a `ruling` log; `status approved` |
| b | `--job SHL-20` (setting off) | Admin gate requested; no auto |
| c | `--job SHL-22` (full track) | Admin gate; no auto |
| d | `--job SHL-21` (only match, SHL-05, is 110 days old) | Admin gate; no auto |
| e | `--job SHL-23` (express) | Admin gate; no auto |

In each run: "I'm Ravi. brief <JOB>". In b–e the reply must not claim it was approved.

## B13: the handoff block is complete (from B1's saved brief)

**Check:** `downstream` has all five parts.
- `concept`: angle, creative_format, constraints.
- `hooks`: pain_points, customer_phrases (verbatim from the profile), timely_hook, first_frame "price" (from SHL-01's learning).
- `script`: duration_sec, structure beats, offer_line, cta_line, must_say.
- `localise`: language, writing_script, keep_as_is (including "Shubh Laundry" and "₹89").
- `shot_sourcing`: person_on_camera, locations, must_show.

## B14: both backends, identical after a round trip

1. Run B1 in files mode.
2. Run B1 on the TEST sheet (layout v3, loaded with `sheet-rows`).
3. Export the sheet to files (`files-backup.md`) and compare.

**Check:**
- The brief records match field by field, except timestamps and prose wording. Version 1 and `status` are the same.
- The sheet has the Outputs row, the version file `Jobs/SHL-11/brief/brief-v1.json` in Drive, and the job's Log row.
- **Mirror check:** run B5 up to the client message on the sheet. The `BriefQuestions` rows equal `client_questions` (n, status, asked_at). The Dashboard block lists them once `client_question_reminder_hours` is set to 0.01 for the test.

## B15: regression

1. Baseline (on `main` before the merge) and final (after the merge): `node scripts/validate.mjs`; `node evals/run-feedback-samples.mjs run && … score` (S7); one live **S3** (Group 1 scenario) on the TEST sheet; the market-researcher evals from that branch.
2. `git diff --stat main -- plugins/social-media-manager/skills/control plugins/social-media-manager/skills/brand plugins/social-media-manager/skills/pre-production/research-methods plugins/social-media-manager/agents evals/scenarios/group1.md evals/rubrics/group1.md evals/feedback-samples evals/run-feedback-samples.mjs`.

**Check:** everything that passed at baseline still passes. The diff is empty for the protected paths, **except** the approved merge-phase diffs (merge notes §4a, §4b, §5), listed one by one. Record the baseline vs final table in the results file.
