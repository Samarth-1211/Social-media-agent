# What concept takes from the brief

The brief is `job.outputs.brief.data` (`library/contracts/brief.schema.json`, x-version 2). Read its `downstream.concept` part first, then the fields below. Facts come from the `*_detail` fields: `offer`, `cta` and `audience` are text generated from them (decision 0004).

## Fields and how they're used

| Brief field | Used for | Rule |
|---|---|---|
| `downstream.concept.angle` | One raw angle, always | Keep its research id if it has one. It doesn't have to win. |
| `downstream.concept.creative_format` / `creative_format` | Format of the recommended concept | Map with the table below. Other concepts may use another format; say "changes format" in `why_not_higher`. |
| `downstream.concept.constraints`, `avoid`, `mandatories` | Step 6 filter; story spine | `mandatories` (logo, address, RERA number…) get a beat, usually the end card. |
| `objective`, `objective_label` | Which angle types fit | leads/sales → proof, offer; awareness → story, opinion; footfall → offer, proof with the place; growth → teach, opinion. |
| `key_message` | The payoff beat | Every concept must land it. |
| `audience_detail` (`who`, `where`, `age_band`, `language`) | Insight; audience slice; area names | Use `where` for local references. |
| `offer_detail` (`text`, `price`, `unit`, `validity`, `conditions`) | Offer beats, L06/L09 proof | Only these numbers and this end date. No validity → no deadline language ("sirf aaj", "aaj hi"). A stock limit ("last 5 pieces") only with `{{needed: client confirms the count on the posting day}}`. |
| `cta_detail` (`action`, `channel`, `target`) | The CTA beat | One CTA, as written, **minus pressure words** ("warna miss", "jaldi karo", "abhi nahi toh kabhi nahi", "last chance" without a real date): keep the action and channel, say it plainly ("DM karo"), and note the change in `assumptions`. |
| `proof_points[]` (`text`, `source`, `ref`) | Lever proof | Cite `ref`. Nothing outside this list, the profile or research counts as proof. |
| `occasion`, `posting_date` | L09, festival formats | Tie to the occasion's real job (psychology T6). |
| `duration_sec`, `deliverables[]` | Story-spine timing | Beats add up to the master length. |
| `language`, `writing_script` | Every line written | Psychology §8. |
| `tone` | Voice of the concepts | Check against the profile's `tone_of_voice`. |
| `job_kind` | Methods allowed | `brand-film` → `creative-methods.md` may add 1–2 angles. |
| `downstream.shot_sourcing` (`person_on_camera`, `locations`, `must_show`, `existing_footage`) | Producibility | `person_on_camera: false` rules out owner-on-camera concepts unless flagged. |
| `research.angles_chosen`, `pain_points_used`, `customer_phrases_used` | What the brief already used | Don't re-pick blindly; go to research for more. |
| `confidence` (`guessed` fields), `assumptions`, `open_questions` | Risks | A concept that leans on a guessed field names it in `risks`. |

## Brief format → concept format

| Brief `creative_format` | Concept `format` options |
|---|---|
| `talking-head` | `pov`, `founder-story`, `myth-vs-fact` |
| `ugc-testimonial` | `ugc-testimonial`, `customer-story` (real customer only) |
| `demo-process` | `demo`, `process-reveal` |
| `before-after` | `before-after` |
| `offer-card-motion` | any format, with the offer card as the hook or end beat (often `before-after`, `demo`, `pov`) |
| `walkthrough` | `day-in-the-life`, `process-reveal`, `local-pride` |
| `festive-greeting` | `festival-story` |
| `explainer` | `myth-vs-fact`, `pov`, `comparison` |
| poster formats | not ours: concept runs for video only |

## Fallback when the brief is missing or a placeholder

Set `fallback_used.brief: true` and say so in the reply.
- From `request`: `raw_request` (the ask, any offer and date in the words given), `occasion`, `deliverables`, `deadline`, `references`.
- From the profile: `audience` (+ `customer_words`), `tone_of_voice`, `languages`, `do` / `dont`, `words.never_use`, `price_points`, `festival_calendar`, `learnings`.
- Defaults: language = the profile's first language; Roman script for Hinglish; length from the request or 20–30 s.
- Never invent the offer, a price or a date. If the request doesn't say, the concepts don't either.
