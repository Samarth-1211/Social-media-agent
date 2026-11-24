# Catch-up card

Shown when someone resumes a job:
- the first time a job comes up in a session;
- or when they say "continue", "where is", "catch me up", "ka kya hua".

It answers five questions from the record alone. Never fill them from memory:

| Question | Field in the card | Where it comes from |
|---|---|---|
| Where are we? | **Now** | `current_stage` + `waiting_on` |
| What's done? | **Last done** | The latest `stage_history` entry with status `done` (stage, who, when) |
| Who is it waiting on? | **Waiting on** | The latest gate with status `pending` (see below) |
| What happened lately? | **Recent** | The last 3 `log` entries, newest last |
| Money? | **Credits** | `credits.used` / `credits.budget` (+ `warn_at`) |
| What's next? | **Next** | `next_action`, word for word |

## Building it

1. Call `get_job` for this job now, even if you read it a minute ago.
2. Pending gate → the person to name:

   | `owner_role` | Name to show |
   |---|---|
   | `admin` | The admin's name from the Team tab |
   | `editor` | The job's assignee's name (an editor or designer) |
   | `client` | The client's `decision_maker.name`, from the brand brief, if set, else "the client". Add who records the reply: the assignee. |
   | `budget` (gate kind) | Always the admin. Add the amount asked for, if it's in the gate note. |

   A pending creative pick (`gate_label: creative-pick`) is shown as "Creative pick (concept + hook) · waiting on <assignee>". If `config.creative_auto_pick_after_hours` is set, add one line "Auto-pick at <requested_at + n h> if no reply"; if that time has already passed, hand the job to `producer` for its auto-pick check before showing the card.
   A pending script pick (`gate_label: script-pick`) is shown as "Script pick (A or B) · waiting on <assignee>".

3. If there is **no** pending gate, the job is running. Say "Running: <current_stage>" and who started it.
4. Add, only when present:
   - **Deadline** — with "(overdue)" if past, India time.
   - **Feedback** — the latest feedback's round, item count and routing status, if routing is not `confirmed`.
   - **Credits warning** — if `used` ≥ `warn_at`, or `used` > `budget`.
5. Use `${CLAUDE_SKILL_DIR}/templates/catch-up-card.md` exactly. Keep it under 12 lines.

## Checks before showing

| Check | If it fails |
|---|---|
| `waiting_on` equals the pending gate's owner role (or `none` with no pending gate; or `client` with no pending gate while the job's brief is `awaiting-client`) | Show the card, plus a line: "Data check: waiting_on says X but the open gate is Y; ask the admin or producer to fix." |
| `next_action` mentions the current stage or the pending gate | If it clearly refers to an earlier stage, add: "next_action looks out of date." |
| The job's status is `paused` or `cancelled` | Say so on the first line. |

## After the card

- **Asked only to catch up:** stop after the card.
- **Wants to act** ("continue", "approve", "next"): say that `producer` will take it from here. The card is the producer's starting point too.
