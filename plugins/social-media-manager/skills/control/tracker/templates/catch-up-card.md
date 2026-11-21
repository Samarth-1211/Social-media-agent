# Catch-up card template

Fill it from a fresh `get_job`. Leave out any line marked (if …) when it doesn't apply. Write it in the user's language; the labels may be translated.

```
**{job_id} · {title}** ({client name}, {type}, {track} track){ · PAUSED / CANCELLED if not active}
Now: {current_stage} · {"waiting on " + person + " (" + owner_role + ")" | "running"}
Last done: {stage} by {name}, {date time}
Recent:
- {log[-3].at} {log[-3].message}
- {log[-2].at} {log[-2].message}
- {log[-1].at} {log[-1].message}
Credits: {used} / {budget}{ · warn at {warn_at}}{ · OVER BUDGET / past warn line (if so)}
Deadline: {date}{ (overdue by N days)} (if set)
Feedback: round {round}, {n} items, routing {status} (if routing not confirmed)
Next: {next_action}
{Data check: … (only if a check in catch-up.md failed)}
```

Rules:
- Show dates as `22 Nov, 15:30`, India time.
- Show names, not handles; look them up in the Team tab.
- Copy `next_action` exactly. Don't rephrase it.
- "Recent" always shows the last 3 log entries (fewer only if the job has fewer), even if one repeats "Last done".
