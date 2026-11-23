# Voiceover pacing

How fast people speak and read in our short videos, so every line fits its seconds. Shared by `script` (timing check), `localise` (length check, voiceover script, SRT), and later `voice-music` (calibration) and `captions-motion`.

Sections: 1 how to use · 2 spoken pace · 3 counting words · 4 fitting a line · 5 pauses · 6 Devanagari vs Roman · 7 on-screen text and captions · 8 calibration · 9 machine-readable defaults · 10 sources.

**Status of the numbers.** English figures come from voiceover industry guides and two of our skill sources (§10). **No published speaking rate for Hindi or Hinglish ad reads was found** (searched 2026-11-23), so those rows are **working defaults**, labelled as such, to be replaced by measured values (§8).

## 1. How to use

1. Count the **spoken** words of each line (§3).
2. Take the scene's seconds, minus any marked pauses (§5).
3. Words ÷ seconds must sit inside the language's comfortable range and never above its hard max (§2). `config.pace_overrides` replaces a default when it exists (§8).
4. Over the max → cut words, move a fact to an on-screen card, or give the scene more time from a scene that has room. Never speed up the read to fit.
5. Under the range is fine for a reveal or an emotional beat; a whole video under it feels slow, so tighten.

## 2. Spoken pace (words per second)

| Language and delivery | Default | Comfortable range | Hard max | Basis |
|---|---|---|---|---|
| English, ad or reel read | 2.5 | 2.2–2.8 | 3.0 | Sourced (§10): 65–80 words in a 30 s spot ≈ 2.2–2.7; 165 wpm ≈ 2.75 |
| Hinglish (Roman), reel read | 2.6 | 2.3–2.9 | 3.0 | **Working default.** Hinglish uses many short words (hai, ka, se, pe, ko) that take little time, so the word rate runs a little above English at the same speed. |
| Hindi, clear delivery for 35+ / Tier 3 | 2.3 | 2.0–2.6 | 2.8 | **Working default.** Slower, clearer reads for older and vernacular-first audiences. |

Adjustments:
- **Brand film, emotional or testimonial voice:** use the low end of the range (about −0.3).
- **Price card or offer read for young urban viewers:** may run at the hard max for one line, never above it.
- **Two voices in one video:** count each voice's lines in its own scenes; hand-offs cost about 0.2 s.
- **Real person on camera (owner, staff, customer):** people who aren't voice artists speak slower and stumble. Use the low end and keep lines under 10 words.

## 3. Counting words

Count words as they are **said**, not as they are written:

| Written | Spoken (Hinglish/Hindi) | Words |
|---|---|---|
| `20%` | bees percent | 2 |
| `₹299` | do sau ninyaanave (+ "rupaye" only if said) | 3 |
| `₹1,499` | ek hazaar chaar sau ninyaanave | 5 |
| `₹45 lakh` | paintaalis lakh | 2 |
| `25 Nov` | pachchees November | 2 |
| `98260 12345` | phone numbers: one word per digit group said (§ localise numbers-and-money) | 2–4 |
| `EMI`, `RERA`, `BHK` | one token each (people say them as one unit) | 1 |

- Punctuation, `·`, `+`, `...` and emoji are not words.
- English numbers count the English way (`299` = two hundred ninety-nine = 4).
- `scripts/lib/script-checks.mjs` (repo, dev only) counts this way for the validator and the evals.

## 4. Fitting a line

- **Max words in a scene** = (scene seconds − marked pauses) × pace, rounded down.
- **Hook:** the first spoken word starts within the first 0.5 s and the hook line ends by 3 s. A hook line that needs more than 3 s is two lines; keep the first.
- **One idea per line, 10–15 words at most,** and under 10 for a person who isn't a voice artist.
- **Leave 0.2–0.3 s of air** at the end of the video so the music can close.
- **Don't fill every second.** A 2–3 s silent reveal with a sound effect often holds better than another sentence.

## 5. Pauses

| Pause | Length | Counted how |
|---|---|---|
| Comma breath | 0.15–0.25 s | Inside the pace figure; don't subtract |
| Beat before a number, price or reveal | 0.2–0.4 s | Marked `[pause 0.3s]`; subtract |
| Before the CTA | 0.4–0.8 s | Marked; subtract |
| End of video | ≥ 0.3 s | Leave it unspoken |

Pauses are marked in the voiceover script as `[pause 0.3s]`. Never with a dash or "...", which TTS voices read unpredictably.

## 6. Devanagari vs Roman

