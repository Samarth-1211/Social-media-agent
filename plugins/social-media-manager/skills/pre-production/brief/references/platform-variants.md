# Platform variants: one master brief → per-platform versions

The master brief fixes **what** we say. A variant changes only **how** it fits a platform. Each variant is one `deliverables[]` entry. When its length or aspect ratio differs from the master, it says what changes in `changes_from_master`.

## 1. Never changes across variants

The message (`key_message`), the offer and **its exact price and validity**, the CTA action and channel, the language and writing script, mandatories, and things to avoid. If a platform seems to need a different offer or price, that's a different job, not a variant.

## 2. May change

The length (a shorter cut), the aspect ratio, how fast the hook lands, where text sits (safe zones), the caption length, sound (music vs. voice-over), and the CTA mechanics (button vs. end card).

## 3. Platforms

Platform slugs match the client profile's `platforms`. Lengths are what works, not the platform's limit; limits change, so check them in production.

| Platform / placement | Slug / format | Aspect | Good length | Hook lands | Notes |
|---|---|---|---|---|---|
| Instagram Reel | `instagram` / `reel` | 9:16 | 15–30 s (reach), up to 60 s for walkthroughs | within 1–2 s | Often watched muted: captions and on-screen text carry the message. Keep text and the CTA away from the top and bottom bands (username, caption, buttons). |
| Instagram feed post / poster | `instagram` / `feed-post` | 4:5 | n/a | first glance | Offer and price readable on a phone |
| Instagram Story | `instagram` / `story` | 9:16 | 5–15 s per frame | immediately | Strongest 5–10 s only; link sticker if they use links |
| Facebook Reel / feed video | `facebook` / `reel` or `feed-video` | 9:16 or 4:5 | 15–30 s | 1–2 s | Older local audiences: slightly slower pace, bigger text |
| YouTube Short | `youtube` / `short` | 9:16 | 20–45 s | 2–3 s | Viewers expect value or information; a clear title |
| YouTube video | `youtube` / `feed-video` | 16:9 | 45 s+ | 5 s | Brand film or walkthrough only |
| WhatsApp Status | `whatsapp-status` / `story` | 9:16 | 15–30 s | immediately | Seen by saved contacts: direct offer, price and "reply karo" work well. Keep it short. |
| Meta ad (Instagram + Facebook) | `meta-ads` / `reel`, `story` or `feed-video` | 9:16 (reels, stories), 4:5 (feed) | 15–20 s | under 1 s | Paid viewers didn't choose you: the hook must work on strangers, the CTA is explicit, and the ad text stays short (about 125 characters before "more"). Music baked in. |
| Google Business post | `google-business` / `feed-post` | 4:3 or 1:1 | n/a | | Offer, dates and a "Call" / "Visit" button; plain wording |

**Sound.** For organic reels, the editor may add trending audio in the app, so leave music open in the brief. For ads and WhatsApp status, the music or voice-over is part of the file.

**Upload natively.** Never post a file with another app's watermark on it.

## 4. Writing `changes_from_master`

One line, concrete:
- "15 s cut: offer and CTA only, no problem beat."
- "4:5 crop for feed; keep the price and logo inside the centre square."
- "Ad: hook in the first second, CTA button 'Send WhatsApp message', text 90 characters."
- "16:9 version: same edit, wider shots of the site; RERA number on the end card stays."

## 5. Self-check (variants)

- [ ] Every platform in `platforms` has a deliverable, and every deliverable's platform is in `platforms`.
- [ ] Each variant that differs in length or aspect ratio has `changes_from_master`.
- [ ] Price, validity, CTA and mandatories are identical in every variant.
- [ ] **Label-swap test:** if two variants would read the same with their platform names swapped, you either don't need both, or you haven't adapted one. Fix it or drop it.
- [ ] No variant the client didn't order or the profile doesn't use. Each one costs editing time and credits.
