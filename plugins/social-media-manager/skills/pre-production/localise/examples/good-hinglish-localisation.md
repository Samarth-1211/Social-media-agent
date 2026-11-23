# Good: Roman Hinglish localisation of an offer reel (fictional)

**Job SHL-01**, Shubh Laundry, Indore: the editor picked version **A "Wahi sofa, wash ke baad"** (before-after, 20 s) with one line edit. Brief: Hinglish, `roman-hinglish`, families 25–45 in Vijay Nagar and Palasia. Decision maker: **Neha (owner)**. Full record: `${CLAUDE_PLUGIN_ROOT}/library/contracts/examples/localised_script.example.json`.

## 1. What changed, and what didn't

The script was already written in Hinglish, so localisation here is polish plus everything around it.

| # | Script | Localised | Why |
|---|---|---|---|
| 4 | "...aur wash ke baad." · card "Wash ke baad" | "...aur dhulne ke baad." · card "Dhulne ke baad" | Customers say "sofa dhulwaya", not "sofa wash karwaya" |
| 1, 2, 3, 5, 6, 7 | unchanged | unchanged | Already natural; times, cards and facts kept |
| caption | unchanged | unchanged | First line 65 characters; hashtags local |

Not changed, by rule: 20%, 25 Nov, ₹299, "WhatsApp karo", the hook card "Curtain + sofa: 20% off", and every scene's time.

Research had the customer phrase "kapde time pe chahiye". It wasn't used: this is an offer for curtains and sofas, and the phrase is about everyday clothes. Forcing it in would be the opposite of natural.

## 2. Numbers said

| Written | Spoken | Scene |
|---|---|---|
| 20% | bees percent | 1, 5 |
| 25 Nov | pachchees November | 5 |
| ₹299 | do sau ninyaanave | 6 |

## 3. Voiceover script (excerpt)

```
1 · 0.0–3.2 · normal
  Diwali se pehle / curtain aur sofa, [pause 0.2s] *bees percent* off.
  TTS: Diwali se pehle curtain aur sofa, bees percent off.
6 · 13.6–16.4 · normal
  Pickup *free*, [pause 0.2s] do sau ninyaanave se upar.
  TTS: Pickup free, do sau ninyaanave se upar.
7 · 16.4–20.0 · normal
  *WhatsApp* karo, / pickup hum karenge.
  Hint: WhatsApp = "whats-app", not "vats-app"
```

## 4. SRT (first two cues)

```
1
00:00:00,000 --> 00:00:03,200
Diwali se pehle curtain
aur sofa, 20% off.

2
00:00:03,200 --> 00:00:05,600
Mehmaan aane wale hain,
aur curtain?
```

7 cues, the longest line 29 characters, the fastest cue 15 characters per second.

## 5. Back-translation caught one drift

The first draft of scene 5 was "Sirf aaj se 25 Nov tak 20% off". Back-translated, that's "Only from today till 25 Nov", which adds urgency the brief doesn't have. Changed to "Dono pe 20% off, 25 Nov tak".

## 6. The client message

```
Namaste Neha ji 🙏
Diwali offer reel ka script ready hai (20 second):

Shuru: "Diwali se pehle curtain aur sofa, 20% off."
1. Parda khulta hai, 20% off dikhta hai
2. Mehmaan aane wale hain, curtain purane?
3. Aapke ek customer ka sofa, pehle aur dhulne ke baad
4. Offer: curtain aur sofa cleaning 20% off, 25 Nov tak
5. Pickup free, ₹299 se upar. Aakhir mein: "WhatsApp karo"

Iske liye ek real sofa ka pehle-baad wala video chahiye, phone se bhi chalega.

Reply OK to approve, or tell us what to change.
```

## Why this is good

- **Small, deliberate changes:** only one word changed, for a real reason. A localiser that rewrites a natural line to look busy makes it worse.
- **The customer phrase was judged, not forced.**
- **Every number has a spoken form,** and the TTS text has no digits or marks.
- **The message passes the 20-second test:** a greeting, the hook line, five moments, the exact offer, the one thing needed, the OK ask. No "script v2", no "scene", no "CTA".
