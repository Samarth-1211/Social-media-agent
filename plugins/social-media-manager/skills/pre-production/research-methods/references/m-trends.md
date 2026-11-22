# m-trends

## Purpose
Find what is timely for this client this month: festivals and seasons, local events and news in the city, and formats or moments people are talking about, each turned into usable hooks.

## When to use
New clients, monthly refreshes and festival runs.

## Tools needed
Web search and web fetch only. No scripts and no API keys.

## Needs a person present?
No.

## Inputs
City and area, business type, audience, languages, the month, `festival_calendar` occasions in the next 60 days, and the sheet's previous `timely_hooks` (so covered stories aren't re-pitched).

## Steps
1. **Plan 3–5 queries** (`trend_searches`, default 5), one per theme, each tied to a specific place or entity:
   - the occasion or season in the city ("Indore wedding season bookings", "Navratri Jabalpur events");
   - local news touching the category ("Indore water supply", "Jabalpur new metro route property");
   - the category in India this month ("dry cleaning winter woollens care", "home loan rate change");
   - formats or moments travelling on Indian Instagram (articles about reel formats or audio, not a hashtag crawl).

   Don't put dates or "last 30 days" in the query; judge recency from the results' dates.
2. **Freshness by intent:** news and events must be from the last 30 days; seasonal and how-to topics may be older if still relevant this month.
3. **Read at most 5 pages** from the results. Merge the same story found in several results into one.
4. **Check grounding:** keep an item only if it really concerns this city, this category or this occasion.
5. **Cluster by story, not by source.** A story found in 3+ independent sources is `strong`; one source is `some` at best; an opinion piece alone is `weak`.
6. **For each kept trend, write up to 2 one-line hooks** with a real tension ("Shaadi ka lehenga ek baar pehna, ab saal bhar kaise rakhein?"). Skip anything already in last month's `timely_hooks` unless it changed.
7. **"Nothing solid this month"** is a valid result: write no timely hooks and say so in the summary.

## Caps
`trend_searches` (5) searches and up to 5 fetches; within the 20/20 web budget per run.

## Output fields
`timely_hooks` (one finding per trend, the hook ideas in its text), occasionally `pain_points` (a seasonal problem: monsoon damp, winter woollens).

## Pitfalls
- Don't invent a trend from a hunch. No source, no finding.
- National trends without a local angle are `weak` for a local business.
- Avoid sensitive news (accidents, politics, religion beyond festival greetings) as hooks.
- Sources that were blocked go in `not_read`, not "nothing happening".

## Source and licence
Method adapted in our own words from last30days (query planning, recency by intent, story clustering, "nothing solid" is valid; MIT, Matt Van Horn, commit `64b1f006`). We use web search only: none of its scripts or API keys.
