# Good: a third round on a two-round cap (fictional)

**Context:** SHL-01 (Shubh Laundry Diwali reel). `client-final-approval` is pending on `master` v3. `revision_round` is 2 and the cap is 2. Ravi (assignee) pastes:

> Neha: Achha hai. Lekin ending mein hamara naya number daal do aur music wala gaana badal do, ye purana lag raha hai. Aur ek 15 sec ka version bhi chahiye status ke liye.

**Change list shown:**

```
**SHL-01-F3** · SHL-01 Diwali curtain & sofa cleaning offer reel · from Neha on client-final-approval v3 · round 3 of 2 · ⚠ OVER CAP
1. "Achha hai" → not actionable
2. "ending mein hamara naya number daal do" → clarification: which number? Not on file · Ask: "Naya number kaunsa hai? Ek baar bhej dein."
3. "music wala gaana badal do, ye purana lag raha hai" → in scope: replace the music with a fresher, current-sounding track → voice-music
4. "ek 15 sec ka version bhi chahiye status ke liye" → change request: new 15 s cut-down for WhatsApp status (new deliverable) → brief
Conflicts: none
Route: reopen **voice-music** for item 3 (item 4 needs a change order; item 2 waits for the number)
Who confirms: Samarth only (over cap and a change request)
Suggested learnings: Neha's contact number changed; brand-keeper should update it (watch)
```

**Drafts (both need Samarth's approval before sending):**

```
extra_round:
Namaste Neha ji 🙏 Aapke suggestions ke liye thank you!
Is reel ke 2 revision rounds ho chuke hain. Music change aur naya number ek extra round mein ho sakte hain.
Ya agar aap chahein to sirf naya number update kar dete hain, wo abhi ho jayega.
Aur naya number ek baar bhej dein 🙏

change_order:
Namaste Neha ji 🙏 Accha idea hai! 15 sec ka status version ek naya addition hoga (abhi ke plan mein nahi tha).
Kya isse abhi add karein, ya pehle ye reel final kar lein aur status version alag se banayein?
```

**Saved:** SHL-01-F3 (round 3, `over_cap` true, routing `proposed`), `revision_round` 2 → 3. The routing can't be confirmed by Ravi.

**Samarth:** Neha ji purane client hain, music change free kar do. 15 sec wala alag job banega. Number aane do.

*(Logged as a `ruling`: extra round waived for item 3 by samarth; item 4 declined here, to become a new job; extra_round draft not sent; change_order approved_by samarth. Routing confirmed by samarth → producer `sent_back` to `voice-music`.)*

**Why it's good:**
- The cap is enforced, but the work is still triaged.
- The over-cap and change-order messages wait for the admin, and the decision is the admin's (here, waiving it as goodwill), logged as a ruling.
- The new number is asked for, not guessed, and never written into logs.
- The new 15 s version is recognised as new work, not slipped into the revision.
