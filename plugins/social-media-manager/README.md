# social-media-manager

Claude as TDM Groups' social media production team: video jobs, poster jobs, client brand profiles and approvals, run stage by stage with human gates.

**Status: 0.1.0, Group 1.**
- **Working now:**
  - jobs from intake to delivery, with real approvals and budget checks;
  - client profiles;
  - client feedback triage;
  - status boards and catch-up.
- **Not built yet:** the creative stages (brief, script, storyboard, generation, edit, posters). They run as **placeholders** for now, and no Higgsfield credits are spent. Later groups replace them one by one.

## Skills

| Skill | Group | Use it for |
|---|---|---|
| `producer` | control | Starting jobs, moving them through stages, approvals, budget checks |
| `tracker` | control | "Where is everything?": boards, overdue, credits, catch-up, team, backups |
| `brand-keeper` | brand | Adding clients and keeping their brand profiles |
| `client-feedback` | brand | Turning a client's WhatsApp reply into a change list, the stage to reopen, and a reply draft |

You don't need to name the skill: just say what you want, in English, Hindi or Hinglish. Each skill can also be called directly as `/social-media-manager:<skill>`.

## Commands for the team

Start every session by saying who you are ("I'm Ravi"). Claude asks if you don't. Approvals are checked against your role in the Team tab.

**Jobs (producer)**

| Say | What happens | Who |
|---|---|---|
| "new job for <client>: <what they want>" | Creates the job (e.g. SHL-03). Proposes track, budget, assignee and deadline, with reasons. Waits for admin approval. | anyone |
| "continue SHL-03" | Catch-up card, then the pending approval or the next step | anyone |
| "next" / "aage badho" | Runs the next stage (never skips a pending approval) | assignee, admin |
| "approve" / "ok hai" | Approves the pending gate of the job you're on | the gate's approver |
| "changes: <note>" | Records the note and redoes the stage | the gate's approver |
| "back to <stage>" | Reopens an earlier stage; everything after it runs again | the gate's approver |
| "client approved: <their message>" | Records the client's OK (paste their words) | assignee, admin |
| "client feedback: <their message>" | Hands the reply to client-feedback | assignee, admin |
| "route ok" | Confirms the stage client-feedback proposed to reopen | assignee, admin (admin only if over the cap or new work) |
| "switch SHL-03 to full track" | Changes the track (asks about stages already passed) | admin |
| "assign SHL-03 to Pooja" · "SHL-03 deadline 5 Dec" · "SHL-03 budget 35" | Changes assignee, deadline or budget | admin |
| "log 6 credits for poster-drafts: <what>" | Records credits spent by hand | assignee, admin |
| "pause SHL-03" · "resume SHL-03" · "cancel SHL-03" | Holds, restarts or cancels a job (cancel asks first) | pause/resume: assignee, admin · cancel: admin |
| "job card SHL-03" | Progress through every stage | anyone |

**Status (tracker)**

| Say | Shows |
|---|---|
| "status" / "kya chal raha hai" | Every open job, grouped by who it's waiting on; overdue marked |
| "overdue" · "<client> ke jobs" · "my jobs" | Filtered boards |
| "credits" | Credits this month, per job and per client |
| "show SHL-03 in full" | The whole job record |
| "add <name> to the team" · "backup" · "import" | Team changes and backups (admin) |

**Clients (brand-keeper)**

| Say | What happens |
|---|---|
| "new client: <name>" | Choose: send their material (bio, captions, logo, Drive folder), or answer one list of questions |
| "update <client>" | Shows the profile, asks which parts to change |
| "show <client> brand brief" | The ~15-line view stages use |
| "remember that <client> …" | Proposes a learning; saved after you confirm |

**Who approves what**

| Gate | Approver |
|---|---|
| intake, brief, concept, production plan, finish, final poster, delivery | admin (Samarth) |
| script, localise, style bible, casting, storyboard, voice & music, QA, edit stages, poster drafts | the assigned editor or designer, or admin |
| client approvals | the assignee or admin, from the client's own message |
| going over a job's credit budget | admin |

## Setup

1. **Google Drive and Google Sheets** must be connected, in the Claude app (Settings → Connectors) or in Claude Code.
2. **First run** (admin): say "set up TDM Studio". Claude:
   - creates the TDM Studio folder and database sheet;
   - asks for the team's names, roles and emails;
   - offers to share the folder with each person, asking each time.
3. **Higgsfield** (needed from the generation group onward): each person signs in to their own Higgsfield account the first time a Higgsfield tool is used. In Claude Code: `/mcp`, then authenticate `higgsfield`.
4. **Tracker page:** say "publish the tracker page" for a read-only board that works on phones too.

Data lives in the Google Sheet (the source of truth), never inside the plugin folder; updating the plugin never touches it. Without Google, Claude Code can work in files mode (`.tdm-studio/`, this computer only).

## What's inside

| Folder | What it holds |
|---|---|
| `skills/<group>/<skill>/` | One folder per skill. Groups: control, brand, pre-production, generation, quality, post-production, delivery. Each group's README lists its skills. |
| `library/contracts/` | `stages.yaml` (the pipeline: 24 stages; `intake` active, the rest placeholders) and the JSON schemas |
| `library/storage/` | How data is saved: Google Sheets layout and rules, setup, backups, tracker page |
| `library/templates/` | Shared views: job record, client record, brand brief |
| `agents/` | Subagents, added when their group is built |
| `.mcp.json` | The Higgsfield remote MCP server |

## Where it works

Built and tested in Claude Code. It also installs in the Claude desktop app and on claude.ai; a few things still need checking there (see `docs/STORAGE.md`, VERIFY-IN-CLAUDE-APP, in the repository).
