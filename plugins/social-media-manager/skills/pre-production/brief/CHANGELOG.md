# Changelog: brief

## 0.2.0-alpha.2 (2026-11-22)

Merged with the market researcher: the brief reads the `research` output (`references/research-input.md`) and `job.urgent`.

### Added
- `SKILL.md`: auto-drafts the brief from the job, profile, research, past jobs, festival calendar and defaults; asks only blocking essentials (team, client or express mode, at most `brief_max_questions`); parses the client's reply to brief questions only while the brief is `awaiting-client`; self-check; admin gate with optional auto-approve (`brief_auto_approve_repeat`, off by default); changes later bump the version and list affected stages.
- References:
  - `field-guide`, `essentials`, `inference-rules`, `interview-rules`;
  - `layman-glossary` (53 phrase mappings);
  - `objective-to-format`, `platform-variants`, `proof-and-claims`;
  - `research-input` (how the research handoff maps into the brief).
- Templates: plain card, production brief, one team question (with `AskUserQuestion`), client WhatsApp questions (Hinglish, Hindi, English).
- Checklist: `ready-for-production` (10 self-check ids).
- Examples: laundry offer reel (0 questions), real-estate brand film (1 team question, 2 variants), interview transcript (team → client → messy reply → express), annotated bad brief.
- Sources and attribution: `docs/research/brief-sources.md`.
