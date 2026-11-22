# 0006: One creative pick; concept on the full track only

- **Status:** accepted (2026-11-22, admin), branch `feat/concept-hooks`
- **Context:** Prompt 5 builds `concept` and `hooks`. The concept stage generates 3 insight-led concepts, which costs time and tokens; quick-track jobs are repeat formats that don't need new concepts. Before this, `concept` ran on both tracks with its own admin gate, `hooks` ran on the full track with no gate, and `script` required `concept`.

## Decision

1. **`concept` runs on the full track, video only, with no gate.** Its output goes straight to `hooks`.
2. **`hooks` runs on both video tracks with an editor gate labelled `creative-pick`.** The editor picks a concept and a hook in one reply ("2B", "concept 1 with hook C", "mix 1 and 3", "more like 2A"). On the quick track, hooks writes for the client's last approved format (`track_mode: quick-reuse`).
3. **`script` reads `hooks` (required) and `concept` (optional).** The hooks output's `downstream` block carries the chosen concept, so the script never needs the concept record. (Option 1A.)
4. **Posters don't use `concept`.** `poster-drafts` keeps `concept` only as an optional read; a poster group may add its own concept step later. (Option 2a.)
5. **New stage key `gate_label`**, valid only with a gate other than `none`; the validator checks it.
6. **Optional auto-pick:** `config.creative_auto_pick_after_hours` (default null = off). When set, the recommended pair is picked after that many hours with no reply and logged with `decided_by_role: system`.

## Alternatives considered

- **1B:** keep `concept` on both tracks and write a tiny "reuse" record on the quick track. Rejected: an extra stage that does nothing on most jobs, and the quick track would still show a concept step.
- **2b:** a separate `poster-concept` placeholder stage. Rejected for now: poster concepts belong to the poster group's design.
- **Two gates** (concept, then hooks). Rejected: two waits for the editor for one creative decision.

## Consequences

- Path lengths: video/quick gains hooks and loses concept (same count), video/full unchanged, poster one stage shorter. `docs/STAGE-CONTRACT.md` needs updating at merge (merge notes).
- The producer and tracker need small additions for the creative-pick reply and auto-pick (merge-notes proposals; they are outside this branch's paths).
- Existing sample jobs that ran `concept` on the quick track or for a poster keep their history; it predates this change.
