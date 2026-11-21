# Versions, changelog and learnings

## 1. Saving changes

Storage rules: `${CLAUDE_PLUGIN_ROOT}/library/storage/README.md` §3 (read fresh, version check, `get_now` for times, read back).

| Change | `version` | Changelog entry |
|---|---|---|
| New client | 1 | `{version: 1, date, by, sections: ["all"], change: "Profile created from <interview / material / both>."}` |
| Any real change: a new value, a confirmed guess, a new learning, a retired learning, an answered question | + 1 | `{version, date, by, sections: [<fields>], change: "<what changed and why>"}`. Name old → new for confirmed fields. |
| Typo or formatting only | unchanged | none |

- **Changelog is newest first.** Never edit or delete old entries.
- **One save per conversation turn**, covering everything the person confirmed in it.
- **Several sections in one save** get one entry listing them all.

Good entries:
- "Confirmed languages (Hinglish, Hindi) and decision maker (Neha) from owner call."
- "Revision cap 2 → 3 for wedding season, agreed by Samarth."
- "Learning added: Neha rejects close-ups of dirty clothes (SHL-01 feedback)."

Bad: "updated", "changes", "misc".

## 2. Learnings

What the team learns by shipping. They make the next draft better.

**What earns a place:**
- a decision made with a reason ("No per-sq-ft price in any creative: director's rule");
- a correction the client gave, especially if repeated;
- something liked or rejected that shows a pattern (seen twice, or once with a clear reason).

**Writing one:**

| Field | Rule |
|---|---|
| `date` | from `get_now` (date part) |
| `kind` | `liked`, `rejected`, `decision` or `correction` |
| `what` | One sentence, specific enough to change a draft. Good: "Neha prefers the offer price in the first 2 seconds of reels." Bad: "Client likes good reels." |
| `evidence` | The job and the client's words (no phone numbers): "SHL-01 round 1: 'offer pehle dikhao'". |
| `applies_to` | `reels`, `posters`, `captions`, `voice-over` or `all` |
| `status` | `active` (apply it), `watch` (seen once, check again) or `retired` (no longer true) |
| `source_job` | the job ID, or null |

**Flow:**
1. A suggestion arrives (from `client-feedback`'s `learnings_suggested`, a finished job, or a person saying "remember that…").
2. Draft it with the rules above and show it: "Add learning for SHL: <what> (<evidence>), applies to <x>, status <active/watch>?"
3. Save only after the assignee or admin says yes; bump the version and add a changelog line.
4. **Duplicates:** if an active learning already says it, add the new evidence to it instead (and move `watch` → `active` on the second sighting).
5. **Contradictions:** if a new learning contradicts an active one, show both. When confirmed, retire the old one (never delete it).
6. **Keep about 20 active.** Past that, propose retiring the oldest `watch` items.

**The brand brief** shows at most 3 active learnings. Pick the most recent, preferring `decision` and `correction`.
