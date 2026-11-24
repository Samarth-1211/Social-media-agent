# Scenarios: script + localise (S1–S6, L1–L7, A1, R1)

Fixtures: `evals/fixtures/script-localise/` (`node evals/script-localise-fixtures.mjs check | seed <dir> [--job ID]`). Runner: `node evals/script-localise/run-scenarios.mjs [runs] [--check-only] [--parallel N]` (headless Sonnet, files mode, live tools off). Rubric: `evals/rubrics/script-localise.md`. **Eval clock: 2026-12-12 10:00 (India time).**

**Not run on `feat/script-localise`** (admin decision 2026-11-23): only the offline checks run (fixture check, planted-fault test, R1). The live runs go after the merge, on "run". P1 (the producer's `gate_label` rule) and P2 (routing) change what S6 and A1 can show. Each check says what passes before and after.

| Run | Job (fixture) | Prompt (after the fixture-mode line) | Stops at |
|---|---|---|---|
| S1-SHL30 | SHL-30 razai ₹249, full, research fresh, pick 2B (H30, long spoken line) | "I'm Ravi. SHL-30 aage badhao (creative pick ho gaya hai)." | the script pick |
| S3-SHL31 | SHL-31: the same, with planted facts in the pick | "I'm Ravi. SHL-31 aage badhao." | the script pick |
| S5-SJE04 | SJE-04 Bhai Dooj sisters, concept spine with a flat middle | "I'm Pooja. SJE-04 aage badhao." | the script pick |
| S6-R1…R7 | SHL-32 (quick track): script v1 = the contract example, pick pending | "I'm Ravi. SHL-32 script pick: <reply>" (R7 from Pooja) | after the reply |
| L1-SHL33 | SHL-33: picked script with planted stiff lines | "I'm Ravi. SHL-33 aage badhao (script pick ho gaya)." | the client gate |
| L2-NRH15 | NRH-15 brand film, Hindi → Devanagari, phone number said | "I'm Ravi. NRH-15 aage badhao." | the client gate |
| L1-SJE05 | SJE-05: Hinglish + English variant (`localise_variant_languages`) | "I'm Pooja. SJE-05 aage badhao." | the client gate |
| L5-SHL34 | SHL-34: localised v1 with a planted meaning change | "I'm Ravi. SHL-34 ka localised script client ko bhejne se pehle dobara check karo, back-translation ke saath." | the client gate |
| A1-ok / A1-changes / A1-offer | SHL-35: client gate pending | "I'm Ravi. SHL-35: client approved / client feedback: …" (A1-changes adds "route ok") | after the reply |
| E2E-SHL30 | SHL-30 | "I'm Ravi. SHL-30 aage badhao." then "A", then "client approved: …" | the stage after client approval |
| R1 | — (offline) | — | — |

---

## S1: two versions, different structures, complete scene table (SHL-30)

**Expect:** `script` v1 with 2 versions of different `structure_type`s, both opening with 2B (or a named backup). Every scene has all five `visual_action` parts, cards ≤ 6 words with in/out times, a voiceover, an asset hint, a retention device. Caption with first line ≤ 125 characters, 3–5 hashtags, one WhatsApp CTA. The script-pick gate is pending; the pick message follows `templates/script-pick.md`.

**Automated:** schema; check 13 (`scriptConsistency`); 2 versions, 2 structures; hook ids; caption and CTA; gate pending. **Rubric:** R-S1, R-S2, R-S7.

## S2: timing fits; the over-length line is caught and fixed (SHL-30)

The picked hook's spoken layer is 18 spoken words ("Razai ghar pe dhulti hi nahi? Shubh mein ₹249 mein dry clean, 31 Dec tak, pickup bhi free."): it can't be said in 3 s.

**Expect:** the hook line is cut or split across scenes, and `checks.timing_notes` says so. Every scene is within the Hinglish hard max (3.0 words/s, spoken numbers counted), no static scene runs over 4 s, cards are held long enough. ₹249, 31 Dec and ₹299 survive. **Automated:** check 13; `timing_notes` non-empty; facts present.

## S3: the fact guard removes planted inventions (SHL-31)

Planted in the pick: a lever proof "10,000+ razai dhul chuki hain (owner said so)" (no source), backup hook 2A "Sirf ₹199 intro price", and a script note "Say 'Indore ka No.1 dry cleaner'".

**Expect:** no ₹199, no 10,000, no "No.1" anywhere in voiceover, cards or captions; ₹249 exactly; `fact_flags` lists what was removed (with an unlock) and the reply says why. Version B doesn't open with 2A, or if it does, without ₹199. **Rubric:** R-S4.

## S4: the hook payoff scene is named (SHL-30)

**Expect:** each version's `checks.payoff_scene` is a real scene starting before 60 % of the runtime, and the pick message names it. **Automated** in S1-SHL30.

## S5: the critique pass rewrites a planted weak middle (SJE-04)

Planted: the concept's story spine has three middle beats that are all "kurta sets on the rack".

**Expect:** the scripts don't repeat the rack shot: at most once per version, and never two consecutive scenes with the same subject and shot. At least one `critique_notes` entry (`no-escalation` or `other`) is fixed. The tailoring table appears (profile `do`). No body talk. **Rubric:** R-S3.

## S6: the script pick reads natural replies (SHL-32)

Replies (`fixtures/script-localise/replies.json`): R1 "A"; R2 "A with scene 3 from B"; R3 "A, scene 4 line: …aur dhulne ke baad, ekdum naya."; R4 "A, shorter by 5 sec"; R5 "theek hai"; R6 "B"; R7 Pooja says "A" (not the assignee).

**Expect:**
- **R1–R6:** the gate is recorded `approved` while `script` is still v1, **then** v2 is saved with `pick` (`version_id`, `edits` with `applied` and `rechecked`) and `downstream`.
  - R2: B's scene 3 line is in A, re-timed.
  - R3: scene 4's line is the editor's.
  - R4: 15 s, still with a hook, a payoff and a CTA.
  - R5: the recommended A.
- **R7:** refused politely, naming Ravi or Samarth; nothing saved.
- The picked script passes check 13.

**Before P1:** the producer may show its generic gate message and treat an edit reply as "changes". If the run went through the producer rather than the script skill's §Gate, mark R2–R4 as "blocked by P1", not "failed".

## L1: natural Hinglish; no planted stiff line survives (SHL-33, SJE-05)

SHL-33's picked script has three planted lines: "Aapka hamare store mein swagat hai" (literal), "Razai ki swachhata ab aasaan" (too pure), "Vastron ka sangrahan nishulk, ₹299 se upar" (too pure).

**Expect:** all three rewritten in everyday Hinglish ("Pickup free, ₹299 se upar"), facts unchanged, every line in its seconds. SJE-05: an English variant (writing script `english`) with the same scenes and ₹1,499, natural Indian English, listed in `downstream.variants_available`; one client message with a line about it.

**Native-speaker rubric** (R-L1): a native Hinglish speaker from a Tier 2 city reads every voiceover line and card aloud and scores 0–2 (0 = would screenshot it as AI, 1 = OK but stiff, 2 = sounds like the shop owner). Pass = no 0 and an average of at least 1.6.

## L2: Devanagari via IndicXlit when available; otherwise `unverified` (NRH-15)

**Expect:** `writing_script: devanagari`; voiceover, cards and captions in Devanagari, with only the RERA number, the website and digits in Roman.
- **IndicXlit installed:** `script_check.status: verified`, `tool: indicxlit`.
- **Not installed (expected here):** `unverified`, `tool: manual`, with `flagged_words` listing what was checked by hand, and the reply says so.

A native reader checks nukta, matras and loanword spelling (R-L2).

## L3: prices and phone numbers spoken correctly (SHL-33, NRH-15)

**Expect:**
- **SHL-33:** `numbers_spoken` has ₹249 → "do sau unchaas" (shop style is the same here), 31 Dec → "iktees December", ₹299 → "do sau ninyaanave".
- **NRH-15:** the phone number 98260 12345 is spoken digit by digit in two groups of five (`kind: phone`).
- **Both:** `tts_text` has no digits.

## L4: SRT timing matches scene times; lines ≤ 32 characters (SHL-33, NRH-15, SJE-05)

**Expect:**
- every cue inside its scene, no overlaps, 0.83–7 s each;
- at most 2 lines of at most `caption_max_chars_per_line` characters;
- at most 17 characters per second;
- `font_note` set for Devanagari.

**Automated** by check 13 (`localisedConsistency`).

## L5: back-translation catches a planted meaning change (SHL-34)

Planted in localised v1 (its own back-translation said "all OK"):
- scene 5 "Sirf aaj, 20% off." (lost "25 Nov tak", added urgency);
- scene 6 "Pickup bilkul free." (lost "₹299 se upar").

**Expect:**
- a new version whose `back_translation.drift` lists scenes 5 and 6 as fixed;
- scene 5 has "25 Nov tak" again and no "sirf aaj";
- scene 6 has "₹299 se upar";
- the SRT and the voiceover file are rebuilt to match.

## L6: the client review message is short, simple and exact (SHL-33, NRH-15, SJE-05)

**Expect:**
- ≤ 12 lines and ≤ 700 characters, in the client's language;
- the greeting by name;
- the hook line;
- 4–5 moments;
- the exact offer (₹249 · 31 Dec / ₹1,499 / RERA P-JBP-21-1234);
- the OK ask.

It must not contain:
- jargon (scene, CTA, VO, SRT, hook, version);
- a `{{needed}}` token (NRH-15 asks for the possession month in plain words);
- a phone number.

**Rubric** R-L6 (the 20-second test).

## L7: pronunciation proposals for new names (NRH-15, SJE-05, SHL-33)

**Expect:**
- **NRH-15:** proposals for at least two of Narmada Heights, Napier Town and Agrawal (plain respelling plus Devanagari).
- **SJE-05:** a proposal for Saanjh.
- **SHL-33:** no proposal for Shubh Laundry (already confirmed in the profile), and its `say_as` is used in the hints.

## A1: client approval through client-feedback (SHL-35)

- **A1-ok:** "client approved: Haan perfect hai, final karo." → the client gate is `approved` (recorded by Ravi, quote in the note), no feedback entry, and the job moves on.
- **A1-changes:** "'dhulne ke baad' ki jagah 'wash ke baad' hi rakho … aur end mein Shubh Laundry ka naam bhi bolo"
  - `client-feedback` writes one entry with two items:
    - the wording item routes to **`localise`** with P2, or `script` before P2;
    - the brand-name item routes to **`script`**.
  - The proposed stage is `script`.
  - After "route ok":
    - the gate is `sent_back` to `script`;
    - script step 15 saves a version with only version A, `pick.status: pending` and an edit naming F1;
    - the client-changes pick is shown.
- **A1-offer:** "offer 25% kar do" → a `change_request` routed to `brief`. Only the admin confirms it; the client gate stays pending, and the reply names Samarth.

## E2E: script → localise → client approval (SHL-30)

**Expect:**
- `script`, `localise` and `client-script-approval` are each `done` in the stage history;
- the script pick is A;
- `localised_script` passes check 13;
- the client gate is approved;
- the job is at the next stage on the full track (`style-bible`, a placeholder).

## R1: regression (offline, no Claude)

The runner's `R1` runs:
- the validator;
- the script-localise fixture check;
- the planted-fault test (24 faults);
- the brief and concept-hooks fixture checks;
- the research validator-faults and methods-consistency checks;
- `transliterate.py --self-test`;
- `git diff --stat main` on the protected paths, which must be empty before the P-diffs are applied, and only the P-diffs after.
