# 05-multiple-voices: Sales head asks for a change, director approves

Covers: conflict. All names and businesses are fictional. Source of truth: `samples.json`.

## Job context (the current record)

| | |
|---|---|
| Job | NRH-01 · Narmada Heights · Navratri site-visit offer reel (video, full) |
| Path | intake, brief, concept, hooks, script, localise, client-script-approval, style-bible, casting, storyboard, production-plan, clips, voice-music, qa-clips, assemble, captions-motion, audio-mix, finish, resolve-export, client-final-approval, delivery |
| Pending gate | client-script-approval (client), showing script v1 and localised_script v1 |
| Decision maker | Mr. Agrawal (director) |
| Client languages | Hindi, English |
| revision_round so far | 0 |
| revision_cap | 2 |
| Earlier feedback | none |
| Approved decisions | brief: Navratri site-visit offer, "starting at" pricing only, RERA number on every creative |
| From | Mr. Tiwari (sales head) and Mr. Agrawal (director), forwarded together |

## Client reply (pasted by the assignee)

```
Mr. Tiwari: Script mein "limited flats left" wali line daal do, urgency chahiye.
Mr. Agrawal: Script mere taraf se approved hai.
```

## Expected

Tiwari is not the decision maker: his item waits for Mr. Agrawal. Never pick a side. A contradiction flag as well is fine. Round change not scored strictly.

- Items (by a phrase in the quote → accepted labels): "limited flats" → in_scope / change_request / clarification; "approved hai" → not_actionable
- Conflicts: multiple_voices
- Route: nothing reopened / script (not_needed / proposed)
- Over cap: false · Round change: 0 or 1
