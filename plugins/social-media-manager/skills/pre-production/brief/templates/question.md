# One team question

One blocking essential per question, in the person's language. The guess comes first and is worded so "haan" accepts it. 2–4 options; the person can always type something else.

## With the ask-the-user tool (Claude Code: `AskUserQuestion`)

One question per call:

| Tool field | Fill |
|---|---|
| `question` | The question in plain words, ending with "?" |
| `header` | 12 characters or fewer: "Price", "Channel", "Last date", "Offer", "Length" |
| `multiSelect` | `false` |
| `options` | 2–4. First: the guess, label ending "(guess)", description = why ("pichli baar yahi tha"). Then the next likeliest values. Optionally "Client se poochna padega" (moves it to the client message). |

The tool adds "Other" by itself, so don't add one.

## As text (no tool)

```
<question>?
Guess: <guess> (<why, a few words>)
1. <guess>  2. <option>  3. <option>  — ya kuch aur likh dein
```

## Examples

```
Video dekh ke log kya karein?
Guess: WhatsApp karein (pichli 2 reels mein yahi tha)
1. WhatsApp karein  2. Call karein  3. Shop aayein  — ya kuch aur likh dein
```

```
Kambal dhulai ka rate kya dikhayein?
Guess: ₹299 per piece (aapke wash rate ke hisaab se)
1. ₹299  2. ₹349  3. Client se poochna padega  — ya kuch aur likh dein
```

```
वीडियो कितना लंबा हो?
अंदाज़ा: 20 सेकंड (ऑफ़र रील के लिए सही)
1. 20 सेकंड  2. 30 सेकंड  3. 15 सेकंड — या कुछ और लिख दें
```

## Don't

- Ask two things at once ("rate aur date?").
- Use jargon (CTA, objective, TG): see `interview-rules.md` §6.
- Ask what the profile, research or a past job already answers.
- Number questions in team mode ("Q3 of 5"). Just ask.
