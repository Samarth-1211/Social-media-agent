# Fact guard

**Real numbers or no numbers.** Every price, offer, claim, date, count and proof in the voiceover, the cards and the caption must trace to the brief, the client profile or research. Anything else is removed or turned into a visible placeholder. A script with a made-up number is worse than a script with a gap: the gap gets filled by the client, the number gets posted.

## 1. Where facts may come from

| Source | `fact_refs` value | May give |
|---|---|---|
| Brief `offer_detail` | `brief.offer_detail.text` / `.price` / `.validity` / `.conditions` | The offer, the exact price, the last date, every condition |
| Brief `cta_detail` | `brief.cta_detail` | The action and channel |
| Brief `proof_points[]` | `brief.proof_points[<i>]` | Facts the brief already cleared (with their source) |
| Brief `mandatories` | `brief.mandatories` | e.g. the RERA number, a logo line |
| Profile (confirmed fields) | `client.do`, `client.price_points`, `client.city`, … | Services, standing prices, places |
| Research `downstream.script.proof_points[]` | `research:<finding id>` | Market facts and customer truths with their confidence; **never** this client's own results |
| Hooks `implied_assets` / concept `levers[].proof` | `hooks.downstream.implied_assets[<i>]`, `hooks.downstream.concept.levers[<i>]` | What must be shown and its proof (often `{{needed}}`) |

Every scene with a fact lists it in `fact_refs`.

## 2. The check (per version)

For each spoken line, card and caption sentence:

1. **Is there a number, price, date, count, percentage, rating, time ("same-day", "2 din mein"), comparison or superlative?** Find its source in §1.
2. **Prices exactly as `offer_detail.price`**, with the unit and condition (`₹299 se upar`, `per kg`, `onwards`). No rounding, no "sirf ₹2xx", no struck-through "was" price unless the brief has it.
3. **Dates exactly as `offer_detail.validity`** (spoken naturally: "25 Nov tak"). No "aaj hi", "last day", countdowns or "limited stock" unless the brief says so.
4. **"Free" carries its condition** in the same card or the next one.
5. **Results** (before/after, "kapde naye jaise") only with real footage of a real job (`must_be_real`), and only typical results.
6. **People:** a customer on screen or quoted is real and consenting (`client-footage`). Never write words for a real customer to say as their own; give talking points. Never an AI person presented as a customer, staff member or the owner.
7. **Superlatives and guarantees** ("sabse best", "No.1", "100% guarantee", "germ-free") only with proof in the brief. Otherwise rewrite them as a specific true fact.
8. **Real estate:** the RERA number and the state RERA website on the end card when the project is registered (brief mandatory); possession date only as the client states it; carpet area, never super built-up presented as carpet; renders labelled "Artist's impression"; never returns, appreciation or "price will double".
9. **Profile `price_points`:** if the brief's price differs from the profile's, use the brief's and note `profile_match: differs` in `assumptions`.

## 3. What to do with an unsourced fact

| Case | `fact_flags[].action` | In the script |
|---|---|---|
| The idea works without the fact | `removed` | Rewrite the line around a true detail ("12 saal se" → "Vijay Nagar ki apni dukaan" if that's confirmed) |
| The idea needs the fact and the client can supply it | `placeholder` | `{{needed: number of flats handed over}}` in the line and the card |
| An asset the client must send (before/after clip, site archive) | `placeholder` | The scene stays; `unlock` says exactly what to send |

Always fill `unlock`: what evidence would let us use it ("client sends a phone clip of a real job, before and after"; "the director confirms the possession month in writing").

- `facts_ok: true` means every remaining fact traces to a source; placeholders are allowed and listed.
- **A `{{needed}}` token never reaches the client.** The editor sees it at the pick. `localise` keeps it out of the client message and asks for the missing fact or asset in one plain line instead ("Iske liye ek real sofa ka pehle-baad wala video chahiye"). A missing number is never guessed to make the message complete.
- After the humanizer pass, run this check again: rewrites drop and change facts more than anything else.

## 4. Examples

| Line | Problem | Fix |
|---|---|---|
| "5000+ khush customers" | No source | Removed → "Vijay Nagar mein ghar ghar pickup" (profile `do`) |
| "Sirf aaj, 50% off!" | Brief says 20% till 25 Nov | "20% off, 25 Nov tak" |
| "Free pickup" | Condition missing | "Pickup free, ₹299 se upar" |
| "Possession ready, aaj hi shift karo" | Not stated by the client | `{{needed: possession month as per RERA}}` |
| "Germ-free steam cleaning" | Health claim, no evidence | "Steam press" (a fact, not a claim) |

## Credits

"Real numbers or no numbers" adapted from "Instagram Reels Script Writer" by CreatorSkills (https://creatorskills.co), https://creatorskills.co/skills/instagram-reels-script-writer, licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: rewritten in our own words and extended with our brief, profile and research sources.
