# Research input: what the brief reads from research

The `research` stage runs before the brief (`stages.yaml`: `brief` has `optional_reads: [research]`). Research never blocks the brief:
- **No `research` output on the job** (an older job, or research didn't run) → `"research": { "status": "skipped", "skip_reason": "no research output on this job" }`.
- **Research skipped itself** (an urgent job) → `status: skipped` with `skip_reason` = its `note`. If it attached an older sheet's `downstream`, you may still use it; say how old it is.

The contracts are `research.schema.json` and the `downstream` definition in `insight.schema.json`.

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

## 4. Express mode and the job

- `job.urgent` true (set at intake) means express mode (`interview-rules.md` §4), and research is usually skipped.
- `brief.research.status` must agree with `job.research_status`: `fresh` for fresh / refreshed / new, `partial`, or `skipped`.
