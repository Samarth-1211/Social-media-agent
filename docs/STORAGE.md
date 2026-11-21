# Storage

Where the plugin keeps clients, jobs, the team and settings, and how skills read and write them. The decision record is `decisions/0002-storage-google-sheets.md`; the working instructions for skills are in `plugins/social-media-manager/library/storage/`.

## In one paragraph

Everything lives in one Google Sheet, **TDM Studio Database**, inside a Google Drive folder, **TDM Studio**, shared with the team.
- People can open and edit it on desktop or phone. Its Dashboard tab shows open jobs by who they are waiting on, overdue jobs, credits this month and the workload per person.
- Claude reads and writes it through the Google Sheets and Google Drive connectors of the agency's shared Claude account, so it works the same in Claude Code, the desktop app and claude.ai.
- A read-only **tracker page** in the Claude app shows the same data in a friendlier layout.
- Local `.tdm-studio/` files exist only for backup, restore and offline drafting.

## Pieces

| Piece | Where |
|---|---|
| Record shapes (contracts) | `library/contracts/*.schema.json` (+ `examples/`) |
| Operations and rules every skill follows | `library/storage/README.md` |
| How each operation runs on Sheets | `library/storage/google-sheets.md` |
| Sheet tabs and columns (source of truth) | `library/storage/sheet-layout.json` |
| Setup requests sent at first run (generated) | `library/storage/sheet-setup.json` ← `scripts/build-sheet-setup.mjs` |
| First-run setup (folder, sheet, team, sharing) | `library/storage/setup.md` |
| Backup, restore, offline | `library/storage/files-backup.md` |
| Tracker page + sample data (generated) | `library/storage/tracker-page/` ← `scripts/build-sample-data.mjs` |
| Record ↔ row conversion (executable spec, dev only) | `scripts/lib/sheet-codec.mjs` |

After changing `sheet-layout.json`, run both build scripts and `node scripts/validate.mjs`. Check 11 fails if the layout no longer covers a schema field, if a record doesn't survive the round trip, or if a generated file is stale.

## Verified behaviour (2026-11-22, TDM Studio TEST Database)

- **Values are interpreted as typed.** `+91…` lost its `+`, `0012` became `12`, and `=1+1` became `2`.
  - With a leading apostrophe, all three stayed exactly as written, for both write and append.
  - Values read back as strings, without the apostrophe. Trailing empty cells are left out of each row.
- **Setup works as generated.** `sheet-setup.json` sent unchanged built all 14 tabs, headers, dropdowns, protected headers and Dashboard formulas, and auto-widened Clients to 29 columns.
- **Round trip is lossless.** The example client, job (with gates, history, outputs, log), team member and config were written to the sheet, read back, and decoded **identical** to the originals, and still valid against their schemas.
- **The Dashboard works on real data.** It listed the job under "waiting on editor", counted it per assignee, and showed the empty states for overdue and credits.

## Honest limits

- **Permissions are behavioural, not security.** Who may approve which gate is enforced by the skills: they refuse politely and name the right approver. Anyone with edit access to the sheet can change any cell, and the protected header rows only warn. If that matters, restrict sheet access in Google Drive.
- **No row locking.** Two people saving the same job at the same moment can collide. The rules re-read before every write and compare `version`, `updated_at` and the target cells, and history tabs are append-only, which catches almost all of it but is not a database lock.
- **Manual edits are trusted but checked.** Edits made directly in the sheet don't bump `version`. Claude re-reads before acting, and reports (rather than fixes) rows that break their schema.
- **Scale.** v1 reads whole tabs, which is fine to a few thousand rows. Archiving finished jobs comes later.
- **Shared account.** Identity comes from "Who's working?" each session, not from the Claude login.

## VERIFY-IN-CLAUDE-APP

Things I could not test from Claude Code. Please check in the Claude app:
1. The **tracker page** loads live data from the TEST sheet. Open https://claude.ai/artifact/9vZTbn9j6WFZyMzvWC8XAj, allow Google Sheets, and confirm the three sample jobs and two clients show.
2. In **claude.ai and the desktop app**, the plugin's skills can call the Google Sheets and Drive connector tools (same operations; tool names may differ from Claude Code's `mcp__claude_ai_Google_Sheets__*`).
3. Each teammate opening the shared tracker page gets the Google Sheets permission prompt and sees data.
4. `${CLAUDE_PLUGIN_ROOT}` links in skills resolve on claude.ai and in the desktop app (open since Prompt 1).
