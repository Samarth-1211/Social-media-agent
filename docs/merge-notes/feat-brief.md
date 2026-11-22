# Merge notes: `feat/brief`

The brief skill (Prompt 4) was built on `feat/brief` from `main` at v0.1.0, separately from the market researcher (`group2a-market-researcher`, Prompt 3). Both get merged and tested together. This file lists every change to a shared file and every item left for the merge.

## 1. Shared-file changes (all additive)

| File | What was added | Why |
|---|---|---|
| `library/contracts/brief.schema.json` | `x-version: 2`, a `$comment`, and optional fields: `status`, `changelog`, `job_kind`, `objective_label`, `audience_detail`, `proof_points`, `offer_detail`, `cta_detail`, `creative_format`, `platforms`, `aspect_ratio`, `duration_sec`, `writing_script`, `posting_date`, `research`, `track_suggestion`, `confidence`, `client_questions`, `ready_for_production`, `self_check`, `downstream`; `deliverables[].changes_from_master`; `$defs` (`slug`, `finding`). Nothing renamed, retyped or required. | Prompt 4 §3. Pair rule: `decisions/0004-brief-field-pairs.md`. |
| `library/contracts/config.schema.json` | `x-version: 2`; optional `brief_auto_approve_repeat` (false), `brief_max_questions` (5), `client_question_reminder_hours` (24) | Prompt 4 §7 |
| `library/contracts/job.schema.json` | `x-version: 2`; gate `decided_by_role` gains `system`; one sentence appended to the `waiting_on` description (the awaiting-client exception) | Auto-approve is logged as `system`; the brief waits on the client without a gate |
| `library/contracts/examples/brief.example.json` | The v2 fields, filled for SHL-01 (approved, research skipped) | Validator checks 7 and 12 |
| `library/contracts/examples/config.example.json` | The 3 brief config keys | Round trip |
| `library/storage/sheet-layout.json` | `version` 1 → 2; new tab `BriefQuestions` (`kind: mirror`, `since: 2`) at the end; Gates `decided_by_role` dropdown gains `system` | Dashboard reminder; phone answers |
| `library/storage/sheet-setup.json` (generated) | The BriefQuestions tab, the Dashboard block `X2:AA3`, a separate Config entry for the 3 brief rows, and `upgrades["2"]` for existing databases | Built by the script |
| `library/storage/tracker-page/sample-data.json` (generated) | Job SHL-03 (brief awaiting the client, 2 open questions); the brief Config rows | Exercises the mirror and the Dashboard |
| `library/storage/README.md` | §5 Brief records (version files, mirror, waiting_on without a gate, typed answers) | Prompt 4 §§4.9, 5, 7 |
| `library/storage/google-sheets.md` | Tab-table row for BriefQuestions; §7 Brief records | Backend steps |
| `library/storage/setup.md` | "13 data tabs" → "14 data tabs (13 in layout v1, plus BriefQuestions in v2)"; new section "Upgrade an existing database to layout v2" | The count would otherwise be wrong; existing sheets need the tab |
| `library/storage/files-backup.md` | `brief/` in the folder tree; "Brief files" section | Files-mode equivalent |
| `scripts/lib/sheet-codec.mjs` | `mirror` tab kind (encoded; ignored on decode) | BriefQuestions |
| `scripts/build-sheet-setup.mjs` | Collects `since: 2` requests into `upgrades["2"]`; Dashboard block; brief Config rows; re-sends the Gates dropdown rule on upgrade | Setup and upgrade |
| `scripts/build-sample-data.mjs` | Job SHL-03; Shubh Laundry `next_job_number` 3 → 4 (the only changed value, needed for the new job) | Sample data |
| `scripts/validate.mjs` | Registers the `x-version` keyword; new check 12 (pairs, variants vs master, research and readiness rules, mirror) | Prompt answer 2 |
| `docs/STAGE-CONTRACT.md` | "Schema versions" section | x-version |
| `docs/STORAGE.md` | "Layout v2 (feat/brief)" section | Overview and what's unverified |
| `docs/ADD-A-SKILL.md` | Check 12 row | Check list |
| `plugins/social-media-manager/ATTRIBUTION.md` | 9 rows and a pointer line (appended) | M1 |
| `docs/decisions/0004-brief-field-pairs.md` | New | Prompt answer 2 |
| `plugins/social-media-manager/.claude-plugin/plugin.json` | `"./skills/pre-production"` added to `skills` (M3) | The validator needs the group registered once `brief/` exists. The brief stage stays a `placeholder` until M5. |
| `docs/decisions/0005-shared-rules-consolidation.md` | New (M3): proposal only | Prompt 4 §0.5: repeated confidence, plain-language and client-message rules |

