# Good: real-estate brand film, 1 team question, 2 platform variants

**Narmada Heights Developers (NRH), Jabalpur.** Job NRH-02, "Narmada Heights: who we are" brand film, video, full track. Fictional.

## Known

| Source | Facts |
|---|---|
| Request | "Ek brand video chahiye, Agrawal sir khud bolenge, Insta aur YouTube dono pe. Koi offer nahi." Deadline 12 Dec. |
| Brand brief (v1) | Families upgrading from rented flats; NRIs buying for parents; 30–55; Jabalpur / Napier Town. Hindi and English. Voice "Assured: specific facts, not pushy". Do: show the RERA number on every creative. Don't: promise returns or appreciation. |
| Profile, guessed | audience, tone |
| Past jobs | NRH-01 (Navratri site-visit reel): CTA "Sample flat dekhne aaiye", visit |

## Draft highlights

| Field | Value | Basis |
|---|---|---|
| `job_kind` | brand-film | "brand video… koi offer nahi" |
| `objective` / label | "Make families in Jabalpur trust Narmada Heights as a builder who delivers what it promises." / `awareness` | request + profile |
| `creative_format` | talking-head (director) | "Agrawal sir khud bolenge" → glossary #37 |
| `duration_sec` | 45 (master) | brand-film default |
| `deliverables` | instagram reel 9:16 45 s; youtube feed-video 16:9 60 s, `changes_from_master`: "16:9 version, 60 s: adds 15 s of site walkthrough B-roll between story and CTA; RERA number on the end card stays" | request "Insta aur YouTube" + `platform-variants.md` |
| `language` / `writing_script` | Hindi / `roman-hinglish`: one script for every variant, and the client's Instagram captions are in Roman letters | profile languages + past posts; guessed (OK) |
| `cta_detail` | "Sample flat dekhne aaiye", `visit`, "sample flat, Napier Town" | same as NRH-01 (approved) |
| `proof_points` | "3 projects handed over since 2009" | **missing**: the profile has no delivery facts; placeholder `[CLIENT TO CONFIRM: projects delivered, since when]`, client question |
| `mandatories` | RERA registration number + MP RERA website on the end card; "Artist's impression" on any render | `proof-and-claims.md` §3 |
| `avoid` | Any promise of returns or price rise; super built-up area quoted as carpet area | profile don't + §3 |

## Gap check

Blockers:
1. **The RERA number isn't on file**: a category mandatory, "Never". The team may know it.
2. The delivery facts are a proof point, not an essential, but the film's message leans on them. That's a client question, not a blocker; the gate shows the placeholder.

## The one team question (AskUserQuestion)

```
question: Narmada Heights ka RERA registration number kya hai?
header:   RERA no.
options:  1. "Brochure mein hai, main bhejta hoon (guess)": Ravi ke paas brochure hai
          2. "Client se poochna padega": number pakka chahiye, client message mein jayega
```

Ravi types: "P-JBP-21-1234, brochure page 2". Saved as `confirmed` (basis "Ravi, brochure p.2, 22 Nov"). The brief asks nothing else. The delivery-facts question goes in a one-line client message, and the admin can approve the brief with the placeholder visible.

## Card

```
**NRH-02 · Narmada Heights: who we are** (brief v1)
Kya: Agrawal sir batayenge kaise Narmada Heights jo bolta hai woh deta hai (koi offer nahi)
Kiske liye: Jabalpur families jo kiraye se apne ghar mein shift ho rahe hain (30-55)
Log kya karein: Sample flat dekhne aayein (Napier Town)
Kaisa: 45 sec Insta reel + 60 sec YouTube (16:9, site shots) · Hindi (Roman captions) · director bolenge
Dhyan: RERA no. end card pe · "price double" jaisa koi wada nahi · renders pe "Artist's impression"
Guess kiya: length 45 sec, Roman captions · Pending: kitne project diye, kab se (client se)
```

**Why it's good:**
- **One question**, asked of the team (who knew), with a guess.
- **The YouTube variant** says exactly what changes and keeps the RERA end card.
- **The proof gap** is a visible placeholder, not an invented "15 saal ka bharosa".
- **Real-estate rules** are in `mandatories` and `avoid`.
