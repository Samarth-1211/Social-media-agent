# Bad: ad copy dressed as a script (annotated)

A fictional first draft for a clothing store's festival reel (**Saanjh Ethnic, Bhopal**, 20 s, Hinglish). The brief's offer: **festive kurta set with custom fitting, ₹1,499** (profile price); CTA: **visit the MP Nagar store**. Audience: women 22–45, often shopping with a sister; a real customer phrase on file: "fitting perfect chahiye". Profile: show the tailoring table; never body-shaming language. It reads like a pamphlet, not a reel. Every problem below is one the skill's checks catch.

## The draft

| # | Time | Visual | Card | VO |
|---|---|---|---|---|
| 1 | 0–4 | Logo animation with sparkles | SAANJH ETHNIC PRESENTS FESTIVE COLLECTION 2026 | "Namaskar dosto! Aaj hum aapke liye laaye hain ek bahut hi khaas festive collection." |
| 2 | 4–9 | Beautiful models in a luxury setting | Best quality — best price — best designs | "Saanjh Ethnic — jahan quality aur style milte hain. Bhopal ka number 1 ethnic store, 10,000+ happy customers ke saath." |
| 3 | 9–13 | Happy family | Hurry! Limited stock!! | "Sirf aaj ke liye, 50% tak ki chhoot! Jaldi kijiye, stock seemit hai." |
| 4 | 13–17 | Various kurtas | — | "Hamare vastron ki gunvatta aur aapka vishwas, yahi hamari pehchaan hai." |
| 5 | 17–20 | Contact details | Call / WhatsApp / Visit / Follow | "Abhi call kijiye, WhatsApp kijiye, store visit kijiye aur hamein follow karna na bhoolein!" |

Caption: "✨🔥✨ FESTIVE DHAMAKA ✨🔥✨ Best collection at best price!!! Hurry up!!! #viral #fyp #explore #fashion #sale #trending #instagood #ethnic #diwali #bhopal #shopping #offer"

## What's wrong

| Where | Problem | Check |
|---|---|---|
| Scene 1 | **Weak hook:** a logo and a greeting first, the offer nowhere; the card is 6+ words and starts after the animation. The first spoken word comes after the sparkles. | Critique `weak-hook`; SC2; SC8 |
| Scene 1 | "Namaskar dosto", "aaj hum aapke liye laaye hain": YouTube fillers | `ai-tells.md` §2.6 |
| Scene 1 | 16 spoken words in 4 s = 4.0 words/s (Hinglish max 3.0) | Timing; SC7 |
| Scene 2 | **Invented facts:** "number 1", "10,000+ happy customers". Neither is in the brief or the profile. | Fact guard; SC5 |
| Scene 2 | "Beautiful models in a luxury setting": not storyboard-ready (no shot, action or camera), not producible by a local store, and borrowed luxury | `scene-writing.md`; SC1 |
| Scene 2 | Em dashes in Hinglish, stacked "best… best… best" | `ai-tells.md` §2.8, §2.9 |
| Scene 3 | **Invented offer and fake urgency:** "sirf aaj", "50% tak", "limited stock". The brief has no discount at all: the offer is the ₹1,499 set with custom fitting, and no stock limit. | Fact guard; limits; SC10 |
| Scene 3 | "Happy family": a generic cliché, and if generated, an AI family that looks like real customers | `scene-writing.md`; limits |
| Scene 4 | **"Too pure" translated Hindi:** "vastron ki gunvatta", "aapka vishwas, hamari pehchaan". Nobody in Bhopal says this. | `ai-tells.md` §2.1, §2.2, §2.10 |
| Scenes 2–4 | **No escalation and no payoff:** three scenes of claims, nothing shown changes, no reveal | Critique `no-escalation`, `buried-payoff` |
| Scene 5 | **Four CTAs** + "follow" bait; the brief's ask is one: visit the store | SC3; `caption-cta.md` |
| Scene 5 | "Contact details": a phone number on screen that the brief didn't ask for | Fact guard |
| Caption | Emoji storm, no first line with the offer, "Hurry up!!!", 12 hashtags including #viral #fyp | `caption-cta.md`; `ai-tells.md` §2.7 |
| Whole | One version, no structure type, no times per card, no asset source, no `must_be_real` | SC1, SC9 |

## The same brief, done right (version A sketch: demo-led, 20 s)

```
1 · 0–3    medium · a kurta set lifted off the rack, a "₹1,499" tag swings into frame · push-in
           🔤 Kurta set + fitting: ₹1,499   🗣 "₹1,499 mein kurta set."   (custom fitting is on the card: the full sentence was 12 spoken words in 3 s)
2 · 3–6.5  close-up · the tailor's tape around a sleeve at the tailoring table · static
           🔤 Fitting yahin, aapke saamne   🗣 "'Fitting perfect chahiye?' Yahin hoti hai."
3 · 6.5–10 medium · two sisters hold matching dupattas to the store mirror (real, consenting customers) · handheld
           🔤 Behen ke saath matching   🗣 "Behen ke saath matching bhi."
4 · 10–13.5 medium · the tailor hands over the fitted kurta, the customer smiles at the mirror · static
           🔤 Pehen ke dekho   🗣 "Pehen ke dekho, phir lo."
5 · 13.5–16.5 wide · the MP Nagar store front, evening lights · tracking
           🔤 MP Nagar store   🗣 "MP Nagar mein."
6 · 16.5–20 screen · end card with the store pin · static
           🔤 Store aaiye · MP Nagar   🗣 "Store aaiye, fitting karwa ke jaiye."
Caption: "Festive kurta set, custom fitting ke saath, ₹1,499. MP Nagar store pe aaiye, fitting yahin hoti hai. #Bhopal #MPNagar #KurtaSet #FestiveWear"
```

- **Every fact is the brief's or the profile's:** ₹1,499, custom fitting, the tailoring table, MP Nagar. No discount appears because the brief has none.
- **The customer's own words** ("fitting perfect chahiye") carry scene 2, verbatim.
- **One ask:** visit the store. The offer is on screen from frame 1. Every scene is shootable on a phone in the store; the two sisters must be real and consenting (`must_be_real`), never generated.
- **No "slim dikhoge", no body talk:** the profile's `never_use` holds.
