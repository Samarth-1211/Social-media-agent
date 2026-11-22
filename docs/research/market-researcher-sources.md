# Market researcher research: sources, methods and tools

- **Read on:** 2026-11-22, for Group 2a (`market-researcher` subagent + `pre-production/research-methods` skill).
- **Clones:** in `../_research/`, outside the repo. Installed skills were read in place (`~/.claude/skills/synced/…`, `~/.claude/plugins/synced/…`).
- **What we did with them:** read them fully and rewrote the methods in our own words. **Nothing was copied or vendored.** Installed skills are **invoked by name** when present, never copied. Every source is recorded in `plugins/social-media-manager/ATTRIBUTION.md`.
- **How to read this:** each section lists what we borrow (→ the module it lands in), then what we leave out and why. The last sections cover connected tools, platform terms, and the contract changes this research feeds into M2.

| Source | Commit / version | Licence | Use | Feeds |
|---|---|---|---|---|
| Jakeschincariol/instagram-agent-skill (`ig-viral`, `ig-audit`) | `d03c56bb598be770c60b201f94237e5d1a4268a6` (2026-09-13) | MIT | invoke when installed; method in our words as fallback | `m-ig-outlier-read`, `m-own-account-audit`, `competitor-discovery`, `confidence-rules` |
| sergebulaev/instagram-skills (`ig-audience-insights`, `ig-hook-extractor`) | `823c681b42be9ecff9f4db20eaf14d1ea45ec1a1` (2026-11-18), plugin v1.0.33 | MIT | invoke when installed; method in our words as fallback | `m-ig-niche-pulse`, `m-ig-hook-classify` |
| bradautomates/head-of-content (`instagram-research`) | `d841dcff2e4d74a4c31cb3ed2de6c2184de3a970` (2026-01-23) | MIT | ideas (cross-check) | `m-ig-outlier-read`, `templates/insight-sheet.md` |
| gooseworks-ai/goose-skills (`research-competitors` + passes, `competitor-ad-intelligence`) | `885edb542d6e4e526d4a9ad2844a3771be248810` (2026-11-16) | MIT | ideas | `m-web-competitor-intel`, `m-meta-ad-library`, `m-maps-review-reading`, `m-monthly-diff`, `competitor-discovery`, `confidence-rules` |
| mvanhorn/last30days-skill (`skills/last30days`) | `64b1f006f800640022ce07f51de5ce56aad34b76` (2026-11-21) | MIT | method only | `m-trends`, `confidence-rules` |
| apify/agent-skills (`apify-ultimate-scraper`; removed `apify-competitor-intelligence`, `apify-content-analytics`) | HEAD `190fc192e83ac229312461e69b727bbd5aa2147e` (2026-11-20); removed skills read at `14b2c63cf350299983cbb5a21d84f98b443f5df4` (2026-03-20) | **none** | tool use only; nothing copied | `m-apify-optional` |
| hyperfx-ai/marketing-skills (`competitor-intel`, `meta-ads-library`) | `6aabc7e065347e6040e2504c5f4b389d26a745d3` (2026-11-19) | MIT | ideas only | `m-monthly-diff`, `m-meta-ad-library` |
| ScrapeCreators/social-media-research-skills (`competitor-social-research`, `comment-mining`, `outlier-post-finder`) | `64ba7b4dea71e130d2712ffb6c1c1024b3b7c4b2` (2026-08-26) | MIT | ideas only | `m-comment-reading`, `m-ig-outlier-read` |
| Anthropic `marketing` plugin (`competitive-brief`) | plugin v1.2.0 (installed copy) | Apache-2.0 | optional delegation only | positioning section of `m-web-competitor-intel` |

