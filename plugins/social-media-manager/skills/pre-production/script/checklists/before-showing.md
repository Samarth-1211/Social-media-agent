# Before showing: script self-check

Run before every save and before showing the script pick, and again on the changed scenes after an edit at the gate. Record each line in `script.data.self_check.items` (`id`, `ok`, `note`). `passed` only if all pass. Fix and re-check once; if a line still fails, save with the failing line noted and say it in the pick message.

| Id | Check | Pass when |
|---|---|---|
| SC1 | **Storyboard-ready** | Every scene has shot, subject, action, camera and setting; one subject, one action, one camera move; `asset_hint` set; `must_be_real` true on every real customer, place or result (`scene-writing.md`). |
| SC2 | **Sound-off readable** | The hook card is up from 0 s; the offer, price with its condition, date and CTA are on cards; every card ≤ 6 words and held long enough (`on-screen-text.md`). |
| SC3 | **One CTA** | Exactly one ask, the brief's `cta_detail`, said and shown; no bait; caption ends on the same ask. |
| SC4 | **Duration matches the brief** | Each version's `duration_sec` = the brief's master length (variants in `variant_notes`); scenes run from 0 with no gaps to the end. |
| SC5 | **No invented facts** | Every price, offer, date, count, claim and proof traces to the brief, profile or research (`fact_refs`); prices exactly as `offer_detail`; "free" with its condition; unsourced items removed or `{{needed}}` with an unlock (`fact-guard.md`). Re-checked after the humanizer pass. |
| SC6 | **Language matches the brief** | The brief's `language`, written in Roman letters for Hindi and Hinglish (`writing_script` `roman-hinglish`) or English; spoken, natural, not translated. |
| SC7 | **Timing fits** | Every scene's spoken words fit its seconds at the language's pace (`voiceover-pacing.md`, `config.pace_overrides`); the hook line ends by 3 s; a pattern change every 1.5–3 s; no static scene over 4 s. |
| SC8 | **Hook paid off** | Both versions open with the picked hook (or a named backup); the promise is delivered by `payoff_scene`, before 60 % of the runtime. |
| SC9 | **Critique done; structures differ** | Each version checked against the three failure modes, weak beats rewritten (`critique_notes`); the two versions use different `structure_type`s. |
| SC10 | **Humanizer and limits** | `ai-tells.md` applied to voiceover, cards and caption (`humanizer_done`); the misuse lines and hooks trust anti-patterns hold: no fake urgency, no invented results, no AI person shown as real, nothing from the brief's `avoid` or the profile's `dont` / `never_use` (`ethics_ok`). |
