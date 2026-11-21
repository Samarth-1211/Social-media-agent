# Google Sheets backend

How the operations in `README.md` run against the **TDM Studio Database** sheet. The layout is in `sheet-layout.json`.

Everything below was tested against a real sheet on 2026-11-22 (`docs/STORAGE.md`, "Verified behaviour").

## 0. Tools

Use the Google Drive and Google Sheets connector tools. Their names differ by app. In Claude Code they are `mcp__claude_ai_Google_Sheets__<name>` and `mcp__claude_ai_Google_Drive__<name>`.

| Need | Google Sheets tool | Google Drive tool |
|---|---|---|
| Read a range | `get_values` (`spreadsheetId`, A1 `range`) | |
| Write a range | `update_values` (`spreadsheetId`, `range`, `values`) | |
| Add rows at the end | `append_values` (`spreadsheetId`, `range` = `<Tab>!A1`, `values`) | |
| Tabs, dropdowns, formatting | `update_spreadsheet` (`requests`) | |
| Tab names and IDs | `get_spreadsheet` (`fields: ["sheets.properties"]`) | |
| Find the database | | `search_files` |
| Create folder or sheet | | `create_file` |
| Share the folder | | `share_file` |

## 1. Find the database

1. Search Drive: `title = 'TDM Studio Database' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`.
   - **One result:** use it. Remember its ID for the session, and check that it matches `spreadsheet_id` in its Config tab.
   - **None:** run first-run setup (`setup.md`).
   - **Several:** list them with owner and modified date, and ask which one.
2. If the user named a different database for this session (for example **TDM Studio TEST Database** for testing), search for that title instead.

## 2. Cells: how values are written and read

Writes are interpreted as if typed into the sheet. Without care, `+910000000001` loses its `+`, `0012` becomes `12`, and text starting with `=` runs as a formula.

**When writing:**

| Column type (layout) | Write as |
|---|---|
| `text`, `date`, `timestamp` | `'` + value, e.g. `'2026-11-25`, `'+910000000001` |
| `list` | `'` + items joined with a newline (`\n`) |
| `json` | `'` + compact JSON |
| `number`, `integer` | a plain number |
| `boolean` | `true` / `false` |
| empty / null | `""` |

The leading apostrophe forces plain text. Sheets doesn't store it and doesn't return it.

**When reading:**
- Every value comes back as a string. Numbers look like `"200"`, booleans like `"TRUE"`.
- Trailing empty cells are left out of a row.
- Convert each value back using the column type.
- An empty cell means null or absent.

**Format rules:**
- Timestamps are ISO 8601 with offset, e.g. `2026-11-22T15:30:00+05:30` (India time).
- Dates are `YYYY-MM-DD`.

**The clock (`get_now`).** Claude has no reliable clock: it knows today's date but not the time, and guessing gives every session a different "now". Take every timestamp from the sheet instead:
1. Write this formula into `Config!E1` with update values, exactly as below (no apostrophe):
   `=TEXT(NOW(),"yyyy-mm-dd")&"T"&TEXT(NOW(),"HH:mm:ss")&"+05:30"`
