# Client WhatsApp message: brief questions

One message, written for the team member to copy and send. Use the client's language and script (profile `languages`; Roman Hinglish if unsure). At most 4 questions, blocking ones first, each with our guess, so the client can reply "1 haan, 2 nahi, ₹249".

Never include job IDs, stage names, field names, jargon or phone numbers. Address the decision maker the way the team does ("Neha ji", "Agrawal sir").

## Hinglish

```
Namaste <name>! <job in plain words> ke liye <n> cheezein confirm karni hain:

1. <question>? Humara guess: <guess>
2. <question>? Humara guess: <guess>

Bas "1 haan, 2 nahi" ya sahi value likh dein. Reply aate hi video shuru kar denge 🙏
```

## Hindi (Devanagari)

```
नमस्ते <name> जी! <job in plain words> के लिए <n> बातें पक्की करनी हैं:

1. <question>? हमारा अंदाज़ा: <guess>
2. <question>? हमारा अंदाज़ा: <guess>

बस "1 हाँ, 2 नहीं" या सही जानकारी लिख दें। जवाब आते ही काम शुरू कर देंगे 🙏
```

## English

```
Hi <name>! For the <job in plain words>, we need to confirm <n> things:

1. <question>? Our guess: <guess>
2. <question>? Our guess: <guess>

Just reply "1 yes, 2 no" or send the right detail, and we'll start right away.
```

## Example (Shubh Laundry)

```
Namaste Neha ji! Winter kambal-razai offer video ke liye 2 cheezein confirm karni hain:

1. Kambal/razai dhulai ka rate kitna dikhayein? Humara guess: ₹349 per piece
2. Offer kab tak chalega? Humara guess: 30 Nov tak

Bas "1 haan, 2 nahi" ya sahi value likh dein. Reply aate hi video shuru kar denge 🙏
```

## Reminder (after `client_question_reminder_hours`)

```
Namaste <name>! <job in plain words> ke <n> sawal pending hain: 1) <short>, 2) <short>. Reply kar dein toh aaj hi kaam shuru ho jayega 🙏
```

## After sending

Record `asked_at` from `get_now`, set the questions to `open`, and save the brief as `awaiting-client` (SKILL.md step 6). Read the reply with `interview-rules.md` §3.
