# Bad: a vague brief (annotated)

What a careless draft for the winter blanket job could look like, and why the self-check stops it. Fictional.

```markdown
**SHL-03 · Winter reel** (brief v1)
Objective: Increase brand awareness and drive engagement this winter.          ← ①
Audience: Everyone in Indore, 18-65.                                           ← ②
Message: Best laundry in Indore! Premium quality, lowest prices, 100%          ← ③
         satisfaction guaranteed. Also try our new saree dry-clean.            ← ④
Offer: Blanket cleaning at just ₹199!! Limited time only.                      ← ⑤
CTA: Call / WhatsApp / DM / visit our website                                  ← ⑥
Format: Trendy viral reel, modern and premium feel, 30-60 sec.                 ← ⑦
Platforms: Instagram, YouTube, Facebook, WhatsApp                               ← ⑧
Deadline: ASAP
```

| # | Problem | Self-check line that fails | Fix |
|---|---|---|---|
| ① | "Awareness" and "engagement" with no measure; the owner wants orders | `editor-can-start` | `objective_label: leads`; success = WhatsApp enquiries in the week after posting |
| ② | Not an audience | `editor-can-start` | "Families in Vijay Nagar and Bhawarkua" (profile), 25–45 |
| ③ | "Best in Indore", "lowest prices", "100% guaranteed": no proof | `no-invented-claims` | Specific true facts: "Ghar se pickup, ₹299 se upar free" |
| ④ | Two messages | `editor-can-start` | One message; the saree idea goes to a later job |
| ⑤ | ₹199 is in no source (the client never said it, the profile has no blanket price); "Limited time" has no date | `offer-matches-profile`, `essentials-confirmed` | Ask the client (one WhatsApp message with a guess); `validity` as a date |
| ⑥ | Four channels | `essentials-confirmed` (no single channel) | One: "WhatsApp karo" (the profile's channel) |
| ⑦ | Adjectives, not direction; length "30–60" | `editor-can-start` | `creative_format: offer-card-motion`, 20 s, beat outline |
| ⑧ | YouTube isn't one of the client's platforms; no variant says what changes | `variants-consistent` | Instagram reel 20 s + WhatsApp status 15 s, with `changes_from_master` |
| — | "ASAP" isn't a date; no language, mandatories or avoid; nothing marked guessed; no research note | `essentials-confirmed`, `mandatories-present`, `language-consistent`, `research-angle-or-reason` | A deadline date; Hinglish / roman-hinglish; price on the first frame, captions on; "cheap" avoided; `research: skipped` with reason |

**Result:** 9 of 10 checks fail (only `pairs-agree` passes, because there's no detail to disagree with). `ready_for_production: false`. The brief must not go to the gate like this. The fixed version is the SHL-03 sample (`library/storage/tracker-page/sample-data.json`, via `scripts/build-sample-data.mjs`), and `good-interview-transcript.md` shows how it got there.
