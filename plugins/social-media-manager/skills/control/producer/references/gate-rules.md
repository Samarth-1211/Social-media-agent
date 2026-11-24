# Gate rules

Gates are where a person decides. The producer opens them, records them and enforces who may decide; it never decides one itself. Storage: `record_gate` in `${CLAUDE_PLUGIN_ROOT}/library/storage/README.md`.

These permissions are **behavioural, not security**: the team shares one Claude account, and anyone can edit the sheet. The producer refuses politely and logs everything, so the admin can see who did what. See `docs/STORAGE.md` (repo).

## 1. Opening a gate (request)

When a stage with `gate: admin | editor | client` finishes and is verified:

1. Read the job fresh. Only one gate may be pending at a time.
2. Call `record_gate` with a request:

   | Field | Value |
   |---|---|
   | `stage` | the stage id |
   | `kind` | `stage` (or `budget`, §4) |
   | `owner_role` | the stage's `gate` |
   | `status` | `pending` |
   | `shown_outputs` | the versions shown. For a stage with `writes`: those fields. For an approval stage (`client-*-approval`, no writes): the fields its `reads` and `optional_reads` name, at their current versions. |
   | `requested_at` | from `get_now` |

3. Set `waiting_on` = `owner_role` and `next_action` = "<Name> to <approve the stage> or request changes." Put the person's name in, not the role:
   - `admin` → the admin's name (Team tab);
   - `editor` → the assignee's name;
   - `client` → "<assignee name> to send <what> to <client decision maker> and record the reply". For `client-script-approval`, <what> is "the script review message (shown above)".
   - Keep `next_action` under 200 characters (the schema limit): who, what, one action.
4. Show `${CLAUDE_SKILL_DIR}/templates/gate-message.md` and stop. **Exception:** a stage with a `gate_label` (in `stages.yaml`) shows its own skill's message, `templates/<gate_label>.md` in that skill's folder, instead of this template. Its `shown_outputs` are what that template shows. Today: `creative-pick` (`hooks`): `${CLAUDE_PLUGIN_ROOT}/skills/pre-production/hooks/templates/creative-pick.md`, `shown_outputs` `{hooks: <v>}` plus `concept: <v>` on the full track; `script-pick` (`script`): `${CLAUDE_PLUGIN_ROOT}/skills/pre-production/script/templates/script-pick.md`, `shown_outputs` `{script: <v>}`. The gate record itself carries only the usual fields; `gate_label` is read from `stages.yaml`, never written into the record.

## 2. Who may decide

The session person's handle and role come from the Team tab (storage README §1.3).

| Gate | May decide | Everyone else gets |
|---|---|---|
| `admin` | `role: admin` | "Sorry <name>, the <stage> gate needs the admin, <admin name>. I've left it pending; <admin name> can say 'approve <job>'." |
| `editor` | the job's `assignee` (editor or designer), or an admin | "Sorry <name>, this one is for <assignee name> (assigned to <job>) or <admin name>." |
| `client` | the job's `assignee` or an admin, **recording the client's own reply** | "Only <assignee name> or <admin name> can record <client>'s decision, from the client's message." |
| `budget` | `role: admin` | "Only <admin name> can approve spending beyond the budget." |
| `spend` | `role: admin` | "Only <admin name> can approve spending money on <what>." |

Rules:
- **Not in the Team tab, or `active: false`:** they can't decide any gate. "I can't record approvals from you yet; <admin name> can add you to the team."
- **No proxies.** "Samarth said OK on the phone" doesn't count. The approver must say it in a session as themselves. Offer to leave the gate pending with a note.
- **Changing who's working mid-session** is allowed: "I'm Samarth now". Confirm the switch in one line and log it as an `event` ("session person changed from ravi to samarth"). Don't argue; it's behavioural.
- **Refusing doesn't change the record.** Leave the gate pending, don't log a decision, and log nothing beyond an optional `event` "approval attempt by <handle> refused (needs <role>)".

## 3. Recording a decision

**Labelled gates** (`creative-pick`, `script-pick`, …). A reply on a pending gate with a `gate_label` goes to that stage's skill, §Gate: `${CLAUDE_PLUGIN_ROOT}/skills/pre-production/hooks/SKILL.md` for `creative-pick` ("2B", "1 with 3A", "mix 1 and 3", "more like 2A", "none, …", a line edit) and `${CLAUDE_PLUGIN_ROOT}/skills/pre-production/script/SKILL.md` for `script-pick` ("A", "B", "A with scene 3 from B", "scene 4 line: …", "shorter by 5 sec"). The skill reads the reply in plain words, checks permission and versions as below, records the decision, and saves the pick. Plain approval ("ok", "theek hai", "approve") = the skill's recommendation. The pick's own version of the stage's output after the decision is expected and needs no new gate. Then run on as for any approval.

