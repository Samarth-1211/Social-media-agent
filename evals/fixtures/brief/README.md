# Brief fixtures

Fictional data for the brief scenarios B1–B15 (`../../scenarios/brief.md`, rubric `../../rubrics/brief.md`). There are no real clients, and the phone numbers are fake.

**Eval clock: 2026-12-08 (India time).** The dates in jobs, replies and expectations assume this "today". In files mode, tell the session the date. On the TEST sheet, the `get_now` clock gives the real date: shift expectations by the difference, or run on 8 Dec.

| File | Holds | Used by |
|---|---|---|
| `clients.json` | Shubh Laundry (SHL, from `client.example.json`) and Narmada Heights (NRH): a starting price, **no RERA number on file** | all |
| `jobs.json` | 17 scenario jobs at the brief stage (intake approved), each with its approved request, optional research and config overrides | B1–B14 |
| `past-jobs.json` | SHL-01 (delivered 24 Nov, client-approved, 20 s Instagram offer-card) and SHL-05 (delivered 20 Aug, 15 s WhatsApp status: outside 90 days) | B3, B12 |
| `research.json` | `shl-fresh`: a research output in the researcher branch's shape (finding ids F2–F20) | B9 |
| `replies.json` | 8 client replies (Hinglish, Devanagari Hindi, English, a voice note, partial, bare value, an embedded instruction, ordinary feedback), each with the expected reading | B5 |
| `bad-brief.json` | A schema-valid but vague brief | B10 |

## Tools

```bash
node evals/brief-fixtures.mjs check                          # every fixture validates against the contracts
node evals/brief-fixtures.mjs seed <dir> [--job SHL-19]      # files-mode data folder; --job applies that job's config
node evals/brief-fixtures.mjs sheet-rows <out.json> [--job]  # rows to load TDM Studio TEST Database (layout v3)
```

`seed` writes the `.tdm-studio` layout from `library/storage/files-backup.md`: config, team, clients, and jobs with `log-full.json`. Use a fresh folder per scenario, so one run's saves don't leak into the next.
