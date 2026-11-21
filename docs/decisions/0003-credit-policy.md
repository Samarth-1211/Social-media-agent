# 0003: Spend generation credits as little as possible

- **Date:** 2026-11-22
- **Status:** accepted

## Context

Higgsfield generation spends credits from a shared account, and the admin wants the minimum spent per job. Most waste comes from three things:
- weak prompts that need re-rolls;
- generating at high quality before the idea is approved;
- generating several variations nobody asked for.

## Decision

Every stage with `credit_spend: true` (clips, voice-music, poster-drafts, poster-final) follows these rules, set in `config.credit_policy`:

1. **Check the prompt first** (`prompt_check_before_spend`). Each generation prompt is checked against the brief and the brand brief: subject, format, aspect ratio, duration, language, mandatories. Nothing is generated from a prompt that hasn't passed.
2. **Estimate first** (`estimate_before_spend`). Show the cost estimate before every generation; Higgsfield has cost-estimate tools. Log the estimate next to the actual spend in the job's credit ledger.
3. **Cheapest first** (`start_tier: draft`). Drafts use the lowest-cost suitable model, lowest resolution and shortest length, with **one** variation (`draft_variations: 1`).
4. **Upgrade only what's approved** (`upgrade_approver: editor`). A higher-cost model is used only for shots or posters the assigned editor or the admin has approved, and the upgrade is logged with who approved it (`tier: final`, `approved_by`).
5. **A budget per job:**

   | Job type | Hard cap | Warn at |
   |---|---|---|
   | Video | 200 credits | none |
   | Poster | 28 credits | 20 credits |

   Defaults come from config and can be changed per job at the intake gate. Going beyond the cap needs an admin-approved `budget` gate.

## Consequences

- Group 1 records the policy, the budgets and the budget gate. The producer enforces the budget check.
- Groups 2 and 3 (`production-plan`, `visual-prompts`, `clips`, `voice-music`, `poster-design`) implement prompt checking, estimates and tier selection against Higgsfield's actual models and prices, which must be checked at build time.
- **Trade-off:** drafts look rougher and approval takes one more step, in exchange for far fewer wasted credits.
