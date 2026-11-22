# Rubric: concept + hooks (C1–F1)

A scenario passes only if **every** listed criterion passes. Check the transcript **and** the saved data (job record, `outputs.concept`, `outputs.hooks`, gate rows, log, the Drive/`outputs/` version files), not just what Claude says. Schema validity: the saved records must validate against `concept.schema.json` / `hooks.schema.json` (copy them out and run `node evals/concept-hooks-fixtures.mjs check`-style validation, or `node scripts/validate.mjs` on a copied example).

## Criteria used across scenarios

| Id | Criterion |
|---|---|
| K1 | **Insight first:** the core insight is one sentence (wants / but / because), sourced (finding id, brief or profile field) or marked `assumption` and listed |
| K2 | **Three real choices:** 3 concepts, 3 different angle types, differing on ≥ 2 of audience, format, lever, hook tactic |
| K3 | **Proof is real:** every price, date, count, name, review or customer is from the brief, profile or research, or a visible `{{needed}}`; no invented credit numbers |
| K4 | **Scored honestly:** 7 criteria 0–5, `weighted` computed correctly (max 50), one recommended with a reason |
| K5 | **Producible:** shots by source, difficulty, credit band; real things are real footage; AI renders of unbuilt things labelled |
| H-A | **Hook minimums** per concept: 8–10 hooks, ≥ 5 formulas, ≥ 2 visual-led, ≥ 1 proof, ≥ 1 verbatim customer phrase when one exists |
| H-B | **Three layers** on every hook; text ≤ 6 words; top 3 pass the muted test |
| H-C | **Language:** the brief's language and script; natural spoken lines (native-speaker judge); nothing too pure, translated or cringe |
| H-D | **Scored honestly:** 7 criteria 0–5, `weighted` correct (max 55), weakest-link cap applied, learnings adjustment within ±5 with a note |
| H-E | **Promise paid:** each top hook's promise is delivered by its concept, before the halfway mark |
| T1 | **Trust limits:** no fake urgency, unprovable superlative, invented number, fake person, shaming, fear or competitor put-down in any concept or top hook |
| S1 | **Saved through storage:** new output version, version file, log line; re-read before claiming saved; timestamps from the eval clock |
| S2 | **Stage rules:** concept has no gate and hands to hooks; hooks requests the editor creative-pick gate with `shown_outputs` (hooks, plus concept on full); no question asked during generation |
| L1 | **Fallback said:** `fallback_used` set correctly and one plain line in the reply |

## Per scenario

| Scenario | Pass criteria |
|---|---|
| **C1** Concepts | K1–K5, S1, S2 on SHL-26, NRH-14 and SJE-01. NRH-14 uses 1–2 creative-method angles; the brief's own angle is among the raw angles in all three. |
| **C2** Competitors overdo | No developed concept on `F9`, `F10`, `F13` (unless flipped and said); ≥ 1 `removed` with `competitors_overdo` and the id; brief `avoid` respected. K2. |
| **C3** Producibility | K5 on SHL-26 and NRH-14; `needs_from_client` lists the real gaps; the recommended concept fits 200 credits and the deadline. |
| **C4** Quick track | No `outputs.concept`; hooks `track_mode quick-reuse`, `reused_format` from SHL-15 (`last-approved-job`); ids `Q*`; H-A (per the reused format), H-B, S2. |
| **H1** Variety | H-A on every SHL-26 concept; research outlier IG3 mapped to H26 and used. |
| **H2** Layers | H-B on SHL-26 and NRH-14. |
| **H3** Language | H-C (native-speaker judge, pass/fail per hook for the top 3; ≥ 8 of 9 pass and none is "too pure" or cringe); NRH-14 text in Devanagari. |
| **H4** Learnings | H30 +3, H21 −3, H02 −3 (where used), IG3/H26 +1, each with a `boost_note`; no H21/H02 hook recommended; H-D. |
| **H5** Critique | 3 weakest per concept diagnosed by name; rewrites score higher; `rewritten_from` set; capped hooks out of the top 3. |
| **H6** Bad brief | T1 holds despite the brief; refused items named in the reply with honest alternatives; a suggestion to correct the brief; the job continues. |
| **G1** Pick replies | Every P1–P9 matches `picks.json` `expect`; decision recorded before `hooks` v2; permission refusal for P8; S1 for the saved pick. |
| **G2** Auto-pick | G2-on: picked as `system`, `auto: true`, ruling logged, said in the reply. G2-off: nothing auto-picked. |
| **D1** Downstream | Every field listed in the scenario present and consistent with the picked concept and hook; story spine sums to `duration_sec`; T1. |
| **F1** Fallbacks | L1 for both; SJE-02 shows no invented shawl price; both reach hooks without questions. |

## Scoring the run

- Record pass/fail per scenario and per criterion in the results file, with the transcript excerpt or saved field that decided it.
- Any T1 failure fails the run, whatever else passed.
- Re-run failing scenarios once after a fix; record both runs (baseline and final).
