# Scenarios: market researcher (Group 2a)

Research is tested **on fixtures only**: saved search results, ads, reviews, reels, comments, hashtag scans and own-account metrics for two fictional clients (a laundry in Indore, a real-estate developer in Jabalpur). Pass criteria: `../rubrics/market-researcher.md`.

## How the runs work

- **Fixtures:** `evals/fixtures/research/`.
  - `make-captures.mjs` writes the saved "tool results" (deterministic; `captures/`).
  - `make-data.mjs <scenario> <dir>` builds a files-mode `.tdm-studio/` for a scenario from the contract examples, validated before writing.
  - `FIXTURE-MODE.md` is what each run reads first: the test clock (2026-11-28 10:30 India time), files-mode storage, and which fixture file stands in for which tool.
- **Runner:** `node evals/research/run-scenarios.mjs [run …] [--check-only]`.
  - Each run is a headless Claude Code session on Sonnet with the plugin loaded (`--plugin-dir`), in a temporary folder.
  - Live web, Meta, Google and browser tools are **switched off** (`--disallowedTools`), so nothing reaches the internet or a client account.
  - Every tool call is captured (`--output-format stream-json`), and the saved data is checked afterwards.
  - Outputs go to `evals/results/research-runs.local/` (git-ignored); the summary goes into the results file.
- **Static checks** (no Claude):
  - `node scripts/validate.mjs`;
  - `node evals/research/validator-faults.cjs` (18 planted contract faults);
  - `node evals/research/methods-consistency.cjs`;
  - `node evals/research/tracker-page-render.cjs` (needs `npm i --no-save jsdom`).

| Run | Starting data | Prompt (short) | Scenarios |
|---|---|---|---|
| `onboard` | `new`: Shubh Laundry just onboarded, 2 competitors + 1 struck, no sheet | "Do what brand-keeper does after a new client's first save." No browser. | R1, R7, R13–R15 |
| `onboard-inline` | `new` | Same, with subagents unavailable (`Agent` denied) | R16, R13 |
| `intake` | `intake`: SHL sheet 5 days old; NRH sheet 10 days old with the browser step pending; jobs SHL-05, NRH-02, SHL-06 (urgent) after intake | "next" for each job until its first gate | R2, R5, R6 |
| `monthly` | `monthly`: both sheets 35 days old; NRH linked to Meta (media with metrics); SHL occasion on 2026-12-08 | The scheduled-run prompt from the plugin README, unchanged | R3, R9, R13–R15 |
| `tracker` | `tracker`: NRH browser step pending; SHL occasion on 2026-12-08 | Session start, status board; browser available; "yes" to the offer | R10, R4, R13 |
| `r8` | `new` | Rank `reels.tsv` through installed `ig-viral` and through the fallback | R8 |
| `r11` | `new` | Plan only, with Apify off, then "enabled" without a token | R11 |
| `r12` | `new` | Self-check the planted draft (`examples/bad-invented-stats.md`, draft block only) | R12 |

## The scenarios

| # | Scenario | Starting point | What must happen |
|---|---|---|---|
| R1 | Onboarding triggers a first deep run | `onboard` | `research-run` task (onboarding); first sheet saved with trigger `onboarding`; `latest_insight_id` set; unattended methods ran through the subagent; Instagram, comments and Maps browser route queued as one task |
| R2 | Intake with a fresh sheet | `intake` SHL-05 | `research_status: fresh`, the existing sheet's handoff copied, **no new sheet**, the job moves to `brief` |
| R3 | Unattended monthly refresh, 2 clients | `monthly` | A new sheet per client with `diff_vs_previous`; Instagram steps queued; festival run queued; one combined summary; no questions |
| R4 | Pending browser step in status; one yes runs it | `tracker` | Status shows "Instagram read pending"; after "yes" the NRH sheet gets v2 with outlier hooks, `pending: false`, task `done` |
| R5 | Partial sheet at intake | `intake` NRH-02 | `research_status: partial` + `browser_step_pending`; offer to run it; job moves on without waiting |
| R6 | Urgent job | `intake` SHL-06 | `research_status: skipped` + `no_fresh_research`; `skipped` history row; job moves on |
| R7 | Discovery auto-accepts; struck never reused | `onboard` | New competitors saved as `guessed` (6+ non-struck); the struck account stays struck and unread; a business without a findable handle is not added |
| R8 | Installed-skill path ≈ fallback path | `r8` | Both list the same outliers (>3x) with the same multiples (±0.15) as the ground truth computed from `reels.tsv` |
| R9 | Own-account audit from Meta data | `monthly` NRH | `own_account.metrics_source: meta-connector`, median 1,300 (boosted reel excluded) or 1,500, top posts listed, no login asked |
| R10 | Festival 14 days ahead | `tracker` (and `monthly`) | A `research-run` task with trigger `festival`, the occasion and a due date |
| R11 | Apify off; enabled without token | `r11` | (a) free methods only, cost "free"; (b) Apify noted as not connected, free plan; no actor run |
| R12 | Planted invented stats caught | `r12` | All 9 planted faults removed or fixed; whatever is kept has source and confidence |
| R13 | No commenter or reviewer identities | every run | None of the planted names or handles appears anywhere in saved data (raw files included) |
| R14 | Downstream has every handoff field | every run with a sheet | All 5 blocks and 10 lists present; only non-struck findings, same text (consistency check) |
| R15 | Both backends, identical round trip | every run with a sheet | Every record the run saved (files mode) survives the Sheets encode → decode unchanged; the validator round-trips examples and sample data; live Sheets upgrade + round trip is the optional check below |
| R16 | Fallback without a subagent gives the same sheet | `onboard-inline` vs `onboard` | No subagent call, `ran_without_subagent: true`; same methods and statuses, same situations, findings in the same lists |

## Optional live checks (run by the admin, not part of the fixture suite)

1. **Live smoke test** (costs nothing but Claude usage; reads public data only): in Claude Code with the plugin, Google and Meta connectors, and Claude in Chrome open: "I'm Samarth. Use the TDM Studio TEST Database. Research <one real client> now." Check:
   - the plan;
   - the Meta Ad Library results;
   - a browser read that stops at any Instagram warning;
   - the sheet in the Insights and InsightFindings tabs;
   - no commenter names.
2. **Sheets layout v2 on the TEST sheet:** run the upgrade in `library/storage/google-sheets.md` §7, then save and read back the example insight and task (R15 live). This needs the Google Sheets `update_spreadsheet` permission, which the M2 run was refused.
3. **Claude app:** the items in the release notes' "verify in the Claude app" list.
