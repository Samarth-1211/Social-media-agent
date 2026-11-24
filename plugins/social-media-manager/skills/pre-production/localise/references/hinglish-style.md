# Hinglish and Hindi style

How real people in Indore, Bhopal, Jabalpur or Lucknow talk, written down. Pair with `${CLAUDE_PLUGIN_ROOT}/library/knowledge/ai-tells.md` §2 (what to avoid) and `india-consumer-psychology.md` §8 (language).

## 1. What Hinglish is

The everyday mix: **feelings, verbs and grammar in Hindi; technical, business and product words in English; connectors from either.** A line can lean 70/30 either way, and the next one can flip.

- Hindi carries the emotion and the action: *pareshaan, tension mat lo, ho jayega, dekh lo, ekdum, bilkul.*
- English carries the thing: *pickup, delivery, sofa cleaning, offer, booking, flat, EMI, possession, fitting.*
- Connectors switch freely: *lekin / but, isliye / so, basically, matlab.*
- Family and community words stay Hindi: *ghar, maa, bhai, didi, mehmaan, mohalla.*

## 2. Switching points

Real speakers switch **at nouns and set phrases**, and keep Hindi grammar around them.

| Natural | Unnatural (model-made) |
|---|---|
| "Sofa cleaning karwao" | "Cleaning karwao of sofa" |
| "Pickup free hai, ₹299 se upar" | "Pickup is free hai above ₹299" |
| "Flat ka possession March se" | "Flat ka possession is from March" |
| "Fitting perfect chahiye? Yahin hoti hai." | "Perfect fitting chahiye toh we do it here." |

Rules:
- An English **noun or noun phrase** inside a Hindi sentence: fine. An English **verb phrase with Hindi grammar around it** ("clean karna hoga very easy"): not fine.
- Don't switch mid-phrase. "Bahut easy hai" is fine; "bahut very easy" isn't.
- English verbs take Hindi helpers: *book karo, check karo, visit kijiye, order karein.*

## 3. Register: aap, tum, the neutral imperative

| Audience | Use | Examples |
|---|---|---|
| Strangers, ads to the public, older viewers, real estate, health | **aap** forms | aaiye, dekhiye, kijiye, book karein |
| Young urban audience, brands whose profile voice is casual | the **neutral imperative** (no pronoun) | WhatsApp karo, dekh lo, pehen ke dekho |
| A friend-to-friend POV reel the brand already does | tum, sparingly | "tum bhi try karo" |
| Never in client creatives | tu | — |

- **One register per line, and usually per video.** Mixing aap and tum in a line is an AI tell.
- The client's `tone_of_voice` and past approved scripts decide between aap and the neutral imperative; Tier 3 and 45+ always get aap.
- Respect markers people actually use: *ji* (Neha ji, Agrawal ji), *sir* in real estate. Never "respected customer".

## 4. Grammar checks (Hindi and Hinglish alike)

- **Gender agreement:** adjectives ending in -a/-i/-e and verbs follow the noun's gender and number: *naya offer, nayi saree, naye curtains; offer aa gaya, sale shuru ho gayi.*
- **Loanword gender** is how people say it, not a rule book: say the phrase aloud ("booking khul gayi", "flat ready hai", "possession mil gaya"). If you're unsure, write a sentence that avoids the agreement, or flag it for a native check. Never guess silently.
- **ne sentences agree with the object:** *maine saree dry clean karwayi* (saree, feminine); *humne flat banaya* (flat, masculine).
- **ka / ke / ki agree with the thing owned:** *ghar ka darwaza, ghar ki chaabi, ghar ke parde.*
- **Oblique before postpositions:** *camera → camere pe*, *kamra → kamre mein*, *sofa → sofe pe* (spoken; in captions "sofa pe" is also common and fine).
- **Plural:** Hinglish usually keeps the English noun singular-looking ("curtain dhulwao" for many curtains); don't force "curtains" with a Hindi verb unless people say it.

## 5. Devanagari writing

- **Nukta** on borrowed sounds: फ़्री, फ़्लैट, ज़रूर, ख़ुद, फ़िटिंग. Casual writers skip it, but for ads keep it consistent within one video.
- **English loanwords in Devanagari** as people spell them: ऑफ़र, पिकअप, डिलीवरी, बुकिंग, सैंपल फ़्लैट, पज़ेशन, व्हाट्सऐप. Use `ऑ` for the English "o" sound in *offer, office, column*.
- **Brand names:** the client's own Devanagari spelling (`client.pronunciation[].devanagari`) or the `--map` you pass to `transliterate.py`; otherwise keep the brand in Roman inside a Devanagari line, which is intentional mixed script.
- **Full stop:** danda (।) after Hindi sentences; `?` and `!` as usual; no em dashes; no "…" as a pause.
- **Numbers:** keep digits (20%, ₹299, 25 नवंबर); Devanagari digits (२०) only if the client uses them.

## 6. Converting scripts

- Convert with `${CLAUDE_SKILL_DIR}/scripts/transliterate.py` (Roman → Devanagari, or back), protecting `keep_as_is`, numbers, ₹, hashtags and placeholders (`--keep`, `--map`).
- **Transliterate, don't translate** while converting: the words stay the same words. Change wording in the transcreation step, before converting.
- Leave English words that should stay Roman (brand names, RERA, hashtags) protected; everything else in a Devanagari line becomes Devanagari.
- **Fallback mode** (no IndicXlit): the output is a draft. Check every flagged word yourself, carefully (spelling, nukta, matras), fix it, and mark `script_check: unverified` with the words you weren't sure of in `flagged_words`.

## Credits

- Grammar checks (gender agreement, ne constructions, ka/ke/ki, nukta) adapted from i18n-agent/i18nstack `localize-hi` (MIT, https://github.com/i18n-agent/i18nstack). Its UI-only rules (Devanagari only, always aap) are not used.
- "Transliterate without translating; keep the word order; leave English words as they are" is inspired by ECNU-ICALK/AutoSkill `hindi_to_hinglish_transliteration` (licence unclear; ideas only, our own words).
- What stays Hindi vs English is adapted from "hindi-english-content-writer" by Equipt (https://github.com/salah-xd/equipt), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: summarised and rewritten in our own words.
