# Ready for production?

The bar: **an editor (or designer) could start without asking anything.**

Run every line before every save. Record each one in `self_check` as `{ check: <id>, pass, note }`. `ready_for_production` is true only if all lines pass. A line you can't make pass becomes an `open_questions` entry and is shown at the gate.

| id | Check | Pass when |
|---|---|---|
| `editor-can-start` | Read the production brief as the editor. Would you need to ask what, for whom, how long, which platforms, which language, what to say at the end, or by when? | No such question is left |
| `essentials-confirmed` | Every essential for this `job_kind` (`essentials.md`) | Filled; no "Never" essential is still guessed or missing |
| `offer-matches-profile` | Every price against the profile's `price_points` (`proof-and-claims.md` §4) | `profile_match` is `matches` or `no-price`, or a `differs` / `not-in-profile` price is confirmed by a person or flagged in `open_questions`. Not applicable with no offer: pass, note "no offer". |
| `no-invented-claims` | Every number and claim; the red-flag phrases (`proof-and-claims.md` §2); category rules (RERA) | Each has a source in `proof_points` or `offer_detail`; no red flag without proof; placeholders are listed |
| `research-angle-or-reason` | `research` | An angle with its finding `id` is used, or `no_angle_reason` / `skip_reason` says why not |
| `variants-consistent` | `deliverables` vs the master (`platform-variants.md` §5) | Platforms match; differing variants have `changes_from_master`; price, CTA and mandatories are the same; label-swap test passes |
| `pairs-agree` | `offer`/`offer_detail`, `cta`/`cta_detail`, `audience`/`audience_detail` | Each text was generated from its detail: `offer` shows `offer_detail.price`; `cta` contains `cta_detail.action` **word for word** and names the channel; `audience` contains `audience_detail.who` word for word |
| `language-consistent` | `language`, `writing_script`, `downstream.localise` | English ⇔ `english`; localise matches; the card is in the team's language |
| `mandatories-present` | Profile do's, learnings (e.g. price on the first frame), captions on, category mandatories | All in `mandatories`; profile don'ts and words to avoid are in `avoid` |
| `downstream-complete` | The `downstream` block | `concept`, `hooks`, `script`, `localise` and `shot_sourcing` filled for video (`concept` and `shot_sourcing` for posters); customer phrases verbatim |

## Quick self-test

Answer these from the brief alone:
1. What does the viewer do at the end, and where?
2. What exact price and last date go on screen?
3. How long, and on which platforms?
4. What must appear, and what must never appear?

If any answer is "I'd have to ask", the brief isn't ready.
