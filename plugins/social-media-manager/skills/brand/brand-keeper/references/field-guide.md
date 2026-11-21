# Field guide

What a good value looks like for each profile field, with examples for typical TDM clients: Indian small and medium businesses. All business names here are fictional. The shape of every field is in `${CLAUDE_PLUGIN_ROOT}/library/contracts/client.schema.json`.

## 1. Identity

| Field | Good | Weak |
|---|---|---|
| `name` | The name customers see: "Shubh Laundry & Dry Clean" | "shubh" |
| `client_id` | kebab-case, stable: `shubh-laundry` | `client1` |
| `client_code` | 3 capitals, unique: `SHL` | `S01`, `LAUNDRY` |
| `business_type` | What they sell and how: "laundry and dry cleaning, pickup and delivery" | "services" |
| `city` | City (and area in `audience.locations`): "Indore" | "MP" |
| `contact_person` | Name and role: "Neha (owner)" | a phone number |
| `decision_maker` | Who has the final say on creatives: `{name: "Neha", role: "owner"}`. If unknown, make it a **high** open question. | the person who messages most |
| `whatsapp` | E.164: `+91` + 10 digits. Private: never shown, logged, or put in examples. | "9876…" with spaces |

**Choosing `client_code`:**
1. Use the first letters of the main words: **SH**ubh **L**aundry → `SHL`; **N**armada **H**eights → `NRH` (skip filler words like "and", "the", "developers", "pvt").
2. If that's taken (check `list_clients`), try the first letter + the next two consonants, then the first two letters + the last word's first letter.
3. Avoid codes that read as words people may find odd.
4. Always show the code and get a yes before saving. It goes into every job ID (`SHL-01`) and can't change later without renaming jobs.

## 2. Audience

- `summary`: who buys, why, in one or two sentences. Name the situation, not just demographics.
  - Laundry: "Working couples and students in Vijay Nagar who don't have time to wash or iron."
  - Real estate: "Families upgrading from rented flats; NRIs buying for parents."
  - Clothing: "College girls and young working women looking for affordable party and festive wear."
  - Travel: "Families planning a yearly trip, and groups of friends booking weekend getaways from Bhopal."
- `age_range`: "20-40". A range, not "all ages".
- `locations`: areas and nearby towns they serve.
- `customer_words`: their **exact** phrases, often Hinglish. Example: "kapde time pe chahiye", "possession kab milega?", "same design mein dusra colour hai?", "package mein kya kya included hai?". Never invent these; leave the field empty and ask if you have none.

## 3. Voice and words

`tone_of_voice`:
- `summary`: one line. "Friendly neighbourhood helper, quick and reliable."
- `attributes`: 3–5, each with `means`, `doesnt_mean` and an `example` line. The `doesnt_mean` is what makes it usable.

| Business | Attribute | Means | Doesn't mean | Example |
|---|---|---|---|---|
| Laundry | Helpful | Solves a daily hassle in one line | Lecturing about fabric care | "Kapde humein do, weekend aapka." |
| Real estate | Assured | Specific facts: RERA number, possession date, carpet area | Pushy sales talk | "Possession Dec 2027. RERA registered." |
| Clothing | Trendy | Current styles, festive and party looks | Copying film dialogues or slang older buyers won't get | "Is Navratri, har raat naya look." |
| Travel | Warm | Talks like a family friend who's been there | Over-promising "paradise" clichés | "Manali mein bachchon ke saath? Hum plan kar dete hain." |

- `by_platform`: one note per platform where the tone shifts. "instagram: light, one joke at most"; "whatsapp-status: offer first, price visible".

`words`:
- `use`: terms they own or always say ("pickup-drop free", "ready-to-move").
- `never_use`: each with a reason ("cheap": owner wants value, not a cheap image; "guaranteed returns": legal risk for real estate).

## 4. Look

`visual_identity`:
- `colours`: name, hex and use. `{name: "Fresh blue", hex: "#1E88E5", use: "primary"}`. Hex values estimated from a logo or post are `guessed`.
- `fonts`: name and use, if known.
- `logo_ref`: a Drive link, or null (then a medium open question: "Send the logo file?").
- `style_notes`: one or two lines ("clean white backgrounds, real staff photos, no stock models").

`do` / `dont`: things that change a draft. "Show the pickup van" beats "be professional". Legal must-shows go here (real estate: RERA number on every creative).

`references`: `{ref, kind: liked | competitor | own-past-work | inspiration | avoid, note}`. The note says what to take from it.

## 5. Calendar, prices, rules

`festival_calendar`: suggest 4–6 entries that matter to the business type, marked `guessed` until confirmed. Dates move every year: write `date: null` and a note "confirm date for <year>", unless a person gives the date.

| Business | Suggest (priority) |
|---|---|
| Laundry / dry clean | Diwali (high: curtain and sofa cleaning), wedding season Nov–Feb (high: saree, sherwani), Holi (medium: colour stain removal), monsoon (low: quick dry) |
| Real estate | Navratri and Dussehra (high: booking offers), Dhanteras and Diwali (high: auspicious purchase), Akshaya Tritiya (high), Gudi Padwa (medium), New Year (low) |
| Clothing | Navratri (high), Diwali (high), wedding season (high), Raksha Bandhan (medium), Eid (medium, if relevant to their customers), end-of-season sale (medium) |
| Travel | Summer vacation Apr–Jun (high), Diwali holidays (high), Christmas–New Year (high), long weekends (medium), monsoon getaways (low) |
| Any | Store anniversary (ask), Independence Day and Republic Day (low: greeting posts) |

`price_points` (admin only): items and prices they're happy to show. Empty until the admin confirms; add a high open question if an offer job is likely.

`revision_cap` (admin only): default from config (2).

`languages`: from Hindi, English, Hinglish. Default from context (their captions, how the owner writes), marked `guessed` until said.

`platforms`: slugs such as `instagram`, `facebook`, `youtube`, `whatsapp-status`, `google-business`, `linkedin`.

`posting_frequency`: "3 reels + 2 posters per week".

## 6. Quick check before showing the summary

- Every filled field has a confidence mark and a basis.
- The decision maker is known, or there's a high open question.
- The voice has `doesnt_mean` for every attribute.
- No phone number appears outside `whatsapp`.
- Open questions: at most about 8, each with a recommendation.
