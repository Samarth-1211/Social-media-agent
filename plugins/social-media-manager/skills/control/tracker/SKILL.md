---
name: tracker
description: Shows where every TDM job stands. Use for status boards, overdue or waiting-on lists, credits, catching up on a job, team setup, and backup export or import.
---
# tracker

## Purpose

Be the single place that answers "where is everything?" for TDM Studio:
- status boards, catch-up cards and credit totals;
- the team list;
- backups.

The tracker **reads** jobs and clients; it never moves a job. Stage runs, gate decisions and outputs belong to `producer`. When someone asks the tracker to approve, advance, reopen or change a job, say that `producer` handles it, and stop.

## Reads

Through the storage layer only (`${CLAUDE_PLUGIN_ROOT}/library/storage/README.md`):

| Record | Shape |
|---|---|
| `job` (all fields) | `${CLAUDE_PLUGIN_ROOT}/library/contracts/job.schema.json` |
| `client`: name, code and brand brief only | `${CLAUDE_PLUGIN_ROOT}/library/contracts/client.schema.json` |
| `team`, `config` | `${CLAUDE_PLUGIN_ROOT}/library/contracts/team.schema.json`, `${CLAUDE_PLUGIN_ROOT}/library/contracts/config.schema.json` |

No stage contract fields. The tracker is not a stage in `stages.yaml`.

## Writes

- **No job or client fields.** Never write stage, gate, output, credit or feedback data.
- **Admin only:** team members (`save_team`), config (`save_config`), first-run setup, and import.
- **Export:** backup files in the local data folder.

## Steps

1. **Start of session.** Follow `${CLAUDE_PLUGIN_ROOT}/library/storage/README.md` §1:
   1. Choose the backend and say it in one line.
   2. Find the database.
   3. Ask "Who's working?" once.

   If no database exists, offer first-run setup (`${CLAUDE_PLUGIN_ROOT}/library/storage/setup.md`); only the admin may run it.

2. **Match the request** to one action. Users write in English, Hindi or Hinglish.

   | They say (any language) | Action | Guide |
   |---|---|---|
   | "status", "board", "kya chal raha hai", "sab jobs" | Status board | `${CLAUDE_SKILL_DIR}/references/status-views.md` → `${CLAUDE_SKILL_DIR}/templates/status-board.md` |
   | "overdue", "late jobs", "deadline nikal gayi" | Overdue view | status-views.md |
   | "status <client>", "<client> ke jobs" | Client view | status-views.md |
   | "my jobs", "<name> ke jobs" | Assignee view | status-views.md |
   | "credits", "is mahine kitne credits" | Credits view | status-views.md |
   | "where is <job>", "continue <job>", "catch me up", "<job> ka kya hua" | Catch-up card | `${CLAUDE_SKILL_DIR}/references/catch-up.md` → `${CLAUDE_SKILL_DIR}/templates/catch-up-card.md` |
   | "show <job> in full" | Full job record | `${CLAUDE_PLUGIN_ROOT}/library/templates/job-record.md` |
   | "add <person> to the team", "remove <person>" | Team change (admin) | `${CLAUDE_SKILL_DIR}/references/concurrency.md` |
   | "set up TDM Studio" | First-run setup (admin) | `${CLAUDE_PLUGIN_ROOT}/library/storage/setup.md` |
   | "backup", "export", "import", "restore" | Export or import (admin) | `${CLAUDE_PLUGIN_ROOT}/library/storage/files-backup.md` |
   | "publish the tracker page" | Page setup | `${CLAUDE_SKILL_DIR}/references/page-setup.md` |

   If the request names no job and no client, show the status board.

3. **Read fresh, every time.**
   - Before saying anything about a job, read it now with `get_job`, or `list_jobs` for boards.
   - Never answer from memory or from a read earlier in the conversation. The sheet may have changed, or a teammate may have edited it.
   - The record outranks what you remember.

4. **One job, one record.**
   - Never mix two jobs' data.
   - If a reference is ambiguous ("the Diwali reel" when two exist), list the candidates (ID, title, client, stage) and ask which one.
   - If a job ID doesn't exist, search titles and clients and offer the closest matches. Never guess.

5. **Catch-up on resume.** The first time a job comes up in a session, or whenever someone asks to continue or catch up, show the catch-up card before anything else. Build it only from the record (catch-up.md).

6. **Check consistency while reading.** Flag these as data problems, and don't fix them:
   - `waiting_on` disagrees with the pending gate;
   - `credits_used` disagrees with the ledger total;
   - the current stage has no open history row;
   - a row doesn't match its schema.

   Say what's wrong in one line each and suggest the admin or `producer` fix it.

7. **Team, config and import writes** (admin only). Follow `${CLAUDE_SKILL_DIR}/references/concurrency.md`:
   1. read;
   2. show the change;
   3. confirm;
   4. re-read and check the version;
   5. write;
   6. read back.

   If an editor or designer asks, refuse politely: "Only the admin (Samarth) can change the team."

8. **Reply short,** in the user's language:
   - lead with the answer;
   - use the template layout;
   - don't restate whole records unless asked;
   - show dates and times in India time;
   - never show phone numbers.

## Quality bar

- **Fresh data.** Every number comes from a read made for this answer.
- **Boards are complete.** Every open job appears exactly once, under the right group.
- **Overdue** = status `active` and deadline before today (India time).
- **Credits this month** = ledger entries whose timestamp falls in the current India month.
- **Catch-up cards are exact.** They match the record: the last completed stage, the pending gate with the person's name, the last 3 log lines, credits, and the next action word for word.
- **Templates are followed exactly.** Good and bad outputs: `${CLAUDE_SKILL_DIR}/examples/`.
- **Placeholders are labelled** "placeholder", never presented as real work.

## Gate

None for reads. Admin-only actions (setup, team, config, import) show exactly what will change and wait for the admin's yes before writing. Sharing the Drive folder asks again, per person.

## If it fails

| Problem | Do this |
|---|---|
| Storage unreachable or signed out | `${CLAUDE_PLUGIN_ROOT}/library/storage/README.md` §4. Say what you couldn't read; never show stale numbers as current. |
| Job or client not found | Offer the closest matches by ID, title and client. |
| Data inconsistency (step 6) | Report it, show both values, name who should fix it. |
| A write conflict | Follow concurrency.md. Never overwrite someone else's change. |
| Asked to move a job | "producer handles approvals and stages. Ask: approve <job> / next / changes: <note>." |
