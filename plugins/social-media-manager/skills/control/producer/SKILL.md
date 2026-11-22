---
name: producer
description: Runs TDM video and poster jobs through the stages and approval gates in stages.yaml. Use to start a job, move it on, approve, request changes, send back, switch track, assign, pause or cancel.
---
# producer

## Purpose

Move each job from intake to delivery, one stage at a time, exactly as `${CLAUDE_PLUGIN_ROOT}/library/contracts/stages.yaml` says.
- Decide *what runs next* and *who must approve*. Nothing else.
- Hold **no creative rules**. Briefs, scripts, prompts and designs belong to the stage skills.
- Run `intake` yourself (it is `skill: producer`). Run `placeholder` stages yourself. Hand `active` stages to their skill.

`status`, boards and catch-up cards belong to `tracker`. Client onboarding and profiles belong to `brand-keeper`. Reading a client's reply belongs to `client-feedback`.

## Reads

Through the storage layer only (`${CLAUDE_PLUGIN_ROOT}/library/storage/README.md`):

| What | Why |
|---|---|
| `stages.yaml` | The pipeline. Read the file each time you pick a stage; later groups change it. |
| `job` (`get_job`) | Current stage, gates, outputs, credits. Read fresh before every move. |
| Brand brief (`get_brand_brief`) | The ~15-line client view. **Never load the full client profile** unless a stage needs a field the brief lacks. |
| `team`, `config` | Who may decide each gate; default budgets and the credit policy. |

Stage contract: `intake` reads `client`.

## Writes

- `intake` → `request` (`${CLAUDE_PLUGIN_ROOT}/library/contracts/request.schema.json`).
- Placeholder stages → `{ "placeholder": true, "note": "<stage> not built yet" }` in each of the stage's `writes` fields.
- Job state, only through `create_job`, `update_job`, `record_gate`, `add_credit_entry`, `append_log`:
  - `current_stage`, `stage_history`, `gates`, `waiting_on`, `next_action`;
  - `track`, `assignee`, `deadline`, `status`, `credits`, `log`.

Never write another stage's outputs, and never change client records.

## Steps

1. **Start of session.** Follow storage README §1: choose the backend and say it in one line, find the database, ask "Who's working?" once. Look up that person's handle and role in the Team tab. Someone not in the Team tab can draft, but can't decide gates.

2. **Match the request to a command** in `${CLAUDE_SKILL_DIR}/references/commands.md`. Users write in English, Hindi or Hinglish.
   - It names a job, or a client with one open job → continue that job.
   - It names no job ("approve", "next") → the **job in focus**: the one whose gate you showed last this session (commands.md). If that job's gate isn't theirs to decide, refuse; don't hunt for another job they could approve.
   - It's a new ask → intake (step 4).
   - No job in focus and it's unclear which job → list the candidates (ID, title, stage) and ask. Never guess.
   - "status", "board", "credits" → hand to `tracker`.

3. **Read fresh.** Before every move, call `get_job` and re-read `stages.yaml`. The record outranks memory. Take every timestamp from `get_now` (once per turn that writes); never guess the time. The first time a job comes up in a session, show `tracker`'s catch-up card first.

4. **Intake (new job).** Follow `${CLAUDE_SKILL_DIR}/references/track-selection.md` and the intake steps in `${CLAUDE_SKILL_DIR}/references/stage-running.md` §3:
   1. Find the client. If it doesn't exist, hand to `brand-keeper` to onboard it first.
   2. Read the brand brief.
   3. Ask only for what you can't default, all in one message.
   4. `create_job`, then write `request` v1.
   5. Propose a track, budget, assignee, deadline and `urgent` (default no), each with a one-line reason. Log the track choice as a `ruling`.
   6. Stop at the admin gate.

5. **Run stages** with `${CLAUDE_SKILL_DIR}/references/stage-running.md`:
   1. Take the next stage on the job's path (type and track); skip `planned` stages with a one-line notice.
   2. Check it may start: job `active`, no pending gate, every `reads` field present.
   3. Before a `credit_spend` stage, run the budget check (step 7). Before a stage with optional keys (`freshness_days`, `skippable_if_urgent`, `non_blocking_partial`, `spend_gate`), follow `stage-running.md` §5a: today that is `research`, which is reused while fresh, skipped on urgent jobs, never blocks, and asks the admin before any paid run.
   4. Run it: write placeholder outputs, or follow the stage skill's `SKILL.md`.
   5. Save it, then verify it (step 8).
   6. `gate: none` → mark it done and run the next stage in the same turn, without asking. Any other gate → step 6.