2. Read `Config!E1` back. The value is now, in India time (the spreadsheet's time zone is `Asia/Kolkata`), e.g. `2026-11-22T15:30:07+05:30`.

Rewriting the formula forces Google to evaluate it; reading the cell alone may return an old value. Call `get_now` once at the start of each turn that writes, and use that value for every timestamp written in that turn. `Config!D1` holds the label "clock (do not edit)".

## 3. Tabs and keys

Row 1 of every data tab holds the column keys from `sheet-layout.json`, in order. **Check row 1 before relying on positions;** if it differs from the layout, stop and report.

| Tab | One row per | Key | Builds |
|---|---|---|---|
| Jobs | job | `job_id` | job record (top-level fields; `credits_*` → `credits.budget / warn_at / used`) |
| Clients | client | `client_id` | client record (`json` and `list` columns as above) |
| Gates | gate | `job_id` + `seq` | `job.gates[]`, in `seq` order |
| StageHistory | stage run | `job_id` + `seq` | `job.stage_history[]` |
| Outputs | job output | `job_id` + `field` | `job.outputs.<field>` (one row per field, updated in place) |
| Credits | ledger entry | `job_id` + `seq` | `job.credits.ledger[]` (also carries `client_id` for the Dashboard) |
| Feedback | client reply | `feedback_id` | `job.client_feedback[]` |
| Log | event | `job_id` + `seq` | `job.log` = last 20 by `seq` |
| Questions | open question | `client_id` + `seq` | `client.open_questions[]` = rows with `status = open` |
| Learnings | learning | `client_id` + `seq` | `client.learnings[]` |
| ClientChanges | profile change | `client_id` + `version` | `client.changelog[]`, newest first |
| Team | person | `handle` | team members |
| Config | setting | `key` | config record (`credit_policy` is JSON) |
| Dashboard | (formulas) | | Never written after setup |

Columns marked `storage_only` in the layout (row keys, `seq`, a question's `status` and `answer`) are not part of the logical record.

**`seq`** is 1 + the highest existing `seq` for that parent (job or client), read just before appending.

## 4. Operations

**Finding a row.** Read the key column (e.g. `Jobs!A:A`). Data row *n* in that list is sheet row *n*. Then read or write `Jobs!A<row>:S<row>`. Re-find the row before every write, because people may have sorted or added rows.

| Operation | Steps |
|---|---|
| `get_now` | §2, "The clock": rewrite the `Config!E1` formula, then read `Config!E1`. |
| `get_config` | Read `Config!A:B` and convert using `config.schema.json` types. |
| `save_config` | Re-read; check `version`; write the changed `value` cells, `version` + 1 and `updated_at`. |
| `get_team` / `save_team` | Read `Team!A:H`. To save, update the member's row (or append a new one), with `version` + 1. |
| `list_clients` | Read `Clients!A:F`. |
| `get_client` | Read the client's Clients row, then its rows in Questions (status `open`), Learnings and ClientChanges. |
| `get_brand_brief` | Same reads as `get_client`. Render `library/templates/brand-brief.md` with active learnings and high or medium open questions only. |
| `save_client` | Re-read the row and check `version` and `updated_at`. Write the whole Clients row. Append new Learnings and ClientChanges rows. For a resolved question, set its `status` to `answered` and fill `answer`; never delete it. |
| `create_job` | See below. |
| `get_job` | Read the Jobs row, then read Gates, StageHistory, Outputs, Credits, Feedback and Log and keep that job's rows. Build the record and validate it. |
| `list_jobs` | Read `Jobs!A:S`. "Overdue" means `deadline` < today and status `active`. |
| `update_job` | Re-read the Jobs row and check `version` and `updated_at`. Re-count the job's Gates and StageHistory rows: they must not be fewer than you held. Write the whole Jobs row with `version` + 1. Then update or append Outputs rows, update the open StageHistory row's `status` and `finished_at`, and append new StageHistory, Gates and Log rows. |
| `record_gate`, request | Append a Gates row (`pending`, `shown_outputs`, `requested_at`). Update the Jobs row: `waiting_on` = owner role, `next_action` = "<who> to approve <stage>". Append a Log row. |
| `record_gate`, decision | Re-read the gate row; it must still be `pending`, otherwise stop and report who decided. Check permission (`README.md` §3). Write `status`, `decided_by`, `decided_by_role`, `decided_at`, `note` and `sent_back_to`. Update the Jobs row (`waiting_on`, `next_action`, `version` + 1). Append a Log row. |
| `add_credit_entry` | Append a Credits row. Re-read the Jobs row and write `credits_used` = old + amount, with `version` + 1. |
| `append_log` | Append a Log row with the next `seq`. |

**`create_job`:**
1. Read the client's Clients row and take `next_job_number` (*n*).
2. The job ID is `<client_code>-<n>`, written with two digits (`SHL-01`).
3. Check that the ID isn't already in `Jobs!A:A`. If it is, increment *n* and check again.
4. Write `next_job_number` = *n* + 1 in that client's cell, after re-reading it just before writing. This counter is operational: it doesn't bump the client's `version` or changelog.
5. Append the Jobs row (`version` 1), a StageHistory row (intake, `in_progress`) and a Log row.

**Large content.** A cell holds at most 50,000 characters. Keep each `Outputs.data` cell well under that. Put large content (scripts with many versions, storyboards, media) in a Drive file under `Jobs/<job_id>/`, list its link in `files`, and keep a short `data` or `summary`.

## 5. Manual edits by the team

People may edit the sheet directly; that is expected.
- **Before any write,** re-read the row and respect what they changed.
- **If a row breaks its schema** (a typo in a dropdown column, invalid JSON in a `json` cell), report it and ask before fixing.
- **Manual edits don't bump `version`.** That's why the check compares `updated_at` and the cells you are about to overwrite, not just `version`.

## 6. Scale

v1 reads whole tabs. That is fine for thousands of rows. If any tab passes about 5,000 rows, archive finished jobs to a separate "TDM Studio Archive <year>" sheet; the plan for that comes later.
