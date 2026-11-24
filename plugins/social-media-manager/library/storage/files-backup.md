# Local files: backup, restore and offline use

The Google Sheet is the source of truth. Local files exist for:
- **Backup / export:** a full copy of the data as JSON, for example before a big change, or to move to a new sheet.
- **Restore / import:** write a backup into a sheet, normally a new empty one.
- **Offline drafting** in Claude Code when Google isn't reachable. This data is on one computer only and is not shared with the team.

There is no live sync. After working offline, import into the sheet deliberately.

## Folder layout

Default folder: `${CLAUDE_PROJECT_DIR}/.tdm-studio/` (or `config.data_folder`). It is git-ignored in the plugin repo; never commit client data.

```
.tdm-studio/
├── config.json                 config record
├── team.json                   [team members]
├── tasks.json                  [task records] (pending browser steps and queued research runs)
├── actions.json                [action records] (export/import only: tracker-page actions, layout v6)
├── clients/
│   ├── index.json              [{client_id, client_code, name, status, business_type, city, updated_at}]
│   └── <client_id>/
│       ├── client.json         client record (source of truth in files mode)
│       ├── client.md           readable view, regenerated on every save (library/templates/client-record.md)
│       └── insights/
│           ├── index.json      [{insight_id, created_at, mode, version, pending_browser_step}], newest first
│           └── <insight_id>/
│               ├── insight.json    insight record (findings included)
│               └── raw/            raw captures (reel rows, review excerpts, ad lists); never personal identities
└── jobs/
    ├── index.json              [{job_id, client_id, title, type, status, current_stage, waiting_on, assignee, deadline, updated_at}]
    └── <job_id>/
        ├── job.json            job record (full: gates, history, credits, feedback, outputs; log = last 20)
        ├── job.md              readable view, regenerated on every save (library/templates/job-record.md)
        ├── log-full.json       every log entry, append-only (the sheet's Log tab, for this job)
        ├── brief/              layout v3: brief-v<n>.json, one file per brief version, never overwritten
        └── outputs/            files produced by stages (concept/concept-v<n>.json and hooks/hooks-v<n>.json hold the full concept and hooks records; job.json keeps the compact ones, as in the sheet; layout v5: script/script-v<n>.json, localise/localised_script-v<n>.json, localise/vo-script-v<n>.md, localise/captions-v<n>.srt, localise/client-review-v<n>.txt)
```

Records are the logical records from `library/contracts/`. They are validated before every save, exactly as in the sheet.

## Export (sheet → files)

Admin only.
1. Read every data tab (`google-sheets.md` §3) and build each client, job, team, insight, task and action record, plus config.
2. Leave out fields whose cells are empty (`google-sheets.md` §2), so two exports of the same sheet are identical. Validate each one. List any that fail, and export them anyway, flagged in `export-report.md`.
3. Write the folder above. Each `index.json` lists every record, sorted by ID.
4. Write `export-report.md`: when, from which sheet (title and ID), and the counts of clients, jobs, team members, insights, tasks and page actions.
   Raw research files stay in Drive; export lists their links (`raw_files`) but doesn't copy them.

The job file keeps only the last 20 log entries. The full log stays in the sheet. To keep it too, also save the raw Log tab as `log-full.json`.

## Import (files → sheet)

Admin only. Confirm the target sheet by title before writing.
1. **Empty target** (only headers): append rows tab by tab, encoded as in `google-sheets.md` §2. Assign `seq` in array order.
2. **Target with data:** for each record, compare with the sheet.
   - Not in the sheet → append it.
   - Same `version` and `updated_at` → skip it.
   - Different → list it as a conflict.

   Show the conflict list and ask before overwriting anything.
3. Read everything back, rebuild the records, and compare them with the files. Report any record that differs.

## Offline mode rules

- Announce it: "Working in files mode: this computer only, not shared."
- Follow every rule in `README.md` §3. `version` and `updated_at` work the same way.
- `get_now` in files mode: read the computer's clock (for example `date -Iseconds` in a shell) and convert it to India time. If no clock is available, ask.
- Regenerate `client.md` and `job.md`, and update the `index.json` files, on every save.
- Page actions (layout v6) don't exist in files mode: the tracker page needs the sheet, so the Actions tab has no file. An export writes `actions.json` (all rows) only so an import can restore them.
- Insights and tasks work as in the sheet: `save_insight` writes `insight.json` whole (findings inside it) and updates `insights/index.json`; `set_latest_insight` changes only `latest_insight_id` in `client.json`; `save_task` rewrites `tasks.json` with the one task changed.
- `job.json` keeps only the last 20 log entries, so **append every log entry to `jobs/<job_id>/log-full.json` as well**. That file plays the part of the sheet's Log tab; import uses it, when present, to restore the full log.

## Brief files (layout v3)

- **Saving a brief** in files mode: write `job.json` as usual, then `jobs/<job_id>/brief/brief-v<n>.json` with the whole brief data. Never overwrite an existing version file.
- **No questions file.** In files mode the client questions live only in `job.json` (`outputs.brief.data.client_questions`). The sheet's `BriefQuestions` tab is a mirror of that list, so nothing more is needed.
- **Export** copies each job's `Jobs/<job_id>/brief/` files from Drive into `jobs/<job_id>/brief/` when Google Drive is connected. Otherwise it writes the current version only, and says so in `export-report.md`.
- **Import** rebuilds the `BriefQuestions` rows from each job's brief (`google-sheets.md` §8, step 3) and uploads the `brief/` files to `Jobs/<job_id>/brief/`.
