# Brand brief (the view later stages read)

The short client view that every stage reads instead of the full profile: about 15 lines. Produced by the storage operation `get_brand_brief`. `brand-keeper` owns the profile behind it.

```markdown
**{name}** ({client_code}): {business_type}, {city} · profile v{version}
Audience: {audience.summary} ({age_range}); their words: "{1-2 customer_words}"
Languages: {languages} · Platforms: {platforms}
Voice: {summary}. We are {attribute} (not {doesnt_mean}); {attribute} (not {doesnt_mean})
Words: use {words.use}; never {word} ({reason})
Look: {colour names + hex}; fonts {fonts}; logo {logo_ref or "none on file"}
Do: {do, max 3} · Don't: {dont, max 3}
Offers/prices OK to show: {price_points, max 3, or "ask admin"}
Upcoming: {next 1-2 festival_calendar items within 60 days}
Learnings: {active learnings, max 3, one line each}
Guessed (treat as unconfirmed): {fields with confidence = guessed}
Open questions: {high and medium priority only, each with its recommendation}
Decision maker: {decision_maker.name} · Revision cap: {revision_cap}
```

Rules for stages that read it:
- **Guessed fields** are working assumptions. Name them when they shape a creative choice.
- **Open questions.** If the work touches an open question, apply its recommendation and say so in one line. Don't stop.
- **Need more?** If you need a field that isn't in the brief, ask for the full profile (`get_client`). Don't guess.
- **Privacy.** Never include the WhatsApp number.
