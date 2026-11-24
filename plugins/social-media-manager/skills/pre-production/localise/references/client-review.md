# Client review message

The message the assignee sends the client on WhatsApp so they can approve the script. A busy shop owner must understand it **in 20 seconds**, on a phone, between customers.

## 1. Shape (`${CLAUDE_SKILL_DIR}/templates/client-review-message.md`)

1. **Greeting** with the decision maker's name and the respect marker they use ("Namaste Neha ji", "नमस्ते अग्रवाल जी"). One line.
2. **What it is:** "Diwali offer reel ka script ready hai (20 second)". One line.
3. **The hook line**, exactly as it will be said, in quotes.
4. **4–5 key moments**, numbered, in simple words: what they'll see and hear. Not every scene; the ones a client cares about (the opening, the proof, the offer, the end).
5. **The offer and CTA exactly** as in the script, with the price, condition and date.
6. **What we need from them**, if anything: the missing fact or asset in one plain line ("Iske liye ek real sofa ka pehle-baad wala video chahiye, phone se bhi chalega"). Never a `{{needed}}` token.
7. **The ask:** "Reply OK to approve, or tell us what to change." In the client's language when they don't use English ("OK likh dijiye, ya bataiye kya badalna hai"), but keep the word **OK** so the reply is easy to recognise.

## 2. Rules

- **The client's language and script** (`client.languages`, how they write on WhatsApp). Usually the same as the video; a Devanagari video for a client who texts in Roman Hinglish gets a Roman message, with the Devanagari hook line quoted as is.
- **No jargon:** no "scene", "VO", "SRT", "CTA", "hook", "version", "localise", "B-roll", "gate". Say "shuru mein", "aakhir mein", "awaaz", "screen pe likha hoga".
- **No scene tables, no timings** except the total length.
- **Short:** 8–12 lines, under ~600 characters. One or two emoji at most (🙏 in the greeting is fine).
- **No phone numbers, no internal notes,** no mention of AI tools.
- **Exactly the approved facts.** The message is checked like the script: every price and date in `keep_as_is` appears exactly (the validator checks the digits).
- **One message.** Variants in another language get one line ("English version bhi ready hai"), not a second message.

## 3. The approval step (`client-script-approval` stage)

When the producer runs `client-script-approval`, `localise` shows the assignee:
1. the message, ready to copy;
2. "Send this to <decision maker> on WhatsApp, then paste their reply here: 'client approved: …' or 'client feedback: …'".

Then the producer opens the `client` gate. The reply is recorded through `client-feedback`: a clear OK is approval; anything else becomes labelled items routed to `script` (what is said, the order, a fact) or `localise` (how it is said: words, language, script, a name's spelling).

## 4. Example (Hinglish)

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
