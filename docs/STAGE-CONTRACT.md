# Stage contract

How `library/contracts/stages.yaml` and the schemas work together.

## The pieces

- **`stages.yaml`**: the ordered pipeline. Each stage declares:
  - `reads`: contract fields it **requires**
  - `optional_reads`: fields it uses if present
  - `writes`: fields it produces
  - `gate`: who approves it
  - `tracks` and `job_types`: when it runs
- **Contract field**: a snake_case name such as `brief`, `script` or `master`. Its value lives in the job record at `job.outputs.<field>`, as `{ data, files, summary, schema, stage, by, updated_at }`.
- **Schemas**: `library/contracts/<field>.schema.json` defines the shape of `data` for fields that have structure (`brief`, `script`, `storyboard`, `package`). `client` is the client record (`client.schema.json`), and `job.schema.json` is the container for everything.

## The rule

**A stage only reads the fields it declares and only writes the fields it declares.**
- It must not peek at other outputs or quietly change earlier ones.
- To change an earlier output (for example, client feedback on the script), the producer **reopens that stage**. It doesn't patch the output from a later stage.

## How a stage runs

1. The producer picks the next stage whose `tracks` and `job_types` match the job.
2. It checks every `reads` field exists in `job.outputs` (or is `client`). If one is missing, it stops and reports.
3. The stage's skill runs and writes its `writes` fields. Each one with a schema must validate.
4. A stage is done only when every declared `writes` field exists and validates.
5. If `gate` isn't `none`, the producer records a pending gate in `job.gates[]` and waits for the owner (admin, editor or client).
   - Approval stages (`client-*-approval`) write no outputs. Their result is the gate record itself.
6. Once approved, the job moves on.

## Paths and checks

Each `(job_type, track)` pair gives a path through the list:

| Path | Stages |
|---|---|
| video / full | 21 |
| video / quick | 14 (skips hooks, localise, style-bible, casting, production-plan, audio-mix, resolve-export) |
| poster | 7 (same stages on quick and full) |

`scripts/validate.mjs` checks every path:
- each `reads` field is written by an earlier stage on that path, or is `client`;
- no field is written twice on the same path;
- each `optional_reads` field is written somewhere earlier (catches typos).

## Changing the pipeline

1. **Add or move a stage:** edit `stages.yaml` and run the validator. It tells you which paths break.
2. **New contract field with structure:** add `<field>.schema.json` (draft 2020-12).
3. **Changing a schema:** if old job records would fail, it's a breaking change. Bump the plugin minor version and describe the migration in `CHANGELOG.md`.
4. **Status:**
   - `planned`: no skill yet.
   - `placeholder`: a stub skill that lets jobs pass through, with real gates.
   - `active`: the real skill.

   Non-planned stages must point at an existing skill in their group.
