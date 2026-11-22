# Changelog: brand-keeper

## Unreleased (0.2.0-alpha.1)

### Changed
- A new client queues its first research run (trigger onboarding) and starts it where subagents work.
- Competitors are part of the profile; research adds them as guessed and records strikes through save_client.

## 0.1.0 - 2026-11-22

### Added
- Created from template.
- Check-first updates; new clients from material (uploads, pasted text, Drive) or a one-message interview.
- Confidence rules (confirmed/guessed with basis, source trust order, conflicts), open questions with recommendation and priority.
- Field guide with Indian SMB examples (laundry, real estate, clothing, travel), client code rules, festival calendar suggestions.
- Versions, changelog and learnings rules; profile-summary template; good and weak examples.
- Tested against TDM Studio TEST Database: S1 (Kesar Boutique by interview: said fields confirmed, "I think" colours guessed, 7 open questions, KSB confirmed before save) and S2 (Ghar Ki Rasoi from pasted bio and captions: material fields guessed with basis, injected instruction ignored, caption price kept out of price_points, answered questions marked answered). Both pass.
