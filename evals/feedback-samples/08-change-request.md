# 08-change-request: New offer and a new language version

Covers: change-request. All names and businesses are fictional. Source of truth: `samples.json`.

## Job context (the current record)

| | |
|---|---|
| Job | SHL-01 · Shubh Laundry · Diwali curtain & sofa cleaning offer reel (video, quick) |
| Path | intake, brief, concept, script, client-script-approval, storyboard, clips, voice-music, qa-clips, assemble, captions-motion, finish, client-final-approval, delivery |
| Pending gate | client-script-approval (client), showing script v1 |
| Decision maker | Neha (owner) |
| Client languages | Hinglish, Hindi |
| revision_round so far | 0 |
| revision_cap | 2 |
| Earlier feedback | none |
| Approved decisions | brief (approved by admin): 20% off curtain and sofa cleaning till 25 Nov; one Hinglish reel |
| From | Neha |

## Client reply (pasted by the assignee)

```
Script theek hai. Bas offer 20% ki jagah 25% kar do, aur ek Marathi version bhi chahiye.
```

## Expected

Both are new work against the approved brief: change_order draft for admin approval; only the admin confirms.

- Items (by a phrase in the quote → accepted labels): "Script theek" → not_actionable; "25%" → change_request; "Marathi" → change_request
- Conflicts: none
- Route: brief (proposed)
- Over cap: false · Round change: 1
