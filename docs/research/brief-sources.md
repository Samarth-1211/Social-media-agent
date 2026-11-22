# Brief research: borrowed patterns

- **Read on:** 2026-11-22
- **Clones:** shallow clones in `../_research/`, outside the repo. `addyosmani/agent-skills` sits in `addyosmani-agent-skills/`, because `agent-skills/` already holds Apify's repo.
- **What we did with them:** adapted ideas into our own words. Nothing was copied or vendored. Each source is also recorded in `plugins/social-media-manager/ATTRIBUTION.md`.
- **Licences:** every repo we read is MIT. `archive-dot-com/creator-marketing-skills` states MIT in its README but ships no `LICENSE` file, so we treat it like the others: our own words, with credit.
- **How to read this:** each section lists what we borrow (→ the brief file it lands in), then what we leave out and why. The last sections cover missing or moved items, installed skills, and the contract changes this research feeds into M2.

| Source | Commit read | Licence | Use | Feeds |
|---|---|---|---|---|
| addyosmani/agent-skills, `interview-me` | `8c99fa36d90068c82d547f7c12a9d67a3e95f4ee` (2026-11-18) | MIT | ideas | `interview-rules.md` |
| mattpocock/skills, `grill-me` → `grilling` | `abeeaf95660ba9e8b7c753eb38f441ca707a8823` (2026-11-19) | MIT | ideas | `interview-rules.md`, `inference-rules.md` |
| coreyhaines31/marketingskills, `ad-creative`, `product-marketing`, `marketing-psychology` | `5b2b400eec1e7e1cec76245a715d0b0d4fd2a9c1` | MIT | ideas | `objective-to-format.md`, `field-guide.md`, `platform-variants.md`, `proof-and-claims.md` |
| ericosiu/marketing-os-starter, `campaign-brief` | `798fed627b481af44531b6563004d44f6a0c612d` (2026-02-24) | MIT | ideas | contract (`downstream`), `field-guide.md`, `ready-for-production.md` |
| zubair-trabzada/ai-ads-claude, `ads-creative` | `d1df3f544249191cbc600c8301e2b9d5ddd121c8` (2026-04-07) | MIT | ideas | `objective-to-format.md`, `platform-variants.md`, `brief-production.md` |
| archive-dot-com/creator-marketing-skills, `campaign-brief-generator`, `paid-social-creative-brief`, `multi-platform-format-adapter` | `ecaf7cf79501741d140817ca346366fc8f828cae` (2026-04-30) | MIT (README) | ideas | `platform-variants.md`, `field-guide.md`, `brief-card-plain.md` |
| rampstackco/claude-skills, `creative-brief` | `9d281db6e7a5c4a0084ba89c91633a07f5f7e42b` (2026-11-15) | MIT | ideas | `field-guide.md`, `bad-vague-brief.md`, `ready-for-production.md` |
| inerrata/brief, `marketing` (+ `references/compliance.md`) | `c0ae0f48ca016141a707039e0ac086bf0cf13b75` (2026-07-09) | MIT | ideas | `proof-and-claims.md`, `inference-rules.md` |
| Motion `build-brief` (Motion-Creative/motion-creative-plugin) | not cloned; public description only | n/a | quality bar only | `ready-for-production.md` |

---

## 1. interview-me → `interview-rules.md`

| | |
|---|---|
| Repo | https://github.com/addyosmani/agent-skills |
| Files read | `skills/interview-me/SKILL.md` (whole file) |

**Borrow**
- **One question at a time, with your guess attached.** People react to a wrong guess faster than they write an answer from scratch. → Team mode: one question per message, each with our guess and the reason for it.
- **Why not batch.** A later question often depends on an earlier answer, and a list gets skimmed. → Team mode never batches. (Client mode is the exception, below.)
- **The stop test: can you predict the next answers?** → Stop asking once every blocking essential is `confirmed`, or once our guess for it is one the person would clearly accept. Hard cap: `brief_max_questions` (5).
- **Catch silently filled-in gaps.** Their red flag is "starting with assumptions you haven't surfaced". → Every inferred value is marked `guessed` and listed in `assumptions`; nothing is filled in silently.
- **"Whatever you think" is delegation, not a decision.** → "Aap dekh lo" / "jo theek lage" keeps the field `guessed` (our pick, said out loud); it never becomes `confirmed`.
- **Watch for the agreeable yes.** A polite user may agree with a guess just to be agreeable. → For blocking essentials only, a one-line read-back ("Toh ₹249 per kg, 30 Nov tak. Sahi?") when the answer changes the field.
- **Name what's out of scope.** → `must_avoid` and the "not doing" line on the plain card.

