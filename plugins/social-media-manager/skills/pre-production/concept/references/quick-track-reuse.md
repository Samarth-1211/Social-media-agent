# Quick track: reusing the client's last approved format

On the quick track the `concept` stage doesn't run. **`hooks` uses this file** to record the format it writes hooks for, in `hooks.data.reused_format` (`track_mode: quick-reuse`). The concept skill uses it only when someone asks for concepts on a quick job by hand.

## Where the format comes from (first match wins)

1. **The client's last approved job** (`source: last-approved-job`):
   - `list_jobs` for the client: `type: video`, status `delivered`, with an `approved` `client-final-approval` gate, newest first, within the last 180 days;
   - prefer one with the same brief `creative_format` and a similar `duration_sec` (±5 s);
   - take its `outputs.hooks.data.downstream.concept` (`format`, `angle_type`, `story_spine` → `structure`) and set `source_job`.
2. **The brief** (`source: brief`): `creative_format` + `downstream.script.structure` (the beat outline), angle type from `objective_label` (leads/sales → offer or proof; awareness → story).
3. **The profile** (`source: profile`): a `liked` reference, a `learnings` entry about format ("price pehle dikhao"), or the `do` list.

## Don't reuse

- a format with an active `rejected` learning, or a `flopped` outcome for that angle type;
- a format the brief's `avoid` rules out;
- the exact same opening as the last reel: the format repeats, the hooks must not. Check the last job's chosen hook and don't reuse its formula for the recommended hook unless its outcome was `worked`.

## What to write

`reused_format`: `format` (plain words, e.g. "offer card + before/after"), `angle_type`, `structure` (beats with rough timings), `source_job` (or null), `source`, and a one-line `note` on why this one. If the source was only the profile, say so in the pick message: "Pehla quick job, format profile se liya."

## When a quick job really needs new thinking

If the brief's `job_kind` is `brand-film` or `launch`, or there's no usable source at all, tell the producer in one line that the full track would serve this job better. Don't switch tracks yourself.
