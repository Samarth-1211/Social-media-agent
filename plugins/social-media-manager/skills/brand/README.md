# brand/: Group 1

Knows each client.

| Skill | Status | Does | Stages |
|---|---|---|---|
| `brand-keeper` | planned | Client onboarding and the brand profile (`client.schema.json`): confirmed vs guessed fields, open questions, learnings. | none (writes the `client` record that every stage reads) |
| `client-feedback` | planned | Turns a client reply into a change list and routes each change to the stage that must reopen. | none (used after any `client` gate) |

Built in Prompt 2.

> This folder is registered in `plugin.json` (`"skills"`) only once it contains at least one real skill. Skill folder names must be unique across all groups.
