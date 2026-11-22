# Layman glossary: plain words → brief fields

How people actually say things (Hinglish, Hindi, English, voice-note style), and which brief field each phrase fills. Match by meaning, not exact words; spelling varies ("chahiye / chaiye / chahie").

A value taken from a person's words is `confirmed` (basis: "<who> said '<phrase>'"). A value you **inferred** from a vague phrase (e.g. "chhota sa" → 15–20 s) is `guessed` until the gate.

## Goal (`objective_label`, `objective`)

| # | They say | Fill |
|---|---|---|
| 1 | "bas log call karein", "phone aana chahiye" | `objective_label: leads`, `cta_detail.channel: call` |
| 2 | "WhatsApp pe enquiry aaye", "msg karein log" | `leads`, `channel: whatsapp` |
| 3 | "shop pe aaye", "dukaan tak laana hai", "footfall chahiye" | `footfall`, `channel: visit` |
| 4 | "site visit karwana hai", "sample flat dikhana hai" | `footfall`, `channel: visit`, target "site / sample flat" |
| 5 | "order aaye", "bikna chahiye", "sale badhao" | `sales` |
| 6 | "log naam yaad rakhein", "brand bane", "pehchaan" | `awareness` |
| 7 | "followers badhao", "page grow karna hai" | `growth`, `channel: dm` or follow |
| 8 | "event mein log aayein", "opening pe bheed chahiye" | `event`; `job_kind: launch` if it's an opening |
| 9 | "booking chahiye", "flat book ho" | `leads` (real estate: a booking starts with an enquiry), `channel: call` or `whatsapp` |
| 10 | "DM karein", "inbox karein" | `channel: dm` |
| 11 | "website pe jaayein", "link pe click" | `channel: website` |
| 12 | "form bharein", "register karein" | `channel: form` |

## Offer (`offer_detail`, `job_kind`)

| # | They say | Fill |
|---|---|---|
| 13 | "20% off", "bees percent chhoot" | `offer_detail.text` with 20% off, `profile_match: no-price`, `job_kind: offer-reel` |
| 14 | "₹249 mein", "249 rs", "ढाई सौ उनचास" | `offer_detail.price: 249` (compare with `price_points`) |
| 15 | "starting 35 lakh", "35 lakh se shuru" | `price: 3500000`, `unit: onwards` |
| 16 | "free pickup", "ghar se le jayenge" | an offer condition or a proof point (profile `do`); **"free" must have no hidden cost** |
| 17 | "is mahine tak", "month end tak" | `validity`: the last day of the current month (sheet clock) |
| 18 | "Diwali tak", "Navratri tak" | `validity`: the festival date from the calendar; if the calendar has no date → **ask** |
| 19 | "jab tak stock hai" | no date: `validity: null`, condition "while stock lasts" (only if true) |
| 20 | "scheme", "dhamaka offer", "special rate" | an offer exists, details unknown → **blocking**: ask what exactly |
| 21 | "koi offer nahi, bas brand video" | `offer_detail: null`, `job_kind: brand-film` |
| 22 | "naya rate", "rate badha hai" | price `differs` from the profile → confirm, and suggest updating the profile via `brand-keeper` |

## Timing (`occasion`, `posting_date`, `deadline`)

| # | They say | Fill |
|---|---|---|
| 23 | "Diwali ke liye", "Diwali special" | `occasion: Diwali`; `posting_date` 5–10 days before; festival hook |
| 24 | "shaadi season", "wedding season" | `occasion: Wedding season` (profile calendar) |
| 25 | "sardi aa rahi hai", "winter" | `occasion: Winter` |
| 26 | "kal tak chahiye", "aaj hi", "jaldi", "urgent", "abhi chahiye" | **express mode**; `deadline` = that date |
| 27 | "agle hafte", "next week" | `deadline`: Friday of next week (`guessed`, confirm back) |
| 28 | "jab ho jaaye", "koi jaldi nahi" | `deadline: null` and note it |
| 29 | "Sunday ko daalna hai" | `posting_date`: the coming Sunday |

## Length and format (`duration_sec`, `deliverables`, `creative_format`)

| # | They say | Fill |
|---|---|---|
| 30 | "chhota sa", "short", "jaldi khatam" | `duration_sec: 15`–`20` (`guessed`) |
| 31 | "thoda detail mein", "poori jaankari" | `duration_sec: 45`–`60`; `creative_format: explainer` or `walkthrough` |
| 32 | "reel", "Insta pe" | `instagram` / `reel` / `9:16` |
| 33 | "status pe lagana hai", "WhatsApp status" | `whatsapp-status` / `story` / `9:16`, about 15–30 s |
| 34 | "YouTube pe", "Shorts" | `youtube` / `short` / `9:16` |
| 35 | "photo/post chahiye", "poster" | `type: poster`; `feed-post` / `4:5` (or `9:16` for status) |
| 36 | "ad chalana hai", "boost karna hai" | add a Meta ad variant (`platform-variants.md`) |
| 37 | "owner khud bolenge", "Sharma ji bolenge" | `creative_format: talking-head`; `shot_sourcing.person_on_camera: true` |
| 38 | "chehra nahi dikhana", "bina kisi ke" | `offer-card-motion` or `demo-process`; `person_on_camera: false` |
| 39 | "pehle aur baad mein dikhao" | `before-after` (real photos only: `proof-and-claims.md`) |
| 40 | "flat ka tour", "site dikhao" | `walkthrough` |
| 41 | "jaise pichli baar", "same as last time", "wahi wala style" | copy format, length, CTA and style from the last client-approved job (`inference-rules.md` §5) |
| 42 | "jaise <competitor> ka hai" | ask which one thing they liked (pace, look, humour). Never copy a competitor. |

## Voice and rules (`language`, `writing_script`, `tone`, `mandatories`, `avoid`)

| # | They say | Fill |
|---|---|---|
| 43 | "Hindi mein", "hindi wala" | `language: Hindi`; script from how they wrote it, else the profile |
| 44 | "English mein", "angrezi" | `language: English`, `writing_script: english` |
| 45 | "mix", "jaise hum bolte hain" | `language: Hinglish`, `writing_script: roman-hinglish` |
| 46 | "Hindi akshar mein", "devanagari" | `writing_script: devanagari` |
| 47 | "seedha seedha", "bina natak" | `tone`: simple and direct, no drama |
| 48 | "festive feel", "tyohaar wala" | `tone`: warm and festive; still honest, no fake urgency |
| 49 | "rate pehle dikhao", "price shuru mein" | `mandatories`: price on the first frame; `downstream.hooks.first_frame: price` |
| 50 | "logo zaroor", "naam bada" | `mandatories`: logo end card / name on screen |
| 51 | "address daalna", "location batana" | `mandatories`: address or area (never a phone number in the brief) |
| 52 | "sasta mat bolna", "cheap nahi" | `avoid`: "the word cheap" |
| 53 | "competitor ka naam nahi" | `avoid`: "Named competitors" |

## Delegation and uncertainty

| They say | Do |
|---|---|
| "aap dekh lo", "jo theek lage", "whatever you think" | Use your guess. The field stays `guessed` (basis: "team left it to us"). |
| "pata nahi", "client se poochna padega" | Move the question to the client message |
| "shayad", "I think", "probably" | Use the value as `guessed`, not `confirmed` |
| "haan haan bilkul", "pakka" | `confirmed` |
