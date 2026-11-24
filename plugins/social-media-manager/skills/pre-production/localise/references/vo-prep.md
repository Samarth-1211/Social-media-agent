# Voiceover prep

Turn each localised `vo_line` into a line a voice artist (or a TTS voice) can read right the first time. Two versions of every line:
- **`text`** for a person: with pause, emphasis and breath marks;
- **`tts_text`** for a voice engine: the same words, no marks, numbers spelled out, names in the spelling that makes the voice say them right.

## 1. Marks (in `text` only)

| Mark | Meaning | Use |
|---|---|---|
| `[pause 0.3s]` | A deliberate beat, 0.2–0.8 s | Before a price, a reveal, the CTA. Counted in the timing (`voiceover-pacing.md` §5). |
| `*word*` | Emphasis: lift and slow this word | 1–2 per line: the number, the benefit, the name of the thing. Never the brand on every line. |
| `/` | Breath point | One per line at most, at a natural phrase break, for lines over ~8 words |

Never mark with dashes, "…", CAPITALS or emoji: voices and TTS read them unpredictably.

## 2. Speed per line (`speed`)

- `normal`: most lines.
- `slow`: reveals, emotional lines, real-estate trust lines, and anything said by the owner or director on camera (match their real pace).
- `fast`: rare; only a playful aside in a youth-brand reel. Never the price or the CTA.

## 3. Line rules

- **One idea, one breath:** 10–15 words at most; under 10 for anyone who isn't a voice artist.
- **The line ends inside its scene,** with about 0.2 s to spare before the cut.
- **Numbers spelled out in `tts_text`** (`numbers-and-money.md` §2); the `text` may keep digits for the artist.
- **Names** follow `client.pronunciation` (`pronunciation.md`); add a `pronunciation_hints` entry for each tricky one.
- **Placeholders** (`{{needed: …}}`) stay in both versions until filled; a line with a placeholder is never sent to a voice.
- **Read it aloud.** If you stumble, rewrite, don't mark.

## 4. TTS notes (for the voice-music stage)

- Indian TTS voices take plain text, a language code (`hi-IN` for Hindi and Hinglish, `en-IN` for Indian English), a named voice and a model; one request carries a limited amount of text (one wrapper we read caps it at 2,500 characters), so send per line or per scene.
- Hindi voices read **Devanagari** most reliably. For a Hinglish job written in Roman, `tts_text` may need a Devanagari form if the chosen voice mispronounces Roman Hinglish: the voice-music stage tests one line and decides. `localise` writes Roman `tts_text` for Roman jobs and Devanagari `tts_text` for Devanagari jobs.
- Some APIs can turn numbers into words themselves ("spoken form"). Don't rely on it: our `tts_text` already has the words.
- Voice generation is a later stage (Group 3). This stage only prepares the text.

## 5. The file

`vo-script-v<n>.md` (`${CLAUDE_SKILL_DIR}/templates/vo-script.md`), in Drive `Jobs/<job_id>/localise/` or `outputs/localise/` in files mode. Its link goes in `vo_script.file` and the output's `files`.

## 6. Example (Hinglish)

| n | text | tts_text | speed |
|---|---|---|---|
| 5 | `Dono pe *bees percent* off, / *pachchees November* tak.` | `Dono pe bees percent off, pachchees November tak.` | normal |
| 6 | `Pickup *free*, [pause 0.2s] do sau ninyaanave se upar.` | `Pickup free, do sau ninyaanave se upar.` | normal |

## Credits

TTS input notes come from reading ankitjh4/indic-ai-skills `sarvam-ai` (MIT): how Indian voice APIs expect text. No code or text was copied.
