# quality/: Group 4

Checks work before people see it.

| Skill | Status | Does | Stages |
|---|---|---|---|
| `qa-review` | planned | Reviews generated clips against the storyboard. Runs the `qa-reviewer` subagent. | `qa-clips` |
| `compliance` | planned | Brand, platform and legal checks (claims, music rights, festival sensitivities). | none (helper called before client-facing gates) |

Subagents planned in `agents/`: `qa-reviewer` (this group) and `storyboard-critic` (used by `storyboard`, Group 2).

> This folder is registered in `plugin.json` (`"skills"`) only once it contains at least one real skill. Skill folder names must be unique across all groups.
