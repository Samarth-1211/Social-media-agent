# Confidence rules

Every profile field you fill gets an entry in `client.confidence`: `{ "status": "confirmed" | "guessed", "basis": "<where it came from>" }`.

## 1. Confirmed or guessed

| `confirmed` | `guessed` |
|---|---|
| The admin or an editor said it ("Samarth, onboarding 22 Nov") | Inferred from business type or city ("typical for a Jabalpur developer") |
| The client said it, as reported by the team ("Neha on call, 12 Nov") | Read from their material: bio, website, captions, logo ("from Instagram bio") |
| Someone approved a value you proposed ("approved by Ravi at onboarding") | Your suggestion (festival calendar, voice attributes drafted from captions) |
| A TDM default the admin accepted (revision cap 2) | "I think…", "probably…", "shayad…" from anyone |

- **Material is never `confirmed` on its own**, however official it looks. A website can be out of date; a caption may have been written by an old agency. It becomes `confirmed` only when a person approves it.
- **"Approve all" counts** only for what was shown, marked. If the summary showed a field as "?", a general "looks good" confirms it. Record the basis as "approved in profile summary by <name>, <date>".

## 2. When sources disagree

Trust order, strongest first:
1. said or approved by the admin, an editor or the client (newest first);
2. the client's own recent material (last 3 months);
3. older material;
4. inference from business type, city or competitors.

Take the stronger source, mark it, and add an open question if the conflict matters:

```
{ "question": "Bio says 'since 1998', owner said 2002 on the call. Which should posts use?",
  "recommendation": "Use 2002 (owner's word) until confirmed.", "priority": "medium", "field": "references" }
```

## 3. Basis: write it so someone can check it

Good: "from Instagram bio, 22 Nov" · "Neha on call, 12 Nov" · "estimated from the logo PNG" · "inferred: laundry in Indore" · "TDM default".
Bad: "research" · "AI" · "known" · empty.

## 4. Open questions

Create one for every gap or guess that would change a creative. Each has:
- `question`: one line, answerable with yes, no or a short value;
- `recommendation`: what we'll do until answered (so work never stops);
- `priority`:
  - **high:** blocks or risks work. Decision maker unknown, prices unknown but an offer is planned, a legal must-show (RERA), languages unknown, a conflict between sources.
  - **medium:** improves quality. Voice attributes guessed, colours estimated, customer words missing.
  - **low:** nice to have. Posting frequency, extra references.
- `field`: the profile field it affects, or null.

Keep at most about 8 open questions. Merge small ones; drop the low ones first.

## 5. Showing confidence

- In every view, guessed values carry "?" and their basis: "Languages: Hinglish? (from captions)".
- In the brand brief, guessed fields are listed on one line, "Guessed (treat as unconfirmed): …", so stages name them when they shape a choice.
- Never write a guessed value as a plain statement in a reply ("Their audience is 25–40"). Write "Audience looks like 25–40 (guessed from captions)".

## 6. Promoting and demoting

- **guessed → confirmed:** when a person confirms it. Update the basis, close any open question for that field (`answered`, with the answer), and bump the version.
- **confirmed → changed:** a newer confirmed statement replaces it. The changelog names the old value.
- **Never downgrade silently.** If new material contradicts a confirmed value, keep the confirmed value and add an open question.
