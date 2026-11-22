# Chat summary (what the run returns)

The only thing a research run puts into the main chat. The subagent returns exactly this; the inline fallback shows exactly this. About 10 lines; the full sheet stays in storage. Write in the user's language.

```markdown
**Research {new | refreshed | partial | reused} for {client}** · {insight_id} v{version}
Top 3:
1. {strongest finding, one line} ({confidence})
2. …
3. …
Changed since last time: {one line, or "first sheet (baseline)"}
{Instagram read: done | queued (~{minutes} min, needs browser) | not needed}
{Competitors: added {n} as guessed ({handles}); strike any that are wrong.}
Not read: {short list, or "nothing skipped"} · Cost: {free | {amount} {currency}}
{Ran without subagent.}
```

After it, the subagent adds one machine-readable block for the skill (not shown to people when the skill relays the summary):

```json
{ "insight_id": "SHL-I202611-2", "version": 1, "research_status": "partial",
  "flags": ["browser_step_pending"], "task_id": "T-20261128-3",
  "cost": [{ "provider": "web", "amount": 0, "currency": "USD" }],
  "log": "research: refreshed sheet SHL-I202611-2 (unattended); Instagram read queued" }
```

Rules:
- Pick the top 3 by confidence and usefulness to the next stage (pain points and working angles first), never by how surprising they are.
- No raw data, no tables of reels or reviews, no commenter text beyond a short phrase.
- If nothing solid was found, say that plainly.
