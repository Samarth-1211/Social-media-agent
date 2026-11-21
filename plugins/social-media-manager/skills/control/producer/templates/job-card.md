# Job card template

A compact view of one job's progress through its path. Show it after intake and whenever someone asks for "the job card". Fill it from a fresh `get_job` and the job's path (`references/stage-running.md` §1). Keep it under 10 lines.

```
**{job_id} · {title}** ({client name}, {type}, {track} track){ · PAUSED / CANCELLED / DELIVERED}
Path: {stage marks, in path order}
Now: {current_stage} · {"waiting on " + name + " (" + owner_role + ")" | "running" | "nothing pending"}
Assignee: {name} · Deadline: {date}{ (overdue by N days)} · Credits: {used} / {budget}{ · warn at {warn_at}}
Outputs: {field} v{n}{ (placeholder)}, … (only fields that exist)
Next: {next_action}
```

## Stage marks

| Mark | Meaning |
|---|---|
| `✓stage` | done (latest history row `done`) |
| `▶stage` | current, running |
| `⏸stage` | current, gate pending |
| `↺stage` | reopened and running again |
| `–stage` | skipped (planned or track switch) |
| `stage` | not reached yet |

Example path line (quick video, at the script gate):

```
Path: ✓intake ✓brief ✓concept ⏸script client-script-approval storyboard clips voice-music qa-clips assemble captions-motion finish client-final-approval delivery
```

## Rules

- Copy `next_action` word for word.
- Show names, not handles.
- Mark placeholders "(placeholder)". Never present them as real work.
- Dates are India time, shown as `22 Nov`.
