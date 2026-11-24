# Script pick (the gate message)

One compact message for the assigned editor: both versions side by side, the recommendation, and how to reply. Phone-readable: no tables, short lines. Hinglish labels when the editor writes Hinglish.

```
🎬 <job_id> · Script pick: A or B   (<duration_sec> s · <language> · <platform>)
<fallback line only if any: "Brief placeholder tha: offer request se" / "Research nahi tha: proof brief aur profile se">

A · <title> · <structure_type> ⭐
  0–3   🗣 "<hook vo_line>"  🔤 <card>
  3–6   <one line per scene: what we see, short> · 🗣 "<vo>"
  …     (every scene, one line each)
  Payoff: scene <n> · CTA: <action>
  Caption: <first_line>
  ⚠ <placeholder or flag, one line each, only if any>

B · <title> · <structure_type>
  … same shape …

⭐ Recommended: A: <one-line reason>
<"Needed from client: …" only if a version needs an asset or a fact>

Reply: "A", "B", "A with scene 3 from B", "scene 4 line: …", "shorter by 5 sec", or "none, <what to change>".
Full scene table: "A poora dikhao".
```

## After client feedback (SKILL step 15)

Only the changed scenes, so the editor checks the client's changes, not the whole script again.

```
🎬 <job_id> · Script pick: client changes (<feedback_id>, round <n>)
Version <A> · <title> · <duration_sec> s

Scene 4  🗣 "<before>"  →  "<after>"
         Client: "<quote>"
Scene 6  🔤 <before>  →  <after>
         Client: "<quote>"
<"Not applied: <item>: needs a brief change (offer/CTA)" only if any>
<"⚠ <placeholder>" only if any>

Timing ✓ · facts ✓ · humanizer ✓
Reply: "ok" to approve, a line edit ("scene 4 line: …"), or what to change.
```

## Rules

- Every scene in one line: the visual in a few words, then the voiceover. The editor must be able to judge flow without opening the full table.
- Show placeholders (`{{needed}}`) and fact flags as ⚠ lines; never hide them.
- Show the hook id only if a version opens with a backup ("B opens with backup QC: problem first").
- `shown_outputs` for the gate: `{script: <v>}`.
- After the pick, reply in one line: "Picked A (scene 7 line changed, re-checked). Localise next." Never re-send the whole pick.
- The full view (`script-version.md`) only when asked.
