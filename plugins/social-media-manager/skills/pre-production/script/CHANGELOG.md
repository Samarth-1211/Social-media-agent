# Changelog: script

## 0.4.0-alpha.1 (2026-11-24)

- First version, on branch `feat/script-localise` (no plugin version bump on the branch).
- Runs the `script` stage (quick and full video tracks, editor gate `script-pick`, decision 0007): two versions with different structures (story-led, demo-led, list-led, problem-solution, before-after, testimonial, pov), both opening with the picked hook (or a named backup), written directly in the brief's language (Hindi and Hinglish in Roman letters).
- Each version: a timed scene table (storyboard-ready visual action, cards of 6 words or fewer with in/out times, voiceover, sound, music, asset source, must-be-real flag, retention device, fact references), a caption whose first line survives the "...more" cut, one CTA, 3–5 hashtags, platform variant notes.
- Checks per version: timing against `library/knowledge/voiceover-pacing.md` (spoken words, pauses, hook by 3 s, pattern change every 1.5–3 s, card hold time), fact guard (real numbers or none; placeholders with an unlock), hook payoff scene, critique pass (three failure modes), humanizer (`library/knowledge/ai-tells.md`), limits (lever misuse lines, hooks trust anti-patterns); self-check SC1–SC10.
- The script pick: natural replies ("A", "B", "A with scene 3 from B", "scene 4 line: …", "shorter by 5 sec", "none, …", "back to hooks"); edits re-checked; the gate decision recorded before the pick is saved as the next `script` version with `downstream` (scene table, shot-list seed, audio cues, caption, CTA, keep-as-is list, learning fields).
- References (upstream input, structures, retention, scene writing, on-screen text, caption and CTA, fact guard, critique pass, platform variants), templates (script version, script pick), checklist, three examples (laundry offer reel, real-estate brand film, bad ad copy annotated).
- Client feedback (step 15): when `client-feedback` routes items to `script`, apply them to the picked version only, re-check the changed scenes, and show the script pick in its client-changes form (before → after with the client's quote).
- From the first live runs (2026-11-24): see `evals/results/2026-11-24_feat-script-localise.md`; fixes listed there.