**Leave out**
- **Confidence percentages and the 5–8 line intent restate.** That's for vague software asks. A brief has named fields, so `confirmed`/`guessed` per field is enough, and a long restate would be jargon for a shop owner.
- **"Options widen the search; don't offer them."** That fits open intent discovery. Our questions ask about concrete facts the person already knows (the price, the channel), where 2–4 tappable options are faster, so we give options plus an "other" answer.
- **Stop the turn after confirmation.** Our flow carries on to the self-check and the gate in the same turn.

## 2. grill-me / grilling → `interview-rules.md`, `inference-rules.md`

| | |
|---|---|
| Repo | https://github.com/mattpocock/skills |
| Files read | `skills/productivity/grill-me/SKILL.md`, `docs/productivity/grill-me.md`, `skills/productivity/grilling/SKILL.md`, `docs/productivity/grilling.md` |

`grill-me` is now a 7-line wrapper that calls the `grilling` skill. The rules the prompt names live in `grilling`, so that's what we read.

**Borrow**
- **Every question carries a recommended answer, worded so "yes" accepts it.** → `templates/question.md`: the guess is option 1, and "haan" takes it.
- **Facts are our job; decisions are theirs.** Never ask for something you could look up. → `inference-rules.md` step 3: before asking, check the client profile, research, past jobs and learnings through storage. Only decisions and facts that aren't stored (a new offer, its price, its validity) are asked.
- **The frontier.** Only ask questions whose prerequisites are settled. → Ask "is there an offer?" before "what's the price?"; never ask about validity for a job with no offer.
- **A round = the whole frontier, numbered.** → This is the shape of **client mode**: one WhatsApp message with numbered questions, each with a guess, so the client can reply "1 haan, 2 nahi, ₹249".
- **Done when nothing is left silently assumed.** → `open_questions` and `assumptions` are always written, even when empty.

**Leave out**
- **Dispatching sub-agents to find facts.** Storage reads are cheap and direct; a sub-agent adds cost and doesn't run the same way on claude.ai.
- **Relentless, long sessions (dozens of questions).** Our cap is 5, and zero is the goal.
- **Prototype-first for "ungrillable" questions.** Visual questions ("how should it feel?") belong to `concept` and `style-bible`, not the brief.

## 3. marketing-os-starter `campaign-brief` → contract, `field-guide.md`, `ready-for-production.md`

| | |
|---|---|
| Repo | https://github.com/ericosiu/marketing-os-starter |
| Files read | `.claude/skills/campaign-brief/SKILL.md`, `schemas/creative-brief.json.template`, `examples/sample-campaign-brief.json` |

**Borrow**
- **A structured JSON brief is the handoff; later skills read it without re-explaining.** → `brief.data.downstream`: one block per later stage (`concept`, `hooks`, `script`, `localise`, `shot_sourcing`), holding just what that stage needs.
- **"Executable without follow-up questions."** If a copywriter would need to ask something, the brief isn't done. → The first line of `checklists/ready-for-production.md`, applied to a video editor.
- **Brief status and approval fields.** → `status` (draft / awaiting-team / awaiting-client / ready / approved) and `changelog[]`. Approval itself stays in the job's gate record.
- **Voice of the customer must be real quotes, not paraphrase.** → `field-guide.md`: customer phrases come verbatim from the profile's `customer_words` or research, with the source.
- **Proof points must be specific and never invented; otherwise flag "needs research".** → `proof_points[]`, each with a `source`; see `proof-and-claims.md`.
- **Separate "never mention" from "required elements".** → Already in our contract as `avoid` and `mandatories`.
- **Check what was tried before.** → `inference-rules.md` priority 4: past jobs and client learnings.

