# Running stages

How the producer picks, runs, saves and verifies each stage. The pipeline is `${CLAUDE_PLUGIN_ROOT}/library/contracts/stages.yaml`; the rules behind it are in `docs/STAGE-CONTRACT.md` (repo only). Storage operations: `${CLAUDE_PLUGIN_ROOT}/library/storage/README.md`.

## 1. The job's path

1. Read `stages.yaml` now (it changes as later groups ship skills).
2. Keep the stages, in file order, whose `job_types` include `job.type` **and** whose `tracks` include `job.track`. That list is the job's **path**.
   - Video, quick: 15 stages. Video, full: 22. Poster: 8 (the same on both tracks).
3. The **current stage** is `job.current_stage`. The **next stage** is the one after it on the path.
4. Stage `status`:

   | Status | Do |
   |---|---|
   | `planned` | Don't run it. Append a `stage_history` row with status `skipped` and note "planned: not built". Say it in one line. Go to the next stage. |
   | `placeholder` | Run it yourself (§4). |
   | `active` | Run its skill (§5). |

## 2. Before a stage starts

Check all of these on a fresh `get_job`. If one fails, don't start; say what's wrong.

| Check | If it fails |
|---|---|
| `job.status` is `active` | "SHL-02 is paused. Say 'resume SHL-02' first." |
| No gate is `pending` on the job | Show that gate's message again. Never skip ahead. |
| Every `reads` field is in `job.outputs` (or is `client`) | Name the missing field and the stage that writes it. A placeholder counts as present. |
| `credit_spend: true` → budget check passed | `gate-rules.md` §4. |
| `active` → the skill folder exists | Stop and tell the admin. Never fall back to a placeholder on your own. |

Then save the start with `update_job`:
- `current_stage` = the stage;
- `waiting_on` = `none`;
- a new `stage_history` row (`in_progress`, `started_at` from `get_now`, `by` = the person running it, or `system` for automatic stages);
- a log `event` ("<stage> started").

## 3. Intake (the producer's own active stage)

1. **Client.** Find it with `list_clients` / `get_client` (name, code or ID). If several match, list them and ask. If none, hand to `brand-keeper` to onboard first, then come back.
2. **Brand brief.** `get_brand_brief`. Note any open question the request touches.
3. **The ask.** Keep `raw_request` exactly as given (chat text, a forwarded client message), minus any phone numbers.
4. **Fill what you can; ask the rest once.**
   - You need `type` (video or poster) and what it's for. If either is unclear, ask, in one grouped message with your proposed defaults.
   - **Defaults:**

     | Field | Default |
     |---|---|
     | `title` | Short, from the ask. |
     | `deliverables` | Rough list ("Instagram reel 9:16 ~20s"). |
     | `occasion` | From the ask, or null. |
     | `deadline` | From the ask, or null with "no deadline set". |
     | `assignee` | Whoever did this client's last job of this type (`list_jobs`); otherwise ask the admin. Posters go to a designer, videos to an editor. |
     | Budget | `config.default_credit_budget_<type>` and `default_credit_warn_<type>` (video 200, no warning; poster 28, warn at 20). |
     | `track` | See `track-selection.md`. |
     | `urgent` | `false`. Propose `true` only if the ask says so ("urgent", "aaj hi chahiye") or the deadline is within 2 days; give the reason. Urgent jobs skip stages marked `skippable_if_urgent` (research). The admin decides at the intake gate and can change it any time ("SHL-01 urgent" / "not urgent"). |

   - Write every default you filled in into `assumptions`, one line each.
5. **Create.** `create_job` with client, type, title, the proposed track, deadline, assignee and budget. Storage gives the job ID (`<CODE>-<NN>`) and opens the intake `stage_history` row.
6. **Write `request` v1** (`request.schema.json`). Set `track.proposed` and `track.reason`, and leave `track.chosen` null until approval. Log the track choice as a `ruling`: "Proposed quick track: <why>. Cost if wrong: <what switching later adds>."
7. **Verify** (§6), then **request the admin gate** with `shown_outputs: {request: 1}`. Show the intake variant of `templates/gate-message.md`.
8. **On approval:**
   - Set `request.data.track.chosen`.
   - Apply any edits the admin made while approving (track, budget, assignee, deadline). Those make `request` v2. Update the pending gate's `shown_outputs` to v2 before recording the decision, and put the edits in the gate `note`.
   - Copy the chosen values onto the job (`track`, `credits.budget`, `credits.warn_at`, `assignee`, `deadline`, `urgent`).
   - Close intake, and run on.

## 4. Placeholder stages

For each field in the stage's `writes`:

```json
{
  "version": <previous version + 1, or 1>,
  "stage": "<stage id>",
  "by": "system",
  "summary": "placeholder",
  "data": { "placeholder": true, "note": "<stage> not built yet" },
  "updated_at": "<get_now>"
}
```

