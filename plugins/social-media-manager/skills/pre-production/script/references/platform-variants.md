# Platform variants

The script is written once for the **master** (the brief's `aspect_ratio` and `duration_sec`, usually Instagram Reels 9:16). Each other deliverable in `brief.deliverables[]` gets one line in `versions[].variant_notes` saying what changes, so the edit stage can cut it without a new script. A deliverable with its own `changes_from_master` follows that.

## 1. Differences that change the script

| | Instagram / Facebook Reels | YouTube Shorts | Meta ad (Reels / Stories placement) | WhatsApp Status |
|---|---|---|---|---|
| Length | The brief's; 15–30 s for offers | 30–45 s holds best; under 15 s struggles | 15–20 s; the first 3 s carry the whole ad | ≤ 30 s per status; often split into two |
| Opening | Hook in 1.5 s, card from frame 1 | First line inside 1.5 s; no intro | Product or offer visible in the first 3 s; no logo sting first | Offer card first, price and number visible |
| Middle | One pattern change every 1.5–3 s | A turn around 5–8 s | Proof before the price | Fewer cuts, bigger text |
| End | One ask; a loop-back helps rewatches | Design the loop (last frame → first frame) | The ad's CTA button does the ask: the spoken CTA matches it ("WhatsApp karo" ↔ "Send WhatsApp message") | The ask is a card with the action ("WhatsApp karo"), not a link |
| Caption | ≤ 125 visible characters; 3–5 hashtags | Title ≈ 40 characters on the tile; tags in the description with `#Shorts` | Primary text ≈ 125, headline ≈ 40; no hashtags needed | None read |
| Safe zone | Bottom ~480 px, right ~150–230 px | Bottom ~30 % | Same as Reels; the CTA button covers the bottom | Top and bottom bars; centre the text |
| Aspect | 9:16 | 9:16 (16:9 with bars isn't a Short) | 9:16 master; 4:5 and 1:1 crops need the action and cards inside the centre 4:5 | 9:16 |

## 2. Rules

- **One master script.** Variants change length, order of the last beats, cards and caption; they never change the offer, the facts or the hook's promise.
- **Shorter variant (e.g. a 15 s ad from a 20 s reel):** keep the hook, the payoff and the CTA; cut an escalation scene. Name the scenes that go: "Meta 15 s: drop scene 2; scene 5 starts at 8.4 s".
- **Longer variant (e.g. a 60 s YouTube film from a 45 s reel):** add B-roll or one proof scene between the story and the CTA, as the brief's `changes_from_master` says.
- **Crops:** keep every card and face inside the centre 4:5 area of the 9:16 frame when a 4:5 or 1:1 variant exists.
- **Ads:** ad rules for the category still apply (real estate: RERA number on the end card in every variant).
- **Paid creators:** a creator or influencer version needs the "paid partnership" label (ASCI), noted in the variant.

## 3. Example `variant_notes`

- "Meta ad 15 s: drop scene 2 (escalation); the end card matches the 'Send WhatsApp message' button."
- "YouTube Shorts: loop-back (last frame = first curtain shot); title 'Curtain + sofa 20% off, Indore'."
- "YouTube 16:9, 60 s: add 15 s of site walkthrough B-roll between scenes 9 and 10; the RERA end card stays."
