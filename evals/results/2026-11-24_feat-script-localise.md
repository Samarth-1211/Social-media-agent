# Results: script + localise (branch `feat/script-localise`, before merge)

- **Date:** 2026-11-24. **Branch:** `feat/script-localise` (plugin still 0.3.0-alpha.1; no version bump on the branch).
- **How:** `node evals/script-localise/run-scenarios.mjs` (headless Sonnet, files mode, live tools off) on `evals/fixtures/script-localise/`, eval clock 2026-12-12. R1 offline.
- **Run on the admin's "run"** (2026-11-24). The protected-file diffs P1–P9 are **not** applied yet.
- **Cost:** first round 18 runs = $28.42; re-runs after fixes (6 runs) = $8.10; **total ≈ $36.5**.
- Raw outputs: `evals/results/script-localise-runs.local/` (git-ignored); per-check summary in its `summary.json`.

## Final results

| Run | Checks | Notes |
|---|---|---|
| S1-SHL30 (S1, S2, S4) | 10/10 | 21-word hook trimmed to its first sentence, price card from frame 1; two real structures (before-after / demo-led); payoff at 8 s; caught "pickup bhi free" without its ₹299 condition in the picked hook and fixed it. |
| S3-SHL31 (fact guard) | 9/9 | ₹199, 10,000+ and "No.1" all removed with fact flags; ₹249 exact. (re-run after a fix, see below) |
| S5-SJE04 (flat middle) | 8/8 | Rack shot used at most once; the tailoring table carries the middle; no body talk. |
| S6-R1 "A" | 8/8 | |
| S6-R2 "A with scene 3 from B" | 9/9 | |
| S6-R3 "scene 4 line: …" | 9/9 | |
| S6-R4 "shorter by 5 sec" | 9/9 | 15 s, hook/payoff/CTA kept. (re-run after a fix) |
| S6-R5 "theek hai" | 8/8 | (re-run after a fix) |
| S6-R6 "B" | 8/8 | |
| S6-R7 Pooja replies | 4/4 | Refused, named Ravi / Samarth, nothing saved. |
| L1-SHL33 (stiff lines, L3, L6) | 14/14 | All three planted lines rewritten ("Bucket mein toh samaati bhi nahi", "Shubh mein do, dry clean ho jaayegi", "Pickup free, ₹299 se upar"); ₹249 → "do sau unchaas"; the client message also asks Neha to confirm the ₹249 razai vs the ₹299 free-pickup threshold. |
| L2-NRH15 (Devanagari, phone, L7) | 17/17 | Natural Hindi; `script_check: unverified` (fallback, IndicXlit not installed) with flagged words; fixed कमेरे → कैमरे by hand; phone number spoken digit by digit; proposals for Narmada Heights, Agrawal, Napier Town, RERA. (re-run after a fix) |
| L1-SJE05 (English variant, L7) | 13/13 | English variant made with the same scenes and ₹1,499; Saanjh pronunciation proposed; "English version bhi ready hai" in the message. |
| L5-SHL34 (back-translation) | 10/10 | Both planted drifts found and fixed (scene 5 date + urgency, scene 6 condition); SRT and TTS rebuilt. (re-run twice after fixes) |
| A1-ok | 4/5 | Client gate approved correctly. **Fails only on the job record:** the producer wrote the next placeholder stage (`storyboard`) with `"schema": null` and log kind `stage`. This problem predates this branch (merge notes P9). |
| A1-changes | 8/8 | Two items; the wording item routed to `script` (P2 not applied yet, as expected); the brand-name item to `script`; after "route ok", sent back to `script`, which re-ran on the picked version only. |
| A1-offer | 5/5 | "25% kar do" became a `change_request` routed to `brief`; the gate stays pending for the admin. |
| E2E-SHL30 | 8/8 | script pick A → localise → client approval → next stage. |
| R1 (offline) | 9/9 | Validator, fixture checks (3 suites), 24/24 planted faults, research checks, `transliterate.py` 11/11, protected paths unchanged vs `main`. |

**18 of 19 runs pass every check.** The one remaining failure comes from a producer issue that predates this branch (P9).

