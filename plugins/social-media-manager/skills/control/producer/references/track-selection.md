# Choosing a track

Every job runs on one of two tracks. The producer **proposes** one at intake with a one-line reason; the admin chooses at the intake gate.

| Track | Video stages | For |
|---|---|---|
| **quick** | 15: skips hooks, localise, style-bible, casting, production-plan, audio-mix and resolve-export | Repeat work in a style and cast that already exist |
| **full** | 22 | Anything new or high-stakes |

Posters run the same 8 stages on both tracks today; the track is still recorded, because later groups may split them.

## 1. Signals

Look before you ask: read `list_jobs` for the client and the brand brief first.

| Points to **full** | Points to **quick** |
|---|---|
| New client: no `delivered` jobs yet | The client has delivered jobs of this type |
| Brand film, launch, opening, rebrand | A simple offer, festival greeting or reminder |
| A format we haven't made for this client (first reel, first ad film) | A repeat format: "same as last Diwali reel" |
| Needs a new look or new characters (style-bible, casting) | An existing style preset and cast |
| More than one language version (localise runs only on full) | One language |
| Longer than ~30 s, or a multi-scene story | Short, one message |
| A professional voice-over mix or a Resolve handover | Music bed and simple voice-over |

**How to decide:**
- Any one strong full signal (new client, launch or brand film, multi-language, new cast) → **full**.
- Otherwise, mostly quick signals → **quick**.
- A real tie → **full** (it's cheaper to skip stages later than to discover a missing style bible after clips are generated), and say so.

## 2. The reason line

One line, in plain words, naming the signal:
- "Quick: repeat Diwali offer reel in their existing style, one language."
- "Full: first video for a new client, so we need a style bible and cast."
- "Full: Hindi and English versions, and localise only runs on the full track."

Log it as a `ruling`: "Proposed <track> track: <reason>. Cost if wrong: <what switching later adds>."
- Cost if quick is wrong: "switching to full later adds hooks, localise, style-bible, casting and production-plan before storyboard; storyboard and later stages rerun."
- Cost if full is wrong: "about 7 extra stages and gates of time; no credits."

## 3. Switching track mid-job

Admin only ("switch SHL-01 to full track"). Read the job fresh, then:

**quick → full**
1. List the full-only stages that come **before** the current stage and never ran (for example, hooks, localise, style-bible and casting when the job is at storyboard).
2. Ask the admin to choose:
   - **Go back:** reopen the earliest missing stage (`sent_back` from the current stage). Everything after it reruns, and later gates are asked again.
   - **Skip for this job:** add `stage_history` rows with status `skipped` and the note "skipped on track switch by <admin>". Later full-only stages still run.
3. Update `track`, and log a `ruling` with the choice.

**full → quick**
- Full-only stages not yet run will be skipped. Outputs already made stay (quick stages may still use them as `optional_reads`).
- Update `track` and log a `ruling`.

**Rules for both directions**
- Never switch while a gate is pending without saying so. The pending gate stays open; the switch affects what comes after it.
- Poster jobs: the switch changes only the label (same stages); say so.