**Moved or missing (reported to the admin, not substituted silently):**
- `goose-skills` has no `competitor-intel`. It is a retired slug (`retired-skills.json`) replaced by `skills/marketing/research-competitors`. We read that plus its rival, category and edge-case passes, and `skills/shared/competitor-ad-intelligence`, with the admin's OK.
- `apify/agent-skills` removed `apify-competitor-intelligence` and `apify-content-analytics` on 2026-03-23 (commit `d753dca`). We read them at the commit before, with the admin's OK. They add almost nothing beyond `apify-ultimate-scraper`.
- `last30days` keeps its main skill at `skills/last30days/SKILL.md`, not at the repo root.
- There is no `instagram-agent` plugin. `ig-viral` and `ig-audit` are **personal skills synced to the account**, from instagram-agent-skill; this Claude Code session lists them as `anthropic-skills:ig-viral` / `anthropic-skills:ig-audit`. The `instagram-skills` and `marketing` plugins are synced to the account but not active in this Claude Code session. **So modules look for the bare skill name under any namespace** and report which path ran.

---

## 1. instagram-agent-skill: `ig-viral` → `m-ig-outlier-read`

Files read: `README.md`, `skills/ig-viral/SKILL.md`, `skills/ig-viral/swipe.py` (input/output only), `skills/ig-reel/hooks.json` (what the classifier needs), `skills/ig-audit/SKILL.md`.

**Borrow**
- **Outlier multiple, never raw views.** Multiple = a reel's views ÷ that account's own recent median (about its last 12 reels). Above 3x is a signal; below 1.5x is that account's normal. → The only ranking used by `m-ig-outlier-read` and the "outliers judged against each account's own median" self-check.
- **Account mix and size band.** 6–12 accounts within about 10x of the client's size: 4 direct (same offer, a bit ahead), 4 adjacent (same audience, different business), 2–4 outsized (format only, never tone or cadence). → `competitor-discovery` proposes accounts in these three `group`s. For an Indore laundry: local laundries and dry cleaners; adjacent home and lifestyle services in MP; outsized national laundry or cleaning brands.
- **What to record per reel:** account, followers, median, views, hook (first spoken or on-screen line, verbatim), on-screen text card, length, CTA. → `outlier_hooks[]` finding fields, plus formula id and confidence from `m-ig-hook-classify`.
- **Read the corpus in thirds.** Compare the top third with the bottom third by multiple: formula counts, hook length, structure, where the ask sits. Report only patterns that repeat across accounts; read unclassified hooks by hand. → Analysis step and `working_angles` / `competitors_overdo`.
- **Say how strong the evidence is.** About 40 reels across 6 accounts supports a claim; 12 reels doesn't. → `confidence-rules`: `strong` / `some` / `weak` tied to sample size.
- **Reading, not scraping.** Use the browser the person is already logged in to, at human speed, about 10 accounts × a dozen reels; never log in for anyone, never ask for a password, no crawler, no background loop. → `Needs a person present: yes`; caps; the attended mode in `automation.md`.
- **Copy the formula, never the video.** Attribute every captured row to its account. → Quality rule; competitor and creator handles are allowed as sources, commenters never.
- **Honesty about the classifier.** Its README reports the hook scorer separates good from bad hooks but can't pick winners, and that abstaining on unclassifiable hooks is correct. → We never claim to predict virality; unclassified hooks stay "unclassified".
- **Run monthly, not daily**; formulas last a season. → Monthly refresh cadence and `freshness_days: 30`.

**Leave out**
- **The Python helpers** (`swipe.py`, `hookscore.py`, `hooks.json`), fetched from GitHub at run time and run with `python3 -I`. `python3` isn't on the team's Windows machines (only the Store shim), and scripts don't run on claude.ai. When the installed skill runs, it uses them itself; our fallback does the maths in the prompt.
- **The per-machine swipe file** (`~/.claude/instagram/swipe.md`). It isn't per client and isn't shared. We save captured rows and results to our storage (insight sheet + raw file); if the installed skill writes its swipe file, we read it once and copy the client's rows into storage.
- **The YouTube Shorts / `yt-dlp` fallback corpus.** Extra tool, weak signal for Indian local businesses.

