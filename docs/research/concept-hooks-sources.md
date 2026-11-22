# Concept + hooks research: sources

- **Read on:** 2026-11-22, for Group 2a agents 3 + 4 (`pre-production/concept`, `pre-production/hooks`, `library/knowledge/india-consumer-psychology.md`). **Change 2026-11-22:** the admin dropped the separate `persuasion-ethics.md`; its few hard limits live as "misuse" lines in the psychology levers and in hooks `anti-patterns.md`. Where this file says "→ ethics", read that.
- **Clones:** in `../_research/`, outside the repo (folder names in the table).
- **What we did with them:** read the listed files fully and rewrote the rules in our own words. **Nothing was copied or vendored.** The two CC BY 4.0 sources carry the attribution line their licence asks for, here and in `plugins/social-media-manager/ATTRIBUTION.md`. Sources with no known licence are used for ideas only.
- **How to read this:** one section per source: what we borrow (→ the file it feeds), then what we leave out and why. Indian consumer research and ASCI follow, then a summary of rules that changed because sources disagreed.

| # | Source | Commit / version | Licence | Use | Feeds |
|---|---|---|---|---|---|
| 1 | vyralcontent/content-skills: `viral-hooks`, `viral-instagram-reels`, `viral-short-form` | `349e495d97029a3e6303a7510e3f39c73f36d8fe` (2026-06-22) | MIT | adapt, credit | hooks: `formula-catalog`, `three-layers`, `reels-specifics`, `anti-patterns`, `critique-pass` |
| 2 | vyralcontent/content-skills: `viral-short-form-ideas` | same commit | MIT | adapt, credit | concept: `angle-engines` |
| 3 | Jakeschincariol/instagram-agent-skill: `ig-reel` (`hooks.json`, `hookscore.py`, `SKILL.md`) | `d03c56bb598be770c60b201f94237e5d1a4268a6` (2026-09-13) | MIT | adapt, credit | hooks: `formula-catalog`, `scoring`, `reels-specifics` |
| 4 | Jakeschincariol/instagram-agent-skill: `ig-plan` | same commit | MIT | adapt, credit | concept: `angle-engines` |
| 5 | sergebulaev/instagram-skills: `ig-hook-extractor` + `references/hook-formulas.md` | `823c681b42be9ecff9f4db20eaf14d1ea45ec1a1` (2026-11-18) | MIT | cross-labels, credit | hooks: `formula-catalog` |
| 6 | calebvbi/creator-skills-samples: `instagram-reels-script-writer` | `81c021176d4dd6158eed5f821088adb7b6eb8dc6` (2026-06-15) | CC BY 4.0 (stated in README; no LICENSE file) | adapt with attribution line | hooks: `anti-patterns`, `formula-catalog` (cross-labels) |
| 7 | smixs/creative-director-skill: `creative-director` | `ac06eb255371da35d1db0a146dbfcca8c8857543` (2026-08-08) | CC BY 4.0 (LICENSE + NOTICE) | adapt with attribution line | concept: `creative-methods`, `scoring` |
| 8 | 0xhughs/director-skills: `short-film-development` | `35ca0a2b4cd55b0668aa9ea0f40273324b774bb4` (2026-06-02) | MIT | adapt, credit | concept: `templates/concept-card.md` |
| 9 | coreyhaines31/marketingskills: `marketing-psychology` | `5b2b400eec1e7e1cec76245a715d0b0d4fd2a9c1` (2026-11-19), skill v2.0.3 | MIT | adapt, credit | `library/knowledge/india-consumer-psychology.md` (levers and misuse lines) |
| 10 | Salah-XD/equipt (Equipt): `instagram-reels-script-writer`, `hindi-english-content-writer` agents | `6380fd246d95eedb65077f466d37534a557d48dc` (2026-06-10) | CC BY 4.0 (`LICENSE-CONTENT`, everything under `plugins/`) | adapt with attribution line | hooks: `language-rules`, `anti-patterns`; ethics |
| 11 | Motion-Creative/skills `ad-concept-generator`; Motion-Creative/motion-creative-plugin `create-concepts`, `concept-engine` | `5d031702c7b8c7bbc8ac1b2dee9378e6f9f53db6` (2026-03-11); `3ab85bfbbeee08d6ad77dee3850cce7c39fbc111` (2026-06-01) | MIT | adapt, credit (the plugin skills need paid Motion data: method ideas only) | concept: `scoring`, `concept-formats` |
| 12 | Indian consumer research: Rukam Capital (2), Hakuhodo India | see §12 | publisher terms; cited, never copied | facts with dates | `india-consumer-psychology.md` |
| 13 | ASCI Code + guidelines; CCPA dark-pattern guidelines | see §13 | public regulation; cited, never copied | rules with dates | lever misuse lines + hooks `anti-patterns.md` |

