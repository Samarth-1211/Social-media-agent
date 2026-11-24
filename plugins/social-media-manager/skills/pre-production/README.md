# pre-production/: Group 2

From request to a shootable plan.

| Skill | Status | Does | Stages |
|---|---|---|---|
| `research-methods` | active (0.2.0-alpha.1) | Market insight sheet per client: competitors, ads, reviews, trends, Instagram outliers. Runs inline or through the `market-researcher` subagent. | `research` |
| `brief` | active (0.2.0-alpha.2) | Drafts the brief by itself from the request, profile, research, past jobs and festival calendar; asks only blocking essentials, in plain words (`brief.schema.json`). | `brief` |
| `concept` | active (0.3.0-alpha.1) | Three insight-led, scored short-video concepts from the brief and research, one recommended; full track only, no gate (picked with the hooks). | `concept` |
| `hooks` | active (0.3.0-alpha.1) | Three-layer hooks (visual, spoken, text) in natural Indian language for each concept or the reused quick format, scored and critiqued; runs the editor's combined creative pick (concept + hook). | `hooks` |
| `script` | active (unreleased, `feat/script-localise`) | Two retention-first, timed, fact-checked versions from the picked concept and hook: a storyboard-ready scene table, caption and one CTA; runs the editor's script pick (`script.schema.json`). | `script` |
| `localise` | active (unreleased, `feat/script-localise`) | Natural Hinglish / Hindi / English for the audience: Devanagari conversion, spoken numbers, voiceover script, SRT, caption post, back-translation, the client's WhatsApp review message (`localised_script.schema.json`); also runs the client script approval. | `localise`, `client-script-approval` |
| `style-bible` | planned | Look, palette, references, preset choice for the job. | `style-bible` |
| `casting` | planned | Characters and consistent AI talent. | `casting` |
| `storyboard` | planned | Shot list (`storyboard.schema.json`). Reviewed by the `storyboard-critic` subagent. | `storyboard` |
| `production-plan` | planned | Model choice, shot order, credit estimate per shot. | `production-plan` |

> This folder is registered in `plugin.json` (`"skills"`) only once it contains at least one real skill. Skill folder names must be unique across all groups.

## Brief handoff (for later stages)

Later stages read `job.outputs.brief.data`. Its `downstream` block is the handoff: each stage reads its own part first, and the full brief only when it needs more.

| Stage | Reads `downstream.` | Holds |
|---|---|---|
| `concept` | `concept` | The chosen angle (with research finding id), `creative_format`, constraints |
| `hooks` | `hooks` | Pain points, customer phrases (verbatim), the timely hook, what the first frame must show |
| `script` | `script` | Length, beat outline, the offer line and CTA line in the video's language, must-say items |
| `localise` | `localise` | Language, writing script (`roman-hinglish` / `devanagari` / `english`), words kept as they are |
| shot sourcing (future stage) | `shot_sourcing` | Person on camera or not, locations, must-show items, existing footage |

Rules for readers:
- Prefer `offer_detail`, `cta_detail` and `audience_detail` for facts; the text fields `offer`, `cta` and `audience` are generated from them (`docs/decisions/0004-brief-field-pairs.md`).
- Fields marked `guessed` in `confidence` are working assumptions: name them when they shape a choice.
- If the brief's `version` changes after you ran, the brief's changelog lists your stage in `affected_stages`; the producer reopens you.

## Concept and hooks handoff (for later stages)

`concept` (full track only, no gate) → `hooks` (both video tracks, editor gate **creative-pick**). The editor picks a concept **and** a hook in one reply. After the pick, everything later stages need is in **`job.outputs.hooks.data.downstream`**: read that, not the concept record (`script` reads `hooks`; `concept` is only an optional read).

