# Automation: triggers, modes, queue, schedule

Research should start by itself and never hold up a job. A person is needed for only three things:
1. being online with a browser for the Instagram read;
2. optionally striking wrong competitors or insights;
3. approving paid Apify spend, and only if Apify is enabled.

## 1. Triggers

| Trigger | Who notices | What happens |
|---|---|---|
| **Client onboarded** | `brand-keeper`, right after it saves a new client | A `research-run` task (trigger `onboarding`) is created. Where subagents work (Claude Code, Cowork) the unattended part starts at once in the background; otherwise it waits for the next run or the first job intake. |
| **Job intake** | `producer`, at the `research` stage | Freshness check (§4). Runs, reuses or skips, never blocks. |
| **Schedule** | The scheduled task (§5) | Unattended refresh of every client in `research_unattended_clients`; Instagram steps queued. |
| **Festival in 14 days** | The scheduled task, and `tracker` at the start of a session | For each `festival_calendar` occasion 14 days or fewer away with no festival sheet yet: a `research-run` task (trigger `festival`, `occasion`, `due` = the later of today and 14 days before the occasion). If a refresh in the same run already covers the occasion (situation `festival`), mark the task `done` at once. |
| **Manual** | Anyone: "research <client>", "refresh research", "go deeper" | A run now, attended if a browser is open. |

## 2. Two run modes

| | Unattended | Attended |
|---|---|---|
| When | Scheduled, background, or no browser/person | A person is online with a browser now |
| Methods | `web-competitor-intel`, `meta-ad-library`, `trends`, `monthly-diff`, `own-account-audit` (when linked), `maps-review-reading` (web route), `apify-optional` (if enabled and within the auto-approve limit) | `ig-outlier-read`, `ig-niche-pulse` (unless Apify did it), `comment-reading`, `maps-review-reading` (browser route), then `ig-hook-classify` on what was read |
| Asks questions? | Never. Questions go in the summary. | Only to start ("Run now?") and if the browser hits a login or a warning |
| Writes | A sheet with `pending_browser_step.pending: true`, plus a task | Completes the same sheet (new version), `pending: false`, task `done` |

The attended read is **small and at human speed**: one page at a time, within the caps, never in a background loop, never logging in for anyone, and stopping at the first warning or challenge page (queue the rest). Claude does the clicking and reading; the person only keeps the browser open and signed in. Use a team Instagram account, never a client's.

## 3. The queue (pending tasks)

- Storage: the Tasks tab / `tasks.json` (`task.schema.json`; `list_tasks`, `save_task`).
- **One pending task per client per kind.** If one exists, update it (add methods, move `due` earlier) instead of adding another.
- `research-browser-step` tasks carry the `insight_id` to complete, the methods left and `estimate_minutes` (about 2 minutes per account read, 10 for a typical client).
- **Showing them:** `tracker` status lists pending browser tasks as "Research: Instagram read pending (~10 min, needs browser)".
- **Offering them:** at the start of a session, if a browser is available and tasks are pending, offer once: "3 clients need a 10-minute Instagram read (Shubh Laundry, Narmada Heights, Kesar Boutique). Run now?" **One yes runs them all in sequence**, oldest `due` first. "Not now" leaves them; don't ask again in that session.
- Finished: task `status: done`, `done_by`, `done_at`; the sheet's `pending_browser_step.pending` becomes false.
- A task older than 45 days is `cancelled` by the next scheduled run (the next refresh replaces it) and the summary says so.

## 4. Freshness check at job intake (producer)

| Situation | Status | Then |
|---|---|---|
| Job `urgent: true` | `skipped` | Nothing runs. Output carries flag `no_fresh_research`, plus the latest sheet's downstream if one exists (with its age in `note`). |
| Latest sheet younger than `freshness_days`, nothing pending | `fresh` | Reuse: copy its downstream into `outputs.research`. Nothing runs. |
| Latest sheet younger than `freshness_days`, browser step pending | `partial` | Reuse what exists, flag `browser_step_pending`, offer to run the browser step now (non-blocking). |
| Sheet older than `freshness_days` | `refreshed` | Run (unattended part now; attended part now or queued). If attended is queued, the status is `partial`. |
| No sheet | `new` | Same as refreshed, situation `new_client`. If attended is queued, the status is `partial`. |

The job always moves on to `brief` in the same turn.

## 5. Scheduled run

- **Where:** a cloud scheduled task (runs with the laptop off and includes the account's connectors), created by the admin. Setup and the exact prompt are in the plugin README ("Scheduled research").
- **Cadence:** weekly, Monday 02:30 India time. The person working is `system` (no "Who's working?", no Team lookup). Each run:
  1. Stops at once if `research_schedule_enabled` is false.
  2. **Festival check** (cheap, every week): queues festival runs (§1).
  3. **Full refresh** only on the first run on or after the 24th of the month (the run checks the Insights tab: no sheet with trigger `schedule` created this calendar month yet): for each client in `research_unattended_clients` (default all active), run the unattended methods (`monthly_refresh`, plus `festival` when it applies), save the sheet with its diff, and queue the Instagram step.
  4. Also runs any `research-run` task that is due and needs no person.
  5. Cancels stale tasks (§3).
  6. Posts **one combined summary** (log line on each client's latest job, if any, plus the run's reply): per client one line on what changed, then the pending browser tasks.
- Unattended runs never ask questions, never spend money above the auto-approve limit, and never change competitors beyond auto-accepted discovery.

## 6. After delivery: the learning loop

When a job is delivered and the client's own post results are available later (Meta connector media for a linked account, or Insights pasted into `ig-audit` or `own-account-audit`):
1. Find the insight findings the job used (`used_in_jobs` contains the job id).
2. Work out the posted reel's outlier multiple against the client's own median.
3. Mark those findings `outcome: worked` (≥ 1.5x and better than the client's median), `didnt` (below 1x), or leave `unknown`, with `outcome_note` ("SHL-04 reel: 3.4x the account median"). Use `mark_finding`.

Correlation, not proof: one reel can't show a finding is right. A finding needs 2+ `worked` outcomes before anyone treats it as proven, and the next sheet's `monthly-diff` reports outcomes.
