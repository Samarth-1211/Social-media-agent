# Production brief (readable view)

The full brief for later stages and for anyone who says "full brief dikhao". It is rendered from the saved `brief` record; the JSON in storage stays the source of truth. Mark guessed values with *(guess)*. Leave out sections whose fields are all empty, except **Honesty**, which is always shown.

```markdown
# Brief <JOB-ID> v<n> · <title>
Status: <status> · Ready for production: <yes/no> · Client profile v<client_version>

## Goal
- Objective: <objective> (<objective_label>)
- Success: <success_measure>

## Audience
- <audience_detail.who> · <where> · <age_band> · speaks <audience_detail.language>

## Message
- One line: <key_message>
- Proof: <proof_points: text (source: ref)>

## Offer
- <offer_detail.text> · ₹<price> <unit> · till <validity> · conditions: <conditions>
- Profile price check: <profile_match> (<profile_price>)

## Action
- <cta_detail.action> via <channel> · <target>

## Format
- <creative_format> · master <aspect_ratio>, <duration_sec>s
| Platform | Format | Aspect | Length | Changes from master |
|---|---|---|---|---|
| <platform> | <format> | <aspect_ratio> | <duration_sec> | <changes_from_master or "master"> |

## Voice
- <language>, written in <writing_script> · tone: <tone>

## Rules
- Must include: <mandatories>
- Avoid: <avoid>
- References: <references>

## Timing
- Deadline <deadline> · posting <posting_date> · occasion <occasion>

## Research
- <research.status> · insight <insight_id> · angles <angles_chosen ids + text> · pain points <ids> · phrases <ids>
- <skip_reason or no_angle_reason, if any>

## Suggestions (advisory)
- Track: <track_suggestion.track> (<reason>) · style preset: <style_preset>

## Honesty
- Guessed: <confidence entries with status guessed, with basis>
- Assumptions: <assumptions>
- Open questions: <open_questions>
- Client questions: <n. question — guess — status/answer>

## Self-check
<self_check: ✔/✘ check — note>

## Handoff
- Concept: <angle> · <creative_format> · constraints <constraints>
- Hooks: pain points <…> · phrases "<…>" · timely <timely_hook> · first frame <first_frame>
- Script: <duration_sec>s · beats <structure> · offer line "<offer_line>" · CTA line "<cta_line>" · must say <must_say>
- Localise: <language>/<writing_script> · keep as is <keep_as_is>
- Shot sourcing: person on camera <yes/no> · locations <…> · must show <…> · footage <existing_footage>

## Changelog
<version — at — by — change (reason; affected stages)>
```
