# Pending browser step (what the person sees)

The attended Instagram read is the one research step that needs someone online with a signed-in browser. These are the three places it shows up. Write in the user's language.

## 1. Status line (tracker status, one per client)

```
Research: Instagram read pending for {client} (~{estimate_minutes} min, needs browser) · since {created_at as date}{ · due {due}}
```

## 2. The offer (once per session, when a browser is available and tasks are pending)

```
{n} clients need a {total minutes}-minute Instagram read: {client 1}, {client 2}, {client 3}.
I'll do the clicking and reading in your browser; just keep it open and signed in (team account, not a client's). Run now?
```

- **Yes** → run them in sequence, oldest `due` first; one line per client as each finishes ("Shubh Laundry done: 3 outliers, 2 new hooks").
- **Not now** → leave them; don't offer again this session.
- **No browser available** → don't offer; the status line is enough.

## 3. Starting one (just before the browser opens)

```
Reading Instagram for {client}: {accounts} accounts × {reels} reels, then the top {k} reels' openings{ and comments}. About {minutes} min.
I'll stop if Instagram asks for a login or shows a warning.
```

Rules:
- Never ask for an Instagram password and never log in for anyone. If the browser isn't signed in, say so and leave the task pending.
- Never run these in the background or on a loop: only with the person present.