- **Spoken time is the same.** Converting a line between scripts doesn't change how long it takes to say, so pace by spoken words, never by characters.
- **Character counts differ a little.** Devanagari usually needs about as many code points as the Roman spelling, sometimes fewer (conjuncts), sometimes more (vowel signs count separately). The SRT check counts code points, which is slightly stricter than what the eye sees.
- **Devanagari needs more height.** Vowel signs above and below the line need about 1.3–1.5× the line height of Roman text. Captions and cards keep the same 6-word and 2-line limits, with a bigger box. Use a font with full Devanagari support (e.g. Noto Sans Devanagari or Mukta, bold).
- **Readers are fastest in the script they read every day.** Roman Hinglish slows a Devanagari-first reader and the other way round, which is why the script is chosen by audience (`localise/references/language-choice.md`).

## 7. On-screen text and captions

- **Text card hold** ≥ max(1.0 s, words ÷ 3 + 0.5 s). Working default: about 3 words per second for a glance read on a phone. The hook card is up from frame 1 and stays at least 1.5 s.
- **Cards:** at most 6 words, and no more than 2 cards on screen at once.
- **SRT captions:** 2 lines at most, `config.caption_max_chars_per_line` characters per line (default 32). Each cue lasts 0.83–7 s and stays inside its scene.
- **Reading speed:** at most 17 characters per second. That's a working default for social viewers who glance; Netflix allows 22 for Hindi and 20 for English adult subtitles.

## 8. Calibration

These defaults are a start. When `voice-music` is built:
1. For each generated or recorded voiceover, measure the real duration per line and compute words per second (spoken count, §3).
2. After about 5 lines from the same voice, write `config.pace_overrides["voice:<voice id>"] = { words_per_sec, measured_from, updated_at }`. After about 3 jobs in one language, also update that language's key.
3. `script` and `localise` use an override in place of the default when one exists. Keep the hard max from §2 as a ceiling unless the admin raises it.
4. Re-measure when the voice, model or speed setting changes.

## 9. Machine-readable defaults

The validator and the eval scripts read this block. Change it here and nowhere else.

```json pace-defaults
{
  "words_per_sec": {
    "English": { "default": 2.5, "min": 2.2, "max": 2.8, "hard_max": 3.0 },
    "Hinglish": { "default": 2.6, "min": 2.3, "max": 2.9, "hard_max": 3.0 },
    "Hindi": { "default": 2.3, "min": 2.0, "max": 2.6, "hard_max": 2.8 }
  },
  "hook_line_end_sec": 3.0,
  "scene_max_sec": { "static": 4.0, "moving": 5.0 },
  "card_min_sec": 1.0,
  "card_words_per_sec": 3,
  "card_lead_sec": 0.5,
  "srt": { "max_lines": 2, "min_cue_sec": 0.83, "max_cue_sec": 7.0, "max_chars_per_sec": 17 }
}
```

## 10. Sources

- Voiceover industry guides on spoken word counts for 30-second spots: Voice Bros, "How to Write a Commercial Voice Over Script" (≈ 2.3 words/s, 65–75 words); Killerspots, "Radio script timer" (≈ 2.5 words/s, 75–85 words); Voice123 (≈ 65 / 75 / 85 words slow / normal / fast). Read via search summaries, 2026-11-23.
- Westwood One on audio-ad copy density: dense copy (195 wpm) did worse than light copy (147 wpm). Supports staying inside the range rather than at the max.
- Jakeschincariol/instagram-agent-skill `ig-reel/beats.py` (MIT): 165 words per minute default, 150–200 range; flags a hook past 3 s and a beat over 4 s.
- calebvbi/creator-skills-samples `instagram-reels-script-writer` (CC BY 4.0): 15 s ≈ 30–40 words, 30 s ≈ 75–100, 60 s ≈ 150–180.
- Netflix Partner Help Center, Hindi Timed Text Style Guide (22 characters per second for adult programs) and Timed Text Style Guide: General Requirements (each event 5/6 s to 7 s).
- Hindi speaking rate: searched for published syllable or word rates for Hindi read speech; none found with figures (e.g. Ranjan, Rajkumar and Agarwal 2022 model word durations in Hindi read speech but report no headline rate). Hence the working defaults.

## Credits

Spoken word counts adapted from "Instagram Reels Script Writer" by CreatorSkills (https://creatorskills.co), https://creatorskills.co/skills/instagram-reels-script-writer, licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: summarised and combined with other sources in our own words.
