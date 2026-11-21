# 0002: Store data in Google Sheets and Google Drive

- **Date:** 2026-11-22
- **Status:** accepted
- **Supersedes:** the "tracker page or local files" storage switch in the Group 1 prompt

## Context

- The admin wants client and job data on Google Drive. It must be readable and editable by everyone on the team, including from a phone, and by Claude.
- The team uses one shared Claude account, so its Google Drive and Google Sheets connectors are linked once and work in Claude Code, the desktop app and claude.ai.

What we checked in the connectors (2026-11-22):
- **Google Sheets:** reads and writes cell ranges; adds tabs; sets dropdowns (data validation) and protected ranges; supports `requiredRevisionId` on batch updates.
- **Google Drive:** creates folders, Google Sheets and files, and searches them. It can update a file's **metadata** but not its **content**, so JSON files stored on Drive could not be overwritten in place.

## Decision

1. **A Google Sheet, "TDM Studio Database", is the data store and the single source of truth.** One tab per collection: Clients, Jobs, Gates, Credits, Feedback, Learnings, Log, Team, Config. A Dashboard tab uses live formulas to group open jobs by who they are waiting on. Detailed layout: `library/storage/` (M3).
2. **A Google Drive folder, "TDM Studio", holds the sheet plus `Clients/<client>/` and `Jobs/<job-id>/` folders** for logos, references and stage outputs.
3. **The tracker page is a read-only view.** "TDM Social Media Tracker" is a Claude artifact that reads the Sheet through the viewer's Google Sheets connector. It never stores data of its own.
4. **Local files (`.tdm-studio/`) are for backup and offline use only:** `export` writes everything to JSON files, and `import` restores it. There is no live sync.
5. **First-run setup** creates the folder and the sheet, asks for each team member's name, role and email, saves them to the Team tab, and offers to share the folder with those emails, asking the admin first.

## Consequences

**Good:**
- One shared store that people can open and edit on desktop and mobile without Claude.
- It works the same in every Claude surface the account uses.
- Readable by non-technical staff.

**Costs and risks:**
- **No row locking.** Sheets has no per-row lock. The storage rules re-read before every write and compare the record's `version`. A manual edit by a person doesn't bump `version`, so Claude also compares `updated_at` and the cell values it is about to overwrite.
- **People can break data by hand.** Dropdowns and protected ID columns reduce the risk, and Claude validates every record it reads, reporting rows that don't fit the schema instead of guessing.
- **Nested data becomes several tabs.** Gates, credits, feedback and log are one row per event. The storage layer rebuilds the logical job record from them.
- **Permissions are behavioural.** Anyone with edit access to the sheet can change anything. Gate rules are enforced by the skills, not by Google.
- **Shared Claude account.** Identity comes from "Who's working?" at the start of each session, not from the login.
