# Language and script choice

Decide the language and the writing script once per job, write down why (`choice_reason`), and keep it the same for the voiceover reference, cards, captions and the caption post.

## 1. Start from the brief

1. `brief.language` and `brief.writing_script` (`roman-hinglish`, `devanagari`, `english`) are the decision when present. They were set at the brief from the audience and the client's past posts.
2. `brief.downstream.localise` (`language`, `writing_script`, `keep_as_is`, `notes`) refines it.
3. `hooks.downstream.language` / `writing_script` should agree; if they don't, the brief wins and you note it.
4. Only when the brief has no `writing_script` (an old or placeholder brief) use the defaults below, and mark the choice `guessed` in `assumptions`.

## 2. Defaults by audience and channel

| Audience / channel | Language | Script |
|---|---|---|
| Instagram Reels, urban and Tier 2 viewers under ~40 | Hinglish | **Roman** (default) |
| Older viewers (45+), Tier 3, vernacular-first, mass WhatsApp broadcasts, Hindi-first platforms | Hindi (with the everyday English words) | **Devanagari** |
| Families 30–55 buying a big item (real estate, gold, schools) | Hindi or Hindi-leaning Hinglish | Devanagari for cards and captions; Roman for the editor's reference |
| Metro B2B, English-first brands, NRI audiences | English (with Indian context) | English |
| YouTube titles for a Hindi audience | Hindi | Devanagari for feeling, a Roman or English keyword for search |
| A mixed audience the brief can't split | The brief's language | Roman, plus a Devanagari variant if `config.localise_variant_languages` asks for one |

Mixed script in one line is normal on a phone, but in our captions and cards it must be **intentional**: brand names, ₹ amounts, registration numbers (RERA), hashtags and handles may stay Roman inside a Devanagari line. Ordinary words never switch script mid-line.

## 3. Writing the choice down

`choice_reason` is one line naming the source and the audience, e.g.:
- "Brief: Hinglish, roman-hinglish. Families 25–45 in Vijay Nagar on Instagram."
- "Brief: Hindi, devanagari. Buyers 30–55 in Jabalpur; the client's own posts are in Hindi."
- "Brief had no writing_script; guessed Roman Hinglish from the client's Instagram captions (assumption)."

## 4. Variants

`config.localise_variant_languages` (default `[]`) lists extra languages, e.g. `["English"]` alongside Hinglish for an NRI audience. Each variant:
- is a full localisation (scenes, voiceover script, SRT, caption post) with the same checks;
- picks its own script (English → `english`; Hindi → usually `devanagari`);
- never repeats the main language and script;
- shares the client review message with the main version (one message, the main language), with one line saying the other version exists.

## 5. Notes

- Indian voice APIs expect `hi-IN` for Hindi and Hinglish voices and `en-IN` for Indian English (`downstream.tts_language_code`). Hindi voices read Devanagari most reliably; a Hinglish voiceover can be in either script, and the TTS text follows the voice's needs (`vo-prep.md`).
- Translation services list a "code-mixed" or "modern colloquial" mode. That tells you natural mixed language is a recognised target, not a lesser one.

## Credits

The script-by-channel defaults are adapted from "hindi-english-content-writer" by Equipt (https://github.com/salah-xd/equipt), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: summarised, extended with our brief fields and audience rows, rewritten in our own words.
