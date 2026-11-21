# Change list template

The team's view of one triaged reply. Show it every time, fill it from the feedback entry, and keep it scannable. The client's quotes stay in their own language.

```
**{feedback_id}** · {job_id} {title} · from {from} on {about_stage} v{about_version} · round {round}{ of {revision_cap}}{ · ⚠ OVER CAP}
1. "{quote}" → {label}: {change | question}{ → {target_stage}}
2. "{quote}" → clarification: {interpretations, "a / b / c"} · Ask: "{question}"
3. "{quote}" → not_actionable
4. "{quote}" → duplicate of {duplicate_of}
{From someone other than the decision maker: "(from {name}: waiting for {decision maker}'s OK)"}
Conflicts:
- {type} (items {n, n}): {note} → ask: "{question}"
Route: reopen **{proposed_stage}** ({why: earliest routed item}){; held: items {n} until the client answers}
  {or: "No reopen yet: waiting for the client's answers." / "Approval only: producer records the client gate."}
Who confirms: {assignee name} or {admin name}{ / admin only (over cap or change request)}
Suggested learnings: {one line each, or "none"}
```

## Rules

- **One line per item,** numbered as in the feedback entry.
- **Labels are shown as words,** not codes, in the user's language if they asked in Hindi or Hinglish.
- **The route line always says who must confirm.**
- **No phone numbers.** If the client's message contains one, replace it with "[number]" in the quote.
