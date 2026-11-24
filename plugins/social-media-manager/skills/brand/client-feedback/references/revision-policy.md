# Revision policy

## 1. What counts as a round

A **round** is one consolidated set of client changes on one version of the work.

| Situation | Round |
|---|---|
| The first reply with at least one `in_scope` or `change_request` item, on a version not counted yet | **+1** (`revision_round` + 1; this feedback's `round` = the new value) |
| More messages about the **same version**, before work on it restarts | Same round: fold them into the same feedback entry, or a new entry with the same `round` |
| Only praise, approval, or questions (`not_actionable`, `clarification`) | No change |
| The client answers our clarification questions | Same round as the items they clarify |
| We send a new version and the client replies with more changes | +1 |
| Fixing **our** mistake (a wrong spelling, wrong number, something the brief asked for that we missed) | No change: label `in_scope`, note "our fix" in `change`, and don't count it |

`revision_round` belongs to the job and covers all client gates on it (script, final, poster). The client's `revision_cap` (default 2) is rounds per job.

## 2. Over the cap

When the new round is greater than `revision_cap`:
1. Set `over_cap: true`.
2. Still triage every item: quote, label and route.
3. Draft an `extra_round` message (`templates/client-message.md`), `needs_admin_approval: true`. It is polite and offers a choice:
   - do these changes as an extra round (the admin decides the price and time; the draft never names a price unless the admin gives one);
   - or pick the 1–2 most important changes within what's included.
4. **Routing waits for the admin:** only the admin confirms it, after deciding (send the message, or waive the cap for this job). Log the decision as a `ruling`.

**Change requests (new work)** get a `change_order` message for admin approval, whatever the round. They're never quietly absorbed. The admin may decide to include one; log that as a `ruling`.

## 3. Routing table

Route each actionable item to the stage that owns that part of the work, on the job's path (`stages.yaml`).

| The item is about | Video stage | Poster stage |
|---|---|---|
| The offer, price, product, audience, deliverables (new or changed) | `brief` (usually a `change_request`) | `brief` |
| The idea or story itself | `concept` (full track); `hooks` (quick track: the reused format) | `poster-drafts` (no concept stage for posters) |
| The opening: first frame, first line, on-screen hook text | `hooks` | — |
| What is said and in what order: the story, a scene added or cut, a claim, the offer line, the CTA | `script` | — |
| How it is said: a word or phrase, Hindi vs English, Roman vs Devanagari, a name's spelling or pronunciation, the caption wording | `localise` | — |
| Scene order, which shots, what's shown | `storyboard` | — |
| How a generated shot looks (person, location, product in the shot) | `clips` | — |
| Voice tone, voice artist, music | `voice-music` | — |
| Cut, pacing, length, transitions, order of clips | `assemble` | — |
| On-screen text, captions, motion graphics | `captions-motion` | — |
| Colour grade, logo end card, contact details on the final | `finish` | — |
| Layout, headline, photo, colours, offer text on a draft | — | `poster-drafts` |
| Small fixes on the final poster (spelling, number, logo size) | — | `poster-final` |

- **Reopen the earliest stage** among the routed items; `producer` reruns everything after it.
- **If the earliest stage is the one just shown** (e.g. poster feedback at `client-poster-approval` routes to `poster-drafts`, the stage that made what was shown), producer records `sent_back` to that stage.
- **If the route would reopen a stage before an approved admin gate** (`brief`) **or the approved creative pick** (`hooks`, editor gate: concept + hook), it's a `change_request`, and only the admin confirms it.
- **A stage not on the path:** route to the nearest earlier stage on the path, and note it.
- **`script` or `localise`?** If the fix changes the meaning, a fact or the list of scenes, it's `script`. If the same meaning just needs different words or a different script, it's `localise`. A mixed item goes to `script` (the earlier stage); `localise` re-runs after it anyway.

## 4. Polite out-of-scope handling

- Never say "that's out of scope" or "you'll be charged". Say what it is and offer a choice.
- Always give the cost and time impact as "the admin will confirm", unless the admin has given them.
- Credit the client's idea before explaining the choice: "Accha idea hai! Ye naya version hoga…"
