# tdm-plugins

TDM Groups' Claude plugin marketplace.

| Plugin | What it does |
|---|---|
| [`social-media-manager`](plugins/social-media-manager/) | Social media production system: video and poster jobs, client brands, approvals. Claude works as the agency's production team, stage by stage with human gates. **0.1.0:** Group 1 (producer, tracker, brand-keeper, client-feedback); creative stages are placeholders. The team's command list is in the plugin README. |

## Repo layout

```
.claude-plugin/marketplace.json   the marketplace (lists the plugins)
plugins/social-media-manager/     the plugin; the only folder that ships to users
evals/                            eval clients, feedback samples, rubrics, scenarios, results (not shipped)
scripts/                          validate.mjs, new-skill.mjs
docs/                             architecture, stage contract, how to add a skill, decisions
```

Start with [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Develop

Requirements: Node 20+ and Claude Code.

```bash
npm install                       # validator dependencies (yaml, ajv)
claude --plugin-dir plugins/social-media-manager
```

`--plugin-dir` loads the plugin for that session only, without installing it. After editing files, restart the session to pick up changes.

Add a skill: `node scripts/new-skill.mjs <group> <skill-name>`. See [docs/ADD-A-SKILL.md](docs/ADD-A-SKILL.md).

## Validate

```bash
node scripts/validate.mjs
```

This runs the repo's checks: manifests, skills, the stage registry, schemas, presets, links, and the Google Sheets storage layout and sample data. If the Claude Code CLI is installed, it also runs `claude plugin validate`; set `SKIP_CLAUDE_VALIDATE=1` to skip that part. CI runs the same validator on every push and pull request.

## Test

Scenario scripts and pass criteria: [evals/scenarios/group1.md](evals/scenarios/group1.md), [evals/rubrics/group1.md](evals/rubrics/group1.md). Client-feedback samples: `node evals/run-feedback-samples.mjs run`, then `score`. Run against the **TDM Studio TEST Database** only.

## Install (teammates)

In Claude Code:

```
/plugin marketplace add Samarth-1211/Social-media-agent
/plugin install social-media-manager@tdm-plugins
```

From a shell: `claude plugin marketplace add Samarth-1211/Social-media-agent`, then `claude plugin install social-media-manager@tdm-plugins`.

- **Updates:** you get a new version when `version` changes in `plugin.json`.
- **Higgsfield:** the first time a Higgsfield tool is used, each person signs in to their own Higgsfield account (`/mcp`, then authenticate `higgsfield`).
- **Desktop app:** a plugin installed at user scope in Claude Code is also available in the desktop app's local sessions on the same computer.
- **claude.ai:** the same plugin format installs there, with a different set of components. The exact setup steps are still to be confirmed (open point in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)).
