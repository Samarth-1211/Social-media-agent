# Stage contract

How `library/contracts/stages.yaml` and the schemas work together.

## The pieces

- **`stages.yaml`** is the ordered pipeline. Each stage declares:
  - `reads`: the fields it **requires**;
  - `optional_reads`: fields it uses if they exist;
  - `writes`: the fields it produces;
  - `gate`: who approves it;
  - `credit_spend`: whether it spends generation credits;
  - `tracks` and `job_types`: when it runs;
  - optional keys, only where a stage needs them (see "Optional stage keys").
- **A contract field** is a snake_case name such as `request`, `brief`, `script` or `master`. Its value lives in the job record at `job.outputs.<field>` as `{ version, data, files, summary, schema, stage, by, updated_at }`. `version` goes up each time the stage rewrites the output.
- **Schemas.** `library/contracts/<field>.schema.json` defines the shape of `data` for fields that have structure: `request`, `research`, `brief`, `script`, `storyboard` and `package`.
  - `client` is the client record (`client.schema.json`).
  - `job.schema.json` is the container for everything.
  - `team.schema.json` and `config.schema.json` hold the agency's own settings.
  - `insight.schema.json` is a client's market insight sheet and `task.schema.json` a pending task (for example a queued browser step). They are records of their own, not job outputs; `research` points at an insight and carries a copy of its handoff block.
  - One contract may `$ref` another by its `$id` (`research` uses the insight's `downstream` definition); the validator registers every schema before compiling.
- **Examples.** `library/contracts/examples/<name>.example.json` is a valid, fictional record for each schema. The validator checks every example, including each non-placeholder output inside the job example.
- **Storage.** The schemas describe *logical* records. The storage layer (`library/storage/`) maps them onto Google Sheets rows. See `STORAGE.md`.

## Stage status

| Status | What the producer does | Skill folder needed? |
|---|---|---|
| `planned` | Skips the stage and says so in one line | No |
| `placeholder` | Runs the stage itself and writes `{ "placeholder": true, "note": "<stage> not built yet" }` into each `writes` field. **The gate still runs for real.** | No |
| `active` | Runs `skill` | **Yes**, in `group`. The validator enforces it. |

A later group makes a stage real by adding its skill and changing `placeholder` to `active`. Neither `producer` nor `tracker` needs editing.

## Gates

| `gate` | Who may approve |
|---|---|
| `admin` | The admin only |
| `editor` | The editor or designer **assigned** to the job, or the admin |
| `client` | The client. The assignee or admin records the decision from the client's reply, via `client-feedback`. |
| `none` | Nobody; the stage moves on automatically |

Rules:
- **Approval covers only what was shown.** The gate records the output versions shown (`shown_outputs`). If an output changes after approval, the gate is requested again.
- **No skipping ahead.** A stage never starts while an earlier gate is pending.
- **No approving on someone's behalf.** If the wrong person tries to approve, refuse politely and name who must approve. This is behavioural, not a security control; see `STORAGE.md`.
- **The client script approval** (`client-script-approval`) is run by `localise`: its approval step shows the client review message; the client's reply is recorded through `client-feedback` (decision 0007).
- **Over budget.** Before a `credit_spend: true` stage, the producer compares the estimate plus credits already used with the job budget. Above budget, it opens a `budget` gate that only the admin can approve. The credit policy (`config.credit_policy`, `decisions/0003-credit-policy.md`) applies on top.
- **Labelled gates.** A gate with a `gate_label` is run by the stage's skill: it shows its own message (`templates/<gate_label>.md`) and reads the reply in plain words. Today: `hooks` → `creative-pick`, where the editor picks a concept **and** a hook in one reply (`decisions/0006-creative-pick-and-quick-track.md`), and `script` → `script-pick`, where the editor picks one of two script versions, with edits (`decisions/0007-script-pick-and-localise-approval.md`). The stage's skill shows its own gate message and reads the reply; `shown_outputs` names every output shown (`hooks`, plus `concept` on the full track). The skill records the decision first, then saves the pick as the next `hooks` version, which needs no new gate.
- **Real money.** A stage with `spend_gate: admin` asks the admin **before** spending money (USD or INR, not credits), with a `spend` gate, unless the estimate is at or below `config.research_auto_approve_limit` (default 0, so always ask). Free work never opens it. Money spent is listed in the credit ledger with its `provider` and `currency`, but only `credits` rows count against the job budget.

## Optional stage keys

| Key | Value | What the producer does |
|---|---|---|
| `freshness_days` | days (≥ 1) | Reuse the stage's earlier work if it is younger than this (`config.freshness_days` overrides). For `research`: an insight sheet under 30 days old with no pending browser step is reused (`fresh`). |
| `skippable_if_urgent` | true / false | On a job with `urgent: true`, skip the stage: write its output with a "skipped" status and a flag for later stages, add a `skipped` history row, and move on. |
| `non_blocking_partial` | true / false | If the work is only partly done (for `research`: the unattended part is fresh but the Instagram browser step is queued), write the output as `partial` and move on. Offer to finish the rest; never wait for it. |
| `spend_gate` | `admin` / `none` | Who approves before the stage spends real money (above). |
| `gate_label` | kebab-case name | Only with a gate other than `none`: the stage's skill runs the gate with its own message and reads the reply (above). Today: `hooks` → `creative-pick`, `script` → `script-pick`. |

The validator rejects unknown keys and wrong value types, so a typo can't silently switch a behaviour off.

## The rule

**A stage reads only the fields it declares and writes only the fields it declares.**
- It must not peek at other outputs or quietly change earlier ones.
- To change an earlier output (for example, client feedback on the script), the producer **reopens that stage**. It does not patch the output from a later stage.

## How a stage runs

1. The producer picks the next stage whose `tracks` and `job_types` match the job.
2. It checks that every `reads` field exists in `job.outputs` (or is `client`). If one is missing, it stops and reports.
3. The stage runs (as a placeholder, or through its skill) and writes its `writes` fields. Each one with a schema must validate; placeholder data is exempt.
4. **Verify before advancing.** Re-read the saved record from storage, not from memory, and confirm every declared `writes` field is there.
5. If `gate` isn't `none`, record a pending gate, set `job.waiting_on` and `job.next_action`, and stop.
   - Approval stages (`client-*-approval`) write no outputs. Their result is the gate record itself.
6. Once approved, the job moves on.

## Paths and checks

Each `(job_type, track)` pair gives a path through the list:

| Path | Stages |
|---|---|
| video / full | 22 |
| video / quick | 16 (skips concept, style-bible, casting, production-plan, audio-mix, resolve-export) |
| poster | 7 (same stages on quick and full; no concept stage) |

`scripts/validate.mjs` checks every path:
- each `reads` field is written by an earlier stage on that path, or is `client`;
- no field is written twice on the same path;
- each `optional_reads` field is written somewhere earlier;
- `credit_spend` is `true` or `false` on every stage.

## Changing the pipeline

1. **Add or move a stage:** edit `stages.yaml` and run the validator. It tells you which paths break.
2. **New contract field with structure:** add `<field>.schema.json` (draft 2020-12) and an example in `examples/`.
3. **Changing a schema:** if existing records would fail, it's a breaking change. Bump the plugin minor version and describe the migration in `CHANGELOG.md`.

## Schema versions

A schema may carry `"x-version": <n>`, an annotation registered in the validator. An additive change (new optional fields, a widened enum) bumps it, and old records stay valid. A breaking change still follows "Changing a schema" above. A schema without `x-version` is version 1.
