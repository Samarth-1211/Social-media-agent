# Job record (readable view)

Used for `job.md` in files mode, the job detail on the tracker page, and when someone asks to "show the whole job". Fill it from the job record; leave out empty sections. For a quick status, use the tracker's catch-up card instead.

```markdown
# {job_id} · {title}
{client name} · {type} · {track} track · status: {status}
Assignee: {assignee} · Deadline: {deadline}{ (OVERDUE) if past}

**Now:** {current_stage}, waiting on {waiting_on}
**Next:** {next_action}

## Credits
{used} / {budget} used{, warn at {warn_at}}
| When | Stage | Tier | Amount | Estimate | Approved by |
|---|---|---|---|---|---|
| {at} | {stage} | {tier} | {amount} | {estimate} | {approved_by} |

## Gates
| Stage | Owner | Status | Decided by | When | Note |
|---|---|---|---|---|---|
| {stage}{ (budget) if kind=budget} | {owner_role} | {status} | {decided_by} ({decided_by_role}) | {decided_at} | {note}{ → sent back to {sent_back_to}} |

## Stages
| Stage | Status | Started | Finished | By |
|---|---|---|---|---|

## Outputs
- **{field}** v{version}: {summary, or "placeholder: {note}"}{, files: links}

## Client feedback
- **{feedback_id}** (round {round}, on {about_stage} v{about_version}): {n} items, {conflicts} conflicts{, OVER CAP}; routing: {routing.status} → {routing.proposed_stage}

## Log (last 20)
- {at} · {by} · {kind}: {message}
```

Rules:
- Dates are shown as `22 Nov, 15:30` (India time).
- Never show phone numbers.
- Placeholder outputs are labelled "placeholder", never presented as real work.
