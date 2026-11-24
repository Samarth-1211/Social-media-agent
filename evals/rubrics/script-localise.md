# Rubric: script + localise

The automated checks (runner, check 13) catch structure, timing, facts and format. This rubric is for what needs a person: does it hold attention, and does it sound like the city? Score each item 0–2 per run (0 = fails, 1 = acceptable, 2 = outstanding) with a one-line reason. **A run passes when no item is 0 and the average is at least 1.5**; L1 has its own pass mark.

## Script (S1–S6)

| Id | Item | 2 = outstanding | 0 = fails |
|---|---|---|---|
| R-S1 | **First 1.5 s on mute** | The first frame and card alone stop the thumb and say the offer or the stake | Logo, greeting or setup first; the card arrives late |
| R-S2 | **Two real options** | A and B differ in structure and in what they ask of the client (footage, people); the recommendation's reason is right | Two drafts of one idea |
| R-S3 | **Every second earns its place** | Each scene adds a fact, a step, a reveal or a stake; a pattern change every 1.5–3 s; the payoff lands early | A flat middle; repeated shots; dead air |
| R-S4 | **True and specific** | Real prices, dates, places; placeholders where facts are missing, each with an unlock | An invented number, review or deadline; a hidden condition |
| R-S5 | **Spoken, not written** | Every line sayable in one breath; Hinglish switches where people switch; no ad-speak | Brochure lines; tongue-twisters; "dosto" |
| R-S6 | **One clear CTA** | One ask, said and shown, low effort, the brief's channel | Two asks, bait, or a vague "contact us" |
| R-S7 | **Storyboard-ready** | An editor could shoot or source every scene without asking; real-only scenes marked; producible by this client | "Show happy customers"; drones and actors for a laundry |
| R-S8 | **Gate replies understood** (S6) | Each reply did exactly what the editor meant; edits re-checked; the one-line confirmation is right | A wrong version picked, an edit lost, or a refused reply recorded |

## Localise (L1–L7)

| Id | Item | 2 = outstanding | 0 = fails |
|---|---|---|---|
| R-L1 | **Sounds like the city** (native speaker, Tier 2) | Every line reads like the shop owner said it; no stiff, pure or literal line; one register | Any line a local would screenshot as AI |
| R-L2 | **Script correctness** (Devanagari) | Spelling, nukta, matras and loanword forms right; mixed script only where intended; the `script_check` status is honest | Wrong spellings marked verified; accidental Roman words |
| R-L3 | **Numbers said naturally** | Prices, dates and phone numbers spoken the way local customers say them; TTS text spelled out | "two hundred forty-nine rupees only"; digits in TTS text |
| R-L4 | **Fits the picture** | Every line in its scene; captions readable; cards still punchy at 6 words or fewer | Lines that need speeding up; cramped captions |
| R-L5 | **Meaning held** | Back-translation shows the same offer, price, CTA and feeling; any drift caught and fixed | Drift that reaches the client |
| R-L6 | **The 20-second test** | A busy shop owner understands the message in 20 seconds and knows how to approve | Jargon, a wall of text, or the offer missing |
| R-L7 | **Names right** | Every brand, person and place name has a reading; new ones proposed, confirmed ones used | A name the voice will mangle, with no hint |

**L1 pass mark:** a native Hinglish (or Hindi, for NRH-15) speaker scores each voiceover line and card 0–2. Pass = no 0, and an average of at least 1.6 across all lines.

## Client approval (A1)

| Id | Item | 2 = outstanding | 0 = fails |
|---|---|---|---|
| R-A1 | **Right route, right person** | OK recorded as approval; each change routed to the stage that owns it; offer changes go to the admin | A change applied without routing, or approved for the client |
| R-A2 | **Only what was asked changed** | The re-run touched only the routed items; the client sees a short "after changes" message | A fresh script, or untouched lines rewritten |

## Recording results

Write the results to `evals/results/<date>_<version>.md`, as earlier suites did:
- the runner's summary (pass/fail per check);
- the rubric scores per run with their one-line reasons;
- the L1 native-speaker sheet;
- every failure and what was fixed.
