# Methods registry

Every research method, one row each. The router (`router.md`) picks method ids from this table; the method's own file says how to run it.

**Adding a method:** write `m-<id>.md` with the standard sections, add one row here, add it to the right rows in `router.md`. Nothing else changes.

| id | File | Good for | Cost | Tools needed | Needs a person? | Paths (in order of preference) | Source and licence |
|---|---|---|---|---|---|---|---|
| `web-competitor-intel` | `m-web-competitor-intel.md` | Who the rivals are, their offers, promises, reviews summary, gaps | Free | Web search, web fetch | No | web | Ideas from goose-skills `research-competitors` (MIT) and Hyper Marketing `competitor-intel` (MIT, inspiration) |
| `meta-ad-library` | `m-meta-ad-library.md` | Which local offers and hooks run as paid ads, and for how long | Free | Meta Ads connector: ads library search | No | connector | Ideas from goose-skills `reading-ads-honestly` and `competitor-ad-intelligence` (MIT); tool use only |
| `trends` | `m-trends.md` | Festivals, seasons, local news and formats that are timely this month | Free | Web search, web fetch | No | web | Method adapted from last30days (MIT), web search only |
| `maps-review-reading` | `m-maps-review-reading.md` | Customer pain points and exact phrases from public reviews | Free | Web search, web fetch; a browser for the full route | Web route: no. Browser route: yes | web → browser | Review rules from goose-skills (MIT) |
| `monthly-diff` | `m-monthly-diff.md` | What changed since the last sheet | Free | Storage only (plus whatever the run re-read) | No | (no tools) | Run memory from goose-skills (MIT); diff format from Hyper Marketing (MIT, inspiration) |
| `own-account-audit` | `m-own-account-audit.md` | What works on the client's own account | Free | Meta Ads connector (Instagram media), or pasted Insights | No if the client's account is linked through Meta and metrics come through; otherwise someone pastes Insights | installed-skill `ig-audit` → connector → pasted | ig-audit method (instagram-agent-skill, MIT) |
| `ig-outlier-read` | `m-ig-outlier-read.md` | Which reels beat their own account's normal, and why | Free | A browser the person is signed in to; or pasted data | **Yes** (browser), unless data is pasted | installed-skill `ig-viral` → fallback (browser) → pasted | ig-viral method (instagram-agent-skill, MIT); cross-checked with head-of-content (MIT) and ScrapeCreators (MIT, inspiration) |
| `ig-niche-pulse` | `m-ig-niche-pulse.md` | What travels on niche, local or festival hashtags right now | Free (Apify: paid) | A browser; or Apify; or pasted data | **Yes** (browser), unless Apify is on or data is pasted | apify (via `apify-optional`) → fallback (browser) → installed-skill `ig-audience-insights` on pasted data | ig-audience-insights method (instagram-skills, MIT) |
| `ig-hook-classify` | `m-ig-hook-classify.md` | Naming the hook formula behind each outlier reel | Free | None (works on captured text) | No | installed-skill `ig-hook-extractor` → fallback | ig-hook-extractor formula ids (instagram-skills, MIT) |
| `comment-reading` | `m-comment-reading.md` | Customers' own words, questions and objections | Free | A browser | **Yes** | fallback (browser) → pasted | Comment buckets from ScrapeCreators `comment-mining` (MIT, inspiration) |
| `apify-optional` | `m-apify-optional.md` | Profile stats and hashtag pulse without a browser | **Paid** (USD) | Apify CLI with `APIFY_TOKEN`, or the Apify connector | No (but the admin approves spend above the limit) | apify | Apify used as a tool only; instructions from Apify's own docs. apify/agent-skills has no licence: nothing copied |

## Columns

- **Needs a person?** "Yes" methods are the **attended** part: they run only when someone is online with a browser, and are otherwise queued as a pending browser task (`automation.md`). "No" methods are the **unattended** part and may run on a schedule.
- **Paths.** Try them in order; use the first one available. Record the path that ran in `methods_used[].path` (`installed-skill`, `fallback`, `apify`, `connector`, `web`, `pasted`) and the installed skill's name in `methods_used[].skill`.
- **Cost.** Free methods still write a 0 cost line per provider (`caps.md` §3). Paid methods go through the spend gate first.
