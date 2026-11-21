# Onboarding: the two paths

Offer both in one message; material first. Example opener:

```
New client: <name>. Two ways to set them up:
(a) Send me what you have: Instagram bio and a few captions, website text, brochure, logo, or their Drive folder. I'll draft the profile and ask only what's missing.
(b) Or answer one short list of questions (about 5 minutes).
Which one?
```

## (a) Draft from material

1. **What's available?**
   - **Uploaded files and images:** read them directly. Logos and posters give colours (estimate the hex, mark it `guessed`), fonts and style.
   - **Pasted text:** bio, website copy, past captions, a WhatsApp chat with the owner.
   - **Google Drive:** only if Drive tools are available. Ask once: "Should I look in Drive for a '<name>' folder?" Search by name, list what you found, and confirm which files to use before reading them.
2. **Extract** into fields with `field-guide.md`. Every value from material is `guessed`, with a basis such as "from Instagram bio" or "from 6 captions, Oct–Nov". It becomes `confirmed` only when the admin, an editor or the client approves it.
3. **The owner's own words** (from a chat or a voice-note transcript) are stronger than marketing copy. Keep exact phrases for `customer_words` and voice examples.
4. **Then ask the gaps** in one message: high-priority open questions only, each with your recommendation, so the answer can be "yes" or a correction:

```
Drafted from the bio and 6 captions. Before I save, 4 things to confirm:
1. Who approves the work: Rajesh ji (owner)? → recommended: yes
2. Languages: Hinglish captions, Hindi voice-overs? → recommended: yes
3. Any prices we may show? → recommended: none until you confirm
4. Never-use words or topics? → recommended: none known
```

## (b) The interview (one grouped message)

Send all of it at once. Short answers are fine; "don't know" is fine (it becomes an open question).

```
For <name>, please answer what you can (skip anything you don't know):

Basics
1. Business, city and area (e.g. laundry with pickup, Indore, Vijay Nagar)
2. Contact person, and who gives final approval on creatives
3. WhatsApp number for the client (kept private)

Customers
4. Who buys from them (age, area, type), and how they talk about the problem, in their own words
5. Languages for posts and voice-overs (Hindi / English / Hinglish)

Channels
6. Platforms (Instagram, Facebook, YouTube, WhatsApp status, Google Business…) and how often they post

Voice and look
7. 3 words for how the brand should sound, and what it must NOT sound like
8. Words they always use, or must never use (and why)
9. Brand colours, fonts and logo (send the logo if you have it)
10. Must-dos and never-dos in creatives (e.g. "always show RERA number", "no before/after of dirty clothes")

References and dates
11. Accounts or posts they like, and competitors to avoid looking like
12. Festivals, seasons or events that matter to their sales

Commercial (admin only)
13. Prices or offers we may show
14. Revision rounds included (default 2)
```

## Mapping answers to fields

| Q | Field(s) |
|---|---|
| 1 | `business_type`, `city`, `audience.locations` |
| 2 | `contact_person`, `decision_maker` |
| 3 | `whatsapp` (E.164: `+91` + 10 digits). Never repeated in replies. |
| 4 | `audience.summary`, `age_range`, `interests`, `customer_words` (their exact words) |
| 5 | `languages` |
| 6 | `platforms`, `posting_frequency` |
| 7 | `tone_of_voice` (summary + 3–5 attributes with `means` / `doesnt_mean` / `example`) |
| 8 | `words.use`, `words.never_use` (with reasons) |
| 9 | `visual_identity` |
| 10 | `do`, `dont` |
| 11 | `references` (`liked`, `competitor`, `avoid`) |
| 12 | `festival_calendar` |
| 13 | `price_points` (admin only) |
| 14 | `revision_cap` (admin only) |

**Answers given by the admin or an editor** are `confirmed` (basis: "Samarth, onboarding 22 Nov"). When they say "I think…" or "probably…", mark it `guessed`, add an open question, and say so.

**Unanswered or "don't know":** leave the field out (or fill a default per `field-guide.md`, marked `guessed`) and add an open question with a recommendation.
