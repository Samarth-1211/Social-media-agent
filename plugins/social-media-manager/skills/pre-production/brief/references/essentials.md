# Essentials: what blocks production

An **essential** is a field the work can't start without. Only essentials can cause a question. Every other field may stay `guessed`: say so in `assumptions` and move on.

## When an essential blocks

An essential **blocks** when it is:
1. **missing**, or
2. **guessed with a weak basis** (a default, or an inference from the business type) **and** marked "never guess" below.

An essential does **not** block when it is guessed but marked "guess OK". The admin sees it at the gate, and a wrong guess is cheap to fix before the script.

These count as `confirmed`, not guessed:
- said or approved by a person in this job (intake note, call summary, chat);
- a `confirmed` profile field (brand brief, without the "Guessed" mark);
- the same value in a past job of this client that was approved at its brief gate **and** by the client (for "jaise pichli baar").

## Essentials by job kind

✔ = essential. **Never** = never guess it: confirm it or ask. **OK** = a guess is fine, shown at the gate.

| Field | offer-reel | brand-film | launch | festival | poster | general | Guess? |
|---|---|---|---|---|---|---|---|
| `objective` + `objective_label` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | OK if the intake says what people should do; otherwise **Never** |
| `deliverables` (platform, format, aspect) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | OK (from the request or the profile platforms) |
| `duration_sec` (video) | ✔ | ✔ | ✔ | ✔ | | ✔ | OK (default from `objective-to-format.md`) |
| `language` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | OK if the profile has it; **Never** if the profile lists several languages and the job doesn't say |
| `cta_detail.channel` | ✔ | | ✔ | ✔ | ✔ | ✔ | OK if a past approved job or the profile shows one channel; otherwise **Never** |
| `offer_detail.text` | ✔ | | if any | if any | if any | | **Never** |
| `offer_detail.price` (if the offer shows a price) | ✔ | | if any | if any | if any | | **Never**: from `price_points` (`matches`) or the client |
| `offer_detail.validity` | ✔ | | if any | if any | if any | | **Never** |
| `key_message` | | ✔ | ✔ | | ✔ | | OK, drafted from the objective and profile |
| What is launched (name, date) | | | ✔ | | | | **Never** |
| `occasion` + `posting_date` | | | | ✔ | | | OK from the festival calendar if the date is fixed; **Never** for movable dates the calendar leaves null |
| `deadline` | | | ✔ | ✔ | | | **Never** for launch and festival (it decides the posting date) |
| Category mandatories (e.g. a real-estate RERA number, see `proof-and-claims.md`) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | **Never** |

"if any" means: essential only when the job has an offer. Whether there *is* an offer is itself never guessed for `launch` and `festival` jobs. Look first (intake, last year's festival job, the profile's festival note); ask only if nothing says.

## Choosing `job_kind`

| The ask says… | `job_kind` |
|---|---|
| A discount, price, deal, "offer", "scheme" | `offer-reel` (even for a festival; set `occasion`) |
| "Brand video", "about us", story of the shop or company, no offer | `brand-film` |
| New branch, new product, new project or tower, "opening" | `launch` |
| A greeting or festival post with no offer | `festival` |
| `type` = poster | `poster` (an offer poster still uses the offer rows above) |
| None of these | `general` |

## Express mode

In express mode (`interview-rules.md`), ask only the **Never** rows that are missing or weakly guessed. Everything else stays `guessed`, listed in `assumptions`, with one line saying so: "Jaldi mode: baaki sab guess kiya hai, gate pe check kar lena."

## Examples

- **Shubh Laundry, Diwali curtain offer.** The intake has the offer, "20% off" and the date; the profile has the language and channel. 0 blockers → no questions.
- **Shubh Laundry, winter blanket offer.** The blanket price isn't in `price_points` and validity wasn't said. 2 blockers, both client-only → one WhatsApp message.
- **Narmada Heights, Navratri site-visit reel.** RERA number not on file. Blocks (category mandatory) → the team may know; ask the team first.
- **Narmada Heights, brand film.** No offer; the channel guess is "visit the sample flat" from past jobs. 0 blockers.
