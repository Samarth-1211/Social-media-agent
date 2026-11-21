# Weak: a profile that looks complete but can't be trusted (annotated)

**Situation:** the same material as `good-profile.md` (bio, five captions, "Owner is Imran bhai, Hinglish"). This version was saved straight away.

```
Safar Sathi Tours (SAF) - saved ✓
Business: travel
Audience: Everyone who loves travel, all ages.
Voice: Professional, friendly, premium.
Colours: orange, blue
Prices: Goa 5N/6D ₹18,999, Manali ₹14,500
Festivals: Diwali 12 Nov, Holi 3 Mar, Christmas 25 Dec
Do: be engaging. Don't: be boring.
Contact: Imran +91 9xxxxxxxxx
```

**What's wrong**

| Problem | Rule broken |
|---|---|
| Saved without showing a summary or getting a yes | Confirm before saving (SKILL step 7) |
| The code `SAF` was never proposed or confirmed | `client_code` must be confirmed (field guide §1) |
| No ✓/? marks: every guess reads as fact | Confidence rules §1 and §5 |
| "Everyone, all ages" and "professional, friendly, premium" can't change a draft; no `doesnt_mean`, no customer words | Field guide §2–3 |
| Colours without hex codes | Field guide §4 |
| Prices copied from an old caption and saved as fact; only the admin may set prices | Admin-only fields; material is never `confirmed` |
| Festival dates invented (they move every year) | Field guide §5: `date: null` and "confirm date" |
| "Be engaging / don't be boring" change nothing | Do/don't must change a draft |
| The phone number shown in the reply | Privacy: WhatsApp is "on file" only |
| No decision maker, no open questions, no changelog | Quality bar |

**Fix:** draft with marks, ask the gaps in one message (prices: high), show `templates/profile-summary.md`, and save only after "save". Use version 1 and a changelog entry.