**Leave out**
- **"If goal, audience, channel, budget or deadline are missing, ask; don't guess."** Our rule is the opposite: draft first, mark the guess, then ask only for blocking essentials.
- **Growth playbooks, revenue projections, activation plans, `$` budgets, UTM notes.** These are SaaS and B2B tools. Our budget is generation credits, already on the job.
- **current_belief → desired_belief, objections.** Useful for `concept`, but research's pain points cover it for us. Adding them would make the brief longer without changing what the editor does.

## 4. ai-ads-claude `ads-creative` → `objective-to-format.md`, `platform-variants.md`, `brief-production.md`

| | |
|---|---|
| Repo | https://github.com/zubair-trabzada/ai-ads-claude |
| Files read | `skills/ads-creative/SKILL.md` (whole file), `agents/ads-creative.md` |

**Borrow**
- **Format-specific brief sections.**
  - The 15-second structure: hook 0–3s, problem, reveal, proof, CTA end card.
  - The 60-second structure: hook, problem, bridge, solution, proof, CTA.
  - UGC: talking points, not a script.
  
  → `objective-to-format.md` gives each format its length band and beat outline, which goes into `downstream.script` as a structure hint (not the script itself).
- **No logo or brand intro in the first 3 seconds.** → A platform rule in `platform-variants.md`.
- **Most social video is watched muted, so captions are always on.** → A default `must_include` for every video.
- **The CTA sits in the bottom third.** → A shot-sourcing hint in `downstream.shot_sourcing`.
- **"Specific enough to execute without guessing."** → `ready-for-production.md`.
- **The cross-platform adaptation matrix.** → The aspect-ratio table in `platform-variants.md`.

**Leave out**
- **Five briefs per job, each with A/B/C variations.** This conflicts with our credit-minimal policy (`decisions/0003-credit-policy.md`): one master brief, variants only for the platforms actually ordered.
- **Hex codes, fonts, mood.** These belong to `brand-keeper` (client profile) and `style-bible`.
- **Fetching the client's website.** Client material enters through `brand-keeper`, not the brief.

## 5. creator-marketing-skills → `platform-variants.md`, `field-guide.md`, `brief-card-plain.md`

| | |
|---|---|
| Repo | https://github.com/archive-dot-com/creator-marketing-skills |
| Files read | `skills/campaign-brief-generator/SKILL.md` and `references/platform-specs-and-segments.md`; `skills/paid-social-creative-brief/SKILL.md`; `skills/multi-platform-format-adapter/SKILL.md` |

`content-brief-builder`, which the prompt names, **doesn't exist in this repo**: `multi-platform-format-adapter` refers to it, but there's no folder for it. We read `multi-platform-format-adapter` instead, because it does the master-brief → per-platform work the prompt wanted.

**Borrow**
- **Same story, different language.** A variant changes the hook timing, pacing, text placement and CTA, not just the aspect ratio. A variant that only swaps specs is a spec sheet. → `platform-variants.md`: each variant records `changes_from_master`; the message, offer, price and CTA never change.
- **The label-swap test.** If you swap two variants' platform labels and they still read the same, the adaptation failed. → A self-check line for multi-platform briefs.
- **Hook window per platform; safe zones; upload natively, without another app's watermark.** → `platform-variants.md`.
- **Organic → paid changes things.** A paid viewer didn't choose you: the hook works on strangers, the CTA is explicit, Stories get the strongest 5–10 seconds, and Meta captions stay under about 125 characters. → The Meta ad variant in `platform-variants.md`.
- **Non-negotiables separate from creative direction, so someone who reads nothing else still hits them.** → The card and the production brief list `must_include` first.
- **Direction, not dictation.** → The brief gives the message and the guardrails. Hooks and scripts belong to later stages.
- **SMB briefs are short and read on a phone.** → The plain card is about 6 lines.
- **Every section earns its place.** → Empty optional fields are left out of the card.

**Leave out**
- **Creator compensation, usage rights, Spark Ads codes, whitelisting.** Our clients film or generate their own content.
- **Test matrices and budget-tier testing plans.** Out of scope for the brief, and they cost credits.
- **Exact pixel safe zones and file limits.** These drift with app updates, so we keep the rule and leave the numbers to production stages.

