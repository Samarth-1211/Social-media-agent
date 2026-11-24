# Voiceover script (vo-script-v<n>.md)

For the voice artist or the voice-music stage. One block per line; `text` carries the marks, `tts_text` is what a voice engine gets (`references/vo-prep.md`).

```
# <job_id> · Voiceover · <language> (<writing_script>) · <duration_sec> s · TTS language <hi-IN | en-IN>

Marks: [pause 0.3s] = beat · *word* = emphasis · / = breath
Names: <term = say_as (Devanagari), one per line, from client.pronunciation + proposals>

1 · 0.0–3.2 · normal
  <text with marks>
  TTS: <tts_text>

2 · 3.2–5.6 · normal
  <text>
  TTS: <tts_text>
  Hint: <pronunciation hint, if any>

…

Total spoken words: <n> · pace <x.x> words/s (default <y> for <language>)
```

Rules:
- One block per scene with a voiceover; silent scenes are listed as "<n> · <times> · (silence: <sfx/music>)" so the artist knows the gap.
- `tts_text`: numbers spelled out, no marks, names in the spelling the voice needs.
- A line with `{{needed: …}}` is marked "NOT READY: needs <what>" and isn't recorded.
