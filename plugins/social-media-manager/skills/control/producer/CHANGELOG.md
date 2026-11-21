# Changelog: producer

## 0.1.0 - 2026-11-22

### Added
- Created from template.
- Runs jobs from `stages.yaml`: path by type and track, planned/placeholder/active stages, verify-before-advancing, reopening (changes, back to), closing.
- Intake as the producer's own active stage: request v1, defaults stated with reasons, proposed track logged as a ruling, admin gate.
- Gate rules: who may decide each gate, no proxies, version check on `shown_outputs`, client gates recorded from the client's own words, budget gate (admin only) and warn line.
- Commands (English/Hindi/Hinglish), track selection and switching, gate-message and job-card templates, one good and one bad example.
- Tested against TDM Studio TEST Database: S3 (SHL-04, quick video, 14 stages, 13 gates, delivered), S6 (editor's proxy approval of an admin gate refused), S8 (14 + 18 > 28 opened an admin budget gate; designer refused; admin raised to 32). Fixes from the first S3 run: job-in-focus rule for bare "approve", shorter gate replies, timestamps from `get_now`.
