# On-screen text

Most people see the first seconds muted. The cards are a second script, read before anything is heard.

## 1. Rules

- **At most 6 words per card** (the schema rejects more). Most cards: 2–4 words.
- **The hook card is up from frame 1** (`in_sec` 0) and stays at least 1.5 s. It's the hook's `text` layer, unchanged unless the scene needs a shorter one.
- **At most 2 cards per scene,** and one at a time on screen where possible.
- **Hold time:** a card stays up at least max(1.0 s, words ÷ 3 + 0.5 s) (`${CLAUDE_PLUGIN_ROOT}/library/knowledge/voiceover-pacing.md` §7). The validator checks it.
- **Cards reinforce the voiceover; they don't transcribe it.** Put the noun, the number or the promise on the card; the sentence goes in the voice. Burned-in captions of the full voiceover are a separate layer (`localise` makes the SRT).
- **Every fact that matters is on a card:** the offer, the price with its condition ("Pickup free · ₹299 se upar"), the date, the CTA, the RERA number. A viewer with no sound must get the offer.
- **Same words on all three surfaces:** the topic word is said, shown and in the caption (a Reel about "sofa cleaning" says, shows and captions "sofa cleaning").
- **Conditions sit next to the claim.** "Free" never appears without its condition in the same card or the card right after.
- **Language:** the video's language. On the script stage Hindi and Hinglish cards are Roman; `localise` converts them. No dashes, no emoji on cards (a ✓ or ₹ symbol is fine).

## 2. Safe zone (9:16, 1080 × 1920)

| Keep clear | Why |
|---|---|
| Top ~230 px | Status bar, "Reels" / "Following" tabs |
| Bottom ~480 px (Reels, TikTok), bottom ~30 % (Shorts) | Caption, handle, audio ticker, ad CTA button |
| Right ~150–230 px | Like / comment / share rail |

`position` values: `top` (just under the top band; good for step numbers and labels), `center` (hook card, price card, end card), `lower-third` (above the caption band; good for conditions and names). Never put the hook card where the platform caption sits.

For 4:5 and 1:1 variants, the same cards fit inside the centre 4:5 area: design for that and the 9:16 master survives the crop.

## 3. Style notes for the edit (not the script's job, but say it when it matters)

- Bold sans-serif, white with a dark outline or a solid box; high contrast beats brand colours on a busy shot.
- One card style across the video.
- Prices and dates bigger than the words around them.
- Devanagari cards need more line height (`voiceover-pacing.md` §6); `localise` notes the font.

## 4. Examples

| Weak card | Strong card |
|---|---|
| "Shubh Laundry presents a special Diwali offer for you" (9 words, brand first) | "Curtain + sofa: 20% off" |
| "Best quality cleaning" | "Wash ke baad" (over the reveal) |
| "Free pickup*" (condition hidden) | "Pickup free · ₹299 se upar" |
| "Contact us now" | "WhatsApp karo" |
| "Luxury 2 & 3 BHK apartments available in prime location" | "RERA: P-JBP-21-1234" |