| `library/storage/README.md` (M4) | "Auto-approved brief gate" paragraph: the only case a gate is decided by `system` | Prompt 4 §4.8 |
| `library/contracts/examples/brief.example.json` (M4) | `self_check` gains the 5 remaining checklist ids (array items only) | The example follows the 10-line checklist |
| `scripts/build-sample-data.mjs` (M4) | SHL-03 `self_check` lists all 10 checklist ids | Same |

| `library/contracts/stages.yaml` (M5) | `brief` `status: placeholder` → `active`; a 2-line comment above the stages | The producer runs the brief after intake (after research once merged). No `optional_reads: [research]` here (§2.1). |
| `library/storage/README.md` (M5) | The awaiting-client `next_action` wording now starts "Brief: waiting for client reply (sent <date>): …" | The Dashboard's open-jobs view and the tracker catch-up card show `next_action` as is, so the status reads "Brief: waiting for client reply" with no tracker edit |
| `scripts/build-sample-data.mjs` (M5) | SHL-03 `next_action` uses that wording | Same |
| `skills/pre-production/README.md` (M5) | `brief` row → active; "Brief handoff" section (which `downstream` part each later stage reads) | Handoff available to the next stages |

| `evals/fixtures/brief/**`, `evals/brief-fixtures.mjs`, `evals/scenarios/brief.md`, `evals/rubrics/brief.md` (M6) | New: fixtures for 2 clients, 17 scenario jobs, 2 past jobs, a research output, 8 replies, a bad brief; a fixture checker, files-mode seeder and TEST-sheet row builder; B1–B15 with the rubric. **Not run.** | Prompt 4 §8; run in the combined test phase |
| `evals/README.md` (M6) | One paragraph pointing to the brief evals | Discoverability; Group 1 eval files untouched |

| `README.md`, `plugins/social-media-manager/README.md` (M7) | Brief rows and commands; "Briefs (brief)" command table; auto-approve note; setup step 5 (sheet upgrade); three one-line status texts updated (status, "not built yet", `stages.yaml` active list) | Team-facing docs |
| `plugins/social-media-manager/CHANGELOG.md` (M7) | `[Unreleased] - feat/brief` section | Version set at merge |
| `skills/pre-production/brief/CHANGELOG.md` | Skill changelog (Unreleased) | |

## 2. To do at merge

1. **Research input.** The researcher branch already gives `brief` `optional_reads: [research]` in its `stages.yaml`; keep that line, plus this branch's `status: active`. Map its `research_status` (fresh / refreshed / new / partial / skipped) onto `brief.research.status` as in `references/research-input.md` §2, or widen the brief enum additively. Its `downstream.brief` lists are `pain_points`, `working_angles` and `timely_hooks`; customer phrases are under `downstream.localise`, proof points under `downstream.script`. Originally planned here: add `optional_reads: [research]` to the `brief` stage in `stages.yaml`. It wasn't added here because no stage writes `research` on this branch, so check 6 would fail. Then connect `brief.research` to the real insight schema, following `skills/pre-production/brief/references/research-input.md` (M3): map the insight's `downstream` fields onto `angles_chosen`, `pain_points_used`, `customer_phrases_used`, and the insight id onto `insight_id`. Until then, every brief writes `research.status = skipped` with `skip_reason` "research stage not built yet".
2. **Version numbers.** Settle them at merge so alpha.1 (researcher) comes before alpha.2 (brief). This branch bumps no plugin version and adds no tag.
3. **Numbering that will clash:**
   - **`sheet-layout.json` `version` and `upgrades["2"]`:** the researcher also adds tabs (Insights, InsightFindings, Tasks). Either combine both sets into one v2 upgrade, or make whichever merges second v3. The same applies to the `since` value on new tabs.
   - **Validator check numbers:** if the researcher also added a check 12, renumber one, and fix `ADD-A-SKILL.md` and the header comment.
   - **`x-version`:** if both branches changed the same schema (likely `job.schema.json` and `config.schema.json`), the merged schema is still `x-version: 2`, with both sets of fields.
   - **Decision record numbers:** this branch adds `0004-*` and `0005-*`; if the researcher branch adds either number, renumber.
   - **`plugin.json` `skills`:** both branches register `./skills/pre-production`; keep a single entry.