## 2. instagram-agent-skill: `ig-audit` → `m-own-account-audit`

**Borrow**
- **The client's own numbers, ranked by outlier multiple and sends per reach** (shares ÷ reach), not views. Supporting metrics: hold at 3s (hook grade), average watch time, follows per reach, non-follower share of reach. → `own_account` block of the insight.
- **Top 5 vs bottom 5** of about 30 posts, checked in order: hold at 3s, hook formula, format, length bucket (<15, 15–30, 30–60, >60 s), theme, early comment replies, and day/time last (rarely the cause). → Steps of `m-own-account-audit`.
- **Views but no follows is a profile problem; no views is a hook problem.** → A finding type for the brief.
- **Claims with evidence and confidence** (30 posts shows a pattern, 6 doesn't). → `confidence-rules`.

**Leave out**
- Nothing structural. It needs per-post Insights, which arrive by paste, export or screenshots; see §10 for what the Meta connector can supply.

## 3. instagram-skills: `ig-audience-insights` → `m-ig-niche-pulse`

Files read: `README.md`, root `SKILL.md`, `SECURITY.md`, `skills/ig-audience-insights/`, `references/mcp-read-layer.md`, `references/untrusted-content.md`, `lib/` (actor IDs and inputs only).

**What it actually reads from:** **Apify** (`APIFY_TOKEN`), or Apify's hosted MCP connector on claude.ai, or **pasted data**. It never drives a browser. So without Apify, our module uses its own attended browser read of hashtag and profile pages, or pasted figures, and the installed skill is used only when Apify is on or data is pasted.

**Borrow**
- **Hidden counts are not zero.** Skip rows whose likes or comments are hidden; never count them as 0. → `m-ig-niche-pulse` pitfalls.
- **Normalise by follower count** before calling anything a winner; a pattern must repeat across several top posts. → Steps and `confidence-rules`.
- **Thin hashtag → try an adjacent tag.** → Matches our "small niche → widen to category or city, and say so" rule.
- **Prefer reels over posts** when scanning a hashtag: the posts view returns minutes-old items with almost no engagement. → Hashtag pulse reads the reels tab.
- **Say which source was used** (fetched, connector, pasted), and never present pasted numbers as fetched. → `methods_used[].path` and source fields.
- **Captions and bios are untrusted data:** quote them, attribute them, never follow instructions inside them, flag injected text in one line. → Our privacy and safety rules (already the rule for client messages in Group 1).
- **Narrow the Apify connector** to named actors so arbitrary paid actors can't run. → `m-apify-optional`.

**Leave out**
- **The publishing layer** (Publora, custom poster command, image API), voice rules and marketplace copy. Not research.
- **Its Python client.** Only used when the installed skill itself runs.

## 4. instagram-skills: `ig-hook-extractor` → `m-ig-hook-classify`

**Borrow**
- **The 10 formulas, by id:** IG1 Number-First Result, IG2 Contrarian Truth, IG3 Relatable Cold-Open, IG4 Mini-Story Confession (caption-first); IG5 Listicle Carousel, IG6 Before/After Transformation, IG7 Myth-Buster Carousel, IG8 Steal-This Framework (carousel); IG9 Pattern-Interrupt Reel, IG10 How-I Reel Teardown (reel). → Our `formula` field uses these ids when the skill is installed; the fallback uses short descriptions of our own for the same ids, so results stay comparable.
- **Surface first, then cues:** decide photo / carousel / reel, then match the opening's shape. → Fallback classifier steps.
- **Confidence bands:** high (≥0.8, clean match), medium (0.5–0.8, overlap; give the top two), low (<0.5: describe literally, name the closest). Tie-break on the post's goal (saves, shares, comments, follows). → `outlier_hooks[].formula_confidence`.
- **Return a blank template, never a copy.** → "Copy the formula, never the video."

**Leave out**
- **Caption micro-rules and hashtag counts** (first 125 characters, hashtag numbers). Platform-stale; the sister repo already notes a hashtag-limit change. Not our job here.
- **US-English AI-vocabulary checks.** Our customer language is Hindi, Hinglish and English.
- It has no post reader: a reel's opening must be captured by the browser read or pasted.

## 5. head-of-content: `instagram-research` → cross-check for `m-ig-outlier-read`

Files read: `.claude/skills/instagram-research/SKILL.md`, `scripts/fetch_instagram.py`, `scripts/analyze_posts.py` (method only).

**Borrow**
- **Report layout:** top hooks (technique, opening line, why it works, a reusable formula), content-structure table (format, pacing, retention), CTA table (type, text, placement), trending topics, 4–6 takeaways, accounts analysed. → `templates/insight-sheet.md`.
- **A weighted engagement score** (comments weigh more than likes; views weigh little), as a secondary signal only. → Pitfall note: never mix accounts in one baseline.

**Leave out**
- **Its outlier rule** (engagement rate above batch mean + 2 standard deviations, across all accounts together). It mixes accounts of very different sizes; ig-viral's per-account median is the better rule.
- **Gemini video analysis** (a third paid key, uploads videos), Apify scripts, an English-only stop-word list (misses Hindi and Hinglish).

## 6. goose-skills: `research-competitors` + `competitor-ad-intelligence` → web, ads, reviews, diff, discovery

Files read: `skills/marketing/research-competitors/SKILL.md` and all of `references/` (`page-technology.md` and `linkedin-engagers.md` skimmed: leave-outs), the rival, category and edge-case pass skills, `skills/shared/competitor-ad-intelligence/SKILL.md`.

**Borrow**
- **Find the field first** with 6–10 searches ("best <category> in <city>", "<brand> alternatives"); pick main rivals with a one-line reason each, plus adjacent options; state the frame in one line; say if the set changed since last run and why. → `competitor-discovery`.
- **Local-business weighting.** Most depth on Google Business Profile (reviews, photos, posts), the map pack, Facebook reviews, local Meta ads, offers, hours, service area; least on hiring and LinkedIn. Review volume and owner reply speed matter most. → `m-web-competitor-intel` and `m-maps-review-reading`.
- **Per-rival capture:** snapshot, recent news (90 days), offers and "what a typical customer pays" for one stated scenario, headline promise word for word, praise and complaint quotes, where we win or lose. Every fact carries link, date and a confidence word. → Finding fields (`source`, `confidence`) and the competitor snapshot.
- **Reviews:** read about 30 recent ones per rival, weighted towards 2–3 stars; at least two sources, or say there was only one; verbatim quotes only, with how many were read. → `m-maps-review-reading` (we cap at 30 per business).
- **Reading ads honestly.** Under 14 days running is a test; 30+ days survived; 60+ days with several versions is "likely working (inferred)". Discount always-on, catalogue and language-variant ads. Never state spend, CTR or "best ad". Library counts aren't comparable across libraries and never add up; ad count means creative volume, not spend. Break each ad into reason to buy, hook type, offer/CTA, proof type, format, landing page. → `m-meta-ad-library` and `competitor_ads[]`.
- **Hook clusters for ads** (fear/loss, outcome, question, social proof, contrarian, empathy, product-led) and "ads are evidence, not results". → `m-meta-ad-library`.
- **Angles and gaps.** A gap needs real buyer weight, no rival leading on it, and our proof; a gap with no buyer evidence is invented. Classes: gap, unvalidated, contested, table stakes. One angle = one reason to buy. → `working_angles` and `competitors_overdo`.
- **Run memory.** Keep a snapshot per rival and per run; the next run opens with "since last time"; a quiet period still writes a record, and "no change" only covers what was re-read. → `m-monthly-diff` and `diff_vs_previous`.
- **Watch thresholds** (report only when crossed): a new ad idea, an idea crossing 30/60/90 days, 3+ versions of one idea, a price or offer change, a review theme appearing 3+ times, rating moving 0.1 or more, a post at 3x+ usual engagement. → `m-monthly-diff`.
- **Fact / inferred / unknown, and a "what we couldn't read" list.** A blocked page is "needs the browser", never "none found". → `confidence-rules` and `before-saving.md`.
- **Free pass first; questions at the end.** → Unattended mode asks nothing; questions go to the summary.

**Leave out**
- LinkedIn engagers, page-technology and pixel sniffing, hiring-as-roadmap, G2/Capterra, AI-answer tracking, Wayback logo checks: B2B SaaS signals with little value for Indian local businesses.
- Its scraping, proxy and credit machinery, and GooseWorks-specific tools.
- Long report and battlecard formats (3,000 words): our sheet is short and feeds later stages.

## 7. last30days → `m-trends`

Files read: `skills/last30days/SKILL.md`, `CONCEPTS.md`, and the parts of `references/` the skill relies on (runbook, discovery, competitors, synthesis).

**Borrow**
- **Window and freshness by intent.** 30 days by default; strict recency for news, evergreen allowed for how-to. Don't put dates or "last 30 days" inside the search text; judge recency on the results. → `m-trends` steps.
- **Plan 1–4 sub-queries with weights**, classify intent first, anchor ambiguous names with a specific entity, and reframe keyword traps. → Query recipes for Indore/Jabalpur, MP, festivals and the season.
- **Merge duplicates, check the item really names the entity, and cluster by story, not by source.** A story seen across 3+ sources is strongest; single-source is flagged. → `confidence-rules`.
- **"Nothing solid this month" is a valid result.** Never invent a trend; don't re-pitch a story already covered. → `timely_hooks` may be empty; `m-monthly-diff` remembers covered stories.
- **Two one-line angles per trend.** → `timely_hooks[]` format.
- **Never imply a source was quiet when it was blocked or not checked.** → `before-saving.md`.

**Leave out**
- **The whole Python engine**, API keys (ScrapeCreators, X, OpenAI…), browser-cookie reads, prediction markets, SQLite memory, HTML publishing. Our version runs on web search alone.
- Reddit and Hacker News weighting: little Indian local signal.

## 8. apify/agent-skills → `m-apify-optional` (tool use only)

**No licence**: all rights reserved. We copy no text, tables or commands. Our instructions are written from Apify's own documentation. Actor IDs and field names are factual identifiers and are **re-verified against Apify's docs and live actor schemas in M3** before use.

**What we take (as facts to verify, not text)**
- **How Apify is reached:** the Apify CLI (`APIFY_TOKEN` or `apify login`), or Apify's hosted MCP server as a connector. Each actor has its own input schema, readable before running; pricing models are free, pay-per-event or monthly flat.
- **Actors relevant to us:** Instagram profile, post, reel, comment and hashtag scrapers under `apify/…`; Google Maps places and reviews under `compass/…`; a Facebook ad library scraper. Exact IDs and inputs go into `m-apify-optional` only after verification.
- **Gotchas:** Instagram limits aggressively (keep runs small and spaced); empty results usually mean a wrong field name, a too-narrow query or a login wall; check whether an actor is deprecated; estimate cost from the actor's own pricing and the result cap before running.

**Leave out**
- Everything not on our list (LinkedIn, X, lead and email enrichment, booking sites), anti-bot or wall-bypass advice, the removed skills' `mcpc` script route, and every price figure (unverified).

**Already decided:** Apify is off by default (`apify_enabled: false`), needs a token, and paid runs ask the admin unless at or below `research_auto_approve_limit` (default 0, so always ask).

## 9. Ideas only: Hyper Marketing and ScrapeCreators

**Hyper Marketing `competitor-intel` and `meta-ads-library`** → `m-monthly-diff`, `m-meta-ad-library`
- The first run is a baseline; the value comes from the second and third, so say so.
- Keep a snapshot of everything read (link, time, short excerpt), or the next diff has nothing to compare.
- Diff per source as before → after, then a marked interpretation line; sections without change get an explicit "no change".
- Aggregates over anecdotes ("5 of the 6 advertisers are running a Diwali discount"); one viral post is noise.
- For ads, always state the query, country and date window, and link the library.
- Left out: everything that needs its paid tools (Firecrawl, HyperSEO, Apify scraping, backlink data, lead enrichment).

**ScrapeCreators `comment-mining`, `competitor-social-research`, `outlier-post-finder`** → `m-comment-reading`, `m-ig-outlier-read`
- Comments: light cleaning only; keep slang and misspellings as customer language; sort into questions, objections, complaints, praise, confusion, requests, buying intent; count and cluster; attach verbatim phrases **without names or handles**; state the sample size; one loud comment is not a pattern.
- Competitor accounts: confirm the handle, never guess it from the company name; compare like-for-like windows; hedge inferences.
- Outliers: about 20+ posts per account; baseline = per-account median split by format; under 10 posts means low confidence. Their bands (1.5–2x mild, 2–5x strong, 5x+ huge) agree with ig-viral's >3x signal.
- Left out: its API, key and endpoints; transcript scraping; other platforms.

---

## 10. Connected tools (checked in the live tool list, 2026-11-22)

| Tool | What it can do for us | Limits found |
|---|---|---|
| Meta Ads connector `ads_library_search` | Search the Ad Library by `search_terms`, `page_ids`, `countries` (ISO-2, e.g. `IN`), `ad_active_status`, `ad_type`; up to 50 results per call | Needs at least one **active** ad account. Its own description says not to use it for bulk extraction (our cap: 6 advertisers). Free. → `m-meta-ad-library`. |
| Meta Ads connector `ads_get_ig_accounts` → `ads_get_ig_media` | Lists Instagram accounts linked to an ad account, then their posts and reels (captions, type, permalink), filterable by date and reels | Built for boosting. **No organic metrics** (views, reach, shares, watch time) appear in the tool description. Not live-tested (the admin made linking optional). → `m-own-account-audit` uses it for the post list only when `client.meta` is linked; metrics come from pasted Insights or an attended browser read. Its fully automatic path is to be confirmed on a linked client in the optional live smoke test. |
| Web search / fetch | Unattended web, reviews snippets, news, festivals | Some pages block fetch (help.instagram.com returned an empty shell). |
| **Claude in Chrome** (`mcp__claude-in-chrome__*`) | The person's real Chrome with their own sign-ins. Default for the attended Instagram read. | Claude Code (`claude --chrome`), desktop app and Cowork; not plain claude.ai chat; not WSL. Not connected in this session. Use inside subagents is not documented, so the attended step runs in the main session. |
| Desktop built-in browser pane (`mcp__Claude_Browser__*`) | Alternative attended browser | Clean profile, no saved logins: the person signs in to Instagram there themselves. Desktop app and Cowork only. |
| Apify (CLI or hosted connector) | Optional, paid | No CLI or token on the admin's machine. Off by default. |
| Anthropic `marketing:competitive-brief` | Optional positioning framework (messaging matrix, content gaps, opportunities, threats) | Synced to the account, not active in this Claude Code session; delegate if present, never copy. |

**Scheduling** (docs checked 2026-11-22; details in M5): a **cloud scheduled task** (`/schedule`, or claude.ai/code/routines) runs with the computer off, includes the account's connectors, and uses skills from the cloned GitHub repo; minimum interval 1 hour; a custom cron can carry `CRON_TZ=Asia/Kolkata`. Cowork tasks offer hourly, daily or weekly only; Desktop local tasks need the app open; session `/loop` tasks die with the session. None can drive a browser, so scheduled runs do the unattended part and queue the Instagram read.

## 11. Platform terms

- **Meta Automated Data Collection Terms** (effective 7 October 2024, https://www.facebook.com/apps/site_scraping_tos_terms.php): collecting data from Meta products "via the use of automated or programmatic tools" needs Meta's express written permission; robots and opt-out rules must be respected; personal data that isn't publicly available must not be collected. These terms incorporate Instagram's Terms of Use.
- **Instagram Terms of Use** (https://help.instagram.com/581066165581870): the page could not be read by the fetch tool (it returns an empty shell). **To check in a browser** and quote here before release.
- **What this means for us.**
  - The attended Instagram read (Claude driving a logged-in browser) is plausibly "automated tools" under Meta's terms, even at human speed. ig-viral itself warns that volume automation breaches Instagram's terms and gets accounts action-blocked.
  - Mitigations, all in the modules: small caps, human speed, a person present, no background loops, a **team account, never a client's**, public data only, no commenter or reviewer identities stored, and pasted data always accepted as an alternative.
  - The **Meta Ad Library tool** and the **client's own account through the Meta connector** are sanctioned APIs and carry no such risk.
  - The admin decides whether the attended read stays on; `m-ig-*` modules work on pasted data alone.

## 12. Decisions confirmed by the admin (2026-11-22)

1. The two Instagram repos are sources; their installed skills are invoked by bare name when present, with our own fallback otherwise.
2. Without Apify, `m-ig-niche-pulse` uses our own attended browser read (or pasted data); `ig-audience-insights` runs only with Apify or pasted data.
3. Linking a client's Meta or Instagram account is optional; the own-account audit runs automatically only when it is linked.
4. Defaults accepted: cloud scheduled task, weekly run with the full refresh after the 24th; Claude in Chrome as the default browser, the desktop pane as the alternative; the attended step runs in the main session; goose's `research-competitors` replaces `competitor-intel`; the removed Apify skills read for ideas; the admin sets `urgent` at intake; the subagent saves the insight itself.
5. Non-permissive sources may be used, which for the one unlicensed repo (`apify/agent-skills`) means as a tool and for ideas: copyright still rules out copying its text.

## Contract changes this research feeds into M2

| Change | Why |
|---|---|
| `stages.yaml`: `research` after `intake` (`gate: none`, `credit_spend: false`, `freshness_days`, `skippable_if_urgent`, `non_blocking_partial`), `writes: [research]`; `brief` gains `optional_reads: [research]` | Stage contract: handoffs go through `job.outputs` |
| `insight.schema.json`: findings with a stable `id`, `source`, `confidence` (`strong`/`some`/`weak`), `pinned`, `struck`, `used_in_jobs[]`, `outcome`; `outlier_hooks[]` with `multiple`, `formula`, `formula_confidence`; `methods_used[].path` (`installed-skill` / `fallback` / `apify` / `pasted`); `own_account`; `diff_vs_previous`; `pending_browser_step`; `raw_files[]`; `downstream` | §§1–9 |
| Client: `competitors[]` with `group` (direct / adjacent / outsized) and `struck`; `own_handle`; `latest_insight_id`; `meta` `{linked, ad_account_id, ig_account_id}` | §1 account mix; §10 the Meta tools need IDs |
| Job: `research_status`, `insight_id`, `urgent`; ledger rows gain `provider` and `currency` (only `credits` rows count against the Higgsfield budget) | Flow; Apify costs USD |
| Gate kind `spend` (admin, before a paid Apify run) | §8 |
| Config: `research_schedule_enabled`, `research_unattended_clients`, `freshness_days`, `research_caps`, `competitor_confirm_required`, `apify_enabled`, `research_auto_approve_limit`, `research_currency` | Prompt §7 |
| Storage: `Insights` + `InsightFindings` + `Tasks` tabs; files-mode `research/` folders and `tasks.json` | 50k-character cell limit; pin/strike from a phone; pending browser tasks |
