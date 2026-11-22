# Hook card

The readable form of one hook (`hooks.data.hooks[]`), used in the creative pick and on request ("2B poora dikhao").

```
<id> · <formula id> <formula name>                <weighted>/55 [<±adj>] [capped]
  👁  <visual: first 1.5 s>
  🗣  "<spoken line>"
  🔤  <on-screen text, ≤ 6 words>
  <tags: visual-led / proof / customer-phrase / timely>  ·  facts from: <source_refs>
  <boost_note, if any>  <critique_note, if any>
```

In the creative pick, show only the three layers and the score; the rest on request.

## Downstream (built at the pick)

What `hooks.data.downstream` holds once `pick.status` is `picked`. Script, localise and shot sourcing read only this.

| Field | Fill with |
|---|---|
| `concept` | From the picked concept card: `id`, `title`, `logline`, `insight`, `angle_type`, `format`, `story_spine` (beats with timings; the hook beat now holds the picked hook), `levers` (id, name, **proof**), `producibility` (difficulty, credit band, shots), `risks` (one line each), `mix_note` for a mixed pick. Quick track: from `reused_format` (`id: null`). |
| `hook` | The picked hook: `id`, `formula_id`, `layers` (with any edit the editor asked for). |
| `backup_hooks` | Two: the other top hooks of the picked concept (or the next two by score). |
| `script_notes.do` | Pay off the hook's promise before the halfway mark · the brief's must-say items (`downstream.script.must_say`) · the real offer, price and date exactly as given · one CTA (`cta_detail.action`) said once and shown once · the client's `do` items that apply. |
| `script_notes.dont` | The brief's `avoid` · the profile's `dont` and `never_use` · any trust anti-pattern this concept is near (e.g. "no countdown beyond the real date") · no new claims the hook didn't need. |
| `implied_assets` | Every shot or card the pick needs: real footage (`must_be_real: true`) for customers, results, the place and the process; motion-graphics cards (price, offer, end card); AI shots with "label as AI" in `note` when they show something not yet real. |
| `language`, `writing_script` | From the brief. |
| `learning` | `hook_formula_id` = the picked hook's formula, `angle_type` = the concept's, `outcome: untested`, `evidence: null`. Filled later by the learning loop. |
