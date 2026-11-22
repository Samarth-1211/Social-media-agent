# Caps

Research is small on purpose: enough to see patterns, little enough to stay at human speed in a browser and cheap in Claude usage.

## 1. Volume caps per run

Read `config.research_caps`; any key missing there uses the default below. Methods never exceed them. "Go deeper" may raise a cap for one run only; the plan records who asked.

| Key | Default | Used by | Notes |
|---|---|---|---|
| `accounts_min` / `accounts_max` | 6 / 12 | `ig-outlier-read`, `competitor-discovery` | ig-viral mix: 4 direct, 4 adjacent, up to 2–4 outsized. Monthly refresh: 6. |
| `reels_per_account` | 12 | `ig-outlier-read` | The last 12 reels give the account's median; fewer than 8 visible = mark the account `weak`. |
| `comment_reels` / `comments_per_reel` | 5 / 30 | `comment-reading` | Comments on the top 5 outlier reels only. |
| `reviews_per_business` | 30 | `maps-review-reading` | Weighted towards 2–3 star reviews. At most 4 businesses per run. |
| `hashtag_scans` | 2 | `ig-niche-pulse` | About 30 reels read per scan. |
| `trend_searches` | 5 | `trends` | Searches, not fetches; up to 5 fetches on top. |
| `ad_library_advertisers` | 6 | `meta-ad-library` | One search per advertiser plus up to 2 keyword searches; `limit` ≤ 25 per call. |

**Web budget for unattended runs** (not configurable, keeps scheduled runs cheap): at most 20 web searches and 20 page fetches per client per run, across all methods. `web-competitor-intel` takes at most 3 searches and 3 fetches per competitor.

## 2. Money (Apify only)

- **Apify is off by default** (`config.apify_enabled: false`). Every other method is free.
- **Estimate before running:** results requested × the actor's current price per result (read it from the actor's pricing on Apify; `m-apify-optional.md`) + any per-run start fee. Round up. Show it in the plan in `config.research_currency`.
- **Spend gate:** estimate ≤ `config.research_auto_approve_limit` → runs without asking (default 0 means **always ask**). Above it → a `spend` gate for the admin (`stages.yaml` `spend_gate: admin`). In an unattended run nobody can approve, so the paid part is queued as a task and the free part runs.
- **After running:** log the real cost (from the run's usage, not the estimate) as a ledger line: provider `apify`, currency USD, with the estimate next to it.

## 3. Cost lines

Every run writes one `cost[]` line per provider used, and the same line to the job's ledger (`add_credit_entry` with `provider` and `currency`; amount 0 for free ones):

| Provider | When |
|---|---|
| `web` | Any web search or fetch |
| `meta` | The Meta Ads connector (ads library, own media) |
| `browser` | The attended browser read |
| `apify` | An Apify run (real cost in USD) |

Free lines use currency `USD` with amount 0, so the ledger never adds them to Higgsfield credits.

## 4. Claude usage

- The scheduled run touches only `config.research_unattended_clients` (default all active clients) and stops for the month if `research_schedule_enabled` is false.
- Reuse beats rerun: a fresh sheet is never refreshed early unless someone asks.
- The subagent returns only the chat summary (`templates/chat-summary.md`); raw data stays in storage.
