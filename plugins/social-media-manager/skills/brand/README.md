# brand/: Group 1

Knows each client.

| Skill | Status | Does | Stages |
|---|---|---|---|
| `brand-keeper` | built (0.1.0) | Client onboarding (from material or by interview) and the brand profile (`client.schema.json`): confirmed vs guessed fields, open questions, learnings, versions, the brand brief. | none (writes the `client` record that every stage reads) |
| `client-feedback` | built (0.1.0) | Turns a client reply into quoted, labelled items, flags conflicts, decodes vague notes, counts revision rounds against the cap, proposes the stage to reopen, and drafts the WhatsApp reply. | none (used after any `client` gate) |

Built in 0.1.0 (Group 1). See each skill's `CHANGELOG.md`.

> This folder is registered in `plugin.json` (`"skills"`) only once it contains at least one real skill. Skill folder names must be unique across all groups.
