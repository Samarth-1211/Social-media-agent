# First-run setup

Run this when no **TDM Studio Database** exists (`google-sheets.md` §1), or when the admin asks to set up again. Only the admin runs setup.

Say what will happen before starting:

> I'll create a "TDM Studio" folder in your Google Drive with a "TDM Studio Database" sheet inside it, then ask for your team members' names, roles and emails. Nothing is shared until you say so.

Wait for a yes.

## 1. Create the folder and the sheet

1. Create the folder **TDM Studio**: Google Drive `create_file`, title `TDM Studio`, content type `application/vnd.google-apps.folder`. Note its `id`.
2. Create inside it the sheet **TDM Studio Database**: `create_file`, content type `application/vnd.google-apps.spreadsheet`, `parentId` = folder ID. Note its `id`.
3. Create the subfolders **Clients** and **Jobs** inside TDM Studio.

## 2. Build the tabs

1. Read `${CLAUDE_PLUGIN_ROOT}/library/storage/sheet-setup.json`.
2. Send **all** of `batch_requests` in one Google Sheets `update_spreadsheet` call, unchanged.
   - This sets the time zone to India, renames the first tab to Dashboard, adds the 17 data tabs (13 in layout v1, Insights, InsightFindings and Tasks in v2, BriefQuestions in v3), and adds the bold frozen header rows, the protected header ranges and the dropdowns.
   - It expects a brand-new sheet whose only tab has ID 0. If the call fails because tabs already exist, stop and report. Never delete tabs in an existing database.
3. Send each entry of `values` with `update_values`, unchanged, except in the Config entry, where you replace:
   - `<SPREADSHEET_ID>` with `'` + the sheet ID;
   - `<DRIVE_FOLDER_ID>` with `'` + the folder ID;
   - `<NOW>` with `'` + the current ISO timestamp (India time).
4. Read back `Dashboard!A1:W3` and `Config!A:B`. The Dashboard shows "No open jobs", and Config has 14 settings. If not, stop and report what differs.

## 3. Register the team

Ask in **one** message:

> Who's on the team? For each person: name, role (admin, editor or designer) and email. I'll use the emails to share the TDM Studio folder, and only after you confirm.

For each person:
- make a `handle` (lowercase, hyphens: `ravi`, `ravi-k`);
- append a Team row: `active` true, `added_at` and `updated_at` from `get_now` (the clock cell is created in step 2), `version` 1.

Show the list back and confirm before saving. The admin (Samarth) must be in it with role `admin`.

## 4. Share the folder (ask first)

List exactly who gets access and at what level:

| Who | Access |
|---|---|
| Editors and designers | Editor (`writer`) on the TDM Studio folder |
| The admin | Already the owner |

Ask: "Share the TDM Studio folder with these people now?" On yes, call Google Drive `share_file` once per email with `role: writer`. Never share publicly or by link. Report each result.

## 5. Finish

Tell the admin:
- the folder and sheet links;
- that defaults are set: video budget 200, poster budget 28 with a warning at 20, revision cap 2, Hinglish, cheapest-first credit policy;
- that they can change these in the Config tab, or by asking Claude;
- (optional) that they can publish the tracker page (`tracker-page/README.md`).

## Test database

For tests, use the folder **TDM Studio TEST** and the sheet **TDM Studio TEST Database** (titles in `sheet-layout.json`). Never run tests against the real database.

## Upgrade an existing database

A sheet built with an older layout is upgraded in place, in order (v1 → v2 research, v2 → v3 brief): `google-sheets.md` §7, using `sheet-setup.json` → `upgrades`. Admin only, TEST sheet first. Nothing existing is moved, renamed or deleted.
