# Bad: catch-up from memory (annotated)

**Situation:** earlier in the chat, Pooja looked at SHL-02 when it was at `poster-drafts`. Since then, she approved the drafts and sent them to the client. An hour later she asks "SHL-02 ka kya hua?" and the tracker answers without reading the sheet again.

**Bad output:**

```
SHL-02 is at poster drafts, waiting on you to approve the drafts. Credits 6 / 28.
Next: approve the drafts.
```

**What's wrong:**

| Problem | Rule broken |
|---|---|
| Stage and gate are from the earlier read. The job is now at `client-poster-approval`, waiting on the **client**. | Read fresh, every time (SKILL.md step 3) |
| Credits show 6. The ledger now has a second draft: 14 / 28. | Every number comes from a read made for this answer |
| It isn't marked overdue, but the deadline (20 Nov) has passed. | Overdue is computed against today, India time |
| "Next" is invented. The record's `next_action` is "Pooja to record Neha ji's reply on the two poster drafts." | Copy `next_action` word for word |
| No "Recent" lines, so Pooja can't see what changed. | The card has the last 3 log lines |

**Correct behaviour:** call `get_job SHL-02` now and fill `templates/catch-up-card.md` from that read:
- Now: client-poster-approval · waiting on Neha (client), reply recorded by Pooja.
- Credits: 14 / 28 · warn at 20.
- Deadline: 20 Nov (overdue by 2 days).
