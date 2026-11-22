# Evals

How we check that skills produce good work, and that changes don't make them worse. Nothing here ships with the plugin.

| Folder | Holds | Naming |
|---|---|---|
| `briefs/` | Test job requests: a realistic client situation plus what we'd ask for. One file per case. | `<skill-or-stage>_<short-case>.md`, e.g. `brief_diwali-cafe-offer.md` |
| `feedback-samples/` | Realistic client replies (Hindi, English, Hinglish, voice-note transcripts, vague, contradictory) for testing `client-feedback`. | `<short-case>.md` |
| `fixtures/research/` | Saved "tool results" and scenario data builders for the market researcher (fixture mode). | `make-captures.mjs`, `make-data.mjs`, `FIXTURE-MODE.md` |
| `research/` | Market-researcher eval scripts: scenario runner, validator fault injection, method consistency, tracker page render. | `run-scenarios.mjs` etc. |
| `rubrics/` | What "good" means for a skill's output. Scored criteria, each with a pass/fail example. | `<skill>.md` |
| `results/` | One file per eval run. | `YYYY-MM-DD_vX.Y.Z.md` (plugin version tested), e.g. `2026-12-02_v0.1.0.md` |

## Running an eval

1. Load the plugin version under test: `claude --plugin-dir plugins/social-media-manager`.
2. Run each relevant brief or feedback sample through the skill.
3. Score each output against the skill's rubric.
4. Write `results/YYYY-MM-DD_vX.Y.Z.md`. Include:
   - the plugin version;
   - who ran it;
   - the cases run;
   - the score per rubric item;
   - failures with a short quote;
   - comparison with the previous results file.

Use `results/*.local.md` for scratch runs. They are git-ignored.

**client-feedback (S7):** `node evals/run-feedback-samples.mjs run` then `node evals/run-feedback-samples.mjs score`. Samples and expectations live in `feedback-samples/samples.json`; `render` rewrites the readable `.md` files. Raw outputs go to `results/feedback-runs.local/` (git-ignored).

## Privacy rules

- **Never put real client phone or WhatsApp numbers in evals.** Use obviously fake ones, e.g. `+910000000001`.
- Real client names, prices or messages are allowed only with the client's consent. Otherwise anonymise (e.g. "a café in Jaipur").
- No logins, tokens or Higgsfield account details.

**market researcher (R1–R16):** `node evals/research/run-scenarios.mjs` runs 8 headless Sonnet sessions on fixtures (live tools switched off) and checks the saved data; `--check-only` re-checks saved outputs. Static checks: `node evals/research/validator-faults.cjs`, `node evals/research/methods-consistency.cjs`, and `node evals/research/tracker-page-render.cjs` (needs `npm i --no-save jsdom`). Details: `scenarios/market-researcher.md`.
**brief (B1–B15):** fixtures in `fixtures/brief/` (`node evals/brief-fixtures.mjs check | seed | sheet-rows`), scenarios `scenarios/brief.md`, rubric `rubrics/brief.md`. Scenario steps in `scenarios/brief.md` (files mode via `seed`; B14 on the TEST sheet).
**concept + hooks (C1–F1):** fixtures in `fixtures/concept-hooks/` (`node evals/concept-hooks-fixtures.mjs check | seed`), scenarios `scenarios/concept-hooks.md`, rubric `rubrics/concept-hooks.md`. Files mode via `seed`; written, run after the merge.
