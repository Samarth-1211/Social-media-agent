# Gate message template

Show this every time a gate opens, and again whenever someone says "next" or "continue" while it's pending. Fill it from a fresh read. Write it in the user's language (labels may be translated); keep it under 8 lines.

## Stage gate (admin or editor)

```
⏸ {job_id} · {stage} needs approval
Approving: {field} v{version}: {summary}{ (placeholder: not real work yet)}
Who: {approver name} ({owner_role}){ or {admin name} (admin), for editor gates}
{Budget check line, for credit stages}
Reply: "approve" · "changes: <what to change>" · "back to <earlier stage>"
```

## Intake gate (admin)

```
⏸ {job_id} · intake needs approval ({admin name}, admin)
{client name}: {title} ({type}){ · {occasion}}
Deliverables: {deliverables}
Track: {proposed}, because {reason}
Budget: {credits} credits{, warn at {warn_at}} · Assignee: {name} · Deadline: {date or "none set"}
Assumed: {assumptions, joined with "; "}
{Brand brief note, if the request touches an open question: "Open question: <q>; using <recommendation>."}
Reply: "approve" · "approve, full track / budget 150 / assign Pooja" · "changes: <note>"
```

## Client gate

```
⏸ {job_id} · {stage}: waiting on the client ({decision maker})
To send: {field} v{version}{ (placeholder: nothing real to send yet)}
{assignee name}: send it to {decision maker}, then paste their reply here:
  "client approved: <their message>"  or  "client feedback: <their message>"
```

## Budget gate (admin only)

```
⛔ {job_id} · {stage} would go over budget
Used {used} + estimate {estimate} = {total} > budget {budget}{ (warn at {warn_at})}
Nothing has been generated. {admin name} (admin) decides:
Reply: "approve, budget <n>" · "changes: <cheaper option>"
```

## Rules

- **Name the person,** not just the role. Use the Team tab name for team members and `decision_maker.name` for the client.
- **Show the version** being approved. An approval covers only that version.
- **Every gate message ends with the reply options.**
- **No phone numbers.**
