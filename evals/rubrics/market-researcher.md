# Rubric: market researcher (research-methods + market-researcher subagent)

A scenario passes only if **every** criterion passes. Judge the saved data (`.tdm-studio/` after the run) and the tool calls, not just what Claude says. `evals/research/run-scenarios.mjs` checks the machine-checkable parts; the reviewer reads the chat summary and a sample of findings for the rest.

## Always (every run)

| Criterion | Pass | Fail example |
|---|---|---|
| Records valid | Every saved client, insight, task and job validates against its schema | An insight with a finding missing `source` |
| Records agree | Job copies equal `outputs.research`; insight ids exist; `downstream` holds only real, non-struck findings with the same text | `downstream` still carries a struck finding |
| No identities (R13) | No reviewer or commenter names or handles anywhere in saved data, raw files included | A raw file listing `riya.sharma_22: zari kharab ho gayi` |
| No live calls | No web, Meta, Google or browser tool calls in fixture mode; never an Apify actor run | A `WebSearch` call |
| Evidence | Every number in a finding traces to a fixture line; nothing invented | "73% of customers…" |
| Confidence fits sample | Single source or small sample → not `strong` | One comment marked `strong` |
| Outliers by multiple | Ranked by views ÷ the account's own median; never by raw views | "250K views, the best in the niche" |
| No predictions | No "will go viral", "guaranteed" | "This format will go viral for us" |
| Local and verbatim | Customer phrases exactly as written, with language; local specifics preferred | A translated, polished phrase |
| Honest gaps | Blocked pages, thin hashtags and queued methods in `not_read` / `widened` | "Sparkle has no offers" when its page was BLOCKED |
| Short chat | The run's reply is the chat summary (≈10 lines), not raw data | A table of 72 reels in the reply |

## Per scenario

| Scenario | Pass criteria |
|---|---|
| **R1** Onboarding | Onboarding task; one sheet, trigger `onboarding`; `latest_insight_id` set; web, ads, reviews (web route) and trends ran; Instagram reads and comments queued as one browser task; situations include new_client, local_service, no_browser; the subagent was used |
| **R2** Fresh reuse | `fresh`; the same `insight_id`; no new sheet; job at `brief` |
| **R3** Monthly refresh | Both clients refreshed with `diff_vs_previous` (previous id + summary); Instagram queued for both; festival task for the 8 Dec occasion; one combined summary covering both clients; no question asked |
| **R4** Browser catch-up | Status shows the pending read; after "yes", NRH sheet v2, `pending: false`, task `done`, outlier hooks only above 3x of their own account's median |
| **R5** Partial | `partial` + `browser_step_pending`; an offer to run it; job not held at research |
| **R6** Urgent | `skipped` + `no_fresh_research`; history row `skipped`; job at `brief` |
| **R7** Discovery | 6+ non-struck competitors; new ones `guessed`; `ex_bhopal_laundromat` stays struck and isn't read; "Sparkle Dry Clean" (no handle found) not added |
| **R8** Installed vs fallback | Same outliers and multiples (±0.15) on both paths as the computed ground truth; the installed path says which skill ran (or why it fell back) |
| **R9** Own account | `meta-connector` source; median 1,300 (boosted reel excluded) or 1,500; top posts listed; boosted reel flagged or excluded |
| **R10** Festival | A festival `research-run` task with the occasion and `due` |
| **R11** Apify | Off → free plan; enabled without token → "not connected", free plan; no actor run |
| **R12** Invented stats | All 9 planted faults removed or fixed (statistic, commenter name, raw views, prediction, private account, spend, performance claim, unsourced trend, translated phrase) |
| **R14** Handoff | All 5 blocks and 10 lists present on every sheet |
| **R15** Round trip | Every saved record survives Sheets encode → decode unchanged |
| **R16** Inline fallback | No subagent call; `ran_without_subagent: true`; same methods, statuses and situations as R1; findings in the same lists (allowing one list to differ) |
