# Localised script (full view)

The human view of `localised_script.data` (`localised_script.schema.json`), shown when someone asks ("localised script dikhao") and saved as the readable copy next to the record in Drive. Phone-readable: one block per scene.

```
<job_id> · Localised · <language> (<writing_script>) · from script v<script_version>, version <script_pick>
Why: <choice_reason>
Script check: <verified (IndicXlit) | unverified (manual: check <flagged words>) | not needed>

1 · 0.0–3.2
  🔤  <card, localised>   <in–out s>
  🗣  <vo_line, localised>
      <vo_line_roman, Devanagari jobs only>
  ⏱  fits ✓<note>

2 · 3.2–5.6
  …

Caption post
  <first_line>
  <rest of full_text>
  Pinned: <pinned_comment or —>

Numbers said: <written → spoken, one per line>
Back-translation: meaning ✓ · offer ✓ · price ✓ · CTA ✓ <drift fixed: one line each>
Pronunciation to confirm: <term = say_as, one per line, or —>
Variants: <language (script), or none>
Files: vo-script-v<n>.md · captions-v<n>.srt · client-review-v<n>.txt
```

Rules: scene numbers and times exactly as the picked script; placeholders shown as `{{needed: …}}`; no phone numbers.
