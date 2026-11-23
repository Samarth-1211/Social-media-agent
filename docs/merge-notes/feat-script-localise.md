# Merge notes: feat/script-localise

Branch `feat/script-localise` from `main` at `c62ed16` (0.3.0-alpha.1 + integration fixes), worktree `../tdm-script`. **Mode A:** `research-methods`, `brief`, `concept` and `hooks` are on `main`, so this branch reads their real `downstream` fields. No version bump, no tag on this branch.

## 1. Decisions (admin, 2026-11-23)

| # | Decision |
|---|---|
| D1 | `client-script-approval` becomes `active`, run by the `localise` skill (group `pre-production`). Its approval step shows the WhatsApp review message; the producer opens the `client` gate as for any client gate; the client's reply goes through `client-feedback`. A future `delivery/client-messenger` may take the stage back. |
| D2 | Changes to protected files are written here as proposed diffs and **applied at merge**: (i) a generic `gate_label` rule in the producer, replacing the `creative-pick` special case; (ii) `client-feedback` revision-policy routing: wording/language → `localise`, structure/content → `script`; (iii) the video quick path count 15 → 16 in the producer and `docs/STAGE-CONTRACT.md`. |
| D3 | IndicXlit: both modes built; only the fallback is tested now (`script_check: unverified`). A Python 3.10 environment for the real path only if the admin says "run" at M7. |

Defaults stated at planning and not objected to: field name stays `localised_script` (schema `localised_script.schema.json`); `localise` gate `none`, tracks quick + full; `script.schema.json` x-version 2 with `lines` made optional; config x-version 4; client x-version 3 (`pronunciation[]`); sheet layout v5 (no new tabs); validator check 13; the script writes Hindi/Hinglish in Roman letters and `localise` converts to the brief's `writing_script`; no `persuasion-ethics.md` (dropped 2026-11-22); eval files and READMEs treated as allowed additions.

## 2. Regression baseline (M1, on `c62ed16`)

| Check | Result |
|---|---|
| `node scripts/validate.mjs` (with `claude plugin validate`) | all 12 checks pass; video/quick 15 stages, video/full 22, poster 7 + 7; 15 schemas, 10 examples; 150 links |
| `node evals/brief-fixtures.mjs check` | pass (2 clients, 17 scenario jobs, 2 past jobs, 1 research output, 8 replies, 1 bad brief) |
| `node evals/concept-hooks-fixtures.mjs check` | pass (3 clients, 7 scenario jobs, 1 past job, 2 research outputs, 6 briefs, 9 pick replies) |
| `node evals/research/validator-faults.cjs` | 18/18 planted faults caught |
| `node evals/research/methods-consistency.cjs` | pass |
| `run-scenarios.mjs --check-only` (research, concept-hooks) | not applicable: needs the git-ignored local run outputs, which this worktree doesn't have |
| Headless Claude runners | not run (they spend Claude usage); only at M7 if the admin says "run" |

M7 repeats these and shows `git diff --stat main` touches no protected path.

## 3. Shared-file changes (additions only)

_Filled in at M2._

## 4. Proposed diffs for protected files (apply at merge, D2)

_Filled in at M2, M5 and M6._

## 5. Merge and test checklist

_Filled in at M6._