| Stage | Reads `hooks.data.downstream.` | Holds |
|---|---|---|
| `script` | `concept`, `hook`, `backup_hooks`, `script_notes` | The chosen concept (logline, insight, angle, format, timed story spine, levers with their proof, risks; `mix_note` for a mixed pick), the hook's three layers + 2 backups, do/don't notes (pay off the hook before the halfway mark; real offer, date and CTA as given) |
| `localise` | `hook.layers`, `language`, `writing_script` | Keep the hook's on-screen text ≤ 6 words in every version; customer phrases stay verbatim |
| shot sourcing (future), `storyboard` | `concept.producibility`, `implied_assets` | Shots by source; anything `must_be_real` is filmed, never generated; AI shots of unbuilt things are labelled |
| learning loop (future) | `learning` | `hook_formula_id`, `angle_type`, `outcome` (`untested` until results come in) → becomes a client `learnings` entry |

Rules for readers:
- `pick.status` must be `picked`; `pending` or `redo` means the creative pick isn't done, so stop.
- On the quick track `downstream.concept.id` is null: the concept is the client's reused format (`reused_format`).
- Shared knowledge for all creative stages: `library/knowledge/india-consumer-psychology.md` (levers L01–L20, audience variants, language). Hook formulas use the ids in `hooks/references/formula-catalog.md` (H01–H30).
- If the brief changes after the pick and its changelog lists `concept` or `hooks` in `affected_stages`, the producer reopens them and the creative pick is asked again.

## Script and localise handoff (for later stages)

`script` (both video tracks, editor gate **script-pick**) → `localise` (both video tracks, no gate) → `client-script-approval` (client gate, run by `localise`; decision 0007). After the client approves, later stages read two `downstream` blocks: **`job.outputs.script.data.downstream`** (the picked version, edits applied) and **`job.outputs.localised_script.data.downstream`** (the version the client approved, in the audience's language).

| Stage | Reads | Holds |
|---|---|---|
| `storyboard`, shot sourcing (future) | `script.downstream.scenes`, `.shot_list_seed` | Per scene: times, beat role, storyboard-ready `visual_action` (shot, subject, action, camera, setting, continuity), `asset_hint`, `must_be_real` |
| `storyboard`, `captions-motion` | `localised_script.downstream.on_screen_cards`, `.writing_script`, `.font_note` | The localised cards (≤ 6 words) with in/out times; the font needs for Devanagari |
| `voice-music` | `localised_script.downstream.vo_lines`, `.tts_language_code`, `.pronunciation`; `script.downstream.audio_cues` (`sfx`, `music_cue`) | Clean TTS text per line with timing and speed (`hi-IN` / `en-IN`), confirmed and proposed name readings; sound and music cues per scene |
| `captions-motion` | `localised_script.downstream.srt_file`; the SRT text in `localised_script.data.captions_srt` | Cues timed from the scene table, ≤ 2 lines of `caption_max_chars_per_line` |
| `delivery` (future) | `localised_script.downstream.caption_post_text`; `script.downstream.cta` | The post text with hashtags; the one CTA |
| learning loop (future) | `script.downstream.learning` | `hook_formula_id`, `structure_type`, `angle_type`, `outcome` (`untested` until results come in) |

Rules for readers:
- `script.pick.status` must be `picked`, and the `client-script-approval` gate approved, before any later stage uses these blocks. A `{{needed: …}}` placeholder in a scene means the asset or fact is still missing: stop and say so, never fill it.
- Times are the contract: every later stage keeps each scene's `start_sec`/`end_sec`. A change of length goes back to `script` (or through client feedback).
- `must_be_real: true` scenes are filmed or come from the client, never generated.
- Variants (`localised_script.data.variants[]`, from `config.localise_variant_languages`) carry their own scenes, voiceover and SRT; `downstream.variants_available` lists them.
- Shared knowledge for timing and wording: `library/knowledge/voiceover-pacing.md` (pace, reading time; `config.pace_overrides` after voice-music calibrates) and `library/knowledge/ai-tells.md`.

