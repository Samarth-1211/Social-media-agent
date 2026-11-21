# Conflict rules

A conflict is anything that means we can't do every item as written. **Flag it; never pick a side.** Each conflict goes in `conflicts[]` as `{type, items, note, resolution: null}`, and gets one question in the client message (or one question for the admin, when the record should answer it).

## 1. `contradiction`

Two things that can't both be true:
- **Inside one reply:** "music fast rakho" … later "thoda slow aur soft music chahiye".
- **Between this reply and an earlier open item:** F1 asked for a red background, F2 asks for blue.

**Exception:** if the later message clearly replaces the earlier one ("nahi nahi, blue hi rakho"), it isn't a conflict. Label the earlier item `duplicate`, with `duplicate_of` pointing at the later one, and say so in the change list.

Question style: "Music: pehle message mein fast, baad mein slow aur soft. Kaunsa rakhein?"

**Not a conflict: changing an approved decision.** "Offer 20% ki jagah 25% kar do" when the brief says 20% is a clear request to change something approved. Label it `change_request` (`labels.md`); the admin decides through the change-order message. Don't also flag it as a contradiction. Flag a contradiction only when the client's own instructions can't all be done. If a request could mean two different things (a wording change, or a bigger change of offer or scope), that's a `clarification` item with both readings, not a conflict.

## 2. `old_version`

The client is replying about a version older than the current output:
- `about_version` is lower than the current `job.outputs.<field>.version`;
- or they quote something we've already changed ("wo yellow wala" when v2 is blue);
- or the reply came in long after a newer version was sent.

Do this:
- Compare the item with what changed since. If the newer version already did it, label the item `duplicate`, citing the earlier feedback item.
- Otherwise keep the label, flag the conflict, and ask: "Aapne pichla version dekha tha. Naya version (blue background wala) dekh ke batayein, kya ye changes ab bhi chahiye?"

## 3. `multiple_voices`

More than one person at the client gives instructions:
- someone who isn't the `decision_maker` asks for changes (the owner's son, the sales head, a partner);
- two people disagree;
- there's no `decision_maker` on file and more than one person writes.

Do this:
- Record `from` for every item.
- List each person's items separately in the change list.
- **Don't route items from someone other than the decision maker** until the decision maker confirms them. Mark them in the change list as "waiting for <decision maker>'s OK".
- Ask, politely, for one consolidated answer: "Neha ji, Rohit ji ne bhi kuch changes bataye hain (1, 3). Kya aap inhe final kar dengi, taaki hum ek saath sab update kar dein?"
- With no decision maker on file, also tell `brand-keeper` to add a high open question.

## 4. Resolving

`resolution` is filled only when the client or admin answers. Example: "Client chose slow music (Neha, 23 Nov)". When it's filled:
- the losing item is labelled `duplicate` or its status set to `declined`;
- the routing proposal is updated;
- the feedback entry is saved again (rewrite the same `feedback_id`).

## 5. Routing while conflicts are open

- Items involved in an unresolved conflict are **not routed**.
- If every actionable item is blocked, routing is `not_needed` for now and the client message carries the questions.
- If some items are clear, route those, and say plainly that the rest wait for the client's answer.
