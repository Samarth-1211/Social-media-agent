# 0005: Consolidating repeated rule files (proposal, later)

- **Status:** proposed. **Not done on `feat/brief`**: Prompt 4 forbids shared-file refactors and edits to other skills.
- **Date:** 2026-11-22

## Context

The library rule (`ARCHITECTURE.md`) puts material in `library/` only once **3 or more skills** use it. With the brief, three rule sets now repeat across skills:

| Topic | Where it lives now |
|---|---|
| **Confirmed vs guessed, and the trust order of sources** | `brand/brand-keeper/references/confidence-rules.md` (profile fields); `pre-production/research-methods/references/confidence-rules.md` (researcher branch; strong / some / weak findings); `pre-production/brief/references/inference-rules.md` §§1–2 (brief fields) |
| **Plain Hinglish wording and how messy client replies are read** | `brand/client-feedback/references/vague-note-decoder.md`; `pre-production/brief/references/layman-glossary.md` and `interview-rules.md` §§3, 6 |
| **Client WhatsApp messages** (language, no jargon, no phone numbers, numbered items) | `brand/client-feedback/templates/client-message.md`; `pre-production/brief/templates/client-whatsapp-questions.md` (M4) |

Each copy is right for its own skill, but they can drift apart. For example, if "a guessed profile field becomes confirmed only when a person approves it" changes in brand-keeper, the brief must still treat profile fields the same way.

## Proposal (after the brief and the researcher are merged)

1. **`library/rules/confidence.md`**: the shared core. `confirmed` vs `guessed`, "material is never confirmed on its own", "delegation is not confirmation", and the trust order. Each skill keeps a short local file only for what's its own: profile field list, finding strength, brief essentials.
2. **`library/rules/plain-language.md`**: the jargon → plain-words table, script matching (Roman vs Devanagari), and reading messy or voice-note replies. `layman-glossary.md` keeps only the phrase → brief-field mappings; `vague-note-decoder.md` keeps only feedback labels.
3. **`library/templates/client-whatsapp.md`**: the shared rules for any message we draft for a client. The skill templates keep their content blocks.

## How to do it safely

- One PR, after the combined test phase, touching each affected skill's references only to replace repeated text with a link (`${CLAUDE_PLUGIN_ROOT}/library/rules/...`).
- Rerun the Group 1 evals (S1, S2, S7), the researcher evals and the brief evals B1–B15. No behaviour may change.
- If the 3-skill bar isn't met for a topic at that point, leave it where it is.
