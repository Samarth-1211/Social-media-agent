# Research plan (shown before running)

Fill this in after the tool check and router (`references/router.md`). In an attended run, show it; in an unattended run, keep it for the summary. Keep it under about 15 lines. Write in the user's language; method names stay as they are.

```markdown
**Research plan: {client name}** ({trigger}; situations: {situations})
Competitors: {n} saved ({direct}/{adjacent}/{outsized}){; discovery adds {k} (guessed)}

Now (no browser needed):
- {method}: {one-line reason} · cap {cap}
- …
Browser step ({run now | queued: ~{minutes} min, needs someone online with Chrome}):
- {method}: {one-line reason} · cap {cap}
- …
Skipped: {method}: {why, e.g. "Meta Ads connector not connected"}
Cost: free{ | Apify ~{amount} {currency}: {auto-approved (limit {limit}) | needs admin approval}}

Say "go deeper", "add <method>" or "remove <method>" to change it. {Free plan: starting now.}
```

Rules:
- Every method listed has its reason. Every skipped method says why.
- Caps are the real numbers for this run (from `config.research_caps`), not "default".
- The cost line is always there; "free" when no Apify.
- A paid part above the auto-approve limit says who must approve, by name (the admin).
