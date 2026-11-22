# Producibility

Every concept lists its shots by source, a difficulty and a credit band. The goal: something the team can make this week, within the job's credit budget (video default 200), mostly with real footage.

## Shot sources

| Source | Use it for | Cost | Notes |
|---|---|---|---|
| `client-footage` | Anything that must be **real**: the shop, the process, a real result, a real customer, the site | 0 credits; needs the client's time | Ask early: list it in `needs_from_client`. |
| `phone-shoot` | Simple scenes the team or client can film on a phone: counter, van, hands, owner talking | 0 credits | One location per day is realistic. |
| `motion-graphics` | Price cards, offer cards, end cards, text, simple icons | 0 credits | Fast, brand-safe; good hooks for offers. |
| `stock` | Generic establishing shots only | 0 credits (licence) | Never as "our shop" or "our customer". |
| `ai` | Scenes that are expensive or impossible to film: an unbuilt flat's interior, a stylised festival moment, a mood shot | Credits | **Never** a real customer, a real result or the real place presented as real. A render of an unbuilt project is labelled "AI-generated" on screen. |

**Trust rule (psychology T1, T2):** the shots that carry the proof are real. AI decorates; it doesn't testify.

## Difficulty

| Level | Typical shape |
|---|---|
| **low** | One location, phone shoot or existing footage, motion-graphic cards, owner or staff on camera. Half a day. |
| **med** | Two or more locations, or a real customer who must agree, or 3–5 AI shots that must match each other. |
| **high** | Actors or many people, more than a day, permissions (public places, sites), or a recurring AI character that must stay consistent across shots. |

## Credit band

Until the production-plan stage prices shots per model, estimate by counting AI-generated shots (drafts at the cheapest tier, per the credit policy):

| Band | AI shots | Meaning |
|---|---|---|
| `none` | 0 | Real footage and motion graphics only. |
| `low` | 1–2 | A mood shot or a render. |
| `medium` | 3–5 | A short AI sequence. |
| `high` | 6+ | AI-led film; check the job budget with the admin before recommending it. |

Leave `credit_estimate` null unless `library/models/` gives real per-model costs. Never make up a credit number.

## Scoring producibility (0–5)

5 = low difficulty, band none/low, nothing needed from the client beyond one shoot · 4 = low/med, band low · 3 = med difficulty or band medium, or depends on one client action (a customer, access) · 2 = high difficulty or band high · 1 = needs several uncertain things (actors, permits, a customer, heavy AI) · 0 = can't be made within the budget or deadline.

## Shortcuts that keep quality high

- Shoot the **before** of a before/after before the work starts: tell the client in `needs_from_client`.
- One location, three angles, beats a montage of ten places.
- An offer card in the first frame is a hook that costs nothing.
- Owner's voice over real footage works when the owner is shy on camera.
