# 0004: Brief text/detail field pairs

- **Status:** accepted for v0.2 (feat/brief). Merging the pairs is **proposed** for the next major version.
- **Date:** 2026-11-22

## Context

`brief.schema.json` v1 already had plain text fields `offer`, `cta` and `audience`. The brief skill needs structured versions: an exact price and validity, an action plus a channel, and who / where / age / language. The contract rule for this branch is **additive only**: we may not rename, retype or remove fields other stages may use. So v2 adds a structured field next to each text field:

| Text field (v1) | Structured field (v2) | Must agree on |
|---|---|---|
| `offer` | `offer_detail` | the same price (`offer_detail.price` shown in `offer`; no price in `offer` when it's null) |
| `cta` | `cta_detail` | `cta` contains `cta_detail.action` and names `cta_detail.channel` |
| `audience` | `audience_detail` | `audience` contains `audience_detail.who` |

Two fields that hold the same fact can drift apart. One stage edits the price in the text, another reads the old price from the detail, and the video ships with the wrong number.

## Decision

1. **The `*_detail` field is the source of truth when it is present.**
2. **The text field is generated from it on save** and never edited on its own. To change the offer, change `offer_detail` and regenerate `offer`.
3. **Validator check 12** confirms each pair agrees: the same price, the same action and channel, the same audience. It also checks that a `differs` price match is flagged in `open_questions`. It runs on the brief example, the job example and the sample data, and the brief skill's self-check applies the same rule before every save.
4. A v1 brief without the detail fields stays valid. The text field is then the only source.

## Consequences

- Later stages may read either field of a pair, but should prefer `*_detail` for facts (price, channel) and the text for wording.
- The duplication costs a little space in the Outputs cell and needs the check above.
- `language` and `writing_script` are not a pair, but check 12 also confirms they don't contradict each other (English ⇔ `english`).

## Proposal for the next major version (1.0 or the next breaking contract change)

Merge each pair into one field:
- `offer`: the object shape of `offer_detail`, plus a generated `display` string;
- `cta`: the object shape of `cta_detail`, plus `display`;
- `audience`: the object shape of `audience_detail`, plus `display`.

**Migration:** for each stored brief, move `*_detail` into the field. Where only the v1 text exists, set `{ display: <text> }` and mark the structured parts `guessed`. This is a breaking change, so per `ARCHITECTURE.md` it bumps the plugin minor version, and the CHANGELOG describes the migration.
