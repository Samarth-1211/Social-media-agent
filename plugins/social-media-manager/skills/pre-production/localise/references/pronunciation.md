# Pronunciation

Brand, product, people and place names said wrong in a voiceover make a local business sound like an outsider. Every name in the voiceover gets checked against the client's lexicon.

## 1. The client's lexicon

`client.pronunciation[]` (`term`, `say_as`, `devanagari`, `confirmed`, `note`, `source_job`), saved by `brand-keeper`.
- **Confirmed entries** are rules: use `say_as` in the pronunciation hints and `devanagari` in Devanagari text.
- **Unconfirmed entries** are used but repeated in `pronunciation_proposals` until someone confirms them.

## 2. When to propose a new entry

Add to `pronunciation_proposals` (`term`, `say_as`, `devanagari`, `reason`) when the voiceover or a card contains:
- the **brand name** and no confirmed entry exists;
- a **person's name** (owner, director, staff);
- a **place** a voice could misread: an area, a colony, a road (Napier Town, Vijay Nagar, Arera Colony, Bhawarkua);
- a **product or English word** a Hindi voice tends to mangle (WhatsApp, possession, RERA, curtain);
- an **acronym**: say whether it's spelled out (B-H-K) or read as a word (RERA = "rera").

Propose; don't decide. The client or admin confirms; `brand-keeper` saves (`confirmed: true`). Never write to the client record from this stage.

## 3. Writing `say_as`

- A **plain respelling** with the stressed syllable in capitals, plus a comparison when helpful: `shubh LAWN-dree (shubh as in "shubh din")`, `NAY-pee-er town`, `ag-ra-WAAL`.
- **No IPA** (editors and voice artists don't read it).
- For a Hindi voice, also give the Devanagari that makes the TTS say it right: `व्हाट्सऐप`, `रेरा`, `नर्मदा हाइट्स`.

## 4. In the voiceover script

- `vo_script.lines[].pronunciation_hints`: one short hint per tricky name in that line ("Narmada = NUR-ma-daa, not nar-MAA-da").
- In `tts_text`, write the name in the spelling that makes the chosen voice say it right (usually the Devanagari form for a Hindi voice), even if the card shows the Roman brand name.
- Never change how the brand is **written** on cards to fix how it's **said**; fix the TTS text instead.

## 5. Examples

| Term | say_as | Devanagari | Note |
|---|---|---|---|
| Shubh Laundry | shubh LAWN-dree | शुभ लॉन्ड्री | Owner's reading (confirmed) |
| WhatsApp | WHATS-app | व्हाट्सऐप | Not "vats-app" |
| RERA | RE-ra (one word) | रेरा | Not spelled out |
| Napier Town | NAY-pee-er town | नेपियर टाउन | Jabalpur area |
| Narmada Heights | NUR-ma-daa HIGHTS | नर्मदा हाइट्स | Proposal until the director confirms |
