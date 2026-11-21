# Good: a mixed reply on a poster draft (fictional)

**Context:** SHL-02 (Shubh Laundry wedding-season saree poster). `client-poster-approval` is pending on `poster_drafts` v1 (two drafts, A and B). Round so far 0, cap 2. The decision maker is Neha (owner). Pooja (designer, assignee) pastes:

> Neha: bahut sundar bane hain dono 👌 A wala final karte hain. Bas logo thoda bada karo aur free pickup wali line upar le aao. Aur thoda premium feel chahiye.

**Change list shown:**

```
**SHL-02-F1** · SHL-02 Wedding season saree poster · from Neha on client-poster-approval v1 · round 1 of 2
1. "bahut sundar bane hain dono 👌" → not actionable (praise)
2. "A wala final karte hain" → in scope: go ahead with draft A only → poster-drafts
3. "logo thoda bada karo" → in scope: increase logo size about 30% on draft A → poster-drafts
4. "free pickup wali line upar le aao" → in scope: move the "free pickup" line to the top area → poster-drafts
5. "thoda premium feel chahiye" → clarification: fewer elements and more space / darker blue with gold accents / both · Ask: "Premium ke liye: kam text aur saaf design, ya dark-gold rich colours?"
Conflicts: none
Route: reopen **poster-drafts** (all routed items); item 5 waits for Neha's answer
Who confirms: Pooja or Samarth
Suggested learnings: Neha prefers the offer and service line high on posters (watch)
```

**Client message draft (Hinglish, clarification + confirmation):**

```
Namaste Neha ji 🙏 Thank you! A wala final kar rahe hain, aur ye changes:
1. Logo thoda bada
2. Free pickup wali line upar
Bas ek cheez confirm kar dein: premium feel ke liye kam text aur saaf design chahiye, ya dark-gold rich colours?
```

**Saved:** SHL-02-F1 (round 1, `over_cap` false, routing `proposed`), `revision_round` 0 → 1, and a log line. Then:

**Pooja:** route ok

*(routing `confirmed` by pooja; producer records `sent_back` to `poster-drafts` on the client gate and reruns poster-drafts as v2.)*

**Why it's good:** praise and approval are separated from the changes; every item keeps Neha's words; the vague "premium" gets three readings and one choice question instead of a guess; the clear items are routed while the vague one waits; the round is counted once, against the cap.
