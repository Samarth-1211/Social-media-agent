# Good: team question → client message → messy reply

**Shubh Laundry, SHL-03, "Winter blanket cleaning offer reel"**, quick track. Ravi (editor) runs the brief. Fictional.

## 1. Draft, then gap check

The draft fills everything except two **Never** essentials:
- **`offer_detail.price`:** blankets aren't in `price_points` (only "Wash + iron ₹89/kg").
- **`offer_detail.validity`:** the request says only "sardi ka offer".

Nothing in storage answers either. The team might know the price, so we ask the team first.

## 2. Team mode (one question, with a guess)

```
Claude: Kambal/razai dhulai ka rate kya dikhayein?
        Guess: ₹349 per piece (₹89/kg wash rate aur bhaari kambal ke hisaab se)
        1. ₹349  2. ₹299  3. Client se poochna padega  — ya kuch aur likh dein
Ravi:   3
```

Ravi doesn't know, so both blockers become client-only. No second team question: validity is client-only anyway.

## 3. Client mode (one WhatsApp message)

```
Namaste Neha ji! Winter kambal-razai offer video ke liye 2 cheezein confirm karni hain:

1. Kambal/razai dhulai ka rate kitna dikhayein? Humara guess: ₹349 per piece
2. Offer kab tak chalega? Humara guess: 30 Nov tak

Bas "1 haan, 2 nahi" ya sahi value likh dein. Reply aate hi video shuru kar denge 🙏
```

Saved as brief v1, `awaiting-client`. Client questions 1 and 2 are `open`, with `asked_at` 21 Nov 10:40. The job is `waiting_on: client`, and `next_action` is "Ravi to paste Neha ji's reply to the 2 brief questions (sent 21 Nov)." No gate. The sheet's BriefQuestions tab now has 2 open rows. After 24 hours they show on the Dashboard.

```
Claude: Message upar hai, Neha ji ko bhej dijiye. Reply aaye toh yahin paste kar dena.
```

## 4. The reply, pasted next day (voice-note transcript)

```
Ravi: neha ji ka reply - "haan ji vo 349 thoda zyada hai 299 rakh do, aur mahine ke end tak chalne do. aur haan 2 kambal pe pickup free likh dena"
```

The brief is `awaiting-client`, so this is read as answers to brief questions, not as feedback:

| Bit of the reply | Read as |
|---|---|
| "349 thoda zyada hai 299 rakh do" | Q1: guess rejected → `price: 299`, `unit: per piece`, `not-in-profile`, confirmed (client reply 22 Nov) |
| "mahine ke end tak" | Q2: `validity: 2026-11-30` (last day of the current month, sheet clock). Same as the guess → confirmed |
| "2 kambal pe pickup free" | Not asked: a new client-confirmed condition, "Free pickup on 2 or more pieces". Shown at the gate. |

Confirm back in one line, because it changes a blocking essential:

```
Claude: Theek hai: ₹299 per piece, 30 Nov tak, 2 kambal pe free pickup. Brief v2 bana raha hoon.
```

Both questions become `answered`, and `waiting_on` goes back to `none`. Brief v2 gets the changelog line "Price ₹299 per piece, valid till 30 Nov, free pickup on 2+ pieces (client reply 22 Nov)". The self-check passes, so the status is `ready` and the brief goes to the admin gate.

## Why it's good

- **2 blockers**, but only **1 team question** and **1 client message**. The team question offered "client se poochna padega", so nothing was asked twice.
- **Every question had a guess,** and the client corrected one: that's the point.
- **The messy reply** was matched by meaning, not by order, and the extra condition wasn't lost.
- **No jargon** anywhere ("rate", "kab tak", not "price point", "validity").

## Express variant (same job, "kal tak chahiye, jaldi")

One message, the blockers only, and the rest said out loud:

```
Jaldi mode: sirf 2 cheezein chahiye: 1) kambal ka rate? (guess ₹349)  2) offer kab tak? (guess 30 Nov)
Baaki sab guess kiya hai (20 sec reel + status, WhatsApp CTA), gate pe check kar lena.
```
