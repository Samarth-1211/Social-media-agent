# Captions file (captions-v<n>.srt)

Plain SRT, UTF-8, built from the localised scene table (`references/captions-srt.md`). Save the file exactly in this shape; the same text goes in `captions_srt.srt`.

```
1
00:00:00,000 --> 00:00:03,200
<line 1, ≤ caption_max_chars_per_line characters>
<line 2, optional>

2
00:00:03,200 --> 00:00:05,600
<line 1>
<line 2, optional>
```

Checklist before saving:
- [ ] Cue numbers 1…n, no gaps; `cues` = n.
- [ ] Every cue inside one scene; no overlaps; each 0.83–7 s.
- [ ] ≤ 2 lines per cue; every line ≤ `caption_max_chars_per_line` (default 32).
- [ ] ≤ 17 characters per second.
- [ ] No marks (`[pause]`, `*`, `/`), no placeholders, no phone numbers.
- [ ] Breaks at phrase boundaries; prices and dates never split from their unit.
- [ ] `font_note` filled for Devanagari jobs.
