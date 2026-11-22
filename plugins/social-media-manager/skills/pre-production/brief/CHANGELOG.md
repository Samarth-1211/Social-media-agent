# Changelog: brief

## Unreleased (feat/brief)

The version number is set at merge, with the market researcher.

### Added
- `SKILL.md`: auto-drafts the brief from the job, profile, research, past jobs, festival calendar and defaults; asks only blocking essentials (team, client or express mode, at most `brief_max_questions`); parses the client's reply to brief questions only while the brief is `awaiting-client`; self-check; admin gate with optional auto-approve (`brief_auto_approve_repeat`, off by default); changes later bump the version and list affected stages.
- References:
  - `field-guide`, `essentials`, `inference-rules`, `interview-rules`;
  - `layman-glossary` (53 phrase mappings);
  - `objective-to-format`, `platform-variants`, `proof-and-claims`;
  - `research-input` (expected research handoff; research is `skipped` until the merge).
- Templates: plain card, production brief, one team question (with `AskUserQuestion`), client WhatsApp questions (Hinglish, Hindi, English).
- Checklist: `ready-for-production` (10 self-check ids).
- Examples: laundry offer reel (0 questions), real-estate brand film (1 team question, 2 variants), interview transcript (team → client → messy reply → express), annotated bad brief.
- Sources and attribution: `docs/research/brief-sources.md`.
