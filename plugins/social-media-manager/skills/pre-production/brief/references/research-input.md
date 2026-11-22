# Research input: what the brief expects from research

The research stage is **not on this branch**. Until the merge, every brief writes:

```json
"research": { "status": "skipped", "skip_reason": "research stage not built yet" }
```

This file describes the input the brief will read once the market researcher is merged. It was written against the researcher branch's contract (`research.schema.json` and the `downstream` definition in `insight.schema.json` on `group2a-market-researcher`, read 2026-11-22). **Re-check both at merge**; the merge notes list this as a to-do.

## 1. Where it comes from

`job.outputs.research.data`: a copy of the client's insight sheet's `downstream` block. The brief never opens the insight record itself. Fields:

| Field | Meaning |
|---|---|
| `research_status` | `fresh` (an existing sheet reused), `refreshed` (updated now), `new` (first sheet), `partial` (browser step still queued), `skipped` (urgent job, nothing ran) |
| `insight_id` | e.g. `SHL-I261120-1`; null only when skipped and no sheet exists |
| `insight_version`, `insight_date` | Which sheet version, and how old it is |
| `flags` | `no_fresh_research` (the brief must say research is old or missing), `browser_step_pending`, `widened` |
| `note` | One line meant for the brief |
| `downstream` | The handoff lists below |

Each `downstream` item is `{ id: "F12", text, confidence: strong | some | weak, language?, formula?, multiple? }`. Items come pinned first, then strong → some → weak. Struck findings are already removed.

## 2. Mapping into the brief

| Research | Brief field | Rule |
|---|---|---|
| `research_status` `fresh`, `refreshed`, `new` | `research.status: fresh` | |
| `research_status` `partial` | `research.status: partial` | Use what's there; don't wait for the browser step |
| `research_status` `skipped` | `research.status: skipped`, `skip_reason` = `note` | If a downstream copy of an older sheet is attached, it may still be used; say how old it is |
| `insight_id` | `research.insight_id` | |
| `downstream.brief.working_angles[]` | `research.angles_chosen[]` (keep `id`) → `downstream.concept.angle` | Pick 1, at most 2. Prefer pinned, then strong. |
| `downstream.brief.pain_points[]` | `research.pain_points_used[]` → `downstream.hooks.pain_points` | 1–3 that fit this job's offer |
| `downstream.brief.timely_hooks[]` | `downstream.hooks.timely_hook` | Only if it fits the posting date |
| `downstream.localise.customer_phrases[]` | `research.customer_phrases_used[]` → `downstream.hooks.customer_phrases` | **Verbatim**, never reworded |
| `downstream.script.proof_points[]` | `proof_points[]` with `source: research`, `ref: <id>` | Only market facts. Never a claim about this client's own results. |
| `downstream.concept_and_hooks.*`, `downstream.visuals.visual_cliches` | Not copied. The concept and hooks stages read research themselves. | Optionally one line in `downstream.concept.constraints` ("avoid: <cliché>") |
| `flags` contains `no_fresh_research` | One line in `assumptions`: "Research is <n> days old / missing." | |

## 3. Using research honestly

- **Cite the id** of every angle, pain point or phrase you use (`F3`), so `research-methods` can record `used_in_jobs` and outcomes later.
- **Weak findings** may inspire an angle but never become a proof point or a claim.
- **If research exists but no angle fits** (e.g. it's all about saree care and this job is blankets), set `research.no_angle_reason`: "Research angles are about wedding dry-clean; this job is a winter blanket offer." The self-check needs either an angle or this reason.
- Research is never a reason to ask a question. If it's thin, use the profile.

## 4. To check at merge

1. `research.status` here has 3 values; research has 5. Keep the mapping in §2, or widen the brief enum (additive) to carry `refreshed` and `new`.
2. The brief's `research` block and `job.research_status` (added by the researcher to the job) must agree.
3. Add `optional_reads: [research]` to the `brief` stage. The researcher branch already has it; take that line when merging.
4. Express mode reads `job.urgent` once it exists; here it uses the request's words and the deadline.
