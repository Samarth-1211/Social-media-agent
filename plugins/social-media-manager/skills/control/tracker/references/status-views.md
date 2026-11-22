# Status views

All views read the Jobs tab once (`list_jobs`). Read Credits or Clients only when the view needs them. Today and this month are measured in **India time** (Asia/Kolkata).

**What counts as open:**
- **Open** = status `active`.
- `paused` jobs are listed under "Paused" at the bottom, only when there are any.
- `delivered` and `cancelled` jobs appear only when someone asks for them.

## 1. Status board (default)

Group the open jobs by `waiting_on`, in this order:
1. **Waiting on admin**
2. **Waiting on editor**
3. **Waiting on client**
4. **Running** (`waiting_on` = `none`)

Within each group, sort by deadline (earliest first; no deadline last).

Each job is one line: ID, title, client name, current stage, assignee, deadline. Mark a past deadline **OVERDUE**.
If the job is at `brief` and waiting on the client (no pending gate), write the stage as "Brief: waiting for client reply (asked <date>)".
If the pending gate is a creative pick (`hooks`, `gate_label: creative-pick`), write the stage as "Creative pick (concept + hook)".
Mark it **REMIND** when the oldest open row in `BriefQuestions` for the job is older than `config.client_question_reminder_hours`.

Above the groups, one summary line: "<n> open jobs · <a> admin · <e> editor · <c> client · <o> overdue".

Template: `templates/status-board.md`.

## 2. Overdue

Open jobs with `deadline` before today. Sort by how late they are, most late first. Show the days late and who the job is waiting on.

## 3. Per client

Resolve the client by code, ID or name (ask if several match). Then show:
- that client's open jobs, as on the board;
- delivered jobs from the last 30 days, one line each;
- open question count from the brand brief, if there are any.

## 4. Per assignee

"My jobs" uses the person identified this session. Show:
- their open jobs, grouped by `waiting_on`;
- separately, gates **they** must decide: editor gates on jobs assigned to them, and every admin gate if they are the admin.

## 5. Credits

| Section | What it shows |
|---|---|
| This month by client | The sum of ledger `amount` for entries whose `at` starts with the current India `YYYY-MM` **and whose `currency` is `credits` or empty**, grouped by the job's client. |
| Money this month | Ledger entries in USD or INR (research with Apify), by client and provider. Never added to credits. Leave the section out when there are none. |
| Open jobs | `used` / `budget`, sorted by percentage used. Flag any above `warn_at` or above `budget`. |
| Tier split | Draft vs final credits this month, so the cheapest-first policy is visible. |

Read the Credits tab for the ledger; `credits_used` on the Jobs row is the running total. If they disagree for a job, flag it (SKILL.md step 6).

## 6. Research

Read the Tasks tab (`list_tasks`, status `pending`) and, per active client, `get_latest_insight`.

| Section | What it shows |
|---|---|
| Pending browser steps | One line per client: "Research: Instagram read pending for <client> (~<n> min, needs browser) · since <date>". Oldest first. |
| Queued runs | `research-run` tasks: festival runs with their occasion and `due`, onboarding runs. |
| Sheets | Per client: latest `insight_id`, its date and age in days, and "stale" if older than `freshness_days`; "no research yet" if none. |

The status board shows the pending browser steps as its last group, "Research" (one line per client), only when there are any.

## Empty states

| View | Message |
|---|---|
| Board | "No open jobs. Start one with producer: new job." |
| Overdue | "Nothing overdue." |
| Credits | "No credits spent this month." |
| Research | "No research waiting. Every active client has a sheet under <freshness_days> days old." (or list the ones without) |

## Big lists

If a group has more than 15 jobs, show the first 15 by deadline and say how many more there are. Offer a filter (client, assignee or type).
