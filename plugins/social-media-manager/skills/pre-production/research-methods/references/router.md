# Router: situation → methods

Pick the methods for this run in four steps. Method ids and files: `methods-registry.md`.

## 1. Tool check (before choosing anything)

Look at what this session really has. Don't assume; look at the tool and skill lists.

| Check | Available when | If missing |
|---|---|---|
| Web search, web fetch | The web search and fetch tools are in the tool list | Drop `web-competitor-intel`, `trends`, `maps-review-reading` (web route). Rare; say so. |
| Meta Ad Library | The Meta Ads connector's ads library search tool is listed (`ads_library_search`) | Drop `meta-ad-library`: "Meta Ads connector not connected: ad research skipped." |
| Client's own account | `client.meta.linked` is true **and** the connector's Instagram media tool is listed | `own-account-audit` uses pasted Insights if someone has them, otherwise it is skipped. |
| Browser | Claude in Chrome tools, or the desktop app's built-in browser tools, are listed, **and** a person is in the conversation now | Attended methods are **queued**, not dropped (situation `no_browser`). |
| Installed skills | A skill named `ig-viral`, `ig-audit`, `ig-audience-insights`, `ig-hook-extractor` or `competitive-brief` is in the skill list, under any plugin or account prefix | The method uses its own fallback steps. |
| Apify | `config.apify_enabled` is true **and** (`APIFY_TOKEN` is set or `apify` CLI is logged in, or an Apify connector is listed) | `apify-optional` is off: "Apify off: free methods only." Never ask for a token in an unattended run. |

Write one line per missing tool into the plan (`templates/research-plan.md`) and into `not_read`.

## 2. Situations

Name every situation that applies (they combine), using the client record, the job and the trigger:

| Situation | Applies when |
|---|---|
| `new_client` | The client has no insight sheet yet (`latest_insight_id` empty), or the trigger is onboarding |
| `monthly_refresh` | A sheet exists and is older than `freshness_days`, or the trigger is the schedule |
| `festival` | A `festival_calendar` occasion falls within the next 14 days, or the request names an occasion |
| `local_service` | `business_type` is a local service: laundry, dry cleaning, salon, clinic, restaurant, tutor, repair, gym |
| `ad_heavy` | `business_type` is real estate, education, finance, insurance, automobile or healthcare chains |
| `no_browser` | No browser, or no person present (scheduled and background runs) |

## 3. Methods per situation

| Situation | Unattended methods | Attended (browser) methods |
|---|---|---|
| `new_client` | web-competitor-intel, meta-ad-library, own-account-audit, trends | ig-outlier-read, ig-hook-classify, comment-reading (+ maps-review-reading if `local_service`) |
| `monthly_refresh` | monthly-diff, meta-ad-library, own-account-audit, trends | ig-outlier-read (smaller cap: 6 accounts), ig-hook-classify |
| `festival` | trends, meta-ad-library | ig-niche-pulse on festival hashtags, ig-outlier-read, ig-hook-classify |
| `local_service` | maps-review-reading (web route), web-competitor-intel | maps-review-reading (browser route), ig-niche-pulse on local hashtags, comment-reading |
| `ad_heavy` | meta-ad-library (run first), web-competitor-intel | ig-outlier-read, ig-hook-classify |
| `no_browser` | all unattended methods of the other situations | none now: queue them all as one pending browser task |

`ig-hook-classify` needs no person itself, but it works on what the outlier read captured, so it runs right after it (or classifies pasted text unattended).

## 4. Rules

1. **Union, then de-duplicate.** Take every method from every situation that applies, once. Run unattended methods first, cheapest first; `meta-ad-library` first when `ad_heavy` applies.
2. **Remove** methods whose tools are missing (§1), with their one-line note. Never pretend a removed method ran.
3. **Attended methods** run now only if a browser **and** a person are present. Otherwise they become one `research-browser-step` task for the client (`automation.md` §3), and the sheet is saved with `pending_browser_step.pending: true`.
4. **Apify** (only when available, §1) may replace the **browser** for profile stats and hashtag pulse, and nothing else: `ig-niche-pulse` runs through `apify-optional`, and `ig-outlier-read` may take follower counts and reel view counts from it. Hooks and comments are still read by a person's browser (or pasted). Paid runs go through the spend gate (`caps.md` §2).
5. **Caps** come from `config.research_caps`, defaults in `caps.md`. A `monthly_refresh` without `new_client` uses the smaller outlier cap.
6. **Competitors first.** If the client has fewer than 6 non-struck competitors, run `competitor-discovery.md` before any method that reads competitors.
7. **"Go deeper" / "add X" / "remove X"** from the person changes the plan before it runs. Going above a cap is recorded in the plan with who asked; a paid method above the limit still needs the admin.
8. **Say why.** Each chosen method gets a one-line reason in the plan and in `methods_used[].reason`.
