# Field guide

Every brief field: what it means, what good looks like, and what bad looks like. The contract is `${CLAUDE_PLUGIN_ROOT}/library/contracts/brief.schema.json`. Examples use two fictional clients: **Shubh Laundry** (Indore) and **Narmada Heights** (Jabalpur real estate).

Write every value so a video editor or designer could act on it without asking. If a value would make them ask "matlab?", it isn't done.

## Identity

| Field | Good | Bad |
|---|---|---|
| `job_id`, `client_id`, `type` | Copied from the job. Never typed by hand. | |
| `version` | +1 on every saved change; matches `job.outputs.brief.version`. | Edited without a `changelog` line. |
| `status` | `draft` while writing → `awaiting-team` / `awaiting-client` while a blocking question is out → `ready` once the self-check passes → `approved` at the gate. | `ready` with an open blocking question. |
| `changelog[]` | `{v2, "Price ₹349 → ₹299 per piece", reason "client reply 22 Nov", affected_stages: ["concept","script"]}` | "updated brief". |
| `job_kind` | `offer-reel`, `brand-film`, `launch`, `festival`, `poster` or `general`. It decides the essentials (`essentials.md`). A festival offer reel is `offer-reel`, with `occasion` set. | |

## Goal

| Field | Good | Bad |
|---|---|---|
| `objective` | Plain words, one sentence, with what people should do: "Get blanket-cleaning orders on WhatsApp before winter." | "Increase brand awareness." "Viral reel." |
| `objective_label` | One of `leads` (calls/WhatsApp), `footfall` (shop or site visits), `sales` (orders), `awareness` (remember the brand), `growth` (followers), `event` (attendance). | Two labels. Pick the one the client would count. |
| `success_measure` | What the client will actually look at: "WhatsApp enquiries in the week after posting", "site visits booked on Navratri weekend". Required whenever `objective_label` is set. | "Engagement." "Views" for a leads job. |

## Audience

| Field | Good | Bad |
|---|---|---|
| `audience_detail.who` | A person you can picture: "Families in Vijay Nagar and Bhawarkua", "First-time home buyers renting in Napier Town". | "Everyone 18-65." "Indore people." |
| `audience_detail.where` | Areas, not just the city, when the business is local: `["Vijay Nagar","Bhawarkua"]`. | |
| `audience_detail.age_band` | A band: "25-45". | |
| `audience_detail.language` | What they speak at home. May differ from the video language. | |
| `audience` | **Generated** from `audience_detail` ("Families in Vijay Nagar and Bhawarkua taking out woollens for winter"). Must contain `who`. | Edited on its own. |

## Message

| Field | Good | Bad |
|---|---|---|
| `key_message` | One sentence a viewer remembers after one watch, in the video's language: "Kambal aur razai ki dhulai, ghar se pickup." | Three ideas joined with "and". A tagline nobody would say. |
| `proof_points[]` | Each with a `source` and `ref`: `{ "Free pickup above ₹299", profile, "do" }`, `{ "RERA reg. P-JBP-21-1234", client, "msg 20 Nov" }`. | "Best quality." A number with no source. See `proof-and-claims.md`. |

## Offer

| Field | Good | Bad |
|---|---|---|
| `offer_detail.text` | What is offered: "Blanket and quilt cleaning". | "Amazing offer!!" |
| `offer_detail.price` / `unit` | The exact number: `299`, `"per piece"`. "Starting at" is `unit: "onwards"`. | "Affordable." A range the client never said. |
| `offer_detail.validity` | The last day as a date: `2026-11-30`. | "Limited time." |
| `offer_detail.conditions[]` | "Min 2 pieces", "Pickup within 5 km". | Hidden conditions that make "free" untrue. |
| `offer_detail.profile_match` | `matches` (same as a saved `price_points` entry), `differs` (flag it), `not-in-profile` (new price, client-confirmed or asked), `no-price` (percentage or free service). | Left `matches` without comparing. |
| `offer` | **Generated**: "Blanket and quilt cleaning ₹299 per piece, till 30 Nov". Shows the same price as `offer_detail`. | A different price from `offer_detail`. |

## Action

| Field | Good | Bad |
|---|---|---|
| `cta_detail.action` | In the video's language: "WhatsApp karo", "Site visit book karein". | "Contact us." |
| `cta_detail.channel` | `whatsapp`, `call`, `visit`, `dm`, `website`, `form`, `other`. One channel per video. | WhatsApp, call, DM and website all at once. |
| `cta_detail.target` | A label: "shop WhatsApp on the end card", "sample flat, Napier Town". **Never a phone number.** | A raw number. |
| `cta` | **Generated**: "WhatsApp karo, free pickup". Contains `action` and names the channel. | |

