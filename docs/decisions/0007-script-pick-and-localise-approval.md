# 0007. Script pick, localise without a gate, and the client script approval

- **Status:** accepted (admin, 2026-11-23), on branch `feat/script-localise`
- **Context:** Group 2a agents 5 + 6 (`script`, `localise`). Builds on 0006 (creative pick and quick track).

## Decision

1. **`script` writes 2 versions** (`config.script_versions`), each with a different structure. The editor picks one at an editor gate labelled **`script-pick`**. The script skill shows its own gate message (`script/templates/script-pick.md`) and reads replies in plain words: "A", "B", "A with scene 3 from B", "scene 4 line: …", "shorter by 5 sec". It applies edits, re-runs the checks on the changed scenes, records the decision, then saves the pick and `downstream` as the next `script` version. That version records the editor's choice and needs no new gate, the same pattern as `creative-pick`.
2. **The script is written in the brief's language,** never written in English and translated. Hindi and Hinglish are written in Roman letters at this stage so the editor can read the pick quickly. `localise` turns the result into the brief's `writing_script`.
3. **`localise` runs on both video tracks with no gate.** Its output is meant for the client, so the next approval is the client's. Group 1 had given it an editor gate on the full track only; this replaces that.
4. **`client-script-approval` is run by `localise`** (group `pre-production`), not by a future `delivery/client-messenger`.
   - Its approval step shows the ready WhatsApp review message (`localised_script.client_review_message`) and tells the assignee how to send it and paste the reply.
   - The producer opens the `client` gate as for any client gate.
   - The client's reply is recorded through `client-feedback`. Approved → move on. Changes → `client-feedback` routes each item to `script` (structure or content) or `localise` (wording or language), and only that stage re-runs.
   - When a delivery-group messenger is built, it may take this stage back with a one-line `stages.yaml` edit.
5. **The contract field stays `localised_script`** (schema `localised_script.schema.json`), because `client-script-approval`, `voice-music` and `captions-motion` already read that name.
6. **Pace and reading-time numbers live in one place:** `library/knowledge/voiceover-pacing.md` §9. Both skills and the validator (check 13) read them from there, and `voice-music` will calibrate them later through `config.pace_overrides`.

## Consequences

- The video quick path grows from 15 to 16 stages, because `localise` now runs on it.
- The producer hard-codes `creative-pick` today (`gate-rules.md` §1.4 and §3). `script-pick` needs a general rule there. That is a protected file, so the proposed diff is in `docs/merge-notes/feat-script-localise.md` and is applied at merge (admin decision, 2026-11-23).
- `client-feedback` routes spoken words to `script` today. Its routing table gets a `localise` row for wording and language. That is also a protected file, also proposed in the merge notes, also applied at merge.
- Until those diffs are applied, `script-pick` replies other than a plain approve fall back to the producer's generic "changes" handling, and wording feedback re-runs `script` (heavier, but safe).