## 6. rampstack `creative-brief` → `field-guide.md`, `bad-vague-brief.md`, `ready-for-production.md`

| | |
|---|---|
| Repo | https://github.com/rampstackco/claude-skills |
| Files read | `skills/creative-brief/SKILL.md` (whole file) |

**Borrow**
- **Read the conversation first; don't ask what the context already answers. Ask only the questions that fill the real gaps.** → `inference-rules.md`, `interview-rules.md`.
- **A snapshot line** (what, who, why, when), as you'd say it at a kickoff. → The first line of the plain card.
- **Failure patterns to push back on:**
  - an audience of "everyone, 18–65";
  - "increase awareness" with no measure;
  - "modern, clean" adjectives;
  - wanting to be "the [big brand] of [niche]".
  
  → `field-guide.md` "what bad looks like", and `examples/bad-vague-brief.md`.
- **Pair every objective with a signal.** → `success_measure` is required whenever `objective_label` is set.
- **Voice as "X, not Y".** → `tone` reuses the profile's `doesnt_mean` column.
- **Who approves, and what triggers sign-off.** → The admin gate; the card states it.

**Leave out**
- **The ten-section markdown file of up to 1500 words in the project root.** Our record is JSON in storage, plus a 6-line card.
- **Visual direction, competitors, inspiration URLs.** These belong to `style-bible` and the market researcher.

## 7. inerrata `brief` → `proof-and-claims.md`, `inference-rules.md`

| | |
|---|---|
| Repo | https://github.com/inerrata/brief |
| Files read | `README.md` (overview), `_unpacked/marketing/SKILL.md`, `_unpacked/marketing/references/compliance.md` |

**Borrow**
- **A standing brand file is ground truth; don't re-ask what it answers.** → The client profile (`get_brand_brief`) is priority 2 in `inference-rules.md`.
- **Deliver first, with a one-line "assuming X" on top; never guess the audience or the goal silently.** → The auto-draft step; `assumptions[]`.
- **Never fake proof, but still write the deliverable, with clearly marked placeholders.** → `proof-and-claims.md`: an unproven claim becomes `[CLIENT TO CONFIRM: …]` plus a `client_questions` entry; it is never invented or silently dropped.
- **The honesty floor.**
  - No invented numbers, testimonials or "No.1".
  - No fake urgency or scarcity (countdowns that reset, "only 2 left" when untrue).
  - "Up to" needs real backing.
  - "Free" means free.
  - Puffery is allowed; measurable claims need proof.
  - Comparisons must be fair and provable.
  
  → `proof-and-claims.md` rules and examples.
- **Regulated categories get conservative claims and a review flag.** → A real-estate line in `proof-and-claims.md` (approvals, possession dates, returns).
- **Redirect, don't just refuse.** Decline the false part, then give the honest version that still sells. → The `proof-and-claims.md` pattern.

**Leave out**
- **The other 16 reference modules, and the US/EU law detail** (CAN-SPAM, GDPR, cookies, FTC specifics). They're out of scope for a video brief, and our clients are in India.
- **Hard-stopping on positioning statements.** Positioning lives in the client profile, owned by `brand-keeper`.

## 8. marketingskills (ad-creative, product-marketing, marketing-psychology) → `objective-to-format.md`, `field-guide.md`, `proof-and-claims.md`

| | |
|---|---|
| Repo | https://github.com/coreyhaines31/marketingskills |
| Files read | `skills/ad-creative/SKILL.md`, `references/meta-creative-formats.md`, `references/short-form-video-specs.md`, `references/motion-video-ads.md` (intro and when-to-use); `skills/product-marketing/SKILL.md` §§1–14; `skills/marketing-psychology/SKILL.md` (scarcity, loss aversion, anchoring, zero-price, ethics notes) |

The prompt's `product-marketing-context` is now `product-marketing`; the old filename only survives as a legacy context file.

**Borrow**
- **Format taxonomy for SMB video** → `objective-to-format.md`. `creative_format` values:
  - talking-head / founder
  - UGC-style testimonial
  - demo / process
  - before-after
  - offer-card motion (faceless)
  - walkthrough (real estate)
  - festive greeting
  - explainer
  
  For each: when it fits, typical length, and what it needs (a person on camera, footage, nothing).