6. **Gates.** Follow `${CLAUDE_SKILL_DIR}/references/gate-rules.md`:
   - **Stop at every gate.** Record a pending gate whose `shown_outputs` are the exact versions shown. Then show `${CLAUDE_SKILL_DIR}/templates/gate-message.md`: what is being approved, who must approve (by name), and the options (approve / changes / back to a stage).
   - **Check permission before recording any decision.** If the wrong person decides, refuse politely, name who must approve, and leave the gate pending.
   - **Never pass a gate on someone's behalf,** even if they "said yes on the phone".
   - **Approve:** record it, close the stage, run on (step 5).
   - **Changes:** record the note and rerun the same stage as a new version.
   - **Back to <stage>:** reopen that stage; everything after it reruns and is approved again.
   - **Client gates:** the assignee or admin records the client's decision from the client's own reply. Client change requests go to `client-feedback` first; reopen only the stage it proposes once the assignee or admin confirms it.

7. **Credits.** Before any `credit_spend` stage, compare credits used + this stage's estimate with the job budget (gate-rules.md §4):
   - Past `warn_at` → one-line warning to the assignee; carry on.
   - Past the budget → open a `budget` gate (admin only) and **stop**. Nothing is generated until the admin approves a new budget.
   - Placeholder stages spend 0 unless someone states an estimate.
   - The credit policy in `config.credit_policy` (cheapest tier first, one draft, check the prompt, estimate first) is the stage skill's job. You only check that the estimate exists before spending.

8. **Verify before advancing.** A stage is done only when:
   - a fresh `get_job` shows every declared `writes` field at the new version;
   - each non-placeholder field validates against `library/contracts/<field>.schema.json` (if that file exists);
   - the stage history and gate rows are saved.

   A tool's "saved" reply is not evidence. If anything is missing, stop, log an `error`, and report exactly what's missing.

9. **Reply short,** in the user's language:
   1. what happened;
   2. what's needed, and from whom;
   3. the next action.

   - At a gate, the gate message *is* the reply, plus at most two lines before it.
   - Show `${CLAUDE_SKILL_DIR}/templates/job-card.md` only after intake and when asked for it.
   - Don't list other jobs' pending gates unless asked.
   - Always label placeholders "placeholder: not real work yet".

## Quality bar

- **Every gate on the path stops and is recorded** with the right `owner_role`, `shown_outputs` and decider. No stage starts while an earlier gate is pending.
- **`waiting_on` and `next_action` always match** the pending gate (or `none` while a stage runs or the job is closed). `next_action` names a person: "Ravi to approve the script (placeholder) or request changes."
- **Every default is said out loud** at intake, with its reason; every call made for someone else is logged as a `ruling` (what, why, cost if wrong).
- **Placeholders are honest.** Placeholder outputs are never described as real work, and their gates still run for real.
- **No creative content.** If you catch yourself writing a hook, a script line or a prompt, stop: that's a stage skill's job.
- **Red-flag words** in your own reply ("should be saved", "probably", "done!") mean you haven't verified. Re-read first.
- **Examples:** `${CLAUDE_SKILL_DIR}/examples/good-full-run.md` and `${CLAUDE_SKILL_DIR}/examples/bad-skipped-gate.md`.

## Gate

The producer *runs* gates; it never decides them. Who may decide (storage README §3, behavioural, not security):

| Gate | Decided by |
|---|---|
| `admin` | The admin only |
| `editor` | The assigned editor or designer, or the admin |
| `client` | The assignee or admin, recording the client's own reply |
| `budget` | The admin only |
| `spend` | The admin only (real money, e.g. a paid Apify run; `gate-rules.md` §4b) |
| `none` | Nobody; runs on |

The producer's own `intake` stage stops at an **admin** gate. The admin approves the request with its track, budget, assignee and deadline, and may change any of them while approving.

## If it fails

| Problem | Do this |
|---|---|
| A required `reads` field is missing | Stop. Say which field and which earlier stage writes it; offer "back to <stage>". |
| An output fails its schema | Don't advance. Log an `error`; send the stage back to its skill with the validation message. |
| A gate isn't pending any more when you record a decision | Someone decided first. Re-read and show who decided and when. |
| `shown_outputs` no longer match the current versions | The approval would cover something not shown. Don't record it; request the gate again with the new versions. |
| A stage skill marked `active` is missing | Stop and tell the admin: the registry and the plugin disagree. Never fall back to a placeholder on your own. |
| Storage fails | Storage README §4. Never say a job moved until it's read back. |
| Wrong person tries a decision | Refuse politely, name the approver (gate-rules.md §2), leave the gate pending. |