1. **Re-read the job.** The gate must still be `pending`. If it isn't, someone decided first: show who and when, and stop.
2. **Check permission** (§2).
3. **Check the versions.** Every field in `shown_outputs` must still be at that version in `job.outputs`. If one moved, the approval would cover something not shown. Don't record it; tell them what changed and request the gate again.
4. **Record** with `record_gate`: `status`, `decided_by` (handle), `decided_by_role`, `decided_at`, `note`, and `sent_back_to` if sent back.

   | They say | `status` | Then |
   |---|---|---|
   | approve / "ok hai" / "approved" / "theek hai, aage badho" | `approved` | Close the stage's history row `done`, then run on (`stage-running.md` §7). |
   | "changes: <note>" / "isme ye badlo" | `changes_requested` | Note = their words. Rerun the same stage (`stage-running.md` §8). |
   | "back to <stage>" / "<stage> pe wapas" | `sent_back` | `sent_back_to` = that stage, which must be earlier on the path. Reopen it. |

5. **Log** a `gate` entry: "<stage> <status> by <handle> (<role>)", plus the note if there is one.
6. **Verify** with a fresh read that the decision is saved before saying so.

**Ambiguous replies.** "ok", "hmm", "dekhte hain" or a thumbs-up on their own, when it's not clear a gate is being decided or which job it's for: ask "Approve <stage> for <job>?" Don't guess.

## 4. Credits and the budget gate

Run this **before** every `credit_spend: true` stage, and before every single generation inside an active one.

1. Read the job fresh: `used` = `credits.used`, `budget` = `credits.budget`, `warn` = `credits.warn_at`.
2. Get the estimate for this run:
   - **Active stage:** the stage skill's estimate (`config.credit_policy.estimate_before_spend`). No estimate means no spend.
   - **Placeholder stage:** 0, unless someone states one ("poster-final will take ~18 credits").
3. Compare `used + estimate`:

   | Result | Do |
   |---|---|
   | ≤ `warn` (or no `warn`) and ≤ `budget` | One line: "Budget check: <used> used + <estimate> estimated = <total> / <budget> ✓". Go on. |
   | > `warn`, ≤ `budget` | Same line plus "⚠ past the warning line (<warn>)". Tell the assignee. Log a `credit` event. Go on. |
   | > `budget` | **Stop.** Open a budget gate (below). Generate nothing. |

4. **Budget gate:** `record_gate` request with `kind: budget`, `owner_role: admin`, `stage` = the credit stage, `shown_outputs` = `{}`, and note "used <u> + estimate <e> = <t> > budget <b>". Show the budget variant of the gate message.
   - **Approve:** the admin gives the new budget ("approve, budget 35"). If they don't, propose `used + estimate` and ask. Update `credits.budget`, log a `ruling` ("budget raised from 28 to 35 by samarth for poster-final"), then start the stage.
   - **Changes:** the stage doesn't run. Note what the admin wants (fewer variations, a cheaper model, a shorter clip). The stage skill must bring a new, lower estimate, and the check runs again.
   - Only the admin decides it, even if the assignee is the one spending.
5. **After spending,** log every spend with `add_credit_entry`: amount, estimate, tier, tool, a description, and `approved_by` for `final`-tier upgrades. Read back that `credits.used` went up by exactly that amount.

**Logging a spend after the fact** ("I already made 2 drafts in Higgsfield, 6 credits"): record it truthfully with `add_credit_entry`, even if it takes the job over budget. If it does, open a budget gate before any further spend and tell the admin.

## 4b. The spend gate (real money, before it is spent)

For stages with `spend_gate: admin` (today: `research`, only when Apify is enabled). Money here is USD or INR, never Higgsfield credits, so the credit budget check (§4) doesn't apply to it.

1. The stage skill shows its plan with an estimate (amount and currency).
2. Estimate ≤ `config.research_auto_approve_limit` → no gate; it runs. (The default limit is 0, so any paid run asks.)
3. Above it → `record_gate` request: `kind: spend`, `owner_role: admin`, `stage` = the stage, `shown_outputs: {}`, note "<what>: estimate <amount> <currency> > auto-approve limit <limit>". The free part of the stage runs meanwhile; only the paid part waits.
   - **Approve** (admin only): the paid part runs; log a `ruling` ("Apify run for SHL approved by samarth: est. 0.43 USD").
   - **Changes:** the skill brings a smaller plan and a new estimate.
   - Nobody approves before the stage finishes its free part → the paid part is queued as a task and the stage completes as `partial`; the gate closes as `changes_requested` with note "queued".
4. After the run, the skill's cost lines go to the ledger with `provider: apify` and the currency; the real cost, not the estimate.

## 5. Client gates

- The producer **never sends anything to a client.** At a client gate, the assignee sends the work (by WhatsApp, today) and records the reply.
- **To record the decision,** ask for the client's message text (pasted or typed), not a summary. Keep it out of logs if it has phone numbers.
  - **Clear approval** ("haan perfect hai, final karo"): record `approved`, with the note "client (<decision maker>): <short quote>". `decided_by` is the team member recording it.
  - **Any change request, mixed message or vague note:** hand the reply to `client-feedback`. It returns labelled items, conflicts and a proposed stage. When the assignee or admin confirms the route, record `sent_back` to that stage (or `changes_requested` if it's the stage just shown) and reopen it.
  - **Not sure whether it's an approval** ("theek hai, but…"): it isn't. Treat it as feedback.
- Revision rounds and the client's revision cap are counted by `client-feedback`. The producer doesn't decide whether a change is in scope.

## 6. What a gate record must never be

- Approved by someone not allowed to decide it.
- Approved for versions that weren't shown.
- Approved "on behalf of" anyone.
- Skipped because the stage is a placeholder.
- Decided when it wasn't pending.
