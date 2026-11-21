# Changelog: client-feedback

## 0.1.0 - 2026-11-22

### Added
- Created from template.
- Quote ledger, split and label (in_scope, clarification, change_request, not_actionable, duplicate), conflict rules, vague-note decoder with Hindi/Hinglish phrases, revision rounds and cap, routing table by stage.
- Change-list and WhatsApp client-message templates (clarification, confirmation, extra round, change order, multiple voices).
- Examples: simple mixed reply, two voices with a contradiction, over-cap round with a change order.
- Tested: S7 on the 10 samples in `evals/feedback-samples/` (dry run): 8/10 on the first run; after fixing the conflict rule (changing an approved decision is a change_request, not a contradiction) 9/10; after widening sample 07 (a reasonable clarification reading) 10/10. Live test on TDM Studio TEST Database: SHL-02 reply triaged and saved (SHL-02-F1), route confirmed by Pooja, producer sent back to poster-drafts and stopped at the editor gate for v2.
- After saving feedback, asks producer to refresh `next_action` so the board shows who confirms the route (found in S9b).