- **"Scaler vs supporting cast".** Some formats reach new people; others convert people who already know you. → It maps to `objective_label`: awareness and growth lean to founder, UGC or explainer; leads and sales lean to offer-card, demo or before-after.
- **Faceless motion: one idea per beat, the still carries the idea, and it's not for proof.** → When `creative_format` = offer-card motion, the brief can't rely on demo proof.
- **Music in-app for organic posts, baked in for paid.** → `platform-variants.md` audio line.
- **Check learnings before proposing an angle again; don't re-propose what was tested.** → `inference-rules.md` priority 4.
- **Customer language verbatim; proof points as their own section.** → `field-guide.md`.
- **Scarcity only when it's real; anchoring with a real original price only.** → `proof-and-claims.md` ("₹499 ~~₹699~~" only if ₹699 was really charged).

**Leave out**
- **The Meta tier list as a ranking.** It's US D2C spend data, and the tiers are dated. We keep the format names and the reach-vs-convert idea.
- **Programmatic rendering, caption CSS, and pixel safe bands.** These belong to production stages.
- **Staged "street interviews".** Close to fake proof for our clients; left out.
- **Most of the 70+ psychology models.** Only the honest-use notes above apply to a brief.

## 9. Motion `build-brief` → `ready-for-production.md` (ideas only)

Not cloned. Read from the public listing of Motion-Creative/motion-creative-plugin: `build-brief` turns a concept into a production-ready brief that a creative team can act on. We take the bar only: **the editor can start without a follow-up question.** We copy nothing, and we don't call it; it needs Motion's paid analytics connection.

---

## Installed skills (call; never copy)

| Skill | State in this session | How the brief uses it |
|---|---|---|
| `marketing:campaign-plan` (anthropics/knowledge-work-plugins `marketing`, Apache-2.0, read at `0e0fcac`) | **Not installed** in Claude Code here; source read only | **Full track only, when present:** optional help for objective, audience and message. If it isn't loaded, the brief does the same with its own references and says nothing. We take only those three parts of its output; its calendar, channel and budget sections are out of scope. |
| `brand-keeper` brand brief view | Built (Group 1) | Required input via `get_brand_brief`. |
| Market researcher `downstream` block | **Not on this branch** | Optional input. Its expected shape is in `references/research-input.md`; when absent, `research.status = skipped`, `skip_reason` "research stage not built yet". It gets wired to the real insight schema at merge. |

## Missing or moved

| Prompt said | Found |
|---|---|
| `mattpocock/skills` `grill-me` | It's a wrapper; the rules are in `grilling` (read both). |
| `coreyhaines31/marketingskills` `product-marketing-context` | Renamed `product-marketing`. |
| `archive-dot-com/creator-marketing-skills` `content-brief-builder` | Not in the repo (referenced only). Read `multi-platform-format-adapter` instead. |
| ericosiu's repo | `ericosiu/marketing-os-starter`, skill `.claude/skills/campaign-brief/`. |
| `inerrata/brief` | Found; the skill is under `_unpacked/marketing/`. We didn't need the `marketing-tool` repo. |
| Motion `build-brief` | Public listing only (as instructed). |

No forks were used.

## Contract changes this research feeds into M2

These were agreed in the plan; the research confirms them.

| Change | From |
|---|---|
| `downstream` block with `concept`, `hooks`, `script`, `localise`, `shot_sourcing` | §3 (JSON handoff) |
| `status`, `changelog[]` | §3 |
| `proof_points[]` with `source`; `offer_detail.profile_match` | §§3, 7 |
| `confidence` per field, `assumptions[]`, `client_questions[]` with guess and options | §§1, 2, 7 |
| `creative_format`, `deliverables[].changes_from_master`, master `aspect_ratio` / `duration_sec` / `platforms[]` | §§4, 5, 8 |
| `ready_for_production` + `self_check[]` | §§3, 6, 9 |
| `research` block (`status`, `insight_id`, `angles_chosen[]`, `pain_points_used[]`, `skip_reason`) | the market researcher's planned `downstream` (Prompt 3) |
