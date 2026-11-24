# Script version (full view)

How one version is laid out when someone asks to see it in full ("A poora dikhao", "script dikhao"), and in the Drive file's readable copy. The record itself is `script.schema.json` → `versions[]`; this is its human view. Phone-readable: one block per scene.

```
<job_id> · Version <A> · <title>
<structure_type> · <duration_sec> s · <platform> · hook <hook_id> (<formula_id>)<, backup: reason>

1 · 0.0–3.2 · HOOK · <retention_device>
  👁  <shot>, <camera>: <subject> <action>. <setting>.
  🔤  "<card text>" <in–out s, position>
  🗣  "<vo_line>"
  🔊  <sfx> · 🎵 <music_cue>
  📦  <asset_hint><, REAL: must be filmed>   <facts: fact_refs, short>

2 · 3.2–5.6 · ESCALATION · open-loop
  …

Caption
  <first_line>
  <rest of full_text>
  Pinned: <pinned_comment or —>

CTA: <action> (<channel>) · said in <n> · shown in <n>
Payoff: scene <n>
Checks: timing ✓<notes> · facts ✓<placeholders: what is needed> · critique: <one line per note> · humanizer ✓ · limits ✓
Variants: <variant_notes, one line each>
```

## Rules

- Times to one decimal; scenes in order; every scene has all five `visual_action` parts.
- Voiceover lines exactly as recorded in the record (Roman letters for Hindi and Hinglish at this stage).
- Placeholders show as `{{needed: …}}`, in bold where the format allows, and are repeated under "Checks".
- No phone numbers anywhere.
