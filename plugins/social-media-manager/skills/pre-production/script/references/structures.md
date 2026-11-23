# Structures

Every version uses one of seven structures (`structure_type`). The two versions **must use different structures**, so the editor chooses between two real options, not two drafts of one idea.

## 1. Pick the pair

1. **Version A = the structure the concept already implies** (§2 table, from `hooks.downstream.concept.format` or, on the quick track, `reused_format.format`).
2. **Version B = a different structure that tests a different way of holding attention.** Pick it from the "good second" column, and prefer one that:
   - needs fewer real assets, if A depends on footage the client may not have (say so in the pick message);
   - or puts the proof earlier, if A's payoff comes late.
3. Both open with the picked hook. A backup hook may open B when B's first beat needs a different first frame (e.g. a `problem-solution` version opens on the problem); record `hook_used.backup_reason`.
4. Never two versions of the same structure, even with different scenes.

## 2. Concept format → structures

| Concept / reused format | Version A | Good second | Avoid |
|---|---|---|---|
| `before-after`, brief `before-after` | before-after | demo-led, problem-solution | list-led |
| `process-reveal`, `demo`, brief `demo-process` | demo-led | before-after, pov | testimonial (needs a real customer) |
| `offer card` / brief `offer-card-motion` | problem-solution or before-after | demo-led, list-led | story-led (too slow for 15–20 s) |
| `customer-story`, `ugc-testimonial` | testimonial | story-led, before-after | list-led |
| `founder-story`, brief `talking-head` | story-led | pov, list-led | — |
| `pov`, `day-in-the-life` | pov | story-led, demo-led | — |
| `myth-vs-fact`, brief `explainer` | list-led | problem-solution | testimonial |
| `comparison` | problem-solution | list-led, before-after | — |
| `festival-story`, `local-pride` | story-led | pov, demo-led | list-led |
| brief `walkthrough` (real estate, shop) | demo-led (the walk) | story-led, pov | — |

## 3. The seven structures

Each outline gives the beat roles (`hook`, `escalation`, `proof`, `payoff`, `cta`) and rough timings for 20 s and 45–60 s. Scale in between. The payoff lands **before 60 % of the runtime**; the CTA takes the last 3–4 s.

### story-led
A person, a want, a turn, a result. Best for brand films, founder and festival stories.
- 20 s: hook (moment) 0–3 · stake 3–7 · turn 7–12 · payoff 12–16 · CTA 16–20.
- 45–60 s: hook 0–3 · who and what they want 3–10 · the obstacle 10–20 · the turn (the business's part) 20–32 · payoff 32–42 · proof line 42–50 · CTA.
- Watch: one character, one turn. No backstory before the conflict. The business is the helper, not the hero.

### demo-led
Show the thing being done, step by step, the result at the end of each step. Best for services, process reveals, walkthroughs.
- 20 s: hook (result or first step) 0–3 · step 1 3–7 · step 2 7–11 · result 11–15 · CTA 15–20.
- 45–60 s: up to 5 steps of 5–8 s, each with its own card ("1. Pickup"), the result before 60 %, then proof and CTA.
- Watch: each step must look different (frame, angle, place). A 4th identical counter shot is where people leave.

### list-led
"3 things", "2 mistakes", myth vs fact. Best for teach and myth angles.
- 20 s: hook (the list's promise) 0–3 · item 1 3–8 · item 2 8–13 · best item last 13–16 · CTA 16–20.
- 45–60 s: 3–4 items, 8–10 s each; the strongest item last but **teased in the hook**.
- Watch: never more than 4 items in under 60 s. Each item is a concrete action or fact, not an adjective.

### problem-solution
Name the pain in the viewer's words, agitate once, show the fix, prove it. Best for offers and comparison angles.
- 20 s: hook (the pain) 0–3 · it gets worse 3–6 · the fix 6–11 · proof 11–15 · CTA 15–20.
- 45–60 s: pain 0–5 · the usual (bad) way 5–15 · the fix 15–30 · proof 30–42 · offer + CTA.
- Watch: agitate once, never shame. The pain is the customer's real phrase where one exists.

### before-after
Same item or place, before and after; the gap does the persuading. Best for cleaning, salons, interiors, tailoring, renovation.
- 20 s: hook (the after, or the price card) 0–3 · before 3–8 · the reveal 8–11 · offer 11–16 · CTA 16–20.
- 45–60 s: add the how (2–3 steps) between before and after, and a second before/after if it's real.
- Watch: **real footage of the same item** (`must_be_real`), a typical result, never an edited "after". The reveal is the payoff; put it before the offer.

### testimonial
A real customer says what happened, in their own words. Best when the client has a consenting customer.
- 20 s: hook (their most specific line) 0–3 · their situation 3–8 · what changed 8–14 · the business shown 14–17 · CTA 17–20.
- 45–60 s: two customers, or one customer plus the process.
- Watch: talking points for the customer, never a script put in their mouth (fact guard). No real customer → don't use this structure; never an AI person presented as a customer.

### pov
"POV: you…" or a first-person camera through a moment. Best for relatable, day-in-the-life and festival angles.
- 20 s: hook (POV line + moment) 0–3 · the moment unfolds 3–10 · the twist/relief 10–15 · CTA 15–20.
- 45–60 s: three short moments in one day, each turning on the business.
- Watch: only label it "POV" if it really is one. The relatable moment must be specific to the city or audience ("mehmaan 6 baje aa rahe hain").

## 4. Length rules

- Under 15 s: one structure beat per 3 s; no list-led or story-led.
- 15–30 s (most reels and ads): any structure; 5–8 scenes.
- 45–60 s (brand films, walkthroughs): 10–16 scenes; add a mid-video re-hook around 40 % (`retention.md`).
- Every scene ≤ 4 s on a static shot, ≤ 5 s on a moving shot (the validator checks it). A longer beat is two scenes.
