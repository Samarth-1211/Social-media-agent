# Presets

Reusable editing styles a job can pick (`job.style_preset`), e.g. a fast festival reel or a calm real-estate walkthrough.

- One file per preset: `<name>.yaml` (or `.json`), named the same as its `name` field.
- Every preset must validate against `_preset.schema.json`. `scripts/validate.mjs` checks this.
- Fields: name, description, avg_shot_length_sec, pacing, transitions, caption_style, music_mood, bpm_range, color_grade, hook_formula, end_card.

No presets yet. They come with Group 2.
