# Good: two voices and a contradiction (fictional)

**Context:** NRH-01 (Narmada Heights Navratri site-visit reel). `client-script-approval` is pending on `script` v2. Round so far 1, cap 2. The decision maker is Mr. Agrawal (director). The approved brief says "starting at" pricing only, with no per-sq-ft price. Ravi (assignee) pastes two forwarded messages:

> Mr. Tiwari (sales head): Script mein per sq ft rate daal do ₹3,450, log wahi poochte hain. Aur music thoda fast rakho.
> Mr. Agrawal: Script theek hai. Music soft hi rakhna, family audience hai. Possession date bhi bolna Dec 2027.

**Change list shown:**

```
**NRH-01-F2** · NRH-01 Navratri site-visit offer reel · from Mr. Tiwari, Mr. Agrawal on client-script-approval v2 · round 2 of 2
1. "Script mein per sq ft rate daal do ₹3,450" → change request: add per-sq-ft price (brief says "starting at" only) → brief (from Mr. Tiwari: waiting for Mr. Agrawal's OK)
2. "music thoda fast rakho" → in scope: faster music → voice-music (from Mr. Tiwari: waiting for Mr. Agrawal's OK)
3. "Script theek hai" → not actionable (approval of the script text)
4. "Music soft hi rakhna, family audience hai" → in scope: keep the music soft → voice-music
5. "Possession date bhi bolna Dec 2027" → in scope: add a possession-date line to the voice-over → script
Conflicts:
- multiple_voices (items 1, 2): instructions from Mr. Tiwari, who isn't the decision maker → ask Mr. Agrawal to confirm
- contradiction (items 2, 4): fast music vs soft music → ask which (Mr. Agrawal's "soft" is likely, but not chosen by us)
Route: reopen **script** for item 5; items 1 and 2 held until Mr. Agrawal answers
Who confirms: Samarth (admin only: item 1 is a change request)
Suggested learnings: none yet
```

**Client message draft (to Mr. Agrawal, Hinglish):**

```
Namaste Agrawal ji 🙏 Thank you! Possession date (Dec 2027) script mein add kar rahe hain.
Tiwari ji ne bhi do suggestions diye hain, aapka final chahiye:
1. Per sq ft rate (₹3,450) script mein dikhayein, ya sirf "starting at" rakhein jaisa pehle tay hua tha?
2. Music: Tiwari ji ne fast kaha, aapne soft. Soft hi final karein?
```

**Also drafted (admin approval needed before sending):** a `change_order` message for item 1 in case Mr. Agrawal wants the per-sq-ft price. It's held until he answers.

**Why it's good:** both conflicts are flagged with their items and neither side is picked. The non-decision-maker's items wait for the director. Only the clear item is routed. The price change is recognised as reversing an approved brief decision (`change_request`), so only the admin confirms. The phone-free quotes are kept exactly.
