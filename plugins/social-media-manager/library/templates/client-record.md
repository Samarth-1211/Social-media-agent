# Client record (readable view)

Used for `client.md` in files mode and the client profile on the tracker page. Fill it from the client record. Mark every field with its confidence: ✓ confirmed, ? guessed (with its basis).

```markdown
# {name} ({client_code}) · {status}
{business_type} · {city} · profile v{version}, updated {updated_at}
Contact: {contact_person} · Decides: {decision_maker.name} ({role})

## Languages and channels
Languages: {languages} {✓/?} · Platforms: {platforms} {✓/?} · Posting: {posting_frequency}

## Audience {✓/?: basis}
{audience.summary} · {age_range} · {locations}
Their words: "{customer_words}"

## Voice {✓/?: basis}
{tone_of_voice.summary}
| We are | Means | Doesn't mean | Example |
|---|---|---|---|
| {name} | {means} | {doesnt_mean} | {example} |
By platform: {platform}: {note}
Words we use: {words.use} · Never: {word} ({reason})

## Look {✓/?: basis}
Colours: {name} {hex} ({use}) · Fonts: {name} ({use}) · Logo: {logo_ref}

## Do / Don't
Do: {do} · Don't: {dont}

## References and calendar
- {kind}: {ref} ({note})
- {occasion}: {date}, {priority} priority ({note})

## Commercial (admin only)
Prices: {item} ₹{price} · Revision cap: {revision_cap} rounds

## Open questions
- [{priority}] {question} → recommended: {recommendation}

## Learnings (active and watch)
- {date} [{kind}, {status}] {what} ({evidence}; applies to {applies_to})

## Changes
- v{version} {date} {by}: {change}
```

Never show the WhatsApp number in this view. Write "on file" instead.
