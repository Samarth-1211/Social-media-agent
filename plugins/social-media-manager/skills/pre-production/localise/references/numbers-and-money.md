# Numbers and money

Write numbers the way they're read on screen, and say them the way the audience says them. Every price, percentage, date and phone number in the voiceover gets an entry in `numbers_spoken` (`written`, `spoken`, `scene`, `kind`).

## 1. Written (cards, captions, SRT)

| Thing | Write | Never |
|---|---|---|
| Rupees | `₹299`, `₹1,499`, `₹45 लाख` / `₹45 lakh` | `Rs.299/-`, `INR 299`, `299 rupees only` |
| Indian grouping | `₹1,23,456` | `₹123,456` |
| Big amounts | lakh and crore words: `₹45 lakh`, `₹1.2 crore` | `₹4,500,000`, `₹4.5M` |
| Percent | `20%` | `20 percent` on a card |
| Dates | `25 Nov`, `25 नवंबर`, `25/11` | `11/25`, `Nov 25th` |
| Time | `subah 10 baje`, `10 AM`, `शाम 6 बजे` | `10:00 hrs` |
| Phone numbers | Only if the brief puts one on screen; grouped `98260 12345` | In the voiceover, unless the brief asks |
| Area | carpet area in sq ft as the client states it | super built-up shown as carpet |

Digits stay digits in Devanagari text (`20% ऑफ़`) unless the client's own posts use Devanagari digits.

## 2. Spoken (voiceover script, TTS text)

- **Spell every number out in the TTS text**, so a voice can't misread it: `₹299` → "do sau ninyaanave", `25 Nov` → "pachchees November". The human-readable `text` may keep digits; `tts_text` never does.
- **Hindi words for Hindi and Hinglish audiences** by default; English words ("twenty percent") only where the client's customers say it that way (metro, English-first brand, or the client's own past videos).
- **Shop style for prices from 1,100 to 9,999:** people say "chaudah sau ninyaanave" more often than "ek hazaar chaar sau ninyaanave". Use shop style unless the brand is formal. `transliterate.py --number 1499` prints both.
- **"Rupaye"** only where it helps the rhythm ("sirf do sau ninyaanave rupaye mein"); usually the ₹ card carries it.
- **Percent:** "bees percent" (Hinglish), "बीस प्रतिशत" only for formal Hindi (rare in ads; "बीस परसेंट" is the everyday form).
- **Dates:** "pachchees November tak"; never "twenty-fifth of November" in Hinglish.
- **Phone numbers (only if the brief asks):** in groups of 5 + 5, digit by digit, in the digits people use for phone numbers. In Hinglish that's usually English digits: "nine eight two six zero, one two three four five". Tier 3 Hindi uses Hindi digits ("nau aath do chhah shunya…").
- **Unit with the price:** "per kg", "per set", "se shuru" ("starting") said every time the card shows one.

## 3. Hindi numbers 1–100 (TTS and voiceover)

`transliterate.py` has the full table (`--number N`). The ones models and voices get wrong most often:

| N | Devanagari | Roman | N | Devanagari | Roman |
|---|---|---|---|---|---|
| 19 | उन्नीस | unnees | 59 | उनसठ | unsath |
| 25 | पच्चीस | pachchees | 69 | उनहत्तर | unhattar |
| 29 | उनतीस | untees | 75 | पचहत्तर | pachhattar |
| 39 | उनतालीस | untaalees | 79 | उन्यासी | unyaasi |
| 45 | पैंतालीस | paintaalees | 89 | नवासी | nawaasi |
| 49 | उनचास | unchaas | 99 | निन्यानवे | ninyaanave |

Prices that end in 9 (₹49, ₹99, ₹299, ₹499, ₹999, ₹1,499) are the norm in local offers: check every one with `--number`.

## 4. Checks

- Every `written` item matches `script.downstream.keep_as_is` and `offer_detail` exactly.
- Every number in a `vo_line` has a `numbers_spoken` entry, and the `tts_text` contains its spoken form.
- The spoken form is counted in the timing check (`voiceover-pacing.md` §3): "do sau ninyaanave" is 3 words.

## Credits

Indian grouping and date order adapted from i18n-agent/i18nstack `localize-hi` (MIT). Spoken-price conventions are our own.
