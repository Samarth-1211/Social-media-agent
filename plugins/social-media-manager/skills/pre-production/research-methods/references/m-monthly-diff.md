# m-monthly-diff

## Purpose
Turn this run into "what changed since last time", so the team reads a short diff instead of a whole new sheet, and carry forward what still holds.

## When to use
Every run for a client that already has a sheet (`monthly_refresh`, and festival runs after the first sheet). Runs **last**, after the other methods.

## Tools needed
Storage only (`get_insight` for the previous sheet). It compares what this run read; it fetches nothing itself.

## Needs a person present?
No.

## Inputs
The previous insight sheet (`client.latest_insight_id`) and its raw competitor snapshot; this run's findings and raw data; outcomes recorded since (`outcome`).

## Steps
1. **First sheet ever?** Write no diff (`diff_vs_previous: null`) and say in the summary: "First sheet: this is the baseline; next month shows what changed."
2. **Compare per category** (pain points, angles, hooks, ads…):
   - **new**: a finding with no match last time → its id in `new`;
   - **gone**: last time's finding that this run re-read and no longer supports → short text in `gone`;
   - **changed**: same subject, different facts (an offer, a rating, a rival's longest-running ad) → `changed` with before and after.
3. **Competitor snapshot numbers** (only those re-read this run): active ads per advertiser (compare each with itself only), longest-running ad in days, offers, Google rating and review count. Report a change only when it crosses a threshold:
   - a new ad idea (not just a new size);
   - an idea crossing 30, 60 or 90 days;
   - an idea gaining 3+ versions;
   - any price or offer change, or a new discount of 10% or more;
   - a review theme appearing 3+ times, or the rating moving 0.1 or more;
   - a reel at 3x+ its account's median.
4. **Carry forward** findings from last time that weren't re-read but are still plausible (pain points, proof), keeping their old source date; never carry forward struck findings. Re-confirmed findings get this run's source and may move up a confidence mark.
5. **Outcomes:** list findings marked `worked` or `didnt` since last month, so the team sees what the learning loop says.
6. **Write `summary`**: 3–5 lines, the most important changes first. "No change" applies only to sources actually re-read.

## Caps
None of its own.

## Output fields
`diff_vs_previous` (`previous_insight_id`, `summary`, `new`, `gone`, `changed`); carried-forward findings in their categories.

## Pitfalls
- Don't report noise: a new ad size, a reshuffled bio or a 1-review change is not news.
- Don't compare ad counts across advertisers or libraries.
- Don't say something "stopped" when the source simply wasn't read this time.

## Source and licence
Run memory, snapshots and watch thresholds adapted in our own words from goose-skills `research-competitors` (MIT, GooseWorks, commit `885edb54`); before/after diff and "no change" lines inspired by Hyper Marketing `competitor-intel` (MIT, ideas only).
