# Proof and claims: never invent, always flag

A brief must not contain a price, number, result or claim that no source gave. When proof is missing, **still write the brief**: put a clearly marked placeholder where the fact goes and ask for it. Never invent the fact, and never quietly drop the idea.

This is practical guidance, not legal advice. For anything high-stakes (health, money, property), the admin should check with the client, and the client with their advisor.

## 1. What counts as proof

| Source (`proof_points[].source`) | OK for | Not OK for |
|---|---|---|
| `profile`: a confirmed profile field (do, price_points, references) | Prices, services, facts about the business | Guessed profile fields (they need confirming first) |
| `client`: the client said it in this job (message, call note), with date | Their own facts: years in business, number of customers, approvals they hold | Superlatives ("No.1", "best") without independent backing |
| `research`: an insight finding with its `id` | Angles, pain points, customer phrases; market facts with a source | Claims about **this** client's results |
| `past-job`: an approved past brief | Repeating a fact already approved | A price or date (those change) |

Write the reference: `{ "text": "12 saal se Vijay Nagar mein", "source": "client", "ref": "Neha ji, call 21 Nov" }`.

## 2. Red flags: block or flag

| Claim | Rule |
|---|---|
| "No.1", "best in Indore", "sabse accha", "India's top" | Only with independent proof (an award, a ranking with its source). Otherwise rewrite it as a specific true fact ("12 saal se aapke mohalle mein"). |
| "100% guarantee", "pakka result", "guaranteed" | Only if the client really offers a written guarantee; then state its terms in `offer_detail.conditions`. |
| "Sabse sasta", "lowest price in city" | Not without a current price comparison the client can show. Use the real price instead. |
| Invented numbers ("5000+ happy customers", "4.9★") | Only from the client (with date) or a visible source (e.g. their Google rating, checked). |
| "Only today", "last 2 left", a countdown | Only if true. Fake urgency or scarcity is never allowed. |
| "Free" | Free means free. Any condition ("above ₹299") goes on screen, next to the word. |
| "Up to 50% off" | Only if a real share of items is at 50%. Otherwise show the typical discount. |
| Struck-through "was" price (₹699 → ₹499) | Only if ₹699 was really charged recently |
| Before/after | Real photos of the same item; a typical result, not the best one ever |
| Testimonials | Real customer, real words, with consent. Talking points, never a script put in their mouth. |
| Comparison with a named competitor | Don't (and many profiles forbid it). Compare with "the usual way" instead. |
| Health, safety, medical ("germ-free", "allergy-safe") | Only with the client's evidence; otherwise rewrite it ("steam press" is a fact; "kills 99.9% germs" is a claim). |
| Paid creator or influencer | Mark it as paid ("#ad" / paid partnership label), following the ASCI influencer guidelines |

## 3. Real estate (Narmada Heights and similar)

- **RERA registration number.** Under the RERA Act (section 11), every advertisement for a registered project must show the project's RERA registration number and the state RERA authority's website. If the number isn't on file, it's a **blocking** essential (`essentials.md`). Some states add more, such as a QR code; check the state's current rules with the client.
- **No assured returns or appreciation.** "Price double in 3 years" or "guaranteed rental" are never allowed.
- **Area.** Quote carpet area where an area is shown; don't present super built-up area as if it were carpet area.
- **Possession date.** Only as the client states it (matching the RERA-registered date). Say "possession from <month year>", not "ready now", unless it is.
- **Renders.** Label them "Artist's impression". Show amenities only if they are approved and planned.
- **Bank approval or loans.** Only if the client confirms the approval and names the bank.
- **Prices.** "Starting ₹35 lakh" needs a real unit at that price. Say whether charges such as GST and registration are extra, if the client says so.

## 4. Prices and the profile

1. Compare every price with the profile's `price_points` (use the full profile if the brand brief shows only 3):
   - same item, same price → `profile_match: matches`, `confirmed`;
   - same item, different price → `differs`: use the job's price if a person said it, add an open question, and suggest updating the profile through `brand-keeper` (only the admin changes `price_points`);
   - item not in the profile → `not-in-profile`: needs the client's confirmation (a client question);
   - no price shown (percentage, free service) → `no-price`.
2. The generated `offer` text shows exactly `offer_detail.price` (validator check 12).

## 5. How to flag, in the brief

When a claim or number is wanted but not proven:
1. Keep the idea, with a placeholder: `[CLIENT TO CONFIRM: number of customers]`.
2. Add a client question if only the client can prove it, or an open question for the team.
3. Mark the self-check `no-invented-claims` as failed until it's answered. A placeholder left at the gate is shown to the admin.

**Redirect, don't just refuse.** If someone asks for an untrue claim ("likh do sabse sasta"), say in one line why not, and offer the honest version that still sells: "Sabse sasta claim prove nahi hoga. '₹89 per kg, free pickup ₹299 se upar' likhte hain — wahi bikta hai."

## 6. Self-check lines

- [ ] Every number and claim in the brief has a `proof_points` entry or comes from `offer_detail`.
- [ ] No red-flag phrase (§2) without the proof it needs.
- [ ] The price matches the profile or is flagged (`profile_match`).
- [ ] Real estate: the RERA number is in `mandatories`, or blocking.
- [ ] Placeholders are listed in `open_questions` or `client_questions`.
