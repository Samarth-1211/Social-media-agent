# Captions (SRT)

Burned-in captions of the voiceover, timed from the scene table, for viewers on mute. `localise` writes the SRT; the `captions-motion` stage styles and burns it in.

## 1. Build it from the scenes

1. One cue per scene with a voiceover line (a silent scene gets no cue). A long line may be **two cues inside the same scene**, split at a phrase break.
2. **Times come from the scene table:** a cue starts at its scene's `start_sec` (or at the split point) and ends at or before the scene's `end_sec`. A cue never crosses a scene cut.
3. **Text = the localised `vo_line`,** in the job's writing script, with numbers as digits (`20%`, `₹299`, `25 नवंबर`). No pause or emphasis marks.
4. Number the cues 1, 2, 3… with no gaps.

## 2. Limits (the validator checks them, check 13)

| Rule | Limit |
|---|---|
| Lines per cue | 1–2 |
| Characters per line | `config.caption_max_chars_per_line` (default 32), counted as Unicode code points |
| Cue length | 0.83–7 s |
| Reading speed | ≤ 17 characters per second (`voiceover-pacing.md` §7) |
| Overlap | None; cues in time order |

## 3. Line breaks

- Break at a **phrase boundary**: after a comma, before "aur / lekin / isliye", between subject and verb phrase. Never inside a name, a price, a number with its unit ("₹299 se upar" stays together) or a date.
- Keep the two lines roughly even; a one-word second line is a bad break.
- If a line still won't fit, shorten the caption wording (captions may be slightly shorter than the voiceover) but never change a fact.

## 4. Format

```
1
00:00:00,000 --> 00:00:03,200
Diwali se pehle curtain
aur sofa, 20% off.

2
00:00:03,200 --> 00:00:05,600
Mehmaan aane wale hain,
aur curtain?
```

- `HH:MM:SS,mmm --> HH:MM:SS,mmm`, a comma before the milliseconds, UTF-8 text, a blank line between cues.
- Save as `captions-v<n>.srt` in Drive `Jobs/<job_id>/localise/` (or `outputs/localise/`); the full text also goes in `captions_srt.srt`, the count in `cues`, the limit used in `max_chars_per_line`.

## 5. Devanagari notes (for `font_note`)

- Use a font with full Devanagari support and a matching Latin set, bold: e.g. Noto Sans Devanagari, Mukta, Hind. Check that matras and conjuncts (क्ष, त्र, ज्ञ, र्क) render, not as boxes or broken pieces.
- Allow about 1.3–1.5× the line height of Roman captions: vowel signs above and below get clipped in tight boxes.
- Roman brand names, ₹ amounts and RERA numbers inside a Devanagari line need the same font family's Latin glyphs, so the line looks like one piece.
- Note anything the edit must check, e.g. "Devanagari bold font with Latin; test 'फ़्लैट', 'क्ष' render; line height 1.4".
