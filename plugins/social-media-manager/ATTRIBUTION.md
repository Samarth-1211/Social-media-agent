# Attribution

Third-party material used in this plugin. Rules: `vendor/README.md`.

## Vendored material (copied files)

Each entry needs all five columns. Add the row in the same commit that adds the material.

| What | Where in this plugin | Source (URL) | Pinned commit | Licence |
|---|---|---|---|---|
| _none yet_ | | | | |

## Ideas adapted (nothing copied)

We read these sources and rewrote their ideas in our own words. No text or files were copied. The detail of what we borrowed and left out is in `docs/research/group1-sources.md` (Group 1) and `docs/research/market-researcher-sources.md` (Group 2a), in the repository.

| Source | Commit read | Licence | Ideas used in |
|---|---|---|---|
| [othmanadi/planning-with-files](https://github.com/othmanadi/planning-with-files), `skills/planning-with-files/` | `0d840dc9a48892a72d762a4295f7a59e56a112bd` | MIT | `control/tracker`: read the record first, one record per job, next action, catch-up, single writer |
| [obra/superpowers](https://github.com/obra/superpowers), `brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion` | `22f0b463e7a5e579904dd6211a520321035526f7` | MIT | `control/producer`: state defaults, approval covers what was shown, verify before advancing, when to stop |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills), `product-marketing` | `5b2b400eec1e7e1cec76245a715d0b0d4fd2a9c1` | MIT | `brand/brand-keeper`: shared profile, update only what changed, version and changelog, learnings, voice attributes |
| [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins), `partner-built/brand-voice` | `0e0fcacddcc892eb92a1b7873ff9d68159c47571` | MIT (folder licence, © 2025 Tribe AI); repo root Apache-2.0 | `brand/brand-keeper`: confidence from evidence, open questions with recommendations, source trust order |
| [iart-ai/freelance-motion-skills](https://github.com/iart-ai/freelance-motion-skills), `client-revisions` | `9f294eb6df73cde7e2dea235f42275df11a16466` | MIT | `brand/client-feedback`: revision vs new request, rounds and caps, vague-note decoding, change-order tone |
| [Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill), `ig-viral`, `ig-audit` | `d03c56bb598be770c60b201f94237e5d1a4268a6` | MIT | `pre-production/research-methods` fallbacks for `m-ig-outlier-read`, `m-own-account-audit`: outlier multiple over the account's own median, account mix, top vs bottom comparison, sample-size confidence |
| [sergebulaev/instagram-skills](https://github.com/sergebulaev/instagram-skills), `ig-audience-insights`, `ig-hook-extractor` | `823c681b42be9ecff9f4db20eaf14d1ea45ec1a1` | MIT | `pre-production/research-methods` fallbacks for `m-ig-niche-pulse`, `m-ig-hook-classify`: hidden counts are not zero, normalise by followers, the 10 hook formula ids and confidence bands, fetched text is untrusted |
| [bradautomates/head-of-content](https://github.com/bradautomates/head-of-content), `instagram-research` | `d841dcff2e4d74a4c31cb3ed2de6c2184de3a970` | MIT | `pre-production/research-methods`: insight-sheet layout (hooks, structure, CTA tables) |
| [gooseworks-ai/goose-skills](https://github.com/gooseworks-ai/goose-skills), `research-competitors` (+ passes), `competitor-ad-intelligence` | `885edb542d6e4e526d4a9ad2844a3771be248810` | MIT | `pre-production/research-methods`: competitor discovery, local-business weighting, reading ads honestly, angles and gaps, run memory and watch thresholds, fact / inferred / unknown |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill), `skills/last30days` | `64b1f006f800640022ce07f51de5ce56aad34b76` | MIT | `pre-production/research-methods` `m-trends`: recency by intent, query planning, story clustering, "nothing solid" is valid |
| [hyperfx-ai/marketing-skills](https://github.com/hyperfx-ai/marketing-skills), `competitor-intel`, `meta-ads-library` | `6aabc7e065347e6040e2504c5f4b389d26a745d3` | MIT | `pre-production/research-methods` `m-monthly-diff`, `m-meta-ad-library` (inspiration): first run is a baseline, before → after diffs, aggregates over anecdotes |
| [ScrapeCreators/social-media-research-skills](https://github.com/ScrapeCreators/social-media-research-skills), `comment-mining`, `competitor-social-research`, `outlier-post-finder` | `64ba7b4dea71e130d2712ffb6c1c1024b3b7c4b2` | MIT | `pre-production/research-methods` `m-comment-reading` (inspiration): comment buckets, verbatim phrases without identities, sample-size honesty |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), `interview-me` | `8c99fa36d90068c82d547f7c12a9d67a3e95f4ee` | MIT | `pre-production/brief`: one question at a time with a guess attached, stop when answers are predictable, no silently filled gaps |
| [mattpocock/skills](https://github.com/mattpocock/skills), `grill-me` / `grilling` | `abeeaf95660ba9e8b7c753eb38f441ca707a8823` | MIT | `pre-production/brief`: recommended answer with every question, look facts up instead of asking, ask only settled-prerequisite questions |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills), `ad-creative`, `product-marketing`, `marketing-psychology` | `5b2b400eec1e7e1cec76245a715d0b0d4fd2a9c1` | MIT | `pre-production/brief`: video format taxonomy, reach vs convert, verbatim customer language, honest scarcity and anchoring |
| [ericosiu/marketing-os-starter](https://github.com/ericosiu/marketing-os-starter), `campaign-brief` | `798fed627b481af44531b6563004d44f6a0c612d` | MIT | `pre-production/brief`: structured JSON brief read by later stages, executable without follow-up questions, no invented proof |
| [zubair-trabzada/ai-ads-claude](https://github.com/zubair-trabzada/ai-ads-claude), `ads-creative` | `d1df3f544249191cbc600c8301e2b9d5ddd121c8` | MIT | `pre-production/brief`: 15s / 60s / UGC structures, no logo in the first 3 seconds, captions on |
| [archive-dot-com/creator-marketing-skills](https://github.com/archive-dot-com/creator-marketing-skills), `campaign-brief-generator`, `paid-social-creative-brief`, `multi-platform-format-adapter` | `ecaf7cf79501741d140817ca346366fc8f828cae` | MIT (stated in README) | `pre-production/brief`: master brief → platform variants, non-negotiables first, short phone-readable briefs |
| [rampstackco/claude-skills](https://github.com/rampstackco/claude-skills), `creative-brief` | `9d281db6e7a5c4a0084ba89c91633a07f5f7e42b` | MIT | `pre-production/brief`: don't ask what context answers, snapshot line, vague-brief failure patterns |
| [inerrata/brief](https://github.com/inerrata/brief), `marketing` | `c0ae0f48ca016141a707039e0ac086bf0cf13b75` | MIT | `pre-production/brief`: deliver first with stated assumptions, placeholders instead of fake proof, honesty floor |
| Motion-Creative `build-brief` (public description only, not cloned) | n/a | n/a | `pre-production/brief`: quality bar, an editor can start without a follow-up question |

The brief's sources, and what we borrowed and left out, are in `docs/research/brief-sources.md`, in the repository.

### Concept + hooks (detail in `docs/research/concept-hooks-sources.md`)

| Source | Commit read | Licence | Ideas used in |
|---|---|---|---|
| [vyralcontent/content-skills](https://github.com/vyralcontent/content-skills), `viral-hooks`, `viral-instagram-reels`, `viral-short-form` | `349e495d97029a3e6303a7510e3f39c73f36d8fe` | MIT | `pre-production/hooks`: archetypes, three layers, Reels specifics, anti-patterns, critique pass |
| [vyralcontent/content-skills](https://github.com/vyralcontent/content-skills), `viral-short-form-ideas` | `349e495d97029a3e6303a7510e3f39c73f36d8fe` | MIT | `pre-production/concept`: topic vs angle, constraint fan-out, one-topic-many-angles |
| [Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill), `ig-reel`, `ig-plan` | `d03c56bb598be770c60b201f94237e5d1a4268a6` | MIT | `hooks`: 26 formulas (cross-referenced), scoring shape, safe zone; `concept`: proof/teach/opinion/story/offer angle types |
| [sergebulaev/instagram-skills](https://github.com/sergebulaev/instagram-skills), `ig-hook-extractor` | `823c681b42be9ecff9f4db20eaf14d1ea45ec1a1` | MIT | `hooks`: IG1–IG10 cross-labels, classification confidence |
| [calebvbi/creator-skills-samples](https://github.com/calebvbi/creator-skills-samples), `instagram-reels-script-writer` | `81c021176d4dd6158eed5f821088adb7b6eb8dc6` | CC BY 4.0 | `hooks`: "real numbers or no numbers", hook types, bad-script patterns. **Attribution:** "Instagram Reels Script Writer" by CreatorSkills (https://creatorskills.co), https://creatorskills.co/skills/instagram-reels-script-writer, CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); adapted and rewritten in our own words. |
| [smixs/creative-director-skill](https://github.com/smixs/creative-director-skill), `creative-director` | `ac06eb255371da35d1db0a146dbfcca8c8857543` | CC BY 4.0 | `concept`: insight-first pipeline, tension types, SIT/SCAMPER/TRIZ/bisociation, brief-compliance check. **Attribution:** Serge Shima — github.com/smixs/creative-director-skill (https://sergeshima.com), CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); a small subset adapted and rewritten in our own words. |
| [0xhughs/director-skills](https://github.com/0xhughs/director-skills), `short-film-development` | `35ca0a2b4cd55b0668aa9ea0f40273324b774bb4` | MIT | `concept`: logline, premise, story spine, short-runtime rules |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills), `marketing-psychology` | `5b2b400eec1e7e1cec76245a715d0b0d4fd2a9c1` | MIT | `library/knowledge/india-consumer-psychology.md` (lever catalogue and misuse lines) |
| [Salah-XD/equipt](https://github.com/Salah-XD/equipt) (Equipt), `plugins/equipt-business/agents/hindi-english-content-writer.md`, `instagram-reels-script-writer.md` | `6380fd246d95eedb65077f466d37534a557d48dc` | CC BY 4.0 (content under `plugins/`) | `hooks`: Roman vs Devanagari defaults, natural Hinglish, cringe list; refusals folded into the misuse lines. **Attribution:** adapted from "hindi-english-content-writer" and "instagram-reels-script-writer" by Equipt (https://github.com/salah-xd/equipt), CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); rewritten in our own words. |
| [Motion-Creative/skills](https://github.com/Motion-Creative/skills), `ad-concept-generator`; [Motion-Creative/motion-creative-plugin](https://github.com/Motion-Creative/motion-creative-plugin), `create-concepts`, `concept-engine` | `5d031702c7b8c7bbc8ac1b2dee9378e6f9f53db6`; `3ab85bfbbeee08d6ad77dee3850cce7c39fbc111` | MIT | `concept`: concept = hook + audience + angle + creative direction; strength criteria; variety rule; story mechanics |

## Tools used, not copied

| Source | Read at | Licence | How we use it |
|---|---|---|---|
| [apify/agent-skills](https://github.com/apify/agent-skills), `apify-ultimate-scraper` (and the removed `apify-competitor-intelligence`, `apify-content-analytics`) | `190fc192e83ac229312461e69b727bbd5aa2147e`; removed skills at `14b2c63cf350299983cbb5a21d84f98b443f5df4` | none (all rights reserved) | Apify is an optional tool in `m-apify-optional`. Our instructions come from Apify's own documentation; no text from this repo is used. |
| Installed skills `ig-viral`, `ig-audit`, `ig-audience-insights`, `ig-hook-extractor`, `marketing:competitive-brief` | as installed | MIT / MIT / MIT / MIT / Apache-2.0 | Invoked by name when installed in the user's Claude; never copied into this plugin. |