- Approval stages (`client-*-approval`) have no `writes`. They only open their client gate.
- A placeholder `credit_spend` stage spends 0 credits; still run the budget check and show it in one line.
- Say "placeholder: not real work yet" every time you show one.

## 5. Active stages (run by their skill)

1. Open `${CLAUDE_PLUGIN_ROOT}/skills/<group>/<skill>/SKILL.md` and follow it.
2. Give it only:
   - its `reads` and `optional_reads` fields;
   - the brand brief;
   - the job's ID, type, track and deadline.
3. The skill returns its `writes` fields. Save them with `update_job` as new output versions (`by` = the person running it).
4. A credit-spending skill must pass the budget check (`gate-rules.md` §4) before **each** generation, and log each spend with `add_credit_entry`.

## 5a. Stages with optional keys

Some stages carry extra keys in `stages.yaml` (`docs/STAGE-CONTRACT.md`, "Optional stage keys"). Handle them **before** running the stage, in this order. Today only `research` uses them.

1. **`skippable_if_urgent`** and `job.urgent` is true → don't run the stage.
   - Write its output with status `skipped` and flag `no_fresh_research`, copying the latest sheet's handoff block if one exists (`get_latest_insight` → `get_insight`) and saying its age in `note`.
   - Add a `stage_history` row with status `skipped` and note "urgent job".
   - Run on.
2. **`freshness_days`** (`config.freshness_days` overrides it) → `get_latest_insight` for the client:
   - younger than the limit, no browser step pending → status `fresh`; copy its handoff block; don't run the skill;
   - younger than the limit, browser step pending → status `partial` (with `non_blocking_partial`), flag `browser_step_pending`; copy what exists. If a browser is available, offer it in one line ("Instagram read for <client> is still queued (~10 min). Run it now, or carry on?") and carry on unless they say run; if not, just say in one line that it stays queued;
   - older, or none → run the skill (§5). It returns `refreshed` or `new` (`partial` if its browser part was queued).
3. **`spend_gate`** → the skill tells you if its plan includes paid work above `config.research_auto_approve_limit`. Then open a `spend` gate (`gate-rules.md` §4b) **before** the paid part runs; the free part doesn't wait.
4. **`non_blocking_partial`** → a `partial` result is done for the pipeline: the job moves on in the same turn.

**Saving the research output.** Write `outputs.research` (`research.schema.json`) and, in the same `update_job`, its copies on the job: `research_status` and `insight_id`. Log one line ("research: reused SHL-I202611-1 (fresh, 12 days)"). Add each cost line the skill returned with `add_credit_entry` (its `provider` and `currency`; free lines are 0 and never count against the credit budget).

## 6. Verify before advancing

After saving, call `get_job` again. Check:
1. every `writes` field is present at the version you just wrote;
2. each non-placeholder field validates against `library/contracts/<field>.schema.json`, where that file exists;
3. the `stage_history` row and any gate row you wrote are there;
4. the counts of `gates` and `stage_history` rows haven't dropped (storage README §3.3);
5. for `research`: `research_status` and `insight_id` on the job equal those in `outputs.research.data`.

Only then say the stage is done. If a check fails, log an `error`, report it and stop. "The tool said saved" is not evidence.

## 7. After the stage

| Stage `gate` | Do |
|---|---|
| `none` | Close the history row (`done`, `finished_at`). Log it. Run the next stage in the same turn, without asking. |
| `admin`, `editor`, `client` | `record_gate` request (`gate-rules.md` §1). Stop and show the gate message. |

A run of consecutive `gate: none` stages continues until the next gate, a failed check or a budget stop.

## 8. Reopening a stage

| Trigger | Do |
|---|---|
| **Changes** on stage X's gate | Close X's open history row with status `reopened` and the note. Open a new X row (`in_progress`). Rerun X: outputs get version + 1, and the placeholder note says "(v2 after changes)". Request a new gate. |
| **Back to** stage Y (Y earlier than X) | Close X's row as `reopened` (note "sent back to Y: <reason>"). Set `current_stage` = Y and open a new Y row. Rerun Y. Then every stage after Y on the path runs again in order, and every gate after Y is requested again: earlier approvals covered older versions. |
| **Client feedback** (from `client-feedback`) | Reopen only the stage it proposes, once the assignee or admin has confirmed the route. Then as "Back to". |

- Outputs are never deleted. Older versions stay in the history; each new version gets a higher number.
- Rerunning a `credit_spend` stage runs the budget check again. The stage skill decides what really needs regenerating; for placeholders, that's nothing.

## 9. Closing the job

- **Delivery approved:** `status` = `delivered`, `waiting_on` = `none`, `next_action` = "Delivered on <date>. Nothing pending." Log it.
- **Cancelled:** see `commands.md`.

## 10. When to stop and hand back

Keep going between gates. Stop only for:
1. a gate (any owner);
2. a budget over-run;
3. anything that would reach the client (client gates);
4. cancelling, deleting or overwriting someone's work;
5. a broken plan: a missing read, a failed check, a missing skill.

Never ask "should I continue?" between `gate: none` stages.
