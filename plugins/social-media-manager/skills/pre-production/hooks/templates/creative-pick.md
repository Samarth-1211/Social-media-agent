# Creative pick (the gate message)

One compact message for the assigned editor. Phone-readable: no tables, short lines. In the person's language (Hinglish labels when they write Hinglish).

## Full track

```
🎬 <job_id> · Creative pick: concept + hook
<fallback line only if any: "Research nahi tha: angles brief aur profile se">

Insight: <core insight, one line>

C1 · <title>  <concept weighted>/50 ⭐
<logline>
  1A  🔤 <text>  ·  🗣 "<spoken>"  ·  👁 <visual, short>   <score>
  1B  …
  1C  …

C2 · <title>  <score>/50
<logline>
  2A … 2B … 2C …

C3 · <title>  <score>/50
<logline>
  3A … 3B … 3C …

⭐ Recommended: <concept><hook letter>: <one-line reason>
<"Needed from client: …" only if a concept needs it>

Reply: "2B", "1 with 3A", "mix 1 and 3", "more like 2A", or "none, <what to change>".
```

## Quick track

```
🎬 <job_id> · Hook pick (format: <reused format>, from <source>)

  QA  🔤 <text>  ·  🗣 "<spoken>"  ·  👁 <visual>   <score> ⭐
  QB  …
  QC  …

⭐ Recommended: QA: <reason>
Reply: "QA", "B", "more like QC", or what to change.
```

## Rules

- Top 3 hooks per concept only; never all 30.
- Show `boost_note` in a few words when a learning moved a hook ("Neha ko 'stop doing' pasand nahi: −3").
- If `creative_auto_pick_after_hours` is set, add one line: "No reply in <n> h → ⭐ pair auto-picked."
- After the pick, reply in one line: "Picked 2B (backups 2A, 2C). Script next." Never re-send the whole pick.
