# Good: Devanagari Hindi for families 30–55, fallback conversion (fictional)

**Job NRH-02**, Narmada Heights, Jabalpur: the editor picked version **A "Har mahine, ek hi jagah"** (demo-led, 45 s) from `script/examples/good-realestate-film-script.md`. Brief: **Hindi, `devanagari`**; buyers 30–55, many first-time owners moving from rented flats. Decision maker: **Mr. Agrawal (director)**, who texts in Hindi. Mandatories: RERA **P-JBP-21-1234** and `rera.mp.gov.in` on the end card. Still open: the possession month.

## 1. Choice

`choice_reason`: "Brief: Hindi, devanagari. Buyers 30–55 in Jabalpur; the client's own posts and WhatsApp are in Hindi."

## 2. Transcreate, then convert

Transcreation came first, in Roman, so the wording is decided before the script changes:

| # | Script (Roman) | Localised (Roman) | Why |
|---|---|---|---|
| 3 | "Har column, har mahine, camera pe." | "Har column, har mahine, camere par." | Oblique "camere" before a postposition; "par" for an older audience |
| 5 | "Aur yeh raha RERA number." | "Aur ye raha RERA number." | Spoken "ye" |
| 7 | "Ghar lene wale ka pehla sawaal hota hai…" | "Ghar lene walon ka pehla sawaal yahi hota hai." | Plural "walon" (all buyers); no "…" as a pause |
| 8 | "Ghar time pe milega?" | "Ghar time par milega?" | Kept "time": it's how buyers ask. "Samay par" would sound like a notice. |

Then `transliterate.py --to devanagari --map "Narmada Heights=नर्मदा हाइट्स" --map "Napier Town=नेपियर टाउन"`. This machine has no IndicXlit, so it ran in **fallback** mode and flagged two words:

```
# mode: fallback · script_check: unverified
# check these words: camere, Agrawal
```

| Flagged | Draft | Checked by hand |
|---|---|---|
| camere | कमेरे | **कैमरे** (ऐ for the English "a" in camera) |
| Agrawal | अग्रवल | **अग्रवाल** (long आ) |

Every other line was checked too (the lexicon covers it, but "unverified" means a person reads all of it). Result: `script_check: { status: unverified, tool: manual, flagged_words: ["कैमरे", "अग्रवाल"], note: "fallback draft, two words corrected by hand; native check welcome" }`.

## 3. The localised lines

| # | Time | 🔤 Card | 🗣 Voiceover |
|---|---|---|---|
| 1 | 0–3 | हर महीने, एक ही जगह | हर महीने, यही जगह शूट की। |
| 2 | 3–7 | {{needed: महीना 1}} → आज | देखिए कैसे बनी। पहले खेत था। |
| 3 | 7–11 | हर महीने की फ़ोटो | हर कॉलम, हर महीने, कैमरे पर। |
| 4 | 11–15 | आज | और आज, यही जगह ऐसी दिखती है। |
| 5 | 15–19 | RERA: P-JBP-21-1234 | और ये रहा RERA नंबर। |
| 6 | 19–23 | अग्रवाल जी, डायरेक्टर | मैं अग्रवाल, नर्मदा हाइट्स से। |
| 7 | 23–27 | पहला सवाल? | घर लेने वालों का पहला सवाल यही होता है। |
| 8 | 27–31 | घर टाइम पर मिलेगा? | "घर टाइम पर मिलेगा?" |
| 9 | 31–35 | पज़ेशन: {{needed}} | पज़ेशन {{needed: महीना, साल}}, जो RERA में दर्ज है। |
| 10 | 35–39 | सैंपल फ़्लैट, नेपियर टाउन | सैंपल फ़्लैट तैयार है, नेपियर टाउन में। |
| 11 | 39–42 | ख़ुद देखिए | आइए, ख़ुद देखिए। |
| 12 | 42–45 | सैंपल फ़्लैट देखने आइए / RERA: P-JBP-21-1234 · rera.mp.gov.in | सैंपल फ़्लैट देखने आइए। |

Mixed script is intentional only in the RERA number and the website. Every line was re-timed: scene 7 is 9 spoken words in 4 s (2.25 words/s, inside the Hindi range 2.0–2.6).

## 4. Voiceover prep (excerpt)

```
5 · 15–19 · slow
  और ये रहा *रेरा नंबर*। [pause 0.3s]
  TTS: और ये रहा रेरा नंबर।
  Hint: RERA = रेरा (one word, not R-E-R-A)
9 · 31–35 · slow · NOT READY: needs the possession month
```

Pronunciation proposals (for `brand-keeper`):
- **Narmada Heights** → "NUR-ma-daa HIGHTS" (नर्मदा हाइट्स)
- **Agrawal** → "ag-ra-WAAL" (अग्रवाल)
- **Napier Town** → "NAY-pee-er town" (नेपियर टाउन)
- **RERA** → "RE-ra" (रेरा)

## 5. Captions (excerpt) and font note

```
7
00:00:23,000 --> 00:00:27,000
घर लेने वालों का पहला
सवाल यही होता है।
```

`font_note`: "Devanagari bold with matching Latin (Noto Sans Devanagari or Mukta); line height 1.4; test 'फ़्लैट', 'पज़ेशन' and the RERA line in one font."

## 6. Back-translation

"Every month, we shot this same spot. See how it was built; first it was a field. Every column, every month, on camera. And today this place looks like this. And here is the RERA number. I'm Agrawal, from Narmada Heights. The first question of home buyers is this: will I get the house on time? Possession {{month, year}}, as registered in RERA. The sample flat is ready, in Napier Town. Come, see for yourself."

Drift found and fixed: the first draft of scene 10 said "सैंपल फ़्लैट अभी देखिए, सीमित समय" ("see the sample flat now, limited time"), which adds urgency the brief doesn't have. Changed to "सैंपल फ़्लैट तैयार है".

## 7. Client review message (Hindi, Devanagari)

```
नमस्ते अग्रवाल जी 🙏
नर्मदा हाइट्स की 45 सेकंड की फ़िल्म का स्क्रिप्ट तैयार है:

शुरू में: "हर महीने, यही जगह शूट की।"
1. साइट की एक ही जगह, हर महीने की फ़ोटो, खेत से आज तक
2. गेट पर RERA नंबर P-JBP-21-1234
3. आप बताएँगे: "घर टाइम पर मिलेगा?" और पज़ेशन की तारीख़
4. नेपियर टाउन का सैंपल फ़्लैट
5. आख़िर में: "सैंपल फ़्लैट देखने आइए"

हमें दो चीज़ें चाहिए: पज़ेशन का महीना और साल (RERA वाला), और पहले महीनों की साइट फ़ोटो।

OK लिख दीजिए, या बताइए क्या बदलना है।
```

## Why this is good

- **Hindi people speak at 30–55:** "घर टाइम पर मिलेगा?", "आइए, ख़ुद देखिए"; no "आशियाना", no "हस्तांतरण".
- **Honest about the tools:** the fallback flagged two words and both were wrong; the record says `unverified` and names them.
- **The facts survive the language change:** the RERA number, the website and the CTA are identical; the open possession month is asked for in plain words, never guessed.
- **The director's lines stay short and slow,** and his name is spelled right in both scripts.
