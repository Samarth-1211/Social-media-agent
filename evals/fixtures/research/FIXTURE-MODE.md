# Fixture mode (evals only)

This run is a test. Follow the plugin's skills exactly, with these substitutions. They exist only in this file, never in the shipped plugin.

## Clock
Treat "now" as **2026-11-28 10:30 India time**. For `get_now`, use `2026-11-28T10:30:00+05:30`, adding a minute per later save in this run. Don't read the computer clock.

## Storage
Files mode. The data folder is `.tdm-studio/` in the current directory (`library/storage/files-backup.md`). The person working is the one the prompt names (`samarth` is the admin; `ravi` and `pooja` are editors). Scheduled runs use `system`.

## Tools stand-ins
Live web, Meta, Google and browser tools are switched off for this test. Read these files instead, **as if they were the tool's results**, and cite them the way you would cite the real source (the URLs and descriptions inside them):

| Method's tool | Read instead |
|---|---|
| Web search and web fetch | `fixtures/<client_id>/web.md` (a page marked BLOCKED did not load) |
| Meta Ad Library search | `fixtures/<client_id>/meta-ads.json` |
| Meta Instagram media for the client's own account | `fixtures/<client_id>/own-account-media.json`, **only** if `client.meta.linked` is true and the file exists |
| Browser: Google Maps reviews | `fixtures/<client_id>/reviews.json` |
| Browser: Instagram profiles and reels (12 latest per account) | `fixtures/<client_id>/reels.tsv`, then `fixtures/<client_id>/reel-openings.md` for the top reels |
| Browser: Instagram comments | `fixtures/<client_id>/comments.json` |
| Browser or Apify: hashtag pulse | `fixtures/<client_id>/hashtags.json` |

The browser stand-ins count as "a browser with a person present" **only if the prompt says a browser is available**. Otherwise there is no browser: attended methods are queued, as in a real unattended run.

Apify: not connected (no token, no connector) unless the prompt says otherwise. Installed Instagram skills: treat `ig-viral`, `ig-audit`, `ig-audience-insights`, `ig-hook-extractor` and `competitive-brief` as **not installed** unless the prompt says otherwise.

## Raw files
Write raw captures under `.tdm-studio/clients/<client_id>/insights/<insight_id>/raw/` as the skill says. Never copy names or handles of reviewers or commenters into them.
