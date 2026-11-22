# Status board template

Fill it from a fresh `list_jobs`. Leave out empty groups, except that the summary line always shows every count.

```
**TDM Studio · {weekday} {date}** ({n} open · {a} admin · {e} editor · {c} client · {o} overdue)

**Waiting on admin ({a})**
- {job_id} · {title} · {client} · {current_stage} · {assignee} · due {deadline}{ · OVERDUE}

**Waiting on editor ({e})**
- …

**Waiting on client ({c})**
- …

**Running ({r})**
- …

Paused: {job_id} {title} (if any)

**Research ({p})** (only if any browser steps are pending)
- Research: Instagram read pending for {client} (~{minutes} min, needs browser)
{Data checks: one line per problem (if any)}
```

Rules:
- One line per job.
- Sort by deadline, earliest first.
- Use names, not handles.
- Mark overdue jobs with **OVERDUE** at the end of the line, India time.
- End with one useful nudge, if there is one: "Admin has 2 gates waiting: say 'approve <job>' to producer."
