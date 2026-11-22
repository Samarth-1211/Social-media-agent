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
   - This sets the time zone to India, renames the first tab to Dashboard, adds the 14 data tabs (13 in layout v1, plus BriefQuestions in v2), and adds the bold frozen header rows, the protected header ranges and the dropdowns.
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

## Upgrade an existing database to layout v2 (brief)

Admin only. Run once per database (TEST first) when `sheet-layout.json` `version` is 2 but the sheet has no `BriefQuestions` tab.
1. Confirm the target sheet by title. Read its tab names (`get_spreadsheet`, `fields: ["sheets.properties"]`): `BriefQuestions` must not exist yet, and no tab may have sheet ID 14. If either is untrue, stop and report.
2. Send `upgrades["2"].batch_requests` from `sheet-setup.json` in one `update_spreadsheet` call. This adds the `BriefQuestions` tab (header, protection, status dropdown), adds bold to the Dashboard block and widens the Gates `decided_by_role` dropdown with `system`.
3. Send each `upgrades["2"].values` entry. The `BriefQuestions` header and the Dashboard block go with `update_values`; the entry marked `append: true` (three brief Config rows) goes with `append_values`.
4. Read back the `BriefQuestions` header row and the three Config rows. Log the upgrade in one line.

Nothing existing is moved, renamed or deleted.
