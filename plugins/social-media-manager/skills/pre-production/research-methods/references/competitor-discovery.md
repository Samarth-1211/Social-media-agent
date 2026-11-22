# Competitor discovery

Finds the accounts research compares against, so nobody has to list them. Runs before any method that reads competitors, whenever the client has **fewer than 6 non-struck competitors** in `client.competitors`.

## 1. The mix (ig-viral's account mix)

| Group | What it is | Target | Size band |
|---|---|---|---|
| `direct` | Same offer, same city, a bit ahead of the client | 4 | Within about 10x of the client's followers |
| `adjacent` | Different business, same customers (for a laundry: home cleaning, tailoring, ethnic-wear shops; for a developer: home loans, interiors, local property news) | 4 | Within about 10x |
| `outsized` | Much bigger accounts in the category (national brands, big creators), for **format only**, never tone or cadence | up to 2 | Any |

Count the client's existing non-struck competitors first and fill only the gaps. Add **at most 8** per discovery, and never let the non-struck total pass `research_caps.accounts_max` (12).

## 2. Find the field (unattended: web search only)

1. **Frame it in one line:** "<business type> in <area/city> for <audience>", e.g. "saree dry-clean and laundry pickup in Vijay Nagar, Indore, for families".
2. **Search** (6–10 searches in all; English and the Hindi/Hinglish words customers use):
   - "best <category> in <city>", "<category> near <area> <city>", "<category> <city> instagram";
   - "<client name> alternatives" and "<client name> vs";
   - for `adjacent`: "<related service> <city> instagram";
   - for `outsized`: "<category> brand India instagram".
3. **Check each handle before keeping it.** A handle counts only if a result shows its `instagram.com/<handle>` address, or the business's own website or Google Business listing links to it. **Never guess a handle from a business name.** A business without a confirmed handle is listed in the plan as "handle not found" and not saved.
4. **Write one reason per account**, specific enough to argue with: "Pickup laundry in Vijay Nagar with saree dry-clean, ~2x our followers" beats "competitor".
5. **Drop** anything struck before (same handle and platform in `client.competitors` with `struck: true`): **a struck account is never proposed again.** Drop the client's own handle, and accounts in other cities for `direct`.

## 3. Save

- **Default (`config.competitor_confirm_required: false`): auto-accept.** Save the new accounts through `brand-keeper`'s `save_client` as `confidence: guessed`, `struck: false`, `added_on` = today. This is a real profile change: `version` + 1 and a changelog line "Competitors added by research discovery: <handles>". Mark the `competitors` field `guessed` in `confidence`, basis "research discovery <date>".
- **Tell the assigned editor** in the run summary (or the tracker status for unattended runs): "Added 6 competitors for Shubh Laundry (guessed). Strike any that are wrong: 'strike <handle>'."
- **If `competitor_confirm_required` is true:** don't save; show the list and wait for the assigned editor or the admin to confirm. Research continues with the client's existing competitors (or, if there are none, with web-level methods only) and says so.

## 4. Strike and confirm

- "strike <handle>" (assigned editor or admin): set `struck: true`, `struck_by`, through `save_client`. Struck accounts stay in the list so they are never re-proposed, and are never read again.
- "confirm <handle>": set `confidence: confirmed`.
- If the browser step later shows an account is far outside its size band, move it to `outsized` (or strike it if it isn't relevant) and say so in the summary; don't silently keep reading it.

## 5. Privacy

Only public business and creator accounts. Never add a private person's account (a reviewer, a commenter, a customer) as a competitor.
