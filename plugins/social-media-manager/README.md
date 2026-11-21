# social-media-manager

Claude as TDM Groups' social media production team: video jobs, poster jobs, client brand profiles and approvals, run stage by stage with human gates.

**Status: 0.0.1, scaffold only.** No skills are active yet. Group 1 (`control/`, `brand/`) comes next.

## What's inside

| Folder | What it holds |
|---|---|
| `skills/<group>/<skill>/` | One self-contained folder per skill. Groups: control, brand, pre-production, generation, quality, post-production, delivery. Each group's README lists its planned skills. |
| `agents/` | Subagents (`storyboard-critic`, `qa-reviewer`), added when their group is built. |
| `library/contracts/` | `stages.yaml` (the pipeline) and the JSON schemas every stage reads and writes. |
| `library/` (other folders) | Material shared by 3 or more skills: storage rules, presets, knowledge, model notes, checklists, templates. |
| `vendor/` | Borrowed third-party material, pinned and attributed (see `ATTRIBUTION.md`). |
| `.mcp.json` | The Higgsfield remote MCP server (`https://mcp.higgsfield.ai/mcp`). |

Commands appear as `/social-media-manager:<skill>`.

## Setup for each user

- **Higgsfield:** the plugin connects to Higgsfield's remote MCP server. Each person signs in to their own Higgsfield account the first time a Higgsfield tool is used (in Claude Code: `/mcp`, then authenticate `higgsfield`). Generation spends that account's credits. If you already have a Higgsfield server with the same URL configured, the plugin's copy doesn't show up and your existing one is used.
- **Data:** job and client records are kept outside the plugin folder (see `library/storage/README.md`). Updating the plugin never touches them.

## Where it works

Built for Claude Code. It also installs in the Claude desktop app and on claude.ai, where some components behave differently; see the repository's `docs/ARCHITECTURE.md`.
