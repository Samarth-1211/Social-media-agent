# Language rules for hooks

The brief decides `language` (Hindi / English / Hinglish) and `writing_script` (`roman-hinglish` / `devanagari` / `english`). Base rules are in `library/knowledge/india-consumer-psychology.md` §8; this file is the hook-level detail.

## Which script

| Situation | Spoken | On-screen text |
|---|---|---|
| Instagram, urban Tier 1–2, under 35 | Hinglish | Roman Hinglish |
| Tier 2/3 mainstream, mixed ages | Hindi-leaning Hinglish | Roman, or Devanagari if the brief says so |
| Older, Tier 3, vernacular-first, WhatsApp broadcast | Hindi | Devanagari |
| Metro B2B, English-first brand | English (Hindi moments allowed) | English |
| Another state's audience (Marathi, Tamil, Bengali…) | Written natively in that language by a native speaker; never translated from Hindi | Same |

Mixing scripts in one line ("₹299 से ऊपर pickup free") is fine on a phone. Keep it consistent within one reel.

## How natural Hinglish works

- **Feelings and everyday verbs in Hindi:** pareshaan, tension, dekh lo, ho jayega, bigad gaya, mast.
- **Technical, business and product words in English:** pickup, booking, offer, EMI, possession, facial, dry clean.
- **Connectors switch freely:** matlab, basically, seedha, sach bolun toh.
- **Numbers and prices as people say them:** "₹299 se upar", "25 Nov tak", "do din mein".
- **Short spoken lines.** If you stumble reading it aloud, rewrite.

## Never "too pure"

Textbook or government Hindi reads as AI or a notice board. Say what the shopkeeper would say.

| Too pure / translated ✗ | Natural ✓ |
|---|---|
| "Aapke vastron ki swachhata hamari pratibaddhata hai." | "Kapde ekdum saaf, yeh humari zimmedaari." |
| "Kripya hamari seva ka labh uthayein." | "Ek baar try karke dekho." |
| "Yeh sampatti nivesh ke liye uttam hai." | "Apna ghar, apne sheher mein." |
| "Kya aap thakaan mehsoos karte hain?" | "Office ke baad thake ho? Suno." |
| "Aaj hum aapko batane wale hain…" | Start at the point: "Saree ka dry clean safe hai?" |

## Cringe list (rewrite on sight)

- Openers: "Namaste dosto", "Hello friends", "Hey guys welcome back", TV-news intros.
- "5 amazing tips", "you won't believe", "shocking".
- "Yaar" or "bro" in every line, or when the brand isn't that voice.
- Emoji rain (1–2 on the text card at most).
- Borrowed slang with no Indian context ("lit", "fire", "slay").
- Forced rhymes and alliteration ("Saaf kapde, khush aap").
- Moral-lesson endings ("isliye hamesha…").
- Late or dead dance trends as the hook.

## Keep exactly as written

Brand names, prices, dates, area names, RERA and licence numbers, the brief's `cta_detail.action` and `downstream.localise.keep_as_is`.

## Customer phrases

Research `customer_phrases` and the profile's `customer_words` go in **verbatim**, typos and grammar included ("saree ka dry clean safe hai na?"). Never polish them; their realness is the point.

---

Credits: adapted from "hindi-english-content-writer" and "instagram-reels-script-writer" by Equipt (https://github.com/salah-xd/equipt), CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); rewritten in our own words, examples our own.
