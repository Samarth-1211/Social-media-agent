# Concept scoring

Score each developed concept 0–5 on seven criteria, then weight. One pass, honest numbers, no rounding up. A concept is the hook, the audience, the angle and the creative direction working together; score that, not just the idea.

## Weights

| Criterion | Weight | Question |
|---|---|---|
| `brief_fit` | ×2 | Does it deliver the brief's objective, key message, offer and CTA, within `avoid` and `mandatories`? |
| `insight_strength` | ×2 | Is it built on a specific, sourced human truth a customer would recognise? |
| `distinctiveness` | ×1.5 | Could a competitor run it unchanged? Does it avoid `competitors_overdo` and the clichés? |
| `india_fit` | ×1.5 | Proof over hype, local detail, natural language, right for this city tier and age (psychology §7)? |
| `brand_fit` | ×1 | Does it sound and look like this client (`tone_of_voice`, `do`/`dont`, visual identity)? |
| `producibility` | ×1 | `producibility.md` scale. |
| `risk` | ×1, **inverted** | 0 = no risk … 5 = serious brand, cultural, production or legal risk. Counts as (5 − risk). |

`weighted = 2·brief_fit + 2·insight_strength + 1.5·distinctiveness + 1.5·india_fit + brand_fit + producibility + (5 − risk)`; maximum **50**.

## Anchors

| Score | brief_fit | insight_strength | distinctiveness | india_fit |
|---|---|---|---|---|
| **5** | Every brief essential lands naturally | Sourced (strong finding or the customer's own words); "haan, bilkul" | Only this client could run it | Specific place, real people, natural Hinglish, right proof for the tier |
| **4** | All essentials, one feels bolted on | Sourced, slightly general | One element a rival could copy | Local and natural; one generic touch |
| **3** | Misses one minor essential | Plausible but inferred (`assumption`) | Category-typical, well executed | Correct but could be any city |
| **2** | Misses the offer or CTA | A category truism ("everyone loves Diwali") | Category cliché | Translated feel or metro tone for a Tier 3 audience |
| **1** | Off-objective | No insight, just a topic | What everyone runs | Cliché-led or culturally off |
| **0** | Breaks `avoid` / `dont` | Contradicts research | Copies a competitor | Disrespectful |

## Learnings

From the client's `learnings` with `angle_type` set:
- `outcome: worked` (status active) for this angle type → +1 to `brief_fit` (max 5); note it in `why_not_higher` or the pack.
- `outcome: flopped` or `kind: rejected` → −1 to `brief_fit`, and the concept can't be `recommended` unless every alternative scores lower.
- `status: watch` → note it, no change.

## Picking the recommendation

1. Highest `weighted`.
2. Tie (within 1 point) → higher `insight_strength`, then higher `producibility`.
3. Never recommend a concept with `risk` ≥ 4 or any unresolved `{{needed}}` that blocks the shoot within the deadline; recommend the next one and say why.
4. One line of reason: the insight + why it wins for this client.

## "Why isn't this a 5?"

One line per concept (`why_not_higher`): the single biggest weakness. If you can fix it cheaply, fix it before saving and re-score once. Don't loop.

---

Credits: weighted scoring and the "why isn't it higher" diagnostic adapted from the Creative Director Skill by Serge Shima — github.com/smixs/creative-director-skill (https://sergeshima.com), CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); concept definition and strength criteria adapted from `ad-concept-generator` and `concept-engine` by Motion (github.com/Motion-Creative, MIT). Rewritten in our own words.
