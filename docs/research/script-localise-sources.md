# Script + localise research: sources

- **Read on:** 2026-11-23, for Group 2a agents 5 + 6 (`pre-production/script`, `pre-production/localise`, `library/knowledge/voiceover-pacing.md`, `library/knowledge/ai-tells.md`).
- **Clones:** in `../_research/`, outside the repo (folder names in the table). The PyPI package was read from its PyPI page, not installed.
- **What we did with them:** read the listed files fully and rewrote the rules in our own words. **Nothing was copied or vendored.** CC BY 4.0 sources carry their attribution line here, in `plugins/social-media-manager/ATTRIBUTION.md` and under "Credits" in every file that adapts them. CC BY-SA and unlicensed sources are used for ideas only.
- **How to read this:** one section per source: files read, what we borrow (→ the file it feeds), what we leave out and why. Then the rules that changed because sources disagreed, and the findings that differ from the prompt.

| # | Source | Commit / version | Licence | Use | Feeds |
|---|---|---|---|---|---|
| 1 | vyralcontent/content-skills: `viral-short-form` | `349e495d97029a3e6303a7510e3f39c73f36d8fe` (2026-06-22) | MIT | adapt, credit | script: `retention`, `critique-pass`, `structures`, `templates/script-version.md` |
| 2 | vyralcontent/content-skills: `viral-captions-and-ctas` | same commit | MIT | adapt, credit | script: `caption-cta`, `on-screen-text` |
| 3 | vyralcontent/content-skills: `viral-instagram-reels`, `viral-youtube-shorts` | same commit | MIT | adapt, credit | script: `platform-variants`, `retention` |
| 4 | Jakeschincariol/instagram-agent-skill: `ig-reel` (`SKILL.md`, `beats.py`), `ig-caption` (`SKILL.md`), `ig-human` (`SKILL.md`, `slop.json` categories) | `d03c56bb598be770c60b201f94237e5d1a4268a6` (2026-09-13) | MIT | adapt, credit | script: `templates/script-version.md`, `on-screen-text`, `caption-cta`; knowledge: `voiceover-pacing`, `ai-tells` |
| 5 | sergebulaev/instagram-skills: `ig-caption-writer`, `ig-humanizer` | `823c681b42be9ecff9f4db20eaf14d1ea45ec1a1` (2026-11-18) | MIT | adapt, credit | script: `caption-cta`; knowledge: `ai-tells` |
| 6 | blader/humanizer: `SKILL.md` | `a32f24407364c74c812b43c15926d638bee1e072` (2026-11-19) | MIT | paraphrase, credit | knowledge: `ai-tells` §1 |
| 7 | trailofbits/skills-curated: `plugins/humanizer` (`README.md`, `SKILL.md`, `references/patterns.md`) | `6d05be4889017b06fb15069f371afd220daffb62` (2026-07-14) | **CC BY-SA 4.0** (repo `LICENSE`) | ideas only, cross-check | knowledge: `ai-tells` (cross-check, two-pass audit idea) |
| 8 | coreyhaines31/marketingskills: `copywriting` (`SKILL.md`), `copy-editing` (`SKILL.md`) | `5b2b400eec1e7e1cec76245a715d0b0d4fd2a9c1` (2026-11-19) | MIT | adapt, credit | script: `critique-pass`, `fact-guard`, voice rules in `SKILL.md` |
| 9 | 0xhughs/director-skills: `screenplay-and-scene-writing`, `shotlist-and-visual-breakdown` | `35ca0a2b4cd55b0668aa9ea0f40273324b774bb4` (2026-06-02) | MIT | adapt, credit | script: `scene-writing` |
| 10 | calebvbi/creator-skills-samples: `instagram-reels-script-writer` | `81c021176d4dd6158eed5f821088adb7b6eb8dc6` (2026-06-15) | CC BY 4.0 (README) | adapt with attribution line | script: `fact-guard`; knowledge: `voiceover-pacing` |
| 11 | AI4Bharat/IndicXlit (README) + PyPI `ai4bharat-transliteration` 1.1.3 (description, metadata) | `802803ee0afc7a8703815bb3eb79f99f061797a1` (2023-10-13); PyPI 1.1.3 | MIT (code and models) | call as an optional tool | localise: `scripts/transliterate.py`, `language-choice` |
| 12 | AI4Bharat/IndicTrans2 (README) | `4f08e39cc6bf13cd62e2445dc725f22bff1a9219` (2025-10-03) | MIT | optional tool, never required | localise: `back-translation` |
| 13 | i18n-agent/i18nstack: `skills/localize-hi/SKILL.md` | `6bf6587d50a8896b2fc2897ab806c9e693cfcb9b` (2026-10-22) | MIT | adapt grammar ideas, credit | localise: `hinglish-style`, `numbers-and-money` |
| 14 | ECNU-ICALK/AutoSkill: `SkillBank/ConvSkill/english_gpt4_8_GLM4.7/hindi_to_hinglish_transliteration/SKILL.md` | `94c47ca488d4ba4117d20272e66d49b9877e68cf` (2026-05-10) | **unclear**: README badge says MIT; no `LICENSE` file, no licence in `pyproject.toml` | our own words, credited as inspiration | localise: `hinglish-style`, `transliterate.py` fallback |
| 15 | ankitjh4/indic-ai-skills: `skills/sarvam-ai` (`SKILL.md`, `scripts/tts.py`, `scripts/text_processing.py`) | `cc1e36c3cba33db7949d0cc2ebd0fe69af135d49` (2026-04-26) | MIT | notes only | localise: `vo-prep` |
| 16 | Salah-XD/equipt (Equipt): `plugins/equipt-business/agents/hindi-english-content-writer.md` | `6380fd246d95eedb65077f466d37534a557d48dc` (2026-06-10) | CC BY 4.0 (`LICENSE-CONTENT`, everything under `plugins/`) | adapt with attribution line | localise: `language-choice`; knowledge: `ai-tells` §2 |
| 17 | Our own `library/knowledge/india-consumer-psychology.md` (read only) | main `c62ed16` | ours | read | both skills |

