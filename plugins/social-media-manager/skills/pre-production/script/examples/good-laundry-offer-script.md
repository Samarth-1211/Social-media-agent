# Good: Diwali offer reel, two structures, one edit at the pick (fictional)

**Job SHL-01**, Shubh Laundry & Dry Clean, Indore. Quick track, Instagram Reel 9:16, **20 s**, Hinglish (Roman). Brief offer: curtain + sofa cleaning **20% off till 25 Nov**; proof point: **free pickup above ₹299** (profile). CTA: **WhatsApp karo** (shop WhatsApp on the end card). Mandatories: logo end card, validity date, free-pickup line. Avoid: dirty-clothes close-ups, the word "cheap".

Creative pick: hook **QA** (H30, price-first offer card), backups QC (relatable "curtain pichhli Diwali wale?") and QE (direct call-out "curtain bhaari hain?"). Learning on file: price in the first frame.

Full record: `${CLAUDE_PLUGIN_ROOT}/library/contracts/examples/script.example.json`.

## The pick message the editor sees

```
🎬 SHL-01 · Script pick: A or B   (20 s · Hinglish · Reels)

A · Wahi sofa, wash ke baad · before-after ⭐
  0–3.2   🗣 "Diwali se pehle curtain aur sofa, 20% off."  🔤 Curtain + sofa: 20% off
  3.2–5.6  faded curtain edge, close · 🗣 "Mehmaan aane wale hain, aur curtain?"
  5.6–8.4  a customer's sofa, before · 🗣 "Yeh ek customer ka sofa, pehle..."
  8.4–10.8 wipe → same sofa, clean · 🗣 "...aur wash ke baad."
  10.8–13.6 offer card · 🗣 "Dono pe 20% off, 25 Nov tak."
  13.6–16.4 van + staff with folded curtains · 🗣 "Pickup free, ₹299 se upar."
  16.4–20  end card · 🗣 "WhatsApp karo, hum ghar se le jaayenge."
  Payoff: scene 4 · CTA: WhatsApp karo
  Caption: Diwali se pehle curtain aur sofa cleaning pe 20% off, 25 Nov tak.
  ⚠ Needs a real before/after clip of one sofa job (client to send, phone is fine)

B · Ek WhatsApp, chaar steps · demo-led
  0–3     🗣 "Curtain aur sofa cleaning pe 20% off."  🔤 Curtain + sofa: 20% off
  3–5.5   WhatsApp 'CURTAIN' sent · 🗣 "Ek WhatsApp karo."
  5.5–8.5 staff bag the curtains at the door · 🗣 "Hum ghar se le jaate hain."
  8.5–11.5 steam iron at the shop · 🗣 "Shop pe wash, press, fold."
  11.5–14.5 curtains back on the rod, diyas lit · 🗣 "Aur wapas, Diwali se pehle."
  14.5–17 offer card · 🗣 "Offer 25 Nov tak hai."
  17–20   end card · 🗣 "WhatsApp karo. Pickup free, ₹299 se upar."
  Payoff: scene 5 · CTA: WhatsApp karo
  Caption: Curtain aur sofa cleaning pe 20% off: bas ek WhatsApp, baaki hum karenge.

⭐ Recommended: A: the real before/after carries trust for a cleaning offer, and the reveal lands before halfway. B needs no client footage.
Needed from client: a before/after phone clip of one real sofa job (for A).

Reply: "A", "B", "A with scene 3 from B", "scene 4 line: …", "shorter by 5 sec", or "none, <what to change>".
```

Editor Ravi replies: **"A, scene 7 line: WhatsApp karo, pickup hum karenge"**. The skill applies the line, re-runs timing (5 spoken words in 3.6 s ✓), the fact guard (pickup is already conditioned in scene 6 ✓), the humanizer and the limits on scene 7, records the gate (`approved`, "script pick: A, edits: scene 7 line") while `script` is still at v1, then saves v2 with `pick` and `downstream`. One-line reply: "Picked A (scene 7 line changed, re-checked). Localise next."

## What the checks caught (in the record)

| Check | Found | Fixed |
|---|---|---|
| Timing | A1 first had the full hook line with "25 Nov tak": 13 spoken words in 3.2 s (4.1 words/s, max 3.0) | The date moved to the offer card scene |
| Timing | B3 said "₹299 se upar pickup free" too: 12 spoken words in 3 s | The condition moved to the end card |
| Fact guard | A's before/after needs a real job | `{{needed}}` + unlock: "client sends a phone clip of a real job" |
| Fact guard | B "pickup free" shown without its condition | End card and caption carry "₹299 se upar" |
| Critique | A: the reveal came after the offer at 12 s (buried payoff) | Before/after moved to 5.6–10.8 s |
| Critique | B: steps 1–3 the same pace and framing (no escalation) | Step 4 ends on a pull-out reveal with a music lift |
| Humanizer | "ekdum best quality cleaning"; "process ekdum seamless hai"; "Hurry!" and an emoji row in the caption | Cut |
| Limits | No countdown or "aaj hi"; 25 Nov is the real end date | — |

## Why this is good

- **Two real options:** A sells with proof (before/after), B with ease (four steps). Different structures and different asset needs, so the editor's choice matters.
- **The hook is delivered:** both open on the price card from frame 1 (the client's own learning), and the promise pays off by 10.8 s (A) and 14.5 s (B, still before the offer).
- **Every fact is the brief's:** 20%, 25 Nov, ₹299, WhatsApp. Nothing rounded, nothing added. "Free" never appears without "₹299 se upar".
- **Storyboard-ready:** every scene names the shot, subject, action, camera and setting, and whether it must be real. Nothing needs AI; it's a phone shoot plus two cards.
- **Spoken Hinglish:** "Mehmaan aane wale hain, aur curtain?" is how an Indore customer talks. No "aapka swagat hai", no "dosto", no dashes.
