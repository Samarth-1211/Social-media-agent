# Commands

What people type, who may do it, and what the producer does. They write in English, Hindi or Hinglish; match the meaning, not exact words.

**Before every command:**
- Read the job fresh (`get_job`).
- **Find the job in focus.** It's the job whose gate message (or job card) you showed last in this session. Talking about other jobs in between doesn't change it; only working on another job does.
- **A command that names no job** applies to the job in focus. "approve", "changes: …" and "next" all work this way.
  - If the person may decide that job's pending gate, do it, and name the job in your reply ("Recorded: SHL-03 script approved").
  - If they may not, refuse as in `gate-rules.md` §2. Don't go looking for some other job they could approve.
  - Only if there is no job in focus yet (a fresh session) and more than one job could fit: list them (ID, title, stage) and ask.
- **Stay on the job in focus.** Don't list other jobs' pending gates unless asked ("what else is waiting on me?" goes to `tracker`).

| Command (examples) | Who may | Does |
|---|---|---|
| **new job**: "new job for Shubh Laundry", "<client> ke liye Diwali reel chahiye", "naya poster" | anyone in the Team tab | Intake (`stage-running.md` §3). |
| **continue**: "continue SHL-01", "SHL-01 kholo", "where were we on SHL-01" | anyone | Show `tracker`'s catch-up card, then the pending gate message or "Say 'next' to run <stage>". |
| **next**: "next", "aage badho", "chalo" | the assignee or an admin | If a gate is pending, show it again; never skip it. Otherwise run the next stage (`stage-running.md`). |
| **approve**: "approve", "approved", "ok hai", "theek hai" | the gate's decider (`gate-rules.md` §2) | Record `approved`; run on. |
| **changes**: "changes: <note>", "isme <x> badlo" | the gate's decider | Record `changes_requested` with the note; rerun the stage. |
| **back to**: "back to script", "storyboard pe wapas jao" | the gate's decider | Record `sent_back`; reopen that stage. |
| **client approved**: "client approved: <their message>", "Neha ji ne ok bola: <message>" | the assignee or an admin | Record the client gate (`gate-rules.md` §5). Ask for the client's own words if missing. |
| **client changes**: "client feedback: <their message>" | the assignee or an admin | Hand to `client-feedback`; reopen the stage it proposes once confirmed. |
| **switch track**: "switch SHL-01 to full track" | admin | `track-selection.md` §3. |
| **assign**: "assign SHL-01 to Pooja", "SHL-01 Ravi ko do" | admin | Check that the person is an active editor or designer. Update `assignee`. If an `editor` gate is pending, its decider changes too; say so. Log a ruling. |
| **deadline**: "SHL-01 deadline 28 Nov" | admin | Update `deadline`. Log it. |
| **budget**: "SHL-02 budget 35" | admin | Update `credits.budget` and log a ruling. If a budget gate is pending, record this as its approval. |
| **log credits**: "log 6 credits for poster-drafts: 1 draft, <model>" | the assignee or an admin | `add_credit_entry` (`gate-rules.md` §4, "after the fact"). |
| **pause**: "pause SHL-01", "SHL-01 hold pe rakho" | the assignee or an admin | `status` = `paused`; keep `current_stage` and any pending gate. `next_action` = "Paused by <name>: <reason>. Say 'resume SHL-01'." |
| **resume**: "resume SHL-01" | the assignee or an admin | `status` = `active`. Restore `waiting_on` and `next_action` from the pending gate (or "Say 'next' to run <stage>"). |
| **cancel**: "cancel SHL-01" | admin | Ask once: "Cancel SHL-01 (<title>)? Outputs and history are kept; it can't be resumed." On yes: `status` = `cancelled`, `waiting_on` = `none`, close the open history row with status `failed` and note "cancelled", and log it. Never delete rows. |
| **urgent**: "SHL-01 urgent", "not urgent", "ye urgent hai" | admin | Set `urgent`; log a ruling. If set before `research` runs, that stage will be skipped (and flagged for the brief). |
| **research**: "research <client>", "refresh research", "Instagram read kar do", "strike <competitor>" | anyone (strikes: the assignee or an admin) | Hand to `research-methods`. Outside a job it doesn't move any job. |
| **job card**: "SHL-01 card", "job card dikhao" | anyone | `templates/job-card.md` from a fresh read. |
| **status, board, credits, overdue** | anyone | Hand to `tracker`. |

**Wrong person.** Refuse politely and name who may (`gate-rules.md` §2). Don't change anything.

**Ambiguous approvals.** If "ok" might not be an approval, or might be for a different job, ask: "Approve <stage> for <job>?"

**While paused or cancelled.**
- Paused: nothing moves; no gate decisions (say "resume first").
- Cancelled: only reading.
- Delivered: only reading, or a new job.

**Natural-language moves** ("script approve kar do aur storyboard bana do") are two commands: run them in order, and stop wherever a rule stops you (here: after the script approval, at the storyboard gate).
