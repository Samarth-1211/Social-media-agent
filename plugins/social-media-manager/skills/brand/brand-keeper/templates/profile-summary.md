# Profile summary template

Show this before saving a new client, and when checking an existing one ("check first"). Keep it under about 25 lines: it's for a person to approve, not the full record (that's `${CLAUDE_PLUGIN_ROOT}/library/templates/client-record.md`). Mark every field: ✓ confirmed, ? guessed (with a short basis).

```
**{name}** ({client_code}{ · NEW | · v{version}}) · {business_type}, {city}
Decides: {decision_maker.name} ({role}) {✓/?} · Contact: {contact_person} · WhatsApp: {on file | missing}
Languages: {languages} {✓/?} · Platforms: {platforms} {✓/?} · Posting: {posting_frequency}
Audience {✓/?}: {summary} ({age_range}); their words: "{customer_words, max 2}"
Voice {✓/?}: {summary}. {attribute} (not {doesnt_mean}); {attribute} (not {doesnt_mean})
Words: use {use} · never {word} ({reason})
Look {✓/?}: {colour name hex}, {fonts}; logo {on file | missing}
Do: {do, max 3} · Don't: {dont, max 3}
Calendar ?: {occasion (priority), max 4}
Admin only: prices {items or "none yet"} · revision cap {n}
Guessed: {list of guessed fields with basis, one line}
Open questions:
1. [{priority}] {question} → {recommendation}
…
{For existing clients: "Last changes: v{n} {date}: {change}; v{n-1} …"}
Reply "save", or tell me what to change.
```

## For updates: before → after

Show only the fields that change:

```
Updating {name} (v{version} → v{version+1}):
- Languages: Hinglish ? → Hinglish, Hindi ✓ (Neha on call)
- Open question answered: "Who approves?" → Neha ✓
Reply "save" or tell me what to change.
```

## Rules

- **WhatsApp is never shown,** only "on file" or "missing".
- **Every "?" has its basis**, here or on the Guessed line.
- **Nothing is saved until the reply is a clear yes** ("save", "haan save karo", "ok, save").
