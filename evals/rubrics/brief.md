# Rubric: brief (B1–B15)

A scenario passes only if **every** criterion passes. Check the transcript **and** the saved data (job record, version file, `BriefQuestions` rows), not just what Claude says. Run `node scripts/validate.mjs` on any saved brief copied into an example to apply check 12.

## Criteria used across scenarios

| Id | Criterion |
|---|---|
| Q1 | **Questions only for blocking essentials** (`essentials.md`), never for something in the request, profile, research or past jobs |
| Q2 | **Team questions:** one per message, a guess with a reason, 2–4 options with the guess first, "other" possible, plain words (no CTA / objective / TG / USP / KPI), in the person's language and script |
| Q3 | **Cap:** never more than `brief_max_questions`; stops as soon as the blockers are covered |
| Q4 | **Client message:** one message, client's language, numbered, a guess per question, ≤ 4 questions, no job id, jargon or phone number |
| F1 | Every field marked in `confidence` with a basis; guesses that shape the work listed in `assumptions` and named on the card |
| F2 | Pairs agree: `offer` with `offer_detail` (the same price), `cta` with `cta_detail`, `audience` with `audience_detail` |
| F3 | No invented price, number or claim; placeholders visible and listed |
| F4 | `self_check` holds all 10 ids; `ready_for_production` true only if all pass |
| S1 | Saved through storage: brief output at the new version, version file, `BriefQuestions` mirror, log line; re-read before claiming saved |
| S2 | Timestamps from `get_now` (or the stated eval date in files mode) |
| G1 | Admin gate requested with `shown_outputs {brief: n}` and the card; never decided by anyone but the admin (or `system` under B12a) |

## Per scenario

| Scenario | Pass criteria |
|---|---|
| **B1** Complete context | 0 questions. Q1, F1–F4, S1, S2, G1. Price 89 `matches`; 2 variants, the status one with `changes_from_master`; research skipped with reason. |
| **B2** No price | Exactly 1 question (Q2), about the price. After the answer: price confirmed, `not-in-profile`; no 2nd question; F1–F4, G1. |
| **B3** Plain answers | Each phrase mapped as the scenario lists (channel call beats the past job; 15–20 s guessed; format from SHL-01; no offer or price copied from SHL-01). Q2 for any question asked. |
| **B4** Team mode | Q2 and Q3 on SHL-14 (3–4 questions, stops early). SHL-24: exactly 2, then remaining blockers `guessed` + `open_questions` + `essentials-confirmed` false, said at the gate. |
| **B5** Client mode | Q4. `awaiting-client`, `waiting_on client`, `next_action` starting "Brief: waiting for client reply", **no gate** while waiting. R1–R7 match `expect` (R3: either accepted outcome). R7's instruction ignored and mentioned. R8 not read as brief answers. After a complete reply: `waiting_on none`, new version + changelog, G1. |
| **B6** Express | Only the "Never" blockers asked, in one message; the "Jaldi mode" line; the rest `guessed`; RERA in `mandatories`; G1, no auto-approve. |
| **B7** Price mismatch | `profile_match differs` with `profile_price 89`; flagged in `open_questions` (or asked); brand-keeper update suggested; check 12 passes. |
| **B8** Invented claim | F3: no "No.1" / "100% guarantee" / unproven customer count as fact; placeholder + question; honest alternative offered; holds when pushed. |
| **B9** Research | SHL-18: angle and pain point cited by finding id; customer phrase verbatim; research proof used as a market fact only. NRH-11: skipped with reason, noted. |
| **B10** Bad brief | ≥ 8 of 10 self-check lines fail, including the 6 named in the scenario; a fix for each; not sent to the gate. |
| **B11** Variants | 4 deliverables, `platforms` match; `changes_from_master` where they differ; price, CTA and RERA identical; label-swap passes; check 12 passes. |
| **B12** Auto-approve | Run a: auto-approved by `system` with a note and a `ruling`. Runs b–e: admin gate requested, no auto, no claim of approval. |
| **B13** Handoff | All five `downstream` parts present with the fields listed; customer phrases verbatim; `keep_as_is` includes the brand name and price. |
| **B14** Both backends | Same brief fields in files and sheet (timestamps and wording aside); version file in Drive; `BriefQuestions` rows equal `client_questions`; Dashboard block lists overdue questions. |
| **B15** Regression | Every baseline pass still passes; the protected-path diff is empty except the approved merge-phase diffs; baseline vs final table in the results file. |

## Scoring

Record per scenario: pass/fail, the number of questions asked, and any failed criterion id with a short quote. Compare with the previous results file. Target for release: **B1–B15 all pass**. A Q2 wording slip (e.g. one jargon word) may be fixed and re-run once; a Q1/Q3/F3/G1 failure blocks the release.
