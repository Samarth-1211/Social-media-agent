# Client message templates (WhatsApp)

Drafts only: a person sends them. Write in the client's language. Use Hinglish (Roman script) by default, Hindi (Devanagari) if they wrote in Devanagari, and English if they wrote in English. Address the decision maker respectfully: "<name> ji".

**Every message:**
- under about 8 lines;
- numbered questions;
- no internal words ("stage", "gate", "v2", "placeholder", "revision round");
- no prices or dates unless the admin gave them.

## clarification

```
Namaste {name} ji 🙏 Feedback ke liye thank you!
Bas {n} cheezein confirm kar dein, taaki sahi changes karein:
1. {question}
2. {question}
Aapka reply aate hi hum update bhej denge.
```

## confirmation (clear changes, nothing to ask)

```
Namaste {name} ji 🙏 Noted! Ye changes kar rahe hain:
1. {change, in client words}
2. {change}
Updated version jaldi share karenge.
```

## extra_round (over the cap) · needs admin approval

```
Namaste {name} ji 🙏 Aapke suggestions ke liye thank you!
Is project ke {cap} revision rounds ho chuke hain. Ye naye changes ek extra round mein ho sakte hain{: {cost/time from admin}}.
Ya agar aap chahein to inme se 1–2 sabse zaroori changes bata dein, wo hum abhi kar dete hain.
Aap jaise kahein 🙏
```

## change_order (new work) · needs admin approval

```
Namaste {name} ji 🙏 Accha idea hai!
"{their request, short}" ek naya addition hoga (abhi ke plan mein nahi tha){, {cost/time from admin}}.
Kya isse abhi add karein, ya pehle current {reel/poster} final kar lein aur ye agle mein lein?
```

## multiple voices (ask the decision maker to consolidate)

```
Namaste {decision maker} ji 🙏 {other person} ji ne bhi kuch suggestions diye hain:
1. {item}
2. {item}
Kya aap inhe final kar dengi/denge? Hum sab changes ek saath kar denge.
```

## English variant (when they write in English)

Same structure, e.g.: "Hi {name}, thanks for the feedback! Just {n} quick questions so we get it right: 1. … We'll send the update as soon as you reply."

## Rules

- `needs_admin_approval: true` for `extra_round` and `change_order`. Set `approved_by` only when the admin says yes. Never mark it sent.
- **Never blame the client** ("you changed your mind"); never use "out of scope" or "charges" without the admin's words.
- **One message per reply.** If there are both questions and confirmed changes, combine them: changes first, then the questions.
