# Evals

How we check that skills produce good work, and that changes don't make them worse. Nothing here ships with the plugin.

| Folder | Holds | Naming |
|---|---|---|
| `briefs/` | Test job requests: a realistic client situation plus what we'd ask for. One file per case. | `<skill-or-stage>_<short-case>.md`, e.g. `brief_diwali-cafe-offer.md` |
| `feedback-samples/` | Realistic client replies (Hindi, English, Hinglish, voice-note transcripts, vague, contradictory) for testing `client-feedback`. | `<short-case>.md` |
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

## Privacy rules

- **Never put real client phone or WhatsApp numbers in evals.** Use obviously fake ones, e.g. `+910000000001`.
- Real client names, prices or messages are allowed only with the client's consent. Otherwise anonymise (e.g. "a café in Jaipur").
- No logins, tokens or Higgsfield account details.
