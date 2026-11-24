# Script + localise fixtures

Fictional data for scenarios S1–S6, L1–L7, A1, E2E and R1 (`../../scenarios/script-localise.md`, rubric `../../rubrics/script-localise.md`). No real clients; phone numbers are fake.

**Eval clock: 2026-12-12 10:00 (India time).** In files mode, tell the session the date and time.

Built on the concept-hooks fixtures: clients, briefs and research come from `../concept-hooks/`, and the contract examples supply the SHL-01 records.

| File | Holds | Used by |
|---|---|---|
| `clients.json` | Overrides on the concept-hooks clients: Shubh Laundry gets a confirmed `pronunciation` entry; next job numbers move up | all |
| `picks.json` | Creative picks (`hooks.downstream`): `shl-razai` (2B, long spoken line), `shl-razai-planted` (10,000+ / ₹199 / No.1 planted), `sje-flat-middle` (three identical middle beats), `sje-festive`, `nrh-film` (Hindi, phone number in the script notes) | S1–S5, L* |
| `scripts.json` | Picked scripts as compact scene rows: `shl-planted-lines` (three stiff lines), `nrh-film` (45 s Roman Hindi), `sje-festive` (25 s Hinglish) | L1–L7, E2E |
| `jobs.json` | Nine scenario jobs at `script`, `script-gate`, `localise` or `client-gate` (see its `$comment`). NRH-15 overrides the NRH-14 brief to 45 s with the sales number and RERA line; SJE-05 turns on the English variant. | all |
| `replies.json` | Script-pick replies R1–R7 and client replies A1-ok / A1-changes / A1-offer, each with the expected result | S6, A1 |

SHL-32, SHL-34 and SHL-35 use the contract examples (`library/contracts/examples/script.example.json`, `localised_script.example.json`), renamed. SHL-34's localised script has two planted meaning changes, applied by the builder (`localisedRecord`, "example-planted-drift").

## Tools

```bash
node evals/script-localise-fixtures.mjs check            # every fixture validates (contracts + check 13)
node evals/script-localise-fixtures.mjs seed <dir> [--job SJE-05]   # files-mode data folder; --job applies its config
node evals/script-localise/check-faults.mjs              # planted-fault test for check 13 (offline)
node evals/script-localise/run-scenarios.mjs R1          # regression, offline
node evals/script-localise/run-scenarios.mjs             # all live runs (Claude usage!) — only on "run"
```
