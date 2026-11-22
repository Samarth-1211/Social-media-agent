# m-ig-niche-pulse

## Purpose
See what is travelling right now on a niche, local or festival hashtag (formats, opening shapes, themes), beyond the client's known competitors.

## When to use
Festival runs (festival hashtags), local services (city and area hashtags), and new clients in a busy niche.

## Tools needed
In this order:
1. **Apify** through `m-apify-optional.md`, when enabled (hashtag scraper, reels).
2. **A browser** the person is signed in to (Claude in Chrome or the built-in browser; read their skill first).
3. **Installed skill `ig-audience-insights`** (instagram-skills), on data it can read: it reads through Apify or pasted figures only, never a browser. Use it when Apify is on, or to analyse pasted hashtag data.
4. **Pasted data.**

## Needs a person present?
**Yes** (browser), unless Apify is enabled or data is pasted.

## Inputs
1–2 hashtags (`hashtag_scans`), chosen from: the festival and city ("navratrijabalpur"), the area or city plus category ("indorelaundry"), the category ("drycleaning"). The client's followers, to judge scale.

## Steps
1. **Pick the tags.** Prefer local + category; check last month's `not_read` for tags that were thin.
2. **Read the reels on each tag** (not the posts view: it shows minutes-old posts with almost no engagement):
   - browser: open the tag's page; note the formats of about 30 recent and top reels from the grid; open up to 9 of the most-engaged to read their counts, opening text and caption first line; open the owner's profile for the top 5 to note followers;
   - Apify: see `m-apify-optional.md` (`resultsType: "reels"`, `resultsLimit: 30`).
3. **Hidden counts are unknown, not zero** (Apify returns −1 for hidden likes): skip them.
4. **Normalise before calling a winner:** engagement ÷ the owner's followers, or views ÷ followers for reels. A big account's ordinary reel isn't a niche signal.
5. **Keep patterns that recur** across several top reels from different owners: format, opening shape (classify with `m-ig-hook-classify.md`), theme, language mix, length.
6. **Thin tag** (under about 15 relevant recent reels): try one adjacent tag, then widen to the category or city and record it in `widened`.

## Caps
`hashtag_scans` (2) × about 30 reels scanned; at most 9 opened per tag in the browser.

## Output fields
`timely_hooks` (festival and seasonal patterns), `working_angles`, `outlier_hooks` (only with a real baseline, otherwise use `working_angles`), `visual_cliches`.

## Pitfalls
- Hashtag pages change and may need a sign-in: if they ask for login or show a warning, stop and queue.
- Many hashtag posts are from individuals: never record their names or handles in findings; cite the scan ("#indorelaundry reels scan 2026-11-20, 7 of 30").
- One viral reel on a tag is an anecdote, not a pulse.

## Source and licence
Rules adapted in our own words from ig-audience-insights in sergebulaev/instagram-skills (hidden counts are not zero, normalise by followers, reels over posts, thin tag → adjacent tag, never invent posts; MIT, commit `823c681b`). The installed skill is invoked by name, never copied.
