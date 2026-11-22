# Objective → format and length

Pick `creative_format` and `duration_sec` from what the client wants people to do. The structure line goes into `downstream.script.structure` as a beat outline. The script stage writes the words; we only give the shape.

## 1. Goal → best formats

Some formats **reach new people**: someone talking, a story, an explainer. Others **convert people who already know the shop**: the offer, a demo, before-after. Match the format to the goal.

| `objective_label` | First choice | Also good | Length |
|---|---|---|---|
| `leads` (calls / WhatsApp) | `offer-card-motion` | `demo-process`, `ugc-testimonial` | 15–25 s |
| `footfall` (shop / site visit) | `walkthrough` (show the place) | `talking-head` (owner invites), `offer-card-motion` | 20–30 s |
| `sales` (orders) | `demo-process` | `before-after`, `offer-card-motion` | 15–30 s |
| `awareness` | `talking-head` / founder story | `explainer`, `festive-greeting` | 30–60 s |
| `growth` (followers) | `explainer` (useful tip) | `talking-head`, `ugc-testimonial` | 20–45 s |
| `event` | `talking-head` (invite) | `walkthrough` (venue), `offer-card-motion` (date + place) | 15–20 s |

Prefer the format the client can actually supply. No one willing to be on camera → no `talking-head`; no footage → `offer-card-motion` (works from stills and graphics). A past format that worked (learning `liked`) beats the table.

## 2. Format catalogue

| `creative_format` | What it is | Needs | Typical length | Watch out |
|---|---|---|---|---|
| `talking-head` | Owner, staff or founder speaks to camera; personal and trusted | A willing person, a quiet spot, phone video | 30–60 s | Flat delivery kills it. Captions always on. |
| `ugc-testimonial` | A real customer says what happened, in their own words | A **real** customer's consent and clip, or a quote the client confirms | 20–40 s | Never scripted fake customers. Talking points, not a script. |
| `demo-process` | Show the service being done: pickup → wash → fold → delivery | Footage of the process (or generated shots of a generic process, labelled) | 15–30 s | Show the real service, not an imagined one |
| `before-after` | Same item, before and after | **Real** before and after photos of the same item | 10–20 s | Results must be typical; no edited "after" |
| `offer-card-motion` | Faceless: bold offer card, simple motion, voice-over or music | Logo, price, offer text; stills optional | 15–20 s | Can't carry proof; keep one idea per beat |
| `walkthrough` | Walk through a flat, shop or site | Footage of the place (or approved renders, labelled "artist's impression") | 30–60 s | Real estate: renders must be labelled; carpet area and RERA rules apply |
| `festive-greeting` | Warm wishes in the brand's voice, light branding | Logo, festival visual | 10–15 s | No hard sell. If there is an offer, use `offer-reel` instead. |
| `explainer` | A useful tip or "how it works" ("saree dry-clean safe kyun hai") | A voice, simple visuals | 30–45 s | Must teach something real |
| `offer-poster` | Poster: offer and price first | Price, offer, logo | n/a | One offer per poster |
| `info-poster` | Poster: news, timings, a new service | Facts from the client | n/a | |
| `greeting-poster` | Festival greeting poster | Logo, festival visual | n/a | |

## 3. Beat outlines (→ `downstream.script.structure`)

Timings are for the master length; scale them for other lengths.

**15–20 s offer reel** (`offer-card-motion`, `demo-process`)
1. hook + offer, 0–3 s: the price or deal on screen in the first frame when a learning asks for it; no logo intro
2. problem or moment, 3–8 s
3. service or product shown, 8–15 s
4. CTA end card, last 3–5 s: action, channel, logo, validity

**30 s walkthrough / launch**
1. hook, 0–3 s: the most striking view or fact
2. what it is, 3–10 s
3. 2–3 highlights, 10–24 s: real features only
4. CTA, 24–30 s: visit, call or WhatsApp; mandatories (e.g. RERA no.)

**45–60 s talking-head / brand film**
1. hook line, 0–5 s: a story opener, not "Namaste, main…"
2. story or problem, 5–25 s
3. how we solve it, 25–45 s
4. proof (a real fact) + soft CTA, 45–60 s

**UGC testimonial (talking points, not a script)**
- the customer's situation in their words; what changed; one specific detail; a soft CTA by the brand on the end card

**Festive greeting, 10–15 s**
- visual + wish, 0–8 s; brand sign-off, 8–15 s

## 4. Rules for every video

- **No logo or brand intro in the first 3 seconds.** The hook comes first.
- **Captions on.** Most people watch muted. Add "Captions on" to `mandatories`.
- **One message, one CTA, one channel.**
- **The CTA sits in the lower third,** not hidden by the platform's buttons (`platform-variants.md`).
- **Length bands are a default, not a rule.** The request or "jaise pichli baar" wins.