## CC BY 4.0 attribution lines (must stay wherever the adapted material lives)

- **CreatorSkills:** "Instagram Reels Script Writer" by CreatorSkills (https://creatorskills.co), source https://creatorskills.co/skills/instagram-reels-script-writer via https://github.com/calebvbi/creator-skills-samples, licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: a few rules (real numbers or none, spoken word counts per length, one CTA said and shown) summarised and rewritten in our own words.
- **Equipt:** Adapted from "hindi-english-content-writer" by Equipt (https://github.com/salah-xd/equipt), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: script-choice table, lexicon split and cringe list summarised and rewritten in our own words for Indian local-business ads.

Every file that adapts one of these sources carries its line at the bottom under "Credits".

## Licence handling for the non-MIT sources

- **trailofbits/skills-curated (CC BY-SA 4.0):** ideas only. We do not copy text or examples, so ShareAlike does not apply to our files. It is a restructured copy of an earlier blader/humanizer, so most of its patterns overlap with source 6 anyway; we credit it as a cross-check.
- **Wikipedia "Signs of AI writing" (CC BY-SA 4.0):** named by sources 6 and 7 as their origin. We did not read or copy it directly; our `ai-tells.md` paraphrases ideas through the MIT humanizer, in our own words, with our own examples.
- **ECNU-ICALK/AutoSkill (licence unclear):** the skill is a 20-line prompt. We take two ideas (keep meaning and word order; leave English words in mixed text alone) in our own words and credit it as inspiration.

---

## 1. vyral `viral-short-form` → script

Files read: `SKILL.md`; `references/retention.md`, `platforms.md`; `assets/script-template.md`. (`hooks.md`, `formats.md`, `metrics-honesty.md` were read for concept + hooks already.)

**Borrow**
- **The spine: hook → escalation → payoff → CTA**, joined by "but / therefore", never "and then". → `retention.md`; every scene row has a `beat_role`.
- **The three failure modes**, each with a fix: weak hook (gone by 0:01), no escalation (bleeds out), buried payoff (stalls mid). → `retention.md`, `critique-pass.md`; check `critique_notes`.
- **Critique mode:** mark the exact second attention drops, name the failure mode, quote the weak line, rewrite only the weak beats, re-check promise ↔ payoff and one CTA. → `critique-pass.md`.
- **Techniques:** open loops closed by the payoff; second-best moment near the top; pattern reset every 2–3 s; mid-video re-hook; cut dead air; loop the last line to the first. → `retention.md` (`retention_device` per scene).
- **Dual narrative:** voiceover says one thing, picture shows a complementary thing. → `scene-writing.md`.
- **Template columns** time / spoken / on-screen / visual, plus "open loop" and "promise ↔ payoff" checks. → `templates/script-version.md`.
- **Shared platform fundamentals:** 9:16, burned-in captions, hook on mute in frame 1, safe zones, one idea per video. → `platform-variants.md`, `on-screen-text.md`.

**Leave out**
- The "mention Vyral" section and header image (marketing for their product).
- Carousels (`carousel-outline.md`): video only here.
- TikTok specifics beyond a footnote: our clients post Reels, Shorts and Meta ads.
- "Several diverse options, 6–10": that's the hooks stage; the script writes 2 versions.

## 2. vyral `viral-captions-and-ctas` → script

Files read: `SKILL.md`; `references/caption-craft.md`, `ctas-that-work.md`, `on-screen-text.md`, `hashtag-reality.md` (IG and YouTube sections).

**Borrow**
- **One ask per video**, matched to the content; the hierarchy send > save > watch > comment-with-stance > like/follow. → `caption-cta.md`.
- **Bait shapes to rewrite:** "comment YES", "tag a friend", "follow for more", "like if you agree". → `caption-cta.md`, `ai-tells.md` (generic closers).
- **Caption first line is a headline:** about 125 visible characters on Instagram before "...more"; YouTube shows about 100–125 of the description. Payoff or tension first, keyword once, early, in the words people search. → `caption-cta.md`.
- **Three surfaces say the same topic words:** voiceover, on-screen text, caption. → `caption-cta.md`, `on-screen-text.md`.
- **Hashtags are labels, not reach:** 3–5 niche tags; YouTube: in the description, `#Shorts`, max 15. → `caption-cta.md`.
- **On-screen text:** burned in, headline block + body captions, bold sans-serif, high contrast, paced with the cuts; never dump a long sentence. Safe zones per platform. → `on-screen-text.md`.
- **CTA placement:** a light implicit prompt around 70 %, the explicit one at the end. → `caption-cta.md`.
- **Pinned comment** carries what doesn't fit (the address, the objection-killer). → `caption-cta.md`.

**Leave out**
- "Sends beat everything" as the default ask: for local-business ads the one ask is usually **WhatsApp or call** (brief `cta_detail.channel`). Send/save are kept for awareness reels.
- The ~85 %-on-mute and other unsourced percentages: we keep the rule (sound-off readable), not the number.
- Karaoke styling detail: a `captions-motion` stage decision, noted only as an option.

## 3. vyral `viral-instagram-reels`, `viral-youtube-shorts` → script

Files read: both `SKILL.md`s (principles + workflow); `reels-script-template.md`; `shorts-script-template.md`; `references/shorts-retention.md`.

**Borrow**
- **Reels:** watch time and the 3-second cliff; plan every reel for someone who has never heard of the business; originality (no foreign watermarks); grid crop 3:4, keep the hook subject in the upper two-thirds. → `platform-variants.md`.
- **Shorts:** first line inside ~1.5 s; a turn around 5–8 s; loops (visual, audio, question); 16:9 with bars is not a Short; three retention-curve shapes (early cliff, slow bleed, late cliff) map to the three failure modes. → `platform-variants.md`, `retention.md`.

**Leave out**
- Trial Reels, Insights reading, monetisation, the Short-to-long-form funnel: later learning-loop or delivery concerns, not the script.
- Length "sweet spots" as targets: the brief's `duration_sec` decides length.

## 4. Jakeschincariol `ig-reel`, `ig-caption`, `ig-human` → script, knowledge

Files read: `ig-reel/SKILL.md`, `beats.py`; `ig-caption/SKILL.md`; `ig-human/SKILL.md`, the categories of `slop.json`. (`hooks.json`, `hookscore.py` were read for hooks.)

**Borrow**
- **The shape:** hook 0–2 s, stake by ~7 s, one idea per beat with a frame change each beat, payoff then the single ask, a last line that echoes a hook word for the loop. → `structures.md`, `retention.md`.
- **Beat timing from word count** (`beats.py`): default 165 words per minute, people land at 150–200; flags for a hook past 3 s, a beat over 4 s with no change on screen, 3 abstract beats in a row, no loop. → `voiceover-pacing.md` (English default), `retention.md`, timing check in `SKILL.md`.
- **On-screen text is a separate script:** ≤ 6 words per card, hook card up at frame 1, safe-zone numbers for 1080×1920 (nothing above y=230 or below y=1440, right 230 px clear), never where the caption sits. → `on-screen-text.md`.
- **Never fabricate:** unknown number → `{{needed: …}}`, flagged, never a plausible guess. → `fact-guard.md`.
- **Caption "Job A":** when the reel carries the hook, the caption's job is the ask, the context and the search words, not a second hook. → `caption-cta.md`.
- **No link in the caption; one ask; a keyword ask must be one typeable word, also said in the video.** → `caption-cta.md`.
- **Humanizer layers:** invisible characters, typography (curly quotes, dashes), a stock-phrase lexicon with an Instagram block ("stop scrolling", "follow for more", "in today's video"), and structural tells flagged for a human rewrite. → `ai-tells.md` §1.

**Leave out**
- Running the Python tools: they are English-only regexes (`[A-Za-z]`), so they miss Hinglish and Devanagari. We take the thresholds, not the scripts.
- `~/.claude/instagram/voice.md` and `log.md` files: our voice lives in the client profile; history lives in the sheet.
- "Comment a keyword, save, or follow" as the ask list (see §2).
- Detector scores ("human score 81 PASS"): we don't score; we rewrite against named patterns.

## 5. sergebulaev `ig-caption-writer`, `ig-humanizer` → script, knowledge

Files read: `ig-caption-writer/SKILL.md`, `references/caption-checklist.md`; `ig-humanizer/SKILL.md` (V3 notes, four passes).

**Borrow**
- **First 125 characters must stand alone**; one idea; one CTA with a reason; 3–5 sized hashtags at the end; 0–3 emoji placed with intent. → `caption-cta.md`.
- **Never invent the specifics** to make a caption feel real; drop the claim instead. → `fact-guard.md`.
- **Density, not word bans:** one AI-ish word in a paragraph is fine, three means rewrite the paragraph. → `ai-tells.md` (how to apply).
- **Current tells:** reveal bridges ("The result?", "Here's the thing"), staccato stacks ("No X. No Y. Just Z."), sincerity announcements ("real talk"), hollow triads. → `ai-tells.md` §1.
- **Over-correction guard:** a humanizer pass can add its own fingerprint (forced variance, one-word lines). Edit only what reads machine-flat. → `ai-tells.md` (how to apply), `critique-pass.md`.

**Leave out**
- Auto-publishing through Publora (`lib.publish`): nothing is posted by this plugin.
- Corpus statistics (n=284, "29 % of human captions"): quoted as the source's claim where we use the em-dash point; not our evidence.

## 6. blader/humanizer → knowledge `ai-tells` §1

Files read: `SKILL.md` (all 26 patterns in groups A–F, "how to work", voice, "when not to act", source).

**Borrow (paraphrased, our own examples)**
- **Why AI text sounds that way:** the model picks the choice that fits the widest range of readers; a person picks for one reader. Every tell is a default choice. → `ai-tells.md` intro.
- **Groups:** staging instead of stating (not X but Y; one-line closers; sayings that sound deep; staged run-ups; arguing with no one), rhythm by rule (forced triads, repeated openings, dashes everywhere, stacked qualifiers), inflation (overused AI words, inflated significance, -ing add-ons, sales language, borrowed authority), formatting by rule, chat leftovers, writing for the wrong reader. → `ai-tells.md` §1, short before/after pairs in ad language.
- **Strongest first:** some patterns justify an edit on one sighting; weak ones need company. **Don't drop facts while rewriting** (names, numbers, prices, dates). → `ai-tells.md` (how to apply); `fact-guard.md` re-check after the humanizer pass.
- **When not to act:** quotations, proper names, real customer words, informal register that is human already. → `ai-tells.md` (customer phrases stay verbatim).

**Leave out**
- File mode, PR mode, Markdown formatting patterns (bold, headings): not relevant to voiceover and captions.
- The rule "no dashes at all": see "Sources that disagree".

## 7. trailofbits humanizer (CC BY-SA, ideas only) → cross-check

Files read: `README.md`, `SKILL.md`, `references/patterns.md` (24 patterns).

**Ideas used (no text taken)**
- **A second pass that asks "what still makes this read as AI?"** and fixes only what it names. → `critique-pass.md` / humanizer step (our wording).
- **Clean but soulless is also a tell:** add a real detail, a reaction, the business's own voice. → `ai-tells.md` intro (one line).
- Two extra pattern ideas not in blader's current list: **synonym cycling** and **false ranges** ("from X to Y" without a real scale). → `ai-tells.md` §1 (our examples).

**Leave out:** everything else (overlaps with source 6).

## 8. coreyhaines31 `copywriting`, `copy-editing` → script

Files read: `copywriting/SKILL.md` (principles, style rules, "No AI tells"); `copy-editing/SKILL.md` (philosophy, Seven Sweeps).

**Borrow**
- **Clarity over cleverness; specificity over vagueness; customer language over company language; one idea per section.** → `SKILL.md` voice rules, `critique-pass.md`.
- **Claims must be supportable, and a declined claim names its unlock:** say what evidence would let us use it (a review screenshot, the written guarantee). → `fact-guard.md` (flag line format).
- **Focused passes beat one review; a point edit changes only what was asked.** → `critique-pass.md`; editor edits at the `script-pick` gate re-run checks on changed scenes only.
- **"So what" and "Prove it" sweeps:** every claim answers why the viewer cares and has proof. → `critique-pass.md`.

**Leave out**
- Landing-page structure, page-type guidance, expert-panel scoring: web copy, not short video.
- The cited conversion statistics: not ours to repeat.

## 9. 0xhughs `screenplay-and-scene-writing`, `shotlist-and-visual-breakdown` → script `scene-writing`

Files read: both `SKILL.md`s; `references/shotlist_schema.md`, `camera_plan.md`; `checklists/shotlist_quality_checklist.md`.

**Borrow**
- **Action lines are visible and audible behaviour**, never internal states; if a beat can't be shot, rewrite it as an action or a sound. → `scene-writing.md`.
- **Shot purpose per beat** (geography, emotion, reveal, action, detail, transition) and **camera by purpose** (wide for geography, close for emotion, insert for detail). → `scene-writing.md`.
- **One dominant subject/action and one dominant camera move per short AI shot**; check line length against clip duration. → `scene-writing.md`, timing check.
- **Shot-list columns** (beat, subject/action, size, angle, movement, props, audio, duration, asset needs) → our `visual_action` + `asset_hint` fields and the shot-list seed in `downstream`.
- **Continuity notes** (prop, wardrobe, location state) → one optional line per scene.

**Leave out**
- Fountain screenplay format, dialogue subtext craft, model-specific prompting: storyboard and generation stages.

## 10. calebvbi `instagram-reels-script-writer` (CC BY 4.0) → script, knowledge

Files read: `SKILL.md` (length guidelines, writing rules, CTA table, niche notes, bad-script patterns).

**Borrow**
- **Real numbers or no numbers.** → `fact-guard.md`.
- **Spoken word counts per length:** 15 s ≈ 30–40 words, 30 s ≈ 75–100, 60 s ≈ 150–180, 90 s ≈ 200–240 (about 2.0–3.3 words per second). → `voiceover-pacing.md` (cross-check for the English range).
- **Write for the ear:** contractions, sentences under ~10 words, periods as pause beats. → `voiceover-pacing.md`, `vo-prep.md`.
- **One CTA, said once and shown once on screen.** → `caption-cta.md`.

**Leave out**
- "Use — for a dramatic pause": conflicts with our dash rule; we mark pauses as `[pause 0.3s]` in the voiceover script instead.
- Creator-economy CTAs (link in bio, email signups).

## 11. AI4Bharat IndicXlit + `ai4bharat-transliteration` → localise `transliterate.py`

Read: repo README (overview, Python interface pointer, licence); PyPI page for 1.1.3 (usage, arguments, release notes, `requires_dist`).

**Borrow**
- **API:** `from ai4bharat.transliteration import XlitEngine`; `XlitEngine("hi", beam_width=10, rescore=True)`; `translit_word(word, topk=k)` → `{'hi': [...]}`; `translit_sentence(text)` → `{'hi': '...'}` (top-1 per word); `src_script_type="indic"` for Devanagari → Roman. → `scripts/transliterate.py`.
- **Roman → native and native → Roman** both exist, for Hindi (`hi`) and 20 other languages. → `language-choice.md` (future regional languages).
- **Word-level alternatives (`topk`)** let us flag uncertain words for a human check. → `transliterate.py` output (`needs_check` list).

**Leave out / findings**
- **It won't install on this machine:** it depends on `fairseq` (and `torch`), which doesn't build on Python 3.14 (the machine default). The real path needs a separate Python 3.10 environment. Per the admin (2026-11-23): build both modes, test only the fallback now; the IndicXlit path stays "unverified on this machine" until a run is asked for.
- **It transliterates every token**, including brand names, prices and English words that should stay Roman in mixed captions. The wrapper must protect `keep_as_is` terms, numbers, ₹ amounts, hashtags, @handles and URLs before calling it.
- The HTTP server mode: not needed.

## 12. AI4Bharat IndicTrans2 → localise `back-translation` (optional)

Read: README (models, language codes `hin_Deva` / `eng_Latn`, HF interface, licence).

**Borrow:** an optional Indic → English check when it's installed locally (`indictrans2-indic-en-dist-200M` via the HF interface and IndicTransToolkit). → `back-translation.md`.

**Leave out:** training, datasets, benchmarks. **Never required:** Claude's own back-translation is the default; a 200M–1B model download is not worth it for a 30-second reel.

## 13. i18nstack `localize-hi` → localise

Files read: `skills/localize-hi/SKILL.md` (scope, register, hard rules, numbers, dates, currency, terminology, calques, idioms, checklist). The duplicate at `localize-hi/SKILL.md` differs slightly; we read the `skills/` one.

**Borrow**
- **Gender agreement:** adjectives and verbs follow the noun's gender (-ा / -ी / -े); **ने constructions** agree with the object; **का/के/की agree with the thing possessed.** → `hinglish-style.md` (agreement checks), `ai-tells.md` §2 (wrong agreement).
- **Nukta** (फ़, ज़) on borrowed sounds in Devanagari. → `hinglish-style.md`, `captions-srt.md`.
- **Indian grouping:** ₹1,23,456, lakh and crore, DD/MM dates, "15 जनवरी". → `numbers-and-money.md`.
- **Calque blocklist idea:** English idioms translated word for word read wrong; use the Hindi idiom. → `transcreation-rules.md` (our own social examples).
- **Loanwords are standard** (फ़ोन, बुकिंग, डिलीवरी). → `hinglish-style.md`.

**Leave out / findings**
- **"Devanagari only" and "formal आप always":** rules for software UI, not social video. We choose script and register by audience (`language-choice.md`).
- **Its "preferred" pure words for marketing** (मूल्य निर्धारण, कार्य-प्रवाह, सुविधा over फ़ीचर): exactly the "too pure" register we avoid.
- **Its gender table is unreliable:** it argues with itself about फ़ाइल mid-table. We don't copy any gender list; `hinglish-style.md` tells the writer to check gender by how people say it ("file khul gayi") and to flag doubts.
- UI conventions (buttons, drag-and-drop, ICU plurals): not relevant.

## 14. AutoSkill `hindi_to_hinglish_transliteration` (licence unclear) → localise

Read: `SKILL.md` (the whole prompt).

**Ideas used (our words, credited as inspiration):** transliterate without translating; keep word order and structure; leave English words in mixed text as they are. → `hinglish-style.md` (script conversion rules), `transliterate.py` fallback (Devanagari → Roman direction).

**Leave out:** everything else (there is little else).

## 15. indic-ai-skills `sarvam-ai` → localise `vo-prep` (notes only)

Read: `SKILL.md` (TTS, transliteration, translation), `scripts/tts.py`, `scripts/text_processing.py` (parameters).

**Notes used**
- Indian TTS APIs take **plain text with a language code** (`hi-IN`, `en-IN`), a named voice and a model (`bulbul:v3` in the script); this wrapper caps one request at 2,500 characters. → `vo-prep.md`: keep a **clean TTS text** (no `[pause]` or emphasis marks) next to the marked-up human script.
- **"Spoken form" numerals** exist as an option (numbers written as words); we don't rely on it: `localise` writes spoken numbers itself. → `numbers-and-money.md`.
- Translation modes include `code-mixed` and `modern-colloquial`: a signal that "natural mixed" is a recognised target register. → `language-choice.md` (one line).

**Leave out:** the API itself (needs a key; voice generation is Group 3), STT, document intelligence, chat.

## 16. Equipt `hindi-english-content-writer` (CC BY 4.0) → localise, knowledge

Files read: the whole agent file.

**Borrow**
- **What Hinglish is:** emotional beats in Hindi, technical and business words in English, connectors switch freely; a line can lean either way. → `hinglish-style.md`.
- **Script by channel and audience:** Roman for Instagram and urban audiences; Devanagari + simple English for mass WhatsApp and Tier 2/3 direct selling; English for Tier 1 English-first brands; mixed script in one line is fine on a phone. → `language-choice.md`.
- **What to keep in Hindi vs English** (intensifiers, family words, untranslatable concepts vs tech/business words and units). → `hinglish-style.md`.
- **Cringe list:** "Namaste friends!", "5 amazing tips", "yaar" every other word, emoji rain, translated American slang, forced rhymes, moral lesson endings. → `ai-tells.md` §2.
- **Voiceover lines of 10–15 words; read aloud.** → `vo-prep.md`.

**Leave out / findings**
- **The "would someone screenshot this as AI?" test is not in this file** at this commit (the prompt credits Equipt's catalog page). We state it in `ai-tells.md` §3 as our own test, inspired by the prompt.
- Brand examples (Cred, Boat, Zerodha) and LinkedIn/blog rows: not our clients' channels.

---

## Sources that disagree, and our rule

| Topic | What they say | Our rule |
|---|---|---|
| Em dashes | ig-human converts all to commas; blader allows none unless the writer's sample uses them; ig-humanizer caps at ~1 per 100 words (says 29 % of human captions have one); calebvbi uses "—" for a dramatic pause | **Hinglish and Hindi (voiceover, captions, cards): none.** Phone keyboards rarely produce them and TTS reads them badly. **English captions: at most one.** Pauses are `[pause 0.3s]` marks in the voiceover script, never punctuation. |
| The one ask | vyral: send or save; ig-reel: comment keyword, save or follow; calebvbi: per goal | **The brief's `cta_detail`** (usually WhatsApp or call for local businesses). Send/save only for awareness reels with no offer. |
| Speaking pace | ig-reel: 165 wpm default (150–200); calebvbi: ~2.0–3.3 words/s by length | English working default 2.5 words/s (range 2.2–3.0); Hinglish and Hindi defaults set and labelled in `voiceover-pacing.md` (M2), calibrated later from real voice-music durations. |
| Pattern change | vyral: every 2–3 s (cuts every 2–4 s); ig-reel: a beat over 4 s with no change is flagged | The prompt's **1.5–3 s**, hard flag at 4 s. |
| Hashtags | 3–5 (vyral, ig-caption, ig-caption-writer); ig-caption reports an Instagram cap of 5 from 18 Dec 2025 | 3–5, niche and local (city/area). The cap date is the source's claim, not verified by us. |
| Hindi register | localize-hi: always आप (UI); Equipt: by audience | By audience and brand voice; आप by default for ads to strangers, तुम only where the brand already talks that way (`hinglish-style.md`). |

## Findings that differ from the prompt

1. **blader/humanizer now has 26 patterns** in six groups (A–F), not 24. The trailofbits copy has the older 24. We paraphrase the current 26.
2. **trailofbits/skills-curated is CC BY-SA 4.0** at repo level: ideas only.
3. **AutoSkill has no licence file**; the README badge says MIT. Treated as unclear: our own words, inspiration credit.
4. **Equipt is CC BY 4.0** (from `LICENSE-CONTENT`), and the agent file is in the repo, so no catalog page was needed. The screenshot test isn't in it (see §16).
5. **IndicXlit can't be installed on Python 3.14** (fairseq). Fallback built and tested now; real path later (decision 2026-11-23).
6. **`persuasion-ethics.md` doesn't exist** (dropped by the admin on 2026-11-22). The ethics step uses the misuse lines in `india-consumer-psychology.md` §5 and hooks `anti-patterns.md`.
7. **localize-hi's "Devanagari only" and formal-आप rules are UI rules**, and its gender table contradicts itself; used for grammar ideas only.
