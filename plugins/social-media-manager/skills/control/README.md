# control/: Group 1

Runs jobs. Holds no creative rules.

| Skill | Status | Does | Stages |
|---|---|---|---|
| `producer` | built (M5) | Runs a job through the stages and gates in `library/contracts/stages.yaml`. Thin: reads the registry, runs placeholders or calls the stage skill, enforces gate owners and the budget check. | `intake` (active) |
| `tracker` | built (M4) | Job records, status views, credits ledger, resume catch-up. All saving goes through the storage layer (`library/storage/`). | none (called by `producer`) |

Built in Prompt 2.

> This folder is registered in `plugin.json` (`"skills"`) only once it contains at least one real skill. Skill folder names must be unique across all groups.