## Found in the first round, and fixed

| Run | Finding | Fix | Kind |
|---|---|---|---|
| S3 | The script skill wrote `gate_label` into the gate record (invalid against `job.schema.json`) | `script/SKILL.md` step 14: the gate record has only the schema's fields; `gate_label` stays in `stages.yaml` | skill |
| S6-R5 | A plain "theek hai" saved `downstream` without `duration_sec`, `structure_type`, `language` (invalid against `script.schema.json`) | `script/SKILL.md` §Gate: build `downstream` on every pick with all required fields; validate before saving | skill |
| S6-R4 | After "shorter by 5 sec" one card was up 1.9 s (needs 2.2 s) | `script/SKILL.md` step 5: the card-hold formula, re-checked after any re-timing | skill |
| L5 | `files` saved as an object; run directly, the job stayed at `localise` instead of going on to the approval step | `localise/SKILL.md` step 15: `files` is a list; run directly → go straight to the approval step | skill |
| L5 (re-run) | Scene voiceover lines wrote numbers as words ("pachchees December tak") instead of digits | `localise/SKILL.md` step 6: written vs said: lines, cards, SRT and captions keep digits; only `tts_text` spells them out | skill |
| L2 | `next_action` over 200 characters | `localise/SKILL.md` approval step: keep it under 200; plus P9 for the producer | skill + proposal |
| L5 | The example offer (25 Nov) had expired by the eval clock (12 Dec): the model rightly stopped and drafted a question to Neha | Fixture: example-based jobs move the offer to 25 Dec | fixture |
| L1, L5 | Checks matched the old line inside the stage's own explanation note | Checks scan only what the audience sees or hears | test |
| L1-SJE05 | "version" flagged as jargon in "English version bhi ready hai" (our own template line) | Jargon check allows "<language> version" | test |
| L2 | A Roman brand name in a Devanagari line flagged, though our rules allow it | Mixed-script check allows `keep_as_is` names | test |
| S6 | The S6 checks never validated the picked script against its schema (how R5 slipped past the first time) | Schema check added to every S6 run | test |

## Rubric (Claude's read of the outputs; the native-speaker L1 sheet is still to do)

| Item | Score | Note |
|---|---|---|
| R-S1 first 1.5 s on mute | 2 | Price card from frame 1 in every SHL version |
| R-S2 two real options | 2 | Different structures and different asset needs; recommendation reasons are right (S1 picks B because it needs no archive clip) |
| R-S3 every second earns its place | 2 | Critique notes show real fixes (repeated van shot replaced, payoff moved before the offer) |
| R-S4 true and specific | 2 | All planted inventions removed; conditions kept next to "free" |
| R-S5 spoken, not written | 2 | |
| R-S6 one clear CTA | 2 | |
| R-S7 storyboard-ready | 2 | |
| R-S8 gate replies understood | 2 | R1–R7 all correct after the fixes |
| R-L1 sounds like the city | 2 (pending native check) | No stiff line survived; register consistent |
| R-L2 script correctness | 1 (pending native check) | Honest `unverified` + flags; `कैमरे पे` / `ज़ीरो` are flagged for a native reader |
| R-L3 numbers said naturally | 2 | Shop style used for ₹1,499 ("chaudah sau ninyaanave") |
| R-L4 fits the picture | 2 | |
| R-L5 meaning held | 2 | |
| R-L6 20-second test | 2 | One slip in NRH's message: it says the director *asks* "घर टाइम पे मिलेगा?", while in the film he quotes the buyers' question |
| R-L7 names right | 2 | |
| R-A1 right route, right person | 2 | (P2 will send wording to `localise`) |
| R-A2 only what was asked changed | 2 | |

## Still to do

1. Native-speaker sheet for L1 (Hinglish, SHL-33 and SJE-05) and L2 (Hindi Devanagari, NRH-15).
2. After the merge, apply P1–P9, then re-run S6-R1…R7 and A1-* through the producer (P1/P2 change the path) and A1-ok (P9).
3. IndicXlit path (`script_check: verified`) not tested on this machine (admin decision D3).
