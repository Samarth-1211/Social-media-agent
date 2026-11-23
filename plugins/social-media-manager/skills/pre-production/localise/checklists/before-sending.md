# Before sending: localise self-check

Run before saving and before the client review message is shown. Record each line in `localised_script.data.self_check.items` (`id`, `ok`, `note`). `passed` only if all pass. Fix and re-check once; if a line still fails, save with it noted, say so, and don't show the client message until it passes.

| Id | Check | Pass when |
|---|---|---|
| LC1 | **Timing** | Every localised line fits its scene at the language's pace (`voiceover-pacing.md`, `config.pace_overrides`), spoken numbers counted; cards still ≤ 6 words and held long enough; scene numbers and times exactly as the picked script. |
| LC2 | **Script correct** | The output is in the chosen writing script, with no accidental mixed script. Devanagari was run through `transliterate.py`: `verified` (IndicXlit), or `unverified` with every flagged word checked by hand and listed in `flagged_words`. Nukta and matras are right. |
| LC3 | **Numbers spoken** | Every price, percentage, date and phone number in a voiceover line has a `numbers_spoken` entry; `tts_text` spells them out; written forms match `keep_as_is` exactly (`numbers-and-money.md`). |
| LC4 | **No AI tells** | `ai-tells.md` §2 run on every line, card, caption and the client message; no too-pure, literal or mixed-register lines; no dashes; the screenshot test passes. |
| LC5 | **Meaning unchanged** | Back-translation: meaning, offer, price and CTA all OK, every drift fixed (`back-translation.md`). |
| LC6 | **One CTA** | The brief's ask, once in the voiceover, once on a card, once in the caption; nothing added. |
| LC7 | **Client message simple** | 8–12 lines in the client's language; the hook line, 4–5 moments, the exact offer and CTA, the OK ask; no jargon, no placeholders, no phone numbers (`client-review.md`). |
| LC8 | **SRT valid** | Cues from the scene table, ≤ 2 lines of `caption_max_chars_per_line`, 0.83–7 s, ≤ 17 characters/s, no overlaps; `font_note` set for Devanagari (`captions-srt.md`). |

Variants (`config.localise_variant_languages`) run LC1–LC6 and LC8 too; LC7 covers the one shared client message.