## CC BY 4.0 attribution lines (must stay wherever the adapted material lives)

- **CreatorSkills:** "Instagram Reels Script Writer" by CreatorSkills (https://creatorskills.co), source https://creatorskills.co/skills/instagram-reels-script-writer via https://github.com/calebvbi/creator-skills-samples, licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: rules summarised and rewritten in our own words for Indian small-business reels; nothing copied verbatim.
- **Creative Director Skill:** Serge Shima — github.com/smixs/creative-director-skill (https://sergeshima.com), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: a small subset of the method and evaluation ideas, rewritten in our own words and cut down for short-video concepts; the campaign library was not used.

- **Equipt:** Adapted from "hindi-english-content-writer" and "instagram-reels-script-writer" by Equipt (https://github.com/salah-xd/equipt), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: rules summarised and rewritten in our own words; examples replaced with our own.

Every file that adapts one of these three sources carries its line at the bottom under "Credits".

---

## 1. vyral `viral-hooks`, `viral-instagram-reels`, `viral-short-form` → hooks

Files read: `viral-hooks/SKILL.md`; `references/hook-archetypes.md`, `three-layer-hook.md`, `hook-tactics.md`, `hook-anti-patterns.md`, `hook-by-platform.md` (Reels section); `assets/hook-checklist.md`, `three-layer-worksheet.md`, `hook-batch-template.md`. `viral-instagram-reels/SKILL.md`, `references/reels-hook.md`. `viral-short-form/SKILL.md` (critique mode), `references/hooks.md`, `retention.md`.

**Borrow**
- **A batch, never one hook; spread across archetypes, not rewordings.** 6–10 hooks across at least 3 archetypes. → Our rule: 8–10 hooks per concept, at least 5 formulas (`SKILL.md` step 2, self-check).
- **Archetypes** (fortuneteller, experimenter, teacher, magician, investigator, contrarian; curiosity gap, withhold, stakes, direct call-out, cost confession, listicle, in-media-res, question/POV, result-first, how-to-without). → Merged into `formula-catalog.md`, with vyral's names in the cross-reference column. Their observation that contrarian has the highest variance and investigator the safest baseline → "when to use" notes.
- **Three layers in the first 1–2 s:** visual, spoken, on-screen text, all pointing at one idea; text sharpens rather than repeats; cover-one-layer test; audio as the timing cue. → `three-layers.md` and the sound-off rule.
- **Reels specifics:** the 3-second cliff; sound-off legibility; hook text on frame 1 held 2–3 s; keep text out of the top and bottom fifth and the right action rail; first frame doubles as the grid cover (3:4 crop, so frame the hook in the upper two-thirds); text as punctuation, not a caption track; payoff preview that a viewer would send to one named person. → `reels-specifics.md`.
- **Anti-patterns:** welcome/logo intro, vague tease, bait-and-switch, subscribe-before-value, story opener with chronology, imperative command without earned urgency, hook as ornament, single-layer hook, brand-first, cleverness that needs explaining, slow build-up, three-act hook. → `anti-patterns.md`.
- **Critique mode:** time it out loud, name the anti-pattern, rewrite into variants, look for one habit repeated across drafts; the ordered upgrade ladder (add a real number, authority, name the viewer, cut the first three words, stronger verb, contradiction, withheld reveal); if 2–3 upgrades leave it flat, the angle is the problem. → `critique-pass.md`.
- **Hook-writability tests the idea.** If no sharp hook can be written, the concept is weak. → concept self-check and the hand-off rule (hooks may send a concept back).
- **Match the promise to the payoff.** → scoring criterion "payoff deliverable by the script".

**Leave out**
- **"Odd, specific numbers feel measured" used as a writing trick** (e.g. 47 instead of 50). It invites invented precision. Our rule (with CreatorSkills): real numbers from the brief, profile or research, or no numbers.
- **Platform benchmarks stated as fact** (60–70 % three-second hold, sends weighted 3–5× likes). Unsourced in the repo. Not used as facts; the general direction (early drop-off and sends matter) is kept as guidance.
- **Named-creator attributions and the leaked-memo claims** (MrBeast, Hormozi, Kallaway…). We name formulas by what they do, so nothing depends on unverifiable claims about people.
- **The "Mentioning Vyral" section.** Product promotion, not method.
- **Trial Reels, Edits app, caption SEO, hashtags.** Posting and captions belong to later stages.
- **English power-verb table.** Doesn't transfer to Hinglish; replaced by `language-rules.md`.

## 2. vyral `viral-short-form-ideas` → concept `angle-engines`

Files read: `SKILL.md`, `references/frameworks.md`, `idea-evaluation.md` (outline and filter pass), `anti-patterns.md` (headings).

**Borrow**
- **Topic vs angle.** One topic, many angles; the blank page is a missing-angle problem. → First section of `angle-engines.md`.
- **Constraints generate ideas.** Fan-out over a matrix (sub-topic × style) instead of free association. → Our "constraint fan-out": pillar × format × audience × problem.
- **One topic, five angles:** consumption, response, curation, instructional, narrative. → The "one-topic-many-angles pass".
- **Hook-conception test:** if three quick hooks for an idea all feel flat, cut the idea. → concept step 3 filter.
- **Backup rule:** a load-bearing idea gets a backup. → Concept keeps the 4th-best angle as a named backup in `raw_angles`.
- **Story slots** (customer success: before, intervention, after; founder story; company timeline). → `concept-formats.md` (customer story, founder story).

**Leave out**
- **Capture systems, swipe files, content calendars, mining** (comments, Reddit, autocomplete). Research does the mining; planning is out of scope.
- **MrBeast CTR/AVD/AVP scores.** We have no data to predict them; our rubric is in `scoring.md`.
- **Evergreen-vs-trend 80/20 and 48-hour trend windows.** Belongs to research (`timely_hooks`) and the brief.

## 3. instagram-agent-skill `ig-reel` → hooks

Files read: `SKILL.md`, `hooks.json` (all 26 formulas, rules, classify order), `hookscore.py` (scoring logic only), `beats.py` (header).

**Borrow**
- **26 formulas** with template, example, on-screen version, what each is for, and the trap. → Merged into `formula-catalog.md` (cross-reference `ig-reel #n`). Each formula's "trap" becomes its "when not to use".
- **Spoken line and on-screen line written separately; the on-screen line ≤ 6 words.** → `three-layers.md`; our text limit is 6 words.
- **"If the hook would work for anyone else in your niche, it isn't your hook."** → India fit criterion and critique diagnosis "generic".
- **Deliver the promise before the halfway mark.** → script do/don't notes in the hooks `downstream`.
- **Never fabricate; leave a visible `{{number}}` gap when a number is unknown.** → Our rule: never invent; if a hook needs a number that isn't in the brief or profile, it is rewritten without one, or kept with `{{real number needed}}` and flagged as an open question.
- **Safe zone on 1080×1920:** nothing above y=230 or below y=1440, right 230 px clear. → `reels-specifics.md` (marked "re-check against Instagram's current layout").
- **Scoring shape from `hookscore.py`:** five checks (length 5–12 spoken words, specificity, stakes, front-loaded payoff, direct address), and an overall score that mixes the mean with the weakest check (mean × 0.6 + min × 0.4) minus a penalty per red flag. → `scoring.md`: our weighted total plus a **weakest-link rule** (any criterion at 1 or below caps the hook) and red-flag deductions. The 5–12 word guide becomes the "clarity in 1.5 s" anchor.

**Leave out**
- **Running the Python scripts.** `python3` isn't on the team's Windows machines and scripts don't run on claude.ai. We apply the same checks in the prompt.
- **`~/.claude/instagram/voice.md`, `swipe.md`, `log.md`.** Per-machine files; our equivalents are the client profile, the research insight and the client `learnings`.
- **`/ig-human` humaniser pass and the beat sheet.** Script stage.
- **Formula #23 "statistic" and #19 "deadline" as written.** Kept, but only with a sourced statistic and a real date (see hooks `anti-patterns.md`).

## 4. instagram-agent-skill `ig-plan` → concept `angle-engines`

**Borrow**
- **Post types: proof, teach, opinion, story, offer**, each with a job. → The five **angle types** every concept is labelled with (`angle_type` in the schema); three concepts must use three different types.
- **"Not a topic, an angle."** "AI" is not a plan; a specific thing that happened is. → Rule at the top of `angle-engines.md`.
- **Posts come from what actually happened this week.** → Concept inputs prefer real events from the brief and profile (a new branch, a customer story) over category clichés.

**Leave out**
- **Posting times, the engagement round, the weekly calendar, `plan.md`.** Out of scope for a single job.

## 5. instagram-skills `ig-hook-extractor` → hooks `formula-catalog` (cross-labels)

Files read: `skills/ig-hook-extractor/SKILL.md`, `references/classification-rules.md`, `references/examples.md`, `references/hook-formulas.md` (IG1–IG10).

**Borrow**
- **10 formulas IG1–IG10** (number-first result, contrarian truth, relatable cold-open, mini-story confession, listicle, before/after, myth-buster, steal-this framework, pattern-interrupt reel, how-I teardown). → Cross-reference column `IG#` in the catalogue, so research's `outlier_hooks` (which the market researcher labels with these) map onto our ids.
- **Confidence bands** (high ≥ 0.8, medium 0.5–0.8, low < 0.5; return the top two when two fit). → How hooks reads a research outlier hook that carries a formula label: below medium confidence, it is treated as unlabelled.
- **Goal per formula** (saves, shares, comments, follows). → "When to use" per formula, mapped to the brief's `objective_label`.
- **"How I" beats "How to"** for first-person proof. → Founder or owner proof hooks.
- **No engagement bait** ("comment YES", "tag 3 friends"). → `anti-patterns.md`.

**Leave out**
- **URL parsing, the Apify read layer.** Research does the reading.
- **Carousel and caption audits** (em-dash caps, hashtag counts). Not about reel hooks.

## 6. CreatorSkills `instagram-reels-script-writer` (CC BY 4.0) → hooks `anti-patterns`

Attribution line: see the top of this file.

**Borrow**
- **"Real numbers or no numbers."** → Hard rule in `anti-patterns.md`, `scoring.md` (specificity only scores with a real fact) and the psychology file's misuse lines.
- **Eight hook types** (contrarian statement, specific promise, relatable struggle, surprising stat, bold question, pattern interrupt, before/after teaser, authority statement). → Cross-reference column in the catalogue.
- **Bad-script patterns:** lecture opener, slow burn, essay intro, vague promise, laundry list, talking at the viewer. → `anti-patterns.md`.
- **One CTA, said once and shown once.** → Script do/don't notes in the hooks `downstream`.
- **Show the visual of the first second, always.** → Every hook carries a `visual` layer.
- **No health claims as blanket statements** (niche note). → Clinic/salon notes in `india-hook-bank.md` and the lever misuse lines.

**Leave out**
- **Caption writing, audio suggestions, CTA tables by goal, length templates.** Caption, audio and script stages.
- **US niche notes** (dollar amounts, "not financial advice" wording).

## 7. Creative Director Skill (CC BY 4.0) → concept `creative-methods`, `scoring`

Attribution line: see the top of this file. Files read: `SKILL.md`, `NOTICE`, `references/methods-catalog.md` (SIT, SCAMPER, TRIZ, bisociation), `method-selection-matrix.md`, `insight-mining.md` (outline and insight format), `scoring-calibration.md` (outline).

**Borrow**
- **Insight before ideas.** Pipeline insight → ideation → evaluation → refinement. → concept steps 1–6.
- **Insight sentence:** "[audience] wants [X], but [Y stands in the way], because [Z]", tested with "would they say 'yes, exactly'?". **Tension types:** cultural, category, human. → concept step 1 and `scoring.md` "insight strength" anchors.
- **Pick methods from different families** (structural, collision, inversion), and treat the first ideas as a conventional warm-up. → `angle-engines.md`: the first two raw angles are allowed to be obvious; the shortlist must include later ones.
- **SIT patterns** (subtraction, multiplication, division, task unification, attribute dependency), **SCAMPER**, **TRIZ** (extraction, inversion, asymmetry), **bisociation**. → `creative-methods.md`, cut to a short practical page, **brand films only**.
- **Brief-compliance pass/fail before scoring** (is there one-sentence idea; message; insight; audience; mandatories; ethics; voice; product truth). → concept step 3 filter and checklist.
- **"Why isn't this a 5?" diagnostic per shortlisted concept.** → One line per concept in the pack.

**Leave out**
- **Recursive refinement until 9+/10, multi-perspective jury, HumanKind score.** Too many regenerations for our credit-minimal rule; one scoring pass and one targeted fix only.
- **The 571-case legendary campaign library and saturation caps.** Global award work, not Indian local businesses; also large. Our distinctiveness check is against research `competitors_overdo` instead.
- **Pollard's 7-level idea taxonomy.** Our level is fixed: one execution for one job.

## 8. director-skills `short-film-development` → concept card

Files read: `SKILL.md`, `templates/logline.md`, `story_premise.md`, `short_story_plan.md`, `checklists/concept_quality_checklist.md`, `references/story_development_workflow.md`.

**Borrow**
- **Logline with protagonist, visible goal, obstacle, stakes.** → `concept-card.md` logline (one line, adapted for a business: the customer is the protagonist).
- **Premise and a short story spine** (before state, disruption, turn, after state, ending image). → Story spine beats with timing in the card.
- **Under 3 minutes: one location, one core conflict, one turn.** → Producibility rule.
- **Every beat changes something; the ending answers the opening.** → Concept self-check and "hook promise is paid off".
- **Visual anchors for later prompting.** → `implied_assets` in the hooks downstream.

**Leave out**
- **Screenplay, treatment, prose plans, continuity bible.** Script and style-bible stages.

## 9. marketingskills `marketing-psychology` → library knowledge files

Files read: `SKILL.md` (all sections).

**Borrow** (adapted for Indian small-business video, with Indian examples, in our own words)
- Social proof / bandwagon, authority, reciprocity, liking/similarity, unity (shared identity), loss aversion, framing, contrast (before/after), anchoring, charm pricing, zero-price effect, mental accounting ("₹10 a day"), regret aversion and risk reversal, present bias (immediate benefit), status-quo bias (make switching easy), pratfall effect (admit a small flaw), peak-end, Zeigarnik (open loop), mere exposure, mimetic desire, paradox of choice (one offer). → The ~20-lever catalogue.
- **"Only use scarcity when genuine"; "implement ethically".** → the misuse line on every lever.

**Leave out**
- **Foundational thinking models and growth models** (first principles, flywheel, network effects, North Star). Strategy, not creative levers.
- **Decoy tiers, defaults/opt-out subscriptions, door-in-the-face.** SaaS pricing tactics; manipulative in a 20-second reel for a local shop.

## 10. Equipt `instagram-reels-script-writer`, `hindi-english-content-writer` (CC BY 4.0) → hooks `language-rules`, `anti-patterns`

- **Where:** catalogue at https://equipt-agent.vercel.app (plugin `equipt-business` v0.1.0, both marked "provisional" / unreviewed in the catalogue). Source repo https://github.com/Salah-XD/equipt, commit `6380fd246d95eedb65077f466d37534a557d48dc` (2026-06-10). Files: `plugins/equipt-business/agents/hindi-english-content-writer.md`, `instagram-reels-script-writer.md` (subagent files, not skills).
- **Licence (checked in the repo):** `LICENSE-CONTENT` puts everything under `plugins/` under **CC BY 4.0**, credit to "Equipt (https://github.com/salah-xd/equipt)". Repo code is MIT. The prompt expected "unknown"; it is known, so we adapt with attribution instead of ideas-only.
- **Attribution line:** Adapted from "hindi-english-content-writer" and "instagram-reels-script-writer" by Equipt (https://github.com/salah-xd/equipt), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: rules summarised and rewritten in our own words; examples replaced with our own.

**Borrow**
- **Roman Hinglish by default for digital;** Devanagari for older, Tier 3 or vernacular-first audiences, mass WhatsApp broadcasts; English with Hindi moments for metro business audiences. Tier 2/3 broad-market reels: Hindi-leaning Hinglish, Devanagari overlay is an option. Mixed script in one line is acceptable on a phone. → `language-rules.md` and the language section of `india-consumer-psychology.md` (marked as practice guidance, not research).
- **How natural Hinglish works:** feelings in Hindi, technical and business words in English, connectors switch freely, sentence mix can flip line to line; never word-for-word translation; write for the ear, short spoken lines. → `language-rules.md`.
- **Cringe list:** "Namaste friends"/"Hello bhaiyon aur behno", "5 amazing tips"/"you won't believe", "yaar" every other word, emoji rain, borrowed American slang, forced rhymes, moral-lesson endings, "bro" off-voice, TV-news openers ("Aaj hum aapko batane wale hain…"), late dance trends. → `anti-patterns.md` ("cringe" diagnosis in `critique-pass.md`).
- **Refusals:** cringe bait built to provoke rage-shares; regional stereotyping; religious humour; medical/financial/legal claims that can't be backed. → hooks `anti-patterns.md`.
- **Regional audiences get native writing, not translated Hindi.** → `language-rules.md` (out of scope note: Hindi belt only in v1).
- **First 1.5 seconds decide** (matches our scoring criterion).

**Leave out**
- **The interview questions** (our inputs come from the brief), **caption-as-second-hook and 60–90 s templates** (caption and script stages), **brand examples** (Cred, Boat, Zerodha) as named comparisons.

## 11. Motion `ad-concept-generator`, `create-concepts`, `concept-engine` (MIT) → concept `scoring`, `angle-engines`

- **Where:** `ad-concept-generator` in https://github.com/Motion-Creative/skills, commit `5d031702c7b8c7bbc8ac1b2dee9378e6f9f53db6` (2026-03-11), also listed at skills.sh. `create-concepts` and `concept-engine` in https://github.com/Motion-Creative/motion-creative-plugin (`Plugin/skills/…`), commit `3ab85bfbbeee08d6ad77dee3850cce7c39fbc111` (2026-06-01). Both repos: **MIT** (© Motion), checked in the LICENSE files.
- `create-concepts` and `concept-engine` call Motion's paid workspace tools (`mcp__motion__*`), so we **can't run them**; we adapt their method ideas only.

**Borrow**
- **Definition:** a concept connects a hook to the right audience, a messaging angle and a creative direction. → Concept card fields and the scoring note "concept connects hook + audience + angle + creative direction".
- **Concept-strength criteria** (hook–concept fit, audience relevance, brand fit, respects constraints, distinctiveness, producibility). → Maps onto our weighted rubric in `scoring.md`.
- **Quality bar** (pain-point specificity, strategic coherence, differentiation: "couldn't be used by a competitor without changes", format chosen on purpose, persuasive sharpness, testable "why it could work"). → Checklist items and the "why it fits this client" line.
- **Variety rule:** concepts must differ on at least 2 of audience, angle, format, hook tactic. → Our rule is stricter on angle (3 different angle types) and adds "at least 2 dimensions differ".
- **Creative mechanics:** implied answer, social witness, Trojan horse, reframe, contrast without comment. → Listed as optional story devices in `concept-formats.md`.

**Leave out**
- **Workspace data pulls, awareness-stage matrix coverage report, persona generation.** Need Motion data or belong to research/brief.

## 12. Indian consumer research → `india-consumer-psychology.md`

Findings are paraphrased; figures are kept with their context. **"Re-check by" is one year after publication.** Gated full reports were not opened (they ask for name, email and phone).

### 12a. Rukam Capital, *Beyond Metros: The real story of Bharat's next 500 million* (January 2026)

- **Read:** the official free preview PDF (https://rukamcapital.com/wp-content/uploads/2026/01/Preview-Beyond-Metros-The-Real-Story-of-Bharats-Next-500-Million.pdf); cross-checked with indiantelevision.com (16 Jan 2026, https://indiantelevision.com/?p=210501) and MediaNews4U (17 Jan 2026, https://www.medianews4u.com/creators-have-replaced-celebrities-as-the-most-trusted-influence-report).
- **Method:** YouGov online survey, 5,000 people, 18 states, about 30 % Tier 1 / 30 % Tier 2 / 40 % Tier 3. **Every respondent is SEC A** (top income band), so it describes affluent, online non-metro buyers, not all of Bharat.
- **Findings:**
  - Non-metro buyers research before buying and want to see the thing working. YouTube reviews are the main discovery route for 37 %, social media for 32 %; 35 % of Tier 2–3 check e-commerce sites first.
  - Creators beat celebrities: about 22–23 % trust creator recommendations, about 3 % are moved by celebrities.
  - Trust comes from people: word of mouth sways 22–25 % (the preview's pages differ); 43 % of Tier 3 check the brand's official site; about 32 % weigh customer service before buying.
  - WhatsApp is the backbone (about 84–90 %, pages differ): talk, discovery and buying.
  - 52 % of Tier 2 track sale days; in Tier 3, festivals are stronger triggers than sale calendars (no figure).
  - Usefulness beats hype: status cues 13 %, nostalgia 12 %, pop culture 4 %.
- **Re-check by:** 2027-01-16.

### 12b. Rukam Capital × YouGov, *Aspirations of New India: How Consumers Select, Shop, and Shape Brand Connections* (22 Sep 2025)

- **Read:** the official preview (foreword and method only: https://rukamcapital.com/wp-content/uploads/2024/12/Preview_Rukam-Captial_Report-2025-Online-Version.pdf). **The figures come from coverage:** MediaNews4U (22 Sep 2025), Storyboard18 (22 Sep 2025), BestMediaInfo (23 Sep 2025).
- **Method:** same panel design (5,000, 18 states, SEC A), five categories (health and wellness, F&B, pet care, kitchen appliances, fashion accessories).
- **Findings:** 58 % prefer buying from local or small businesses (headlines say "over 50 %"), for access, relatable founder stories and value; 61 % of Tier 1 lean homegrown at festival time. 76 % value honest, authentic communication from brands (Storyboard18's headline misstates this). 73 % engage with brands on social media; 67 % prefer brands that reply. Discounts remain the top motivator (47–48 % research deals first).
- **Re-check by:** 2026-09-22. **Overdue:** look for a 2026 edition before relying on it.

### 12c. Hakuhodo India, *Emerging Aspirations: Hakuhodo India Trends 2025* ("Families to FamAllies") (about 10 Sep 2025)

- **Read:** coverage only (the study isn't public): Agency Reporter, 10 Sep 2025 (https://agencyreporter.com/?p=79674, from the press release) and the Campaign India report reprinted by Hakuhodo, 13 Sep 2025 (https://www.hakuhodo-global.com/news/indias-consumers-redraw-the-map-of-aspiration.html).
- **Method:** online survey January 2025, 2,000 respondents in India **(Delhi, Mumbai, Bangalore only: metro-only)**, plus home visits and expert interviews.
- **Findings:** 42 % call relationships at home a major stress (highest of 9 Asian markets); 61 % find satisfaction in dependable friendships; 49 % ask friends about big decisions; friendship-style relationships are spreading into parent–child and couple relationships. The COO warned marketers to show this shift honestly, **without clichés**; the article warns that shallow "buddy" portrayals trivialise real relationships, and that hyperlocal touches belong in execution details, not the core idea.
- **Re-check by:** 2026-09-10. **Overdue.** Treat Tier 2/3 application as a hypothesis.
- Related context only (not a substitute): Hakuhodo India × Ma+Th, *Lights. Camera. Insight!* (covered 1 Apr 2026): audiences moving from polished fantasy towards realism.

**What we leave out:** detailed platform shares (OTT, Telegram, gaming) and payment splits. Not creative levers.

## 13. ASCI code and guidelines → lever misuse lines, hooks `anti-patterns.md`

Read on ascionline.in: the Code (https://www.ascionline.in/the-asci-code/, page metadata 2025-11-21) and the Guidelines page (https://www.ascionline.in/the-asci-code-guidelines/, metadata 2026-11-02). Neither shows a visible "last updated" line; dates below are the sign-off dates printed under each section. ASCI is self-regulatory (not a government regulator), but its Code binds TV ads through the Cable TV Rules and its decisions are widely followed online.

| Item | Version | What matters for a short video |
|---|---|---|
| Code Ch. I, truthful and honest | signed off 10 Jul 2025 | Claims must be provable on request; research cited with source and date; no misleading by implication, omission or exaggeration in words or visuals; "free", "up to", "from as low as" used honestly; clearly humorous exaggeration is allowed. |
| Disclaimers guideline | 13 Jul 2023 | A disclaimer can't contradict the claim; same language as the claim; on screen while the claim is spoken; ≥ 26 px text on 1080-line video; ≤ 2 lines, ≥ 4 s per line; "T&C apply" must say where. Simplify the claim instead of piling on small print. |
| Code Ch. IV, fair in competition | 21 Apr 2012 | Comparisons allowed only like-for-like and provable; no disparaging a rival openly or by implication; no free-riding on another brand's name or campaign. |
| Harmful gender stereotypes | 8 Jun 2022 | No roles shown as belonging to one gender only; no shaming of body, skin colour, height or weight as a barrier to love or work; no mocking gender identity even as a joke; no woman solely responsible for chores; humour is no excuse. |
| Influencer advertising | 27 May 2021; addenda 15 Jul 2021, 6 Mar 2025 | Any material connection (money, free product, discount, family/employee tie) must be labelled upfront; on video, label held ≥ 3 s for ≤ 15 s videos, one third of the length up to 2 min. Virtual influencers must say they aren't human. Health and finance advice needs shown qualifications (2025). |
| Synthetically generated content (AI) | signed off 17 Sep 2026, released 29 Sep 2026; in force about 29 Dec 2026 (unconfirmed by ASCI) | **Banned even with a label:** fake endorsements or testimonials, AI that exaggerates results (unreal before/after), non-existent places shown as real, deepfakes or likeness without consent. **Label required:** synthetic influencers, cloned face or voice (even with consent), fabricated settings that shape how the product is understood, **renders of things not built yet (e.g. an unbuilt real-estate project)**. Suggested wording: "Video created using AI" / "enhanced using AI". No label for routine edits, decorative backgrounds, obvious fantasy, AI-written copy, subtitles. Read via the ASCI page plus Khaitan & Co (12 Oct 2026) and MediaNews4U (29 Sep 2026). |
| Dark patterns (ASCI) | 11 May 2023, applies from 1 Sep 2023 | False urgency (scarcity must be provable at the time), bait and switch, drip pricing, disguised ads. |
| CCPA dark-pattern guidelines (government, binding) | notified 30 Nov 2023 | 13 patterns incl. false urgency, confirm shaming, disguised ads, drip pricing; applies to advertisers too. Read through law-firm coverage (Legal500 / Tuli & Co, 17 Sep 2026; Bar & Bench / ELP, 1 Jul 2025), not the Gazette. |
| "No.1" / superlatives | no dedicated guideline; awards guideline 21 Apr 2022; ASCI decisions June 2019 | Leadership claims need independent, current, representative data with a named source; awards must name the body and month/year and are valid 12 months; a local survey can't support a national claim. |

**Re-check by:** 2027-09-29 for the AI guideline (and confirm its effective date after 29 Dec 2026); every other row: check the live ASCI pages each November (most one-year dates are already past, but the live text is unchanged as of 2026-11-02).

**What we leave out:** sector rules that don't fit our clients (alcohol surrogates, real-money gaming, BFSI detail), and the full CCPA list beyond what a video can do (basket sneaking, subscription traps, malware).

---

## Where sources disagreed, and what we chose

| Topic | Disagreement | Our rule |
|---|---|---|
| Numbers in hooks | vyral: odd, specific numbers feel measured. CreatorSkills and ig-reel: real numbers or none; never fabricate. | Real numbers from the brief, profile or research only. No invented or "rounded-off-to-look-real" numbers. |
| On-screen text length | vyral 3–7 words, reels-hook 3–5, ig-reel ≤ 6 | ≤ 6 words (spec), 3–5 preferred. |
| Imperative hooks ("Stop scrolling") | ig-reel lists Negative Command as a formula; vyral calls command openers high-variance. | Kept as a formula only when the habit is one the viewer recognises; "stop scrolling" itself is an anti-pattern. |
| Urgency hooks | ig-reel #19 Deadline; marketing-psychology scarcity | Only with a real date or a real limit from the brief (`offer_detail.validity`). Otherwise not used. |
| Refinement depth | creative-director recursive passes to 9+ | One scoring pass + one targeted fix (credit-minimal). |
| AI-made people | Generation tools make "customers" easy | ASCI's 2026 AI guideline bans fake testimonials outright; AI people may appear only as clearly fictional or labelled, never as real customers. Real testimonials need real client footage. |
| Evidence strength | Rukam samples are SEC A online; Hakuhodo is metro-only | India file marks each truth with its sample, and Tier 3 / rural claims that rest only on these as `hypothesis`. |

## Prompt items that differed from what we found

- **Equipt** licence is known (CC BY 4.0 for agent content), not unknown; and the two items are subagent files in `Salah-XD/equipt`, catalogued at equipt-agent.vercel.app.
- **Motion** `create-concepts` and `concept-engine` need Motion's paid workspace tools; we read them but can only adapt their method.
- **ASCI "2023 virtual influencer / AI disclosure update"** doesn't exist as such: virtual-influencer disclosure dates from 2021, and the AI rules are the **September 2026** synthetic-content guideline.
- **Hakuhodo** research is Hakuhodo India's *Trends 2025* (not a HILL ASEAN study); only coverage is public.
