# AI tells

What makes a voiceover, caption, text card or client message read as machine-written, and how to fix it. Shared by `script` (humanizer pass), `localise` (AI-tell check) and, later, `voice-music`, `captions-motion` and client messages.

Sections: 1 English tells · 2 Hinglish and Hindi tells · 3 the screenshot test · how to apply · credits.

**Why it happens.** A model picks the choice that fits the most readers; a person writes for one reader, one shop and one city. Almost every tell below is the safe default. The fix is the same each time: say the specific thing this business would say.

**Clean but empty is also a tell.** Removing every pattern below can leave a line that's correct and dead. Each script should still carry one real detail: an area name, a real price, the owner's way of saying it.

## How to apply

1. **Read the line out loud** the way the shop owner would say it. Anything you'd stumble on, or that nobody in Indore would say, is the first fix.
2. **Strong tells: fix on one sighting.** These are marked ●. **Weak tells (○) need company:** fix them only when two or more show up in the same line or caption.
3. **Density, not word bans.** One slightly formal word in a caption is human. Three AI-ish markers in one paragraph means rewriting the paragraph, not swapping words.
4. **Keep every fact.** While rewriting, the price, offer, date, area, CTA and any `keep_as_is` term stay exactly as they were. Re-check them after the pass.
5. **Don't over-correct.** Forced short-long rhythm, one-word lines for drama and fake casualness ("yaar" every line) are tells too. Change only what reads machine-flat. When unsure, leave it.
6. **Customer phrases stay verbatim.** A real customer's words from research or the profile are never "humanized".
7. **Record what changed** in the stage's `humanizer_notes` or `ai_tell_check.fixes`: one line per fix.

## 1. English tells

Our own short examples, in ad language. The patterns are paraphrased from the humanizer sources (credits).

### A. Staging instead of saying it

- ● **"Not X, it's Y"** and its cousins ("not just X, but Y"; "This isn't about X. It's about Y."). It sets up a claim nobody made, so the real point sounds bigger.
  - Before: "It's not just a laundry, it's peace of mind."
  - After: "We pick up, wash, press and drop back the same week."
- ● **Closers that repeat the point** ("That's the difference." / "Simple as that." / "Let that sink in.").
  - Before: "Pickup is free above ₹299. That's the Shubh promise."
  - After: "Pickup is free above ₹299." (Stop there.)
- ● **Deep-sounding sayings** ("At its core…", "What really matters is…", "Home is where…").
  - Before: "At its core, a home is about the people in it."
  - After: "Possession in March 2027. Your parents move in before summer."
- ● **Run-ups before the point** ("Here's the thing", "Let's dive in", "Honestly?", "The result?", "Plot twist:").
  - Before: "The result? Spotless curtains."
  - After: "Curtains back in two days, pressed."
- ○ **Arguing with no one** ("Don't get me wrong", "To be clear", "Some might say…").

### B. Rhythm by rule

- ● **Staccato stacks** ("No stress. No mess. Just results." / "Fast. Fresh. Folded.").
- ○ **Triads everywhere.** One real list of three is fine ("wash, press, fold"). Three abstract nouns ("quality, trust and care") or a second triad in the same caption is a tell.
- ○ **Same opening, line after line** ("We… We… We…"). Merge lines or change the subject.
- ● **Em dashes as the connector for everything.** English captions get at most one. Hinglish and Hindi get none (§2).
- ○ **Synonym cycling**: the same thing renamed in every line ("sofa… couch… seating… furniture"). Pick one word and repeat it.
- ○ **False ranges** ("from curtains to carpets, from homes to hearts") where the ends aren't on a real scale.

### C. Inflation and borrowed authority

- ● **Overused AI words**, especially in clusters: elevate, seamless, unlock, delve, crucial, robust, leverage, empower, curated, vibrant, nestled, journey, game-changer, next level, testament.
- ● **Inflated significance** ("marks a new era", "redefines laundry in Indore").
- ● **Sales language with nothing behind it** ("best-in-class", "premium quality", "world-class", "unmatched", "trusted by thousands" with no count).
  - Before: "Experience premium quality cleaning like never before."
  - After: "Silk sarees hand-pressed; we check every one before it goes back."
- ● **Borrowed authority** ("experts say", "studies show", "customers love us") with no named source. Name the source or cut the line.
- ○ **Shallow -ing add-ons** ("…ensuring a fresh start", "…making every day special").
- ○ **Stacked hedges** ("may potentially help").

### D. Leftovers and wrong reader

- ● **Chat leftovers** in client-facing text: "Certainly!", "Great question", "I hope this helps", "Here's your script:", "As an AI".
- ● **Template blanks** left in: `[Business Name]`, `{city}`. A `{{needed: …}}` placeholder is allowed only where the fact guard put it, and it never goes to the client.
- ● **Engagement bait** ("Like and share!", "Follow for more", "Tag someone who needs this", "Comment YES").
- ● **Video preambles** ("In this video…", "Today I'll show you…", "Hey guys, welcome back").
- ○ **Re-explaining what the viewer just saw** ("As you can see in this video…").

## 2. Hinglish and Hindi tells (our own)

Patterns we see when a model writes for Indian local businesses. Each has a before/after.

