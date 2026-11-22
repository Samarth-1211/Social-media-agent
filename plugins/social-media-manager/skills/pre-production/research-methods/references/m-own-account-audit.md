# m-own-account-audit

## Purpose
Find what already works on the client's own Instagram: which posts beat the account's normal, and what separates the top from the bottom.

## When to use
New clients and monthly refreshes, whenever the client's own numbers can be had without anyone logging in to the client's account.

## Tools needed
One of, in this order:
1. **Installed skill `ig-audit`** (from instagram-agent-skill), when installed and Insights are available to give it.
2. **Meta Ads connector** Instagram tools, when `client.meta.linked` is true: the Instagram accounts tool, then the Instagram media tool (`ads_get_ig_media`) with `ad_account_id`, `ig_account_id`, and filters for reels in the last 90 days.
3. **Pasted Insights:** an export or screenshots from the client's Professional Dashboard, sent by the client or the team.

## Needs a person present?
No, when the account is linked and metrics come through, or Insights were pasted earlier. Otherwise the method is skipped (never queued as a login task: nobody logs in to a client's account for research).

## Inputs
`client.own_handle`, `client.meta`, any pasted Insights in the client's Drive folder or chat.

## Steps
1. **Get the posts.** Linked: call the media tool (reels, last 90 days, up to 30 posts; page with the cursor). Note which metrics the response actually contains.
   - The media tool is built for boosting and may return captions and links without view or reach counts. **If there are no counts, don't guess any:** use pasted Insights if available, otherwise record `own_account` with `posts_read` and no multiples, and add "own-account metrics not available through the connector" to `not_read`.
2. **With counts:** median views across the posts read; each post's multiple = views ÷ median.
3. **Delegate if `ig-audit` is installed:** give it the posts and Insights; take its top 5 / bottom 5 and its findings, and keep only those with numbers it actually had.
4. **Otherwise, compare top 5 vs bottom 5** yourself, in this order: hold at 3 seconds (hook grade), hook formula (`m-ig-hook-classify`), format, length bucket (<15, 15–30, 30–60, >60 s), theme, whether the client replied to comments early; day and time last (rarely the cause).
5. **Diagnose:** views but few follows → a profile problem; few views → a hook problem. Sends per reach is the strongest signal when present.
6. **Write findings** with the sample size: about 30 posts can show a pattern; 6 can't (`weak`).

## Caps
Up to 30 own posts from the last 90 days.

## Output fields
`own_account` (`handle`, `metrics_source`, `period_from`/`to`, `posts_read`, `median_views`, `top`, `bottom`, `diagnosis`); `working_angles` (what already works for the client), `proof_points` (results the client can show).

## Pitfalls
- Never ask for or use the client's password, and never log in to their account.
- Boosted posts have paid views; mark them and keep them out of the median if the data says they were boosted.
- A tiny account (median under 200 views) makes multiples jumpy: confidence `weak`.

## Source and licence
Method adapted in our own words from ig-audit in Jakeschincariol/instagram-agent-skill (outlier multiple, sends per reach, hold at 3s, top 5 vs bottom 5, honest confidence; MIT, commit `d03c56bb`). The installed skill is invoked by name when present, never copied.
