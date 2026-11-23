# Bad: translated, stiff, "too pure" Hindi (annotated)

The SHL-01 offer reel (Shubh Laundry, Indore, 20 s), "localised" by translating an English draft into textbook Hindi. Every line is grammatical. None of it sounds like Indore. All the problems below are ones `localise` catches.

## The draft

| # | Voiceover | Card |
|---|---|---|
| 1 | "दीपावली से पूर्व अपने पर्दों एवं सोफ़े की स्वच्छता पर 20 प्रतिशत की छूट प्राप्त करें।" | "दीपावली विशेष प्रस्ताव — केवल आपके लिए" |
| 2 | "क्या आपके अतिथि आगमन हेतु तैयार हैं?" | "अतिथि आगमन" |
| 3 | "हमारे ग्राहक का सोफ़ा — स्वच्छता से पूर्व…" | "पूर्व" |
| 4 | "…और स्वच्छता के पश्चात।" | "पश्चात" |
| 5 | "यह प्रस्ताव 25 नवंबर तक मान्य है। शीघ्रता करें!" | "शीघ्रता करें!!" |
| 6 | "₹299 से अधिक के आदेश पर निःशुल्क संग्रहण सेवा।" | "निःशुल्क संग्रहण*" |
| 7 | "आज ही हमसे व्हाट्सऐप अथवा दूरभाष द्वारा संपर्क करें। हमारे पेज को फ़ॉलो करना न भूलें।" | "संपर्क करें" |

Client message: "आदरणीय ग्राहक, आपका हमारी सेवा में स्वागत है। कृपया संलग्न स्क्रिप्ट (संस्करण 2, दृश्य 1–7) की समीक्षा करें एवं अपनी स्वीकृति प्रदान करें।"

## What's wrong

| Where | Problem | Rule |
|---|---|---|
| Whole | **Wrong language and script for the job:** the brief says Hinglish in Roman for 25–45 families on Instagram. This is formal Hindi in Devanagari for nobody in particular. | `language-choice.md` §1 |
| 1 | **Too pure:** पूर्व, एवं, स्वच्छता, प्राप्त करें, प्रतिशत. People say "Diwali se pehle curtain aur sofa, 20% off". | `ai-tells.md` §2.1; `transcreation-rules.md` §4 |
| 1 | **Over the pace:** 16 spoken words in 3.2 s (5.0 words/s; the Hindi max is 2.8) | LC1 |
| 1 | **The hook card changed:** "Curtain + sofa: 20% off" (the offer in frame 1, the client's own learning) became a slogan with no number | `transcreation-rules.md` §1 |
| 1, 3 | **Em dashes** in Hindi | `ai-tells.md` §2.8 |
| 2 | **Literal translation:** "अतिथि आगमन हेतु" ("for guests' arrival"). The open loop ("aur curtain?") is gone, so the scene no longer does its job. | `ai-tells.md` §2.2; `transcreation-rules.md` §1 |
| 3–4 | **Shuddh** पूर्व / पश्चात on the before/after cards; the reveal lost its everyday "pehle… baad mein" | `ai-tells.md` §2.1 |
| 5 | **Fake urgency added:** "शीघ्रता करें!!" isn't in the script | Back-translation drift; LC5 |
| 6 | **Meaning changed:** "on orders above ₹299" is narrower than the brief's "pickup free above ₹299", and संग्रहण ("collection") is a word nobody uses for pickup. The asterisk hides the condition. | Back-translation `offer_ok: false`; `numbers-and-money.md` |
| 7 | **Three asks:** WhatsApp, phone, follow. The brief has one: WhatsApp. "दूरभाष" is a government word. | LC6; `ai-tells.md` §1 D |
| 1–7 | **No spoken numbers:** "20 प्रतिशत" and "₹299" left for the voice to guess | LC3 |
| Message | **Jargon and a notice tone:** "आदरणीय ग्राहक", "संलग्न", "संस्करण 2, दृश्य 1–7", "स्वीकृति प्रदान करें". No greeting by name, no hook line, no offer, no OK ask. Neha would call to ask what this is. | `client-review.md` |
| Message | Calls the client "ग्राहक" (customer): she's the business owner | `client-review.md` §1 |

## Back-translation of the draft

"Before Deepavali, receive a 20 percent discount on the cleanliness of your curtains and sofa. Are your guests ready for arrival? Our customer's sofa, before cleanliness… and after cleanliness. This offer is valid till 25 November. Hurry! Free collection service on orders above ₹299. Contact us today by WhatsApp or telephone. Don't forget to follow our page."

Four failures: **meaning** (the open loop is gone), **offer** (the pickup condition narrowed), **price** wording (ok, but the condition changed), **CTA** (three asks). The localisation is rejected before any client message is built.

## The fix

Start again from the picked script's lines, in Roman Hinglish, changing only what sounds unnatural. That's the result in `good-hinglish-localisation.md`: one word changed (dhulne), every fact and every second kept.