## Format

| Field | Good | Bad |
|---|---|---|
| `creative_format` | From `objective-to-format.md`: `offer-card-motion`, `walkthrough`… | "Something trendy." |
| `platforms[]` | Every platform in `deliverables`, listed once. | |
| `aspect_ratio`, `duration_sec` | Master values: `9:16`, `20`. | Missing for video. |
| `deliverables[]` | One per platform version: `{instagram, reel, 9:16, 20}`, `{whatsapp-status, story, 9:16, 15, changes_from_master: "15s cut: offer + CTA only"}`. See `platform-variants.md`. | "Reel + some stories." |

## Voice

| Field | Good | Bad |
|---|---|---|
| `language` | `Hinglish`, `Hindi` or `English`, from the profile or the person. | |
| `writing_script` | `roman-hinglish` (Hindi or Hinglish in Roman letters, which most Instagram audiences read), `devanagari`, or `english`. | Devanagari captions for a Roman-reading audience, unless asked. |
| `tone` | The profile's attributes in "X, not Y" form: "Friendly helper, not pushy; quick, not cheap." | "Fun and engaging." |

## Rules

| Field | Good | Bad |
|---|---|---|
| `mandatories` | Things the editor must show: "Price on the first frame", "RERA number on the end card", "Logo end card", "Captions on". | |
| `avoid` | From the profile's don'ts and words to avoid, plus job-specific ones: "Dirty-clothes close-ups", "the word cheap", "Promise of returns". | Empty when the profile has don'ts. |
| `references[]` | Links or Drive paths, each with a reason in `assumptions` if it isn't obvious. | |

## Timing

| Field | Good | Bad |
|---|---|---|
| `deadline` | The delivery date from the job. | |
| `posting_date` | When it goes live; for festivals, before the festival, e.g. Navratri day 1 minus 2 days. | After the festival. |
| `occasion` | "Diwali", "Winter", "Navratri", or null. | |

## Research link

Fill `research` from `research-input.md`. When there is no research output, write `{ status: "skipped", skip_reason: "research stage not built yet" }`. Every angle or pain point used carries its finding `id`.

## Suggestions (advisory)

| Field | Good |
|---|---|
| `style_preset` | A preset name, or null. The suggestion only; `style-bible` decides. |
| `track_suggestion` | `{ quick, "Repeat offer-reel format for this client" }`. The producer and admin decide. |

## Honesty

| Field | Good | Bad |
|---|---|---|
| `confidence` | Every field you filled: `{status, basis}`, e.g. `offer: {guessed, "blanket price not in profile price_points"}`. | Everything `confirmed`. |
| `assumptions[]` | One line per guess that shapes the work: "Duration 20s: default for offer reels." | Hidden guesses. |
| `open_questions[]` | What is still unknown, with who will answer: "Blanket price per piece (asked the client)." | |
| `client_questions[]` | Only what the client alone knows (`interview-rules.md` §Client mode). | Questions the team or the profile can answer. |

## Readiness and handoff

- `self_check[]` and `ready_for_production` come from this skill's `checklists/ready-for-production.md`.
- `downstream` gives each later stage only what it needs:

| Block | Fill with |
|---|---|
| `concept` | The chosen angle (with research id if any), `creative_format`, and constraints from `avoid` |
| `hooks` | Pain points and customer phrases (verbatim), a timely hook (festival, season), and what the first frame must show (e.g. the price, from a learning) |
| `script` | Duration, the beat outline from `objective-to-format.md`, the offer line and CTA line in the video's language, and the must-say items |
| `localise` | Language, `writing_script`, and what stays as is (brand name, price, RERA number, address) |
| `shot_sourcing` | Whether a person is on camera, locations, must-show items, and existing footage |

## What bad briefs look like

Push back (or fix and say so) when you see:
- **An audience of "everyone".** Pick the one customer type the client most wants and say why.
- **"Awareness" with no measure.** Ask what the owner will look at next week.
- **Adjectives instead of direction** ("modern, premium, viral"). Ask for one past post or competitor post they liked.
- **"Make it like [big brand]".** Ask which one thing to borrow: the pace, the humour, the look.
- **Three messages.** Keep the one the CTA supports; move the rest to `avoid` or a later job.

This skill's `examples/bad-vague-brief.md` shows these, annotated.