1. ● **"Shuddh" words where people use English loanwords.** People say *pickup, delivery, booking, offer, discount, flat, EMI, sale*. A model reaches for *sangrahan, vitaran, aarakshan, chhoot*.
   - Before: "Ghar se vastron ka sangrahan nishulk."
   - After: "Ghar se pickup free."
2. ● **Literal translations of English ad lines.**
   - Before: "Aapka hamare store mein swagat hai." / "Hum aapki seva mein hamesha tatpar hain."
   - After: "Aaiye, dukaan Vijay Nagar mein hai." / "Kuch bhi ho, WhatsApp karo."
   - Others to catch: "yeh samajh banata hai" (makes sense), "din ke ant mein" (at the end of the day), "apna sabse achha dikhiye" (look your best).
3. ● **Unnatural switching points.** Real speakers switch at nouns and set phrases (*sofa cleaning, free pickup, flat 20% off*), keep the grammar and the feeling in Hindi (*karo, ho jayega, tension mat lo*), and use English connectors only where people do (*but, so, basically*). A model switches mid-phrase or puts Hindi grammar words around English verbs.
   - Before: "Aapke curtains ko clean karna hoga very easy."
   - After: "Curtain saaf karwana ab easy hai."
4. ● **Wrong gender or number agreement.** The adjective and verb follow the noun's gender, and in a *ne* sentence the verb follows the object. Loanwords take the gender people give them: say the phrase aloud and listen ("sale shuru ho gayi", "flat ready hai", "booking khul gayi").
   - Before: "Humara naya offer aa gayi."
   - After: "Hamara naya offer aa gaya."
   - Before: "Maine saree dry clean karwaya." (saree is feminine)
   - After: "Maine saree dry clean karwayi."
   - If you aren't sure of a word's gender, flag it for a native check rather than guess.
5. ● **Formality that doesn't match the audience.** Ads to strangers default to *aap* (karein, dekhiye, aaiye) or the friendly neutral imperative (*karo, dekho*) where the brand already talks that way. Never mix *aap* and *tum* in one line. *Tu* never appears in client creatives. Older Tier 3 audiences get *aap* every time.
   - Before: "Aap apna order book karo, tum ko discount milega."
   - After: "Order book karo, discount milega." or "Order book kijiye, discount milega."
6. ● **Overused YouTube fillers:** "Dosto", "toh chaliye shuru karte hain", "namaskar doston", "aaj hum baat karenge", "bina kisi deri ke", "video ko end tak dekhna".
7. ● **Emoji storms.** More than 2–3 emoji in a caption, emoji at the start of every line, 🔥💯✨ chains, or emoji inside voiceover text. One or two with a job (🙏 in a greeting, 📍 before an address) is fine.
8. ● **Em dashes and fancy punctuation** in Hinglish or Hindi: em dashes, curly quotes, "…" as a pause. Indian phone keyboards rarely produce them, and TTS reads them badly. Use a comma, a full stop, or a new line.
9. ● **Stacked superlatives:** "sabse best, sabse sasta, sabse fast, number 1 quality". One claim, proven, beats four unproven.
10. ● **Generic "best quality, best price"** and its family: "100% satisfaction", "affordable rates", "quality service", "aapka vishwas, hamari pehchaan". Replace with the real fact: the price, the time, the area, the process.
11. ○ **Rhyming slogans that sound like a 1990s pamphlet** ("Kapde chamkaao, khushiyan paao"). Keep one only if the client already uses it.
12. ○ **Hindi film or news-anchor clichés:** "Ab hoga sapna sach", "Breaking news: …", "Aisa pehle kabhi nahi hua".
13. ○ **"Yaar" and "bhai" in every line.** One, where the brand voice is casual, is plenty.
14. ○ **Moral-lesson endings:** "…toh hamesha safai ka dhyan rakhein".
15. ● **Mixed scripts by accident.** Devanagari and Roman in one caption line, unless a brand name or ₹ amount is meant to stay Roman (see `localise/references/hinglish-style.md`).
16. ● **Translated American slang:** "yeh offer fire hai", "ekdum lit", "game-changer deal".

## 3. The screenshot test

Before a line, caption or client message leaves the stage, ask:

> **Would a local customer screenshot this and send it to a friend saying "lol, AI ne likha hai"?**

If yes, or you're unsure, rewrite it in the shop owner's words and run the test again. Two failed rounds means the draft was built from a formula: start that line from the real fact instead of polishing it.

## Credits

- English patterns paraphrased from blader/humanizer (MIT, https://github.com/blader/humanizer), cross-checked against trailofbits/skills-curated `humanizer` (CC BY-SA 4.0; ideas only, no text taken), Jakeschincariol/instagram-agent-skill `ig-human` (MIT) and sergebulaev/instagram-skills `ig-humanizer` (MIT). The humanizer sources trace their patterns to Wikipedia's "Signs of AI writing" (WikiProject AI Cleanup). We paraphrase the ideas only, with our own examples, and take none of that text.
- Hinglish cringe ideas adapted from "hindi-english-content-writer" by Equipt (https://github.com/salah-xd/equipt), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: summarised and extended in our own words for local-business ads.
- The screenshot test is our own wording.
