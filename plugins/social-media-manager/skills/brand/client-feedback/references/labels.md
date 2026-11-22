# Labels

Every item gets exactly one label. Decide in this order; the first that fits wins.

| Order | Label | When | Example (quote) |
|---|---|---|---|
| 1 | `duplicate` | It repeats an item in this reply or an earlier open item, or a later message in the same reply replaces it. Set `duplicate_of` (item number, or `<feedback_id>#<n>`). | "haan wo logo bada karna hai na" after "logo thoda bada karo" |
| 2 | `not_actionable` | Praise, thanks, greetings, small talk, emojis, approval with no change. | "bahut sundar 👌", "thank you ji", "ok 👍" |
| 3 | `clarification` | We can't act without asking: vague taste notes, unclear "this/that", a missing value (which phone number? which date?). Needs `question`; vague notes also get `interpretations`. | "thoda aur attractive banao", "wo wala colour karo" |
| 4 | `change_request` | New work beyond what was approved: a new deliverable, a new offer or price, a different concept, or reversing something already approved at an earlier gate. | "ek 30 sec ka version bhi bana do", "offer 20% ki jagah 25% kar do" (after the brief was approved) |
| 5 | `in_scope` | A concrete change to the work just shown, within its approved brief. | "logo thoda bada karo", "last mein phone number 2 sec aur rakho" |

## The deciding question

When torn between `in_scope` and `change_request`, ask: **"Was this already decided and approved?"**
- **Not decided yet, and it adjusts the shown work** → `in_scope`.
- **It reverses an approved decision** (brief, the creative pick, script approved at an earlier gate), **or adds something the brief didn't have** → `change_request`.
- **Can't tell from the record** → label it `clarification`, with the question for the admin, not the client: "Was the 25% offer agreed with the client before?"

## Writing `change`

One line, in team language, concrete enough to act on:
- Good: "Increase logo size on the end card by about 30%."
- Good: "Replace background music with a slower, softer track."
- Bad: "Make it better." (That's a clarification, not a change.)

## Item `status`

| Status | Meaning |
|---|---|
| `open` | Default for `in_scope` and `change_request` |
| `asked` | `clarification` items once the message is sent |
| `done` | Set by the stage skill or producer when the reopened stage delivers it |
| `declined` | The admin decided not to do it (e.g. a change order refused); say why in the change list |

`not_actionable` and `duplicate` items need no status.

## Mixed messages

"Sab theek hai bas music change karo" is two items:
1. "sab theek hai" → `not_actionable` (but note: the rest is approved);
2. "music change karo" → `in_scope` if the music isn't specified, or `clarification` if we can't tell what's wrong with it ("kaisa music chahiye?").

**A reply with any actionable item is not an approval.** The gate stays pending until the changes come back and are approved.
