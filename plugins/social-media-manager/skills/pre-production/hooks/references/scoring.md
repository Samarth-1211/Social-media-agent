# Hook scoring

Score every hook 0–5 on seven criteria, weight, apply the weakest-link cap, then the learnings adjustment. Honest numbers; one pass (plus one re-score after the critique pass).

## Weights

| Criterion | Weight | Question |
|---|---|---|
| `clarity` | ×2 | With the sound **off**, do the first frame and text say what this is about in 1.5 s? (Spoken line 5–12 words.) |
| `curiosity` | ×2 | Is there an open loop or a stake the viewer needs closed? |
| `relevance` | ×1.5 | Does it hit this audience's real pain point or desire (brief `pain_points`, research)? |
| `specificity` | ×1.5 | Concrete nouns and **real** facts (price, place, time, phrase)? Invented facts score 0. |
| `india_fit` | ×1.5 | Proof over hype, local reference, natural language for this city tier and age? |
| `payoff` | ×1.5 | Can the concept deliver this promise, early (before the halfway mark)? |
| `brand_safety` | ×1 | Fits the brand voice, `do`/`dont`, and no trust anti-pattern? |

`weighted = 2·clarity + 2·curiosity + 1.5·(relevance + specificity + india_fit + payoff) + brand_safety`; maximum **55**.

## Anchors

| Score | clarity | curiosity | specificity | india_fit | payoff |
|---|---|---|---|---|---|
| **5** | Muted, a stranger gets it at a glance | Viewer must know the answer | A real number, place or phrase does the work | Sounds like a sharp local creator; real local detail | The concept delivers it in the first half |
| **4** | Clear with the text | Clear stake | One concrete detail | Natural, a touch generic | Delivered, a bit late |
| **3** | Needs the spoken line | Mild interest | Concrete but generic | Correct but could be anywhere | Partly delivered |
| **2** | Needs both audio and context | Predictable | Vague ("best", "quality") | Translated feel, metro tone for Tier 3 | Stretched |
| **1** | Confusing | No reason to stay | Nothing concrete | Cringe or off | Not delivered |
| **0** | — | — | Invented fact | Offensive | Bait-and-switch |

`relevance` 5 = the audience's own pain in their words; 1 = unrelated. `brand_safety` 5 = on-voice and clean; 0 = any trust anti-pattern (`anti-patterns.md`).

## Weakest-link cap

A hook is only as strong as its weakest layer. If **any** criterion is **1 or below**: `capped: true`, and `weighted` can't count above 30. A capped hook goes into the critique pass and can't be in the top 3 unless no alternative exists (say so in `critique_note`).

## Learnings adjustment

From the client's `learnings` where `hook_formula_id` matches this hook's formula:

| Learning | Adjustment | Note |
|---|---|---|
| `outcome: worked`, status `active` | +3 | `boost_note`: "H30 worked for SHL-01 (+3)" |
| `outcome: worked`, status `watch` | +1 | |
| `outcome: mixed` | 0 | note only |
| `outcome: flopped`, or `kind: rejected` (status active) | −3 | Also can't be the recommended hook unless nothing else scores higher |
| status `retired` | 0 | ignore |

Also: a learning without a formula id that clearly describes one ("price pehle dikhao" → H30) → +1 with a note. Research `outlier_hooks` for this formula with confidence `strong` → +1 ("working in this niche now"). Total adjustment stays within −5…+5. Record it in `scores.adjustment` and the reason in `boost_note`.

## Choosing the top 3 (variety)

Scores rank hooks; these rules keep the pick a real choice:
1. **Within a concept:** the top 3 use at least 2 formulas, and the first one fits the concept's angle (a price card can lead an `offer` concept; a `story` concept leads with a story or visual-led hook, a `proof` concept with a proof or process hook).
2. **Across concepts:** no two top hooks share the same spoken line or on-screen text (near-copies count), and no formula leads (is #1) in more than one concept.
3. **A boost lifts a formula, it doesn't clone it.** When a learnings boost puts the same formula on top everywhere, keep it where it fits the angle best; in the other concepts the next-best different hook takes the slot. Say so in that hook's `critique_note` ("H30 kept for C1; C2 leads with its own angle").

## Recommending a pair

Rank pairs by `concept.weighted / 50 + hook.weighted / 55`. Recommend the top pair unless its hook is capped or its concept has `risk` ≥ 4; then the next. Reason in one line: what the pair does that the others don't.

---

Credits: the weakest-link idea (overall = mean blended with the weakest check, minus red flags) adapted from `hookscore.py` in `ig-reel` by Jake Schincariol (github.com/Jakeschincariol/instagram-agent-skill, MIT); rewritten as our own rubric.
