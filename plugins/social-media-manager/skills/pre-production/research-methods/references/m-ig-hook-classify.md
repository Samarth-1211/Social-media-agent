# m-ig-hook-classify

## Purpose
Name the hook formula behind each outlier reel (and each own top post), with a confidence, so later stages can reuse the **formula** with the client's own content.

## When to use
Right after `m-ig-outlier-read`, `m-ig-niche-pulse` or `m-own-account-audit` produced openings to classify; also on pasted captions or opening lines.

## Tools needed
1. **Installed skill `ig-hook-extractor`** (instagram-skills), if it is in the skill list.
2. Otherwise none: the fallback below works on captured text.

## Needs a person present?
No. It only reads what was captured.

## Inputs
Per reel or post: the surface (single image, carousel, reel), the visual hook, the first on-screen text, the spoken hook if captured, the caption's first line, the structure.

## Steps
1. **Installed `ig-hook-extractor`:** give it each item's opening text and caption (it can't open URLs itself). Take its formula id, confidence and the blank template; keep the template in the raw file, not in the sheet.
2. **Fallback:** decide the surface first, then match the opening's shape. Use the same ids so results stay comparable:

   | Id | Surface | Shape of the opening |
   |---|---|---|
   | IG1 | caption-first | A precise result or number up front, with a promise the viewer can copy it |
   | IG2 | caption-first | A flat statement against common advice |
   | IG3 | caption-first | A shared everyday moment, dropped in without setup |
   | IG4 | caption-first | A first-person story with a time marker and an admitted cost |
   | IG5 | carousel | A numbered list, one point per slide |
   | IG6 | carousel | The result first, the before after it |
   | IG7 | carousel | Myth and truth in pairs |
   | IG8 | carousel | A named method, summed up on one slide |
   | IG9 | reel | A pattern interrupt or open loop in the first 1–3 seconds |
   | IG10 | reel | "How I did X in Y" with labelled steps |

   Reels mostly fall under IG9 or IG10. Also note, in `structure`, the caption-style shape their opening line takes (IG1–IG4), because that is what a script can borrow.
3. **Confidence:** 0.8+ when the skeleton matches cleanly; 0.5–0.8 when it's loose or two fit (name both, the better first); below 0.5 → `unclassified`, with a plain description of the opening. Tie-break on the post's goal (saves → IG1/IG5/IG8/IG10; shares → IG2/IG7/IG9; comments → IG3/IG4; follows → IG6).
4. **Write** `formula` and `formula_confidence` into each `outlier_hooks[].details`, and into own-account `top`/`bottom` items.

## Caps
Only items already captured (at most about 15 per run).

## Output fields
`outlier_hooks[].details.formula`, `formula_confidence`; `structure` notes.

## Pitfalls
- Abstaining is correct: an opening that fits nothing is `unclassified`, not forced into a box.
- Hinglish openings follow the same shapes; classify by structure, not by English keywords.
- A formula name is a label for reuse, not a prediction that it will work.

## Source and licence
Formula ids IG1–IG10, surface-first classification and confidence bands adapted in our own words from ig-hook-extractor in sergebulaev/instagram-skills (MIT, commit `823c681b`). The installed skill is invoked by name, never copied.
