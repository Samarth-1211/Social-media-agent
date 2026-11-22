# Good: ad-heavy niche (real estate in Jabalpur)

Fictional client: **Narmada Heights Developers**, Jabalpur. Residential projects; buyers are families upgrading from rented flats and NRIs buying for parents; Hindi and English. Triggered by job intake (NRH-01, a Navratri site-visit reel). No browser in the session.

## What happened

1. **Freshness check:** no sheet yet, so status `new`; the job is not urgent.
2. **Situations:** `new_client` + `ad_heavy` + `festival` (Navratri in the request) + `no_browser`.
3. **Ads first.** `meta-ad-library` searched 6 local residential advertisers by name and two keyword searches ("2BHK Jabalpur", "flat booking offer"), country IN, active ads:
   - "5 of 6 advertisers run drone renders with 'luxury living' text" → competitors overdo, `strong`, an aggregate rather than one ad;
   - one advertiser's Navratri offer (free modular kitchen) running 24 days in 4 versions → read as "test, being iterated", not "working";
   - **no spend or reach claims.**
4. **Web and reviews:** "possession kab milega" recurs across project reviews → pain point and customer phrase (Hinglish). Review text only, no reviewer names.
5. **Instagram queued:** one `research-browser-step` task (ig-outlier-read, ig-hook-classify, ~10 min). The sheet was saved with `pending_browser_step.pending: true`, and the job got `research_status: partial` with flag `browser_step_pending`. **The job moved straight on to the brief.**
6. **Own account:** the client is linked through Meta, so the media tool listed 27 reels from the last 90 days. The response had **no view counts**, so no multiples were computed; `not_read` says "own-account metrics not available through the connector". Nothing was guessed.

## Why it's good

- The router put the free, unattended, highest-signal method first for this niche.
- Ads were read with the rules: test vs survived vs likely working, aggregates over anecdotes, no spend talk.
- The missing browser didn't block anything: the job continued with a partial sheet, and the Instagram read waits in the queue for whoever is online next.
- The connector gap was reported, not papered over.

## The chat summary

```
Research partial for Narmada Heights · NRH-I202611-1 v1
Top 3:
1. Buyers ask about the possession date before price (some)
2. Rivals overdo drone renders and "luxury living" text; 5 of 6 advertisers run them (strong)
3. Navratri booking offers are already running; lead with RERA and dated site progress instead (some)
Changed since last time: first sheet (baseline)
Instagram read: queued (~10 min, needs browser)
Not read: Instagram (queued); own-account metrics (connector gives no counts) · Cost: free
```
