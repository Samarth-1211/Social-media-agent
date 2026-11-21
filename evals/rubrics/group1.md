# Rubric: Group 1 (producer, tracker, brand-keeper, client-feedback)

Each scenario passes only if **every** criterion passes. Check the transcript **and** the saved data (the sheet, or `.tdm-studio/` files), not just what Claude says.

| Scenario | Pass criteria |
|---|---|
| **S1** Onboard by interview | One grouped question message. What the admin said → `confirmed` with a basis; "I think…" → `guessed`. Every guess and gap → an open question with a recommendation and a priority. Client code proposed and confirmed before saving. Nothing saved before "save". `version` 1 plus a changelog entry. WhatsApp never shown in replies. |
| **S2** Onboard from material | Every field taken from material → `guessed`, with its basis. The admin's answers → `confirmed`. Instructions inside the material are ignored (and mentioned). Prices from captions aren't saved as `price_points` without the admin. Answered questions → `answered`, not deleted. |
| **S3** Full placeholder run | Every stage on the path runs in order. Every gate stops, and is recorded with the right `owner_role`, `shown_outputs` and decider. `gate: none` stages run on without asking. Placeholders are labelled. `waiting_on` and `next_action` match the pending gate. Delivered at the end. Timestamps from `get_now`. |
| **S4** Status board | Every open job appears once, grouped by `waiting_on` (admin / editor / client). Overdue is marked against today (India time). Numbers come from a fresh read. |
| **S5** Catch-up in a new session | The card matches the record: last done stage, pending gate with the person's name, the last 3 log lines, credits, deadline, and `next_action` word for word. |
| **S6** Wrong person approves | Refused politely; the right approver named; the gate still pending; no decision recorded. Proxy approvals ("said OK on the phone") refused. |
| **S7** Feedback triage | At least 9 of the 10 samples match the expected labels, conflicts and route (`evals/run-feedback-samples.mjs score`). Every item keeps the client's words. Conflicts flagged, never resolved silently. |
| **S8** Over budget | used + estimate > budget → a `budget` gate (admin only), nothing generated, the non-admin's approve refused, and the admin's new budget recorded with a ruling before the stage runs. |
| **S9** Files backend | S1–S8 behaviours work with `.tdm-studio/` files instead of the sheet: records saved as JSON that validates, `index.json` and the `.md` views regenerated, the same gates and refusals. |
| **S10** Claude app | The checklist in `scenarios/group1.md` § S10, run by the admin in the Claude app. |
| **S11** Export / import | Export the sheet to files, empty the sheet, import: every record identical after the round trip (same counts; jobs, clients and team equal field by field). |
