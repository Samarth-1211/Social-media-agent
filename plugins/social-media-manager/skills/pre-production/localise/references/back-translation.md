# Back-translation check

Before anything goes to the client, translate the localised version back into plain English and compare it with the picked script. It catches the quiet changes: an offer that grew, a date that shifted, urgency that crept in, a CTA that turned into two.

## 1. How

1. **Translate each localised `vo_line`, card and the caption post back to plain English,** line by line, as literally as you can, without looking at the script's English meaning. Fresh eyes: what does this line actually say?
2. Put it in `back_translation.text` (short; one sentence per scene is enough).
3. **Compare** with `script.downstream` (scene by scene) and `keep_as_is`:

| Check | Field | Fails when |
|---|---|---|
| Meaning | `meaning_ok` | A scene now says something different, or loses its job (an open loop no longer opens, a reveal no longer reveals) |
| Offer | `offer_ok` | The offer's scope changed ("curtain and sofa" → "all cleaning") or a condition vanished |
| Price | `price_ok` | Any number, percentage, date or unit differs from `keep_as_is` / `offer_detail` |
| CTA | `cta_ok` | The ask changed channel, became two asks, or got pressure added |

4. **List every drift** in `drift[]` (`scene`, `issue`, `fixed`) and fix it in the localised version, then re-check that scene. Also list added urgency ("sirf aaj"), added claims ("best"), and lost conditions, even if the four booleans still pass.
5. All four `true` and every drift `fixed` → pass. Otherwise `self_check.passed` must be false (the validator checks this) and the client message waits.

## 2. Tools

- **Default: Claude.** Back-translate in the same session, line by line.
- **Optional: IndicTrans2** (AI4Bharat, MIT), only if it is already installed locally (e.g. the `indictrans2-indic-en-dist-200M` model with IndicTransToolkit). Use it for Devanagari jobs as a second opinion; set `by: indictrans2`. **Never install it for a job** and never make it a requirement.
- English jobs with no transcreation: `by: not-needed`, all four `true`, no drift.

## 3. Example drift

| Scene | Localised | Back-translated | Issue | Fix |
|---|---|---|---|---|
| 5 | "Sirf aaj se 25 Nov tak 20% off" | "Only from today till 25 Nov, 20% off" | "only from today" adds urgency the brief doesn't have | "Dono pe 20% off, 25 Nov tak" |
| 6 | "पिकअप बिल्कुल फ़्री" | "Pickup completely free" | The condition ₹299 vanished; "completely" adds a claim | "पिकअप फ़्री, ₹299 से ऊपर" |
| 12 | "आज ही कॉल करें या आइए" | "Call today or come" | Two asks, and a call channel the brief doesn't have | "सैंपल फ़्लैट देखने आइए" |
