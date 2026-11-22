# Concept + hooks fixtures

Fictional data for scenarios C1–F1 (`../../scenarios/concept-hooks.md`, rubric `../../rubrics/concept-hooks.md`). No real clients; phone numbers are fake.

**Eval clock: 2026-12-10 10:00 (India time).** In files mode, tell the session the date and time.

| File | Holds | Used by |
|---|---|---|
| `clients.json` | Shubh Laundry and Narmada Heights from `../brief/clients.json`, with overrides: SHL learnings **H02 rejected**, **H30 worked**, **H21 flopped**; plus new **Saanjh Ethnic Wear** (SJE, Bhopal boutique, never says "slim") | all |
| `briefs.json` | Six approved briefs (base + per-job fields): SHL-26 razai offer (full, research fresh), SHL-27 wash + iron (quick), SHL-03 saree trust reel, NRH-14 Hindi brand film, SJE-01 Bhai Dooj sister sets, **SJE-03 the planted bad brief** (fake urgency, invented numbers, body-shaming) | C1–H6, F1 |
| `research.json` | `shl-winter-fresh` (fresh: outlier hooks IG3/IG6, competitors overdo, customer phrases) and `nrh-partial` (browser step pending, no outliers) | C1–C3, H1–H4 |
| `jobs.json` | Seven scenario jobs (at `concept`, at `hooks`, or with the creative pick pending for 26 h) and one delivered past job (SHL-15, built from `job.example.json`) | all |
| `picks.json` | Nine scripted replies at SHL-03's creative pick, each with the expected result | G1 |

SHL-03's concept and hooks outputs are the contract examples (`library/contracts/examples/concept.example.json`, `hooks.example.json`).

## Tools

```bash
node evals/concept-hooks-fixtures.mjs check                                # every fixture validates against the contracts
node evals/concept-hooks-fixtures.mjs seed <dir> [--job SHL-03 --variant G2-on]   # files-mode data folder; --variant applies config overrides
```
