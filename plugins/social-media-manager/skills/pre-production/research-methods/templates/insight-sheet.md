# Insight sheet (readable view)

The insight is saved as a record (`insight.schema.json`). This template renders it for people: when someone asks "show <client> research", in files mode as `insights/<insight_id>/insight.md`, and as a Drive doc beside the raw files if the team wants one. Only non-struck findings appear under their category; struck ones are listed at the end.

```markdown
# Market insights: {client name} · {insight_id} (v{version})
{created_at as date} · {mode} · trigger: {trigger} · situations: {situations}
{If pending_browser_step.pending: "⏳ Instagram read pending ({methods}), ~{estimate_minutes} min with a browser"}
{If widened: "Widened: {widened}"}

## In short
{summary}

## What changed since last time
{diff_vs_previous.summary, or "First sheet: this is the baseline."}

## For the brief
- **Pain points:** {text} ({confidence}; {source})
- **Working angles:** …
- **Timely hooks:** …

## For concept and hooks
- **Outlier hooks:** {account}: {multiple}x its median · {formula} ({formula_confidence}) · "{hook_text}" / {hook_visual} · {format}, {length_s}s · {structure} · CTA: {cta} · {source}
- **Competitors overdo (avoid):** …

## For the script
- **Proof points:** …

## For localise
- **Customer phrases** (as written): "{text}" ({language}; {source})

## For shot sourcing and style bible
- **Visual clichés to avoid:** …

## Competitor ads
| Advertiser | Running | Versions | Reason to buy | Hook | Offer | Read |
|---|---|---|---|---|---|---|
| {advertiser} | {days_running} days | {versions} | {reason_to_buy} | {hook_type} | {offer} | {status_read} |

## The client's own account
{own_account: median {median_views} over {posts_read} posts ({metrics_source}); top 5 vs bottom 5; {diagnosis} — or "Not available: {why}"}

## How this was made
| Method | Path | Status | Why |
|---|---|---|---|
| {method} | {path}{ ({skill})} | {status} | {reason} |

Competitors read: {handle} ({group}, {followers} followers, median {median_views}) …
Not read: {not_read}
Cost: {cost lines}
Raw files: {raw_files}
{If ran_without_subagent: "Ran without subagent."}

Struck by editors: {id}: {text}
```

Rules: every finding line keeps its confidence and source; no commenter or reviewer names; numbers only as recorded.