4. **`pending_tasks` vs `BriefQuestions`.** The researcher adds a pending-tasks area (`Tasks` tab, `tasks.json`). Decide at merge whether brief client questions become one kind of pending task, or stay a separate mirror. For one task list: `BriefQuestions` rows map to tasks of kind `client-reply`, with `job_id`, `asked_at`, `status`, and the question in the body. The Dashboard block then queries the tasks tab instead.
5. **Job fields from the researcher.** The researcher adds `research_status`, `insight_id` and `urgent` to the job. At merge, the brief's express mode reads `job.urgent` (on this branch it uses the request words "jaldi" / "abhi chahiye" and a deadline within 2 days), and `brief.research` should agree with `job.research_status`.
6. **Combined test phase.** Run the validator, the S7 feedback runner, one live S3 run on the TEST sheet (now including the v2 upgrade on TDM Studio TEST Database), B1–B15 (written in M6, not run), and `git diff --stat main` for the protected paths.

## 3. Risks to re-check after merge

- **Client replies routed to `client-feedback`.** The brief mitigates this only inside itself:
  - it parses pasted client answers only when that job's brief `status` is `awaiting-client`;
  - its description names "the client's reply to brief questions".
  
  `client-feedback` is unchanged. If B5 fails after the merge (the reply lands in client-feedback), fix it then.
- **Dashboard query on text timestamps.** The query compares `asked_at` text with a text cutoff built from `NOW()`. It works when every `asked_at` has the `+05:30` form; check it on the TEST sheet.
- **Auto-approve vs the producer's gate rules.** `producer` says never to pass a gate on someone's behalf. The brief's auto-approve (off by default) records a `system` decision, which storage README §5 allows. Check in the combined test (B12) that the producer accepts it rather than re-requesting the admin gate. If not, propose a one-line exception in `producer/references/gate-rules.md` at merge.
- **The producer and an awaiting-client brief.** The producer is unchanged. The brief skill tells it not to request the gate while the brief is `awaiting-client` (README §5). Confirm in S3/B5 that the producer doesn't force the gate early.

## 4. Proposed diffs to protected files (M5, awaiting the admin's decision)

The brief's "waiting on the client without a gate" state (storage README §5) meets two protected rules. Neither is applied.

**Decision (admin, 2026-11-22):** apply 4a and 4b at the merge phase, before the combined tests. Not on `feat/brief`.

### 4a. Producer: don't request the gate while a stage waits on the client

Without it, the producer's step "any other gate → request it" would ask the admin to approve a brief that is still waiting for the client's answers.

`skills/control/producer/references/stage-running.md` §7:
```diff
 | `none` | Close the history row (`done`, `finished_at`). Log it. Run the next stage in the same turn, without asking. |
 | `admin`, `editor`, `client` | `record_gate` request (`gate-rules.md` §1). Stop and show the gate message. |
+| Stage skill says it is **waiting on the client** (e.g. brief `awaiting-client`) | Don't request the gate. Keep the history row `in_progress`, keep the skill's `waiting_on: client` and `next_action`, and stop. When the reply is pasted, run the same stage skill again; it ends with its normal gate. |
```

### 4b. Tracker catch-up: no false data-check warning

Without it, the catch-up card for a brief waiting on the client shows "Data check: waiting_on says client but the open gate is none".

`skills/control/tracker/references/catch-up.md`, "Checks before showing":
```diff
-| `waiting_on` equals the pending gate's owner role (or `none` with no pending gate) | Show the card, plus a line: "Data check: waiting_on says X but the open gate is Y; ask the admin or producer to fix." |
+| `waiting_on` equals the pending gate's owner role (or `none` with no pending gate; or `client` with no pending gate while the job's brief is `awaiting-client`) | Show the card, plus a line: "Data check: waiting_on says X but the open gate is Y; ask the admin or producer to fix." |
```

## 5. Proposed for merge phase (not applied)

### Tracker status board: show "Brief: waiting for client reply"

The board line shows the stage but not `next_action`, so an awaiting-client brief appears only as "brief" under "Waiting on client". This is the proposed 2-line addition to `skills/control/tracker/references/status-views.md` §1. It is **not applied**, because tracker files are protected on this branch.

```diff
 Each job is one line: ID, title, client name, current stage, assignee, deadline. Mark a past deadline **OVERDUE**.
+If the job is at `brief` and waiting on the client (no pending gate), write the stage as "Brief: waiting for client reply (asked <date>)".
+Mark it **REMIND** when the oldest open row in `BriefQuestions` for the job is older than `config.client_question_reminder_hours`.
```
