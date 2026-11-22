# What concept takes from research

Research is `job.outputs.research.data` (`library/contracts/research.schema.json`). Its `downstream` block is a copy of the client's insight sheet handoff (`insight.schema.json` → `$defs/downstream`). Each item is `{ id, text, confidence: strong | some | weak, language?, formula?, multiple? }`. The brief copies only its own part; **concept reads research itself.**

## Status first

| `research_status` / `flags` | What it means here |
|---|---|
| `fresh`, `refreshed`, `new` | Use it fully. |
| `partial` (`browser_step_pending`) | Use what exists; Instagram outliers may be missing. Say so. |
| `skipped` with an `insight_id` | An older sheet: use it, weigh `insight_date` (older than 60 days → treat `weak`). |
| `skipped`, no sheet, or flag `no_fresh_research` | `fallback_used.research: true`. Concepts rest on the brief and profile; clichés from psychology §4 are assumptions. |
| flag `widened` | Findings are about the wider category or city, not this niche: lower confidence one step. |

## Fields

| Research `downstream.` | Used for | Rule |
|---|---|---|
| `concept_and_hooks.working_angles[]` | Raw angles (step 5) | Strong first. Keep the id in the angle `note` and the concept `insight.source.ref`. |
| `concept_and_hooks.competitors_overdo[]` | Removal filter (step 6), distinctiveness score | An angle matching one is removed (`competitors_overdo`), unless the concept visibly flips it. |
| `concept_and_hooks.outlier_hooks[]` | Not used here; hooks reads them. A concept can note which formula would suit it. | |
| `brief.pain_points[]` | Core insight, tensions | Cite the id as the insight source. |
| `brief.timely_hooks[]` | Festival or season angles | Only if the job's dates match. |
| `script.proof_points[]` | Lever proof | Same weight as brief `proof_points`; cite the id. |
| `localise.customer_phrases[]` | Insight wording, a story beat | Verbatim; never polish them into textbook Hindi. |
| `visuals.visual_cliches[]` | Removal filter, story spine | Don't open on one. |
| `research.note` | One line in the reply when it matters | e.g. "research 54 days old". |

## Confidence

- A concept's core insight should rest on a `strong` or `some` finding. Resting on `weak` alone → say so in `risks` and keep its score for insight strength at 3 or below.
- Never upgrade a finding's confidence in our own text, and never quote a research number as more certain than the sheet says.

## Fallback when research is missing

`fallback_used.research: true`; one line in the reply ("No research yet: angles from the brief and profile"). Insight sources become `brief` or `profile`; competitor clichés are written as `assumptions`. Don't run research yourself; that's the research stage's job.
