# 04-contradiction: Contradicting background instructions

Covers: conflict. All names and businesses are fictional. Source of truth: `samples.json`.

## Job context (the current record)

| | |
|---|---|
| Job | SHL-02 · Shubh Laundry · Wedding season saree dry-clean poster (poster, quick) |
| Path | intake, brief, concept, poster-drafts, client-poster-approval, poster-final, delivery |
| Pending gate | client-poster-approval (client), showing poster_drafts v1 (one draft, light-grey background) |
| Decision maker | Neha (owner) |
| Client languages | Hinglish, Hindi |
| revision_round so far | 0 |
| revision_cap | 2 |
| Earlier feedback | none |
| Approved decisions | brief: wedding season saree and sherwani dry clean, free pickup above ₹299 |
| From | Neha |

## Client reply (pasted by the assignee)

```
Logo thoda bada karo. Background white rakho, clean lagega. Aur background mein blue colour bhar do, brand colour hai na.
```

## Expected

White vs blue is held until Neha chooses; the logo change is routed.

- Items (by a phrase in the quote → accepted labels): "Logo" → in_scope; "white" → in_scope / clarification; "blue" → in_scope / clarification
- Conflicts: contradiction
- Route: poster-drafts (proposed)
- Over cap: false · Round change: 1
