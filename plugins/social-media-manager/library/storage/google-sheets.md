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
- An empty cell means the field is absent: leave it out of the record. Don't turn it into `[]`, `""` or `null` (unless the schema requires the field, in which case use its empty value).

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
| Config | setting | `key` | config record (`credit_policy`, `research_caps` and a `research_unattended_clients` list are JSON) |
| Insights | insight sheet | `insight_id` | insight record (everything except `findings`) |
| InsightFindings | finding | `insight_id` + `seq` | `insight.findings.<category>[]`, in `seq` order; `category` names the list. Editors may change `pinned` and `struck` here directly. |
| Tasks | pending task | `task_id` | task record |
| Dashboard | (formulas) | | Never written after setup or an upgrade |
| BriefQuestions (layout v3) | brief client question | `job_id` + `n` | Nothing: a **mirror** of `outputs.brief.data.client_questions`, for the Dashboard and phone answers (§8) |

Columns marked `storage_only` in the layout (row keys, `seq`, a question's `status` and `answer`) are not part of the logical record.

**`seq`** is 1 + the highest existing `seq` for that parent (job or client), read just before appending.

## 4. Operations

**Finding a row.** Read the key column (e.g. `Jobs!A:A`). Data row *n* in that list is sheet row *n*. Then read or write the whole row, e.g. `Jobs!A<row>:V<row>` (the last column comes from the layout). Re-find the row before every write, because people may have sorted or added rows.

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
| `save_client`, new client | Re-read `Clients!A:B`: `client_id` and `client_code` must not exist yet (if they do, stop and report). Append the Clients row with `version` 1 and `next_job_number` 1. Append one Questions row per open question (`status` open), and the ClientChanges row for v1. Read the new row back. |
| `create_job` | See below. |
| `get_job` | Read the Jobs row, then read Gates, StageHistory, Outputs, Credits, Feedback and Log and keep that job's rows. Build the record and validate it. |
| `list_jobs` | Read `Jobs!A:V`. "Overdue" means `deadline` < today and status `active`. |
| `update_job` | Re-read the Jobs row and check `version` and `updated_at`. Re-count the job's Gates and StageHistory rows: they must not be fewer than you held. Write the whole Jobs row with `version` + 1. Then update or append Outputs rows, update the open StageHistory row's `status` and `finished_at`, and append new StageHistory, Gates and Log rows. Feedback: append a row for a new reply; to change one (routing, item status, messages, conflict resolution), find its row by `feedback_id` and rewrite it whole. |
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

**Concept and hooks records.** These two can pass 30,000 characters on the full track (3 concepts, 8–10 hooks each). Always save the whole record as `Jobs/<job_id>/<field>/<field>-v<version>.json` in Drive (`concept/concept-v2.json`, `hooks/hooks-v1.json`) and list its link in `files`. If the whole record is under 40,000 characters, the `Outputs.data` cell holds it too (quick-track hooks usually are: about 8,000). Otherwise the cell keeps a compact record: for `concept`, `raw_angles` cut to id, type and status; for `hooks`, only hooks with status `top`, plus `pick`, `recommended`, `top_per_concept` and `downstream`. Later stages read the cell; the Drive file is for the editor and for reruns. Both must validate against their schema.

**Script and localise records (layout v5).** Same rule as concept and hooks. Every `script` version is saved whole as `Jobs/<job_id>/script/script-v<n>.json`, and every `localised_script` version as `Jobs/<job_id>/localise/localised_script-v<n>.json`. Two script versions with 6–10 scenes each usually stay under 40,000 characters, so the cell holds the whole record. If one doesn't, the cell keeps `versions` cut to `id`, `title`, `structure_type` and `checks`, plus `recommended`, `pick` and `downstream` (the picked scene table). `localise` also writes three plain files to the same folder: `vo-script-v<n>.md`, `captions-v<n>.srt` and `client-review-v<n>.txt`. It lists their links in the output's `files` and in the record (`vo_script.file`, `captions_srt.file`, `client_review_message.file`), and the SRT and voiceover text also stay inside the record. No new tabs. The client's `pronunciation` list is a JSON cell on the Clients tab.

**Research and tasks:**

| Operation | Steps |
|---|---|
| `get_latest_insight` | Read `Insights!A:U`; keep the client's rows; take the one with the latest `created_at`. |
| `get_insight` | Read the Insights row, then the InsightFindings rows with that `insight_id`; group them by `category` (every category present, empty if it has no rows). Validate. |
| `save_insight`, new | Re-read `Insights!A:B`: the `insight_id` must not exist. Append the Insights row (`version` 1), then one InsightFindings row per finding (`seq` 1, 2, … in category order; `client_id` filled for filtering). Read both back. Then `set_latest_insight`. |
| `save_insight`, update | Re-read the row; check `version` and `updated_at`. Rewrite the Insights row whole (`version` + 1). Findings: update rows in place by `insight_id` + `seq`; append new findings with the next `seq`. Never delete a finding row: strike it. |
| `mark_finding` | Re-read the InsightFindings row (find it by `insight_id` and finding `id`), write the changed cells, then rebuild `downstream` from the current findings and rewrite the Insights row with `version` + 1. A pin or strike typed straight into the sheet counts as well: the next `get_insight` rebuilds `downstream` before anyone reads it. |
| `set_latest_insight` | Find the client's Clients row and write the `latest_insight_id` cell only (re-read just before). No `version` bump. |
| `list_tasks` | Read `Tasks!A:T`. |
| `save_task` | New: re-read `Tasks!A:A` for the day's highest `T-<yyyymmdd>-<n>`, append with `version` 1. Update: re-read the row, check `version`, rewrite it whole with `version` + 1. |

**Raw research data** (captured reel rows, review excerpts, ad lists) goes to a Drive file under `TDM Studio/Clients/<client_code>/research/<insight_id>/`, linked in `raw_files`. It never goes into a cell: the sheet holds only the insight and its findings.

## 5. Manual edits by the team

People may edit the sheet directly; that is expected.
- **Before any write,** re-read the row and respect what they changed.
- **If a row breaks its schema** (a typo in a dropdown column, invalid JSON in a `json` cell), report it and ask before fixing.
- **Manual edits don't bump `version`.** That's why the check compares `updated_at` and the cells you are about to overwrite, not just `version`.

## 6. Scale

v1 reads whole tabs. That is fine for thousands of rows. If any tab passes about 5,000 rows, archive finished jobs to a separate "TDM Studio Archive <year>" sheet; the plan for that comes later.

## 7. Upgrading a sheet built with an older layout

`sheet-setup.json` → `upgrades` lists the steps for each layout change. A sheet with no **Insights** tab is on layout v1 (Group 1, plugin 0.1.0); a sheet with Insights but no **BriefQuestions** tab is on layout v2 (0.2.0-alpha.1); a sheet whose **Learnings** tab has no `hook_formula_id` column is on layout v3 (0.2.0-alpha.2). A sheet whose **Clients** tab has no `pronunciation` column is on layout v4 (0.3.0-alpha.1). Apply the upgrades in order, from the sheet's layout to the current one.

Admin only. Confirm the sheet by title first, and make a backup (`files-backup.md`, Export) if it holds real data.
1. Send `upgrades[0].batch_requests` in one `update_spreadsheet` call. It widens Jobs, Clients and Credits, adds the Insights, InsightFindings and Tasks tabs at the end, and adds dropdowns and protected headers. Existing columns and tabs don't move.
2. Send each `upgrades[0].values` entry with `update_values`: the new header cells, the new tabs' headers, and the Dashboard formulas (credits now count only rows in credits).
3. Send each `upgrades[0].append` entry with `append_values`: the research settings rows for the Config tab.
4. Read row 1 of every tab and compare it with `sheet-layout.json`. Report any difference.

Existing rows need nothing: the new cells are empty, which means `urgent` false, no research yet, no competitors, and ledger rows in credits.

**v2 → v3 (brief), `upgrades[1]`:** the same four steps. Its `batch_requests` add the BriefQuestions tab (header, protection, status dropdown), make the Dashboard block bold and widen the Gates `decided_by_role` dropdown with `system`. Its `values` write the BriefQuestions header and the "Brief: waiting for client reply" Dashboard block (`X2:AA3`). Its `append` adds the three brief settings to Config. Existing rows need nothing.

**v3 → v4 (concept + hooks), `upgrades[2]`:** the same four steps. Its `batch_requests` add the `angle_type` and `outcome` dropdowns and protect the new Learnings header cells. Its `values` write the three new Learnings headers (`hook_formula_id`, `angle_type`, `outcome`, after `source_job`). Its `append` adds `concepts_count`, `hooks_per_concept` and `creative_auto_pick_after_hours` (empty = off) to Config. Existing rows need nothing: empty cells mean a learning isn't about a hook formula or angle.

**v4 → v5 (script + localise), `upgrades[3]`:** the same four steps. Its `batch_requests` widen the Clients tab and protect the new header cell. Its `values` write the `pronunciation` header (after `latest_insight_id`). Its `append` adds `script_versions` (2), `pace_overrides` (`{}`), `localise_variant_languages` (`[]`) and `caption_max_chars_per_line` (32) to Config. Existing rows need nothing: an empty `pronunciation` cell means no entries yet.

## 8. Brief records (layout v3)

The sheet must be on layout v3 (it has a `BriefQuestions` tab). If it isn't, stop and ask the admin to run the upgrade (§7).

**Saving a brief version** (one turn, after `get_now`):
1. `update_job` as usual: write the brief into the job's Outputs row (`field` = `brief`), with `version` = the brief's `version`.
2. **Version file.** In the database folder, find or create `Jobs/<job_id>/brief/`, using Drive `search_files` and then `create_file` (folder mime type `application/vnd.google-apps.folder`). Create `brief-v<n>.json` there with `create_file`, content type `application/json`, holding the whole brief data. Never overwrite an existing version file. Put its path in the Outputs row's `files`.
3. **Mirror.** Read `BriefQuestions!A:L` and keep this job's rows.
   - For each item in `client_questions`: update the row with the same `job_id` + `n` in place, or append it.
   - A row whose `n` is no longer in the list: set its `status` to `dropped`.
   - Cells are written as in §2 (`options` as a list, `blocking` as a boolean).
4. Re-read the Outputs row and the mirror rows. The question numbers and statuses must match the brief (`README.md` §3 "verify").

**Reading.** At the start of every brief run, read the job's `BriefQuestions` rows as well as the Outputs row. If a row has an `answer` while the brief's matching question is still `open`, someone typed the client's answer into the sheet: treat it as a client reply.

**Dashboard.** The "Brief: waiting for client reply" block lists open questions older than `client_question_reminder_hours` (Config; default 24). It compares `asked_at` with the sheet clock, both in India time. Skills never write the Dashboard.
