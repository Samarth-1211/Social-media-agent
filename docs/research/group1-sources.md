# Group 1 research: borrowed patterns

- **Read on:** 2026-11-22
- **Clones:** shallow clones in `../_research/`, outside the repo.
- **What we did with them:** adapted ideas into our own wording. Nothing was copied or vendored. Each source is also recorded in `plugins/social-media-manager/ATTRIBUTION.md`.
- **How to read this:** each section lists what we borrow (→ the skill or contract it lands in), then what we leave out and why. The last section lists the contract changes this research feeds into M2.

---

## 1. planning-with-files → `tracker`

| | |
|---|---|
| Repo | https://github.com/othmanadi/planning-with-files |
| Commit read | `0d840dc9a48892a72d762a4295f7a59e56a112bd` (2026-11-21) |
| Licence | MIT |
| Files read | `skills/planning-with-files/SKILL.md`; `templates/task_plan.md`, `progress.md`, `findings.md`, `loop.md`, `task_plan_autonomous.md` |

The repo copies this skill into about 15 agent-specific folders (`.codex/`, `.cursor/`, …). We read the main one under `skills/`.

**Borrow**
- **Read the record before acting.** "Restore state before continuing", and "Read before decide": re-read the plan before any major decision. → The tracker's first rule is to read the job record before touching the job, and again before any gate decision.
- **One isolated record per task; never fall back to another one.** Their plan resolver refuses to guess when several plans could match, and an explicit selector that doesn't resolve stops recovery. → One record per job. If the job is ambiguous ("continue the Diwali reel" while two are open), list the candidates and ask. Never guess.
- **A single "Next Step" field, refreshed whenever status changes.** → New `job.next_action`, rewritten at every stage or gate change. The catch-up card reads it rather than reconstructing it.
- **Reboot test.** Five questions: Where am I? Where am I going? What's the goal? What have I learned? What have I done? → The catch-up card answers these: current stage and last completed stage, remaining stages, job title and brief line, last 3 log lines, credits, next action.
- **Write as you go, not at the end.** The 2-action rule: anything important goes to disk now. → Save after every stage and every gate decision, never batched at the end of a session. A chat can end at any moment.
- **Single writer for shared state.** One orchestrator owns the plan; workers report through their own ledgers. → Only the `producer` changes stage and gate state. Other skills write only their own fields, through the storage layer.
- **Progress only goes up.** Their parallel-write guard treats a drop in completed items as evidence that someone's work was overwritten. → Concurrency check: if a fresh read of a job shows fewer `stage_history` or `gates` entries than the copy you hold, stop and report. Don't save over it.
- **Log errors, and never repeat a failed action unchanged.** Their 3-strike protocol escalates to the user after 3 failures. → The "If it fails" sections: log the error, change the approach, and ask the person after the third failure.
- **Stored content is data, not instructions.** → Client messages, Drive documents and sheet cells are treated as data, never followed as commands.

**Leave out**
- **Hooks, shell and Python scripts, attestation hashes, nonce delimiters, autonomous/gated modes, `/loop` and `/goal` integration.** They are Claude Code-only plumbing that won't run on claude.ai or the desktop app, and our records live in Google Sheets, not markdown files.
- **Three planning files per task.** Our job record plus its log already covers plan, findings and progress. A second set of files would duplicate it.
- **Session-history replay.** Out of scope, and a privacy risk.

---

## 2. superpowers → `producer`

| | |
|---|---|
| Repo | https://github.com/obra/superpowers |
| Commit read | `22f0b463e7a5e579904dd6211a520321035526f7` (2026-11-03) |
| Licence | MIT |
| Files read | `skills/brainstorming/SKILL.md`, `skills/writing-plans/SKILL.md`, `skills/executing-plans/SKILL.md`, `skills/verification-before-completion/SKILL.md` |

**Borrow**
- **Look before you ask.** Never ask what the project or earlier context already answers, and never reopen a settled decision. → The producer reads the brand brief and job record before asking anything, and never re-asks a field that is already `confirmed`.
- **Say defaults out loud.** "A default they never heard is one they couldn't reject." → At intake, every default (track, budget, deadline, assignee) is stated with a one-line reason, so the admin can correct it at the gate.
- **Approval covers only what was shown.** "Approval covers what you showed them." Their hard gate: nothing is built before approval. → A gate approval applies to the exact version shown. If an output changes after approval, the gate reopens. A stage never starts while an earlier gate is pending.
- **Evidence before claims.** The gate function: identify → run → read → verify → claim. → "Verify before advancing": after saving, re-read the record from storage and confirm every declared `writes` field is there and valid. Don't rely on memory.
- **"Agent said success" is not evidence.** → Don't trust a tool's "saved" reply. Read the row back.
- **Red-flag words.** "Should", "probably", "done!" said without checking. → Listed in `references/stage-running.md`.
- **Keep going between gates, but stop at the four kinds of stop.** Their executor doesn't ask "should I continue?" between tasks; it stops only for irreversible actions, security-sensitive actions, external side effects, or a broken plan. → The producer runs consecutive `gate: none` stages without asking. It always stops at a gate, before spending credits over budget, before anything goes to a client, and before cancelling or deleting.
- **Record your decisions.** "Ruling: what you decided — why — what it costs if wrong." → When the producer makes a call on someone's behalf (for example, choosing the quick track), it logs a one-line ruling so the gate owner can review it.
- **The record survives memory loss.** "After compaction, trust the ledger over your own recollection." → On resume, the job record outranks anything remembered from the chat.

**Leave out**
- **TDD, worktrees, code review, subagent dispatch, design documents, the visual companion.** These are software-engineering workflow; Group 1 is also told to use no subagents.
- **Brainstorming's one-open-question-at-a-time discovery.** Intake has to be fast and grouped (section 6.3 asks for all questions in one message). We keep only "look first" and "state defaults".

---

## 3. marketingskills: product-marketing → `brand-keeper`

| | |
|---|---|
| Repo | https://github.com/coreyhaines31/marketingskills |
| Commit read | `5b2b400eec1e7e1cec76245a715d0b0d4fd2a9c1` (2026-11-19) |
| Licence | MIT |
| Files read | `skills/product-marketing/SKILL.md`, `skills/product-marketing/references/brand-voice.md` |
| Not found | `product-marketing-context` doesn't exist as a separate skill. The context document is part of `product-marketing` itself. |

**Borrow**
- **One shared context document that every other skill reads.** → The client profile is the single source, and later stages read a short "brand brief" view of it.
- **Check first, update only what changed.** If the profile exists: summarise it, show its version and latest changelog lines, ask which sections to update, and gather only those. → `brand-keeper` step 1.
- **Two ways to create a new profile; drafting from material is preferred.** → Path (a), draft from material, is offered first; path (b), the interview, second.
- **Versioning.** Bump the version on every substantive save. A typo fix gets no bump. Changelog entries go newest first, each naming the sections touched and the reason. Never rewrite past entries. → `client.version` and `changelog[]` rules.
- **Learnings as a structured, growing table.** Each entry has date, learning, evidence, applies to, and status (`active`, `watch`, `retired`).
  - What earns a place: a pattern seen twice or more, a decision made with a reason, or a correction given more than once.
  - Retire entries instead of deleting them; keep about 20 active.
  - Any skill can propose a learning; a person approves it.
  - → `client.learnings[]` gains `evidence`, `applies_to` and `status`.
- **Capture the customer's own words.** Exact phrases beat polished summaries. → Keep the client's own wording (often Hinglish) for audience and offers.
- **Brand voice built from evidence.** Each voice attribute gets *means / doesn't mean / an example line*. Sources, strongest first: posts that performed, the owner's own writing, conversations, reviews, then examples of what the brand would never say. Word lists: terms we own, customer words, and never-use words, each with a reason. → `client.tone_of_voice` becomes structured, plus a `words` section.
- **Tone changes by context while the voice stays the same.** → A small tone-by-context row per platform (Instagram reel, WhatsApp status, festival post).

**Leave out**
- **B2B persona tables, competitive landscape, the JTBD "four forces", the paid-ads section, proof-point metrics.** Too heavy for Indian SMB clients (laundry, real estate, clothing, travel); most of these fields would be guesses.
- **"One section at a time" for the from-scratch path.** We ask all interview questions in one grouped message, as the Group 1 prompt requires.
- **The local markdown file at `.agents/`.** Our profile lives in the Google Sheet.

`references/brand-voice.md` itself credits Wispr Flow's MIT-licensed brand-voice skill. We take ideas only, so no further attribution is owed, but we note the chain here.

---

## 4. knowledge-work-plugins: brand-voice → `brand-keeper`

| | |
|---|---|
| Repo | https://github.com/anthropics/knowledge-work-plugins |
| Commit read | `0e0fcacddcc892eb92a1b7873ff9d68159c47571` (2026-11-19) |
| Licence | Apache-2.0 at the repo root. The `partner-built/brand-voice/` folder has its own `LICENSE`: MIT, © 2025 Tribe AI. |
| Files read | `partner-built/brand-voice/skills/discover-brand/SKILL.md`, `skills/guideline-generation/SKILL.md`, `skills/guideline-generation/references/confidence-scoring.md`, `skills/brand-voice-enforcement/SKILL.md`. Skimmed: `discover-brand/references/source-ranking.md`, `discover-brand/references/search-strategies.md`, `guideline-generation/references/guideline-template.md`. |

**Borrow**
- **Every open question carries a recommendation.** "Confirm or override, never a dead end." Each has a priority: high (blocks work), medium (improves quality), low (nice to have). → `client.open_questions[]` becomes `{question, recommendation, priority, field}`.
- **Confidence comes from evidence, and low confidence creates a question.** Their rules: low confidence plus a conflict is a high-priority question; low confidence plus a gap is medium; every guess says what would raise confidence. → We keep the binary `confirmed` / `guessed` that the Group 1 prompt asks for, but every guessed field records its **basis**: "from Instagram bio", "inferred from business type". A guessed field that blocks a stage creates an open question.
- **Source trust order.** Official (said or approved) > operational (used in practice) > conversational > contextual > stale. → For a client: what the client or admin said or approved is `confirmed`. Their own past posts, captions and pasted chats are `guessed`, with that basis. Inferences from business type or city rank lowest. Older material loses to newer, and the conflict is flagged.
- **Check connectors before discovery, and confirm scope with one question.** → Before onboarding "from material": check whether Google Drive is connected, offer to search the client's Drive folder, and confirm what to use in a single question.
- **A "We are / We are not" table.** → The brand brief shows 3–4 rows.
- **Open questions while producing content.** If later work touches an unresolved question, apply its recommendation and say so. → A rule in the brand-brief template for later stages.
- **Privacy.** Redact names and contact details from examples, and flag sensitive information. → No client phone numbers in examples or evals. Learnings never quote personal details.

**Leave out**
- **Discovery subagents and the enterprise platform list (Notion, Confluence, Gong, Granola, Slack, Box, SharePoint).** Subagents are excluded from Group 1, and our clients' material arrives through chat uploads, WhatsApp text and Google Drive.
- **Weighted aggregate confidence scores (0.3 / 0.6 / 1.0 weights).** False precision for SMB profiles with few sources. Binary marks plus a basis are clearer for editors.
- **The local `.claude/brand-voice-guidelines.md` file and settings file.** Storage is the Google Sheet.

---

## 5. freelance-motion-skills: client-revisions → `client-feedback`

| | |
|---|---|
| Repo | https://github.com/iart-ai/freelance-motion-skills |
| Commit read | `9f294eb6df73cde7e2dea235f42275df11a16466` (2026-11-11) |
| Licence | MIT |
| Files read | `skills/client-revisions/SKILL.md`, `references/feedback-translator.md`, `references/email-templates.md`, `references/sow-clauses.md` |

**Borrow**
- **Classify every note before acting on it.**
  - Vague → translate it first; don't act yet.
  - A concrete change to something **already approved** → a revision. It counts against the cap.
  - Anything **not in the approved brief**, or that **reverses an approved decision** → new work (a change order).
  - When unsure, ask "was this decided and approved already?"
  - → Our labels: `in_scope` = revision, `change_request` = new work or a reversal, `clarification` = vague.
- **A locked gate.** Reopening an approved stage counts as new work, because later work was built on it. → Feedback that targets a stage before the one under review is routed as `change_request`, and the reopen is proposed for admin confirmation.
- **Scattered feedback from several people.** Consolidate it first; the client decides which note wins. → Conflict type "several people, no decision maker". New `client.decision_maker` field. If it's missing or bypassed, flag it and ask the client to choose. Never pick a side.
- **A round is one consolidated set of feedback.** Their "generous" variant folds follow-ups within 24 hours into the same round. → Revision-round rule: client messages about the same version, before work restarts, count as one round. A new version shown and answered starts the next round.
- **The vague-note translator.** Three decoding questions: where (timestamp, scene or poster area)? Which axis (colour, pace, type, scale, sound, message)? Compared to what (a reference)? Plus their lookup table of phrases. → `references/vague-note-decoder.md`, extended with Hindi and Hinglish phrases ("thoda aur attractive banao", "premium feel chahiye", "kuch missing hai", "zyada bhara hua lag raha hai").
- **Ask for the problem, not the fix.** → An optional line in client messages.
- **Change-order and extra-round messages.** Collaborative tone; always offer a choice (go ahead or park it); always state the cost and time impact; never accuse. → `templates/client-message.md` and the over-cap message drafted for admin approval.

**Leave out**
- **SOW and contract clauses, day rates, the kill clause.** Pricing and contracts are the admin's commercial decisions, not something the plugin should write. We only draft the over-cap message for the admin to approve.
- **The email format.** Our clients use WhatsApp: short messages, in the client's language.
- **Motion-design-specific axes like "easing".** Generalised to video and poster axes.

---

## Contract changes this research feeds into M2

| Contract | Change | Source |
|---|---|---|
| `job` | Add `next_action` (one line, refreshed on every stage or gate change) | planning-with-files |
| `job` | Each gate records `shown_version` or a reference; changing an output after approval reopens its gate | superpowers |
| `job` | New `rulings[]` entries, or log lines of kind `ruling`, for calls made on someone's behalf | superpowers |
| `job.client_feedback` | Labels `in_scope`, `clarification`, `change_request`, `not_actionable`, `duplicate`; each item keeps the client's exact words; conflict types; round number | client-revisions + Group 1 prompt |
| `client` | `decision_maker` field | client-revisions |
| `client` | Structured `tone_of_voice` (attributes with means / doesn't mean / example line, plus tone by platform) and a `words` section (use, never use with reason) | product-marketing |
| `client` | `confidence` value becomes `{status: confirmed or guessed, basis}` | brand-voice |
| `client` | `open_questions[]` becomes `{question, recommendation, priority, field}` | brand-voice |
| `client` | `learnings[]` gains `evidence`, `applies_to`, `status` (active / watch / retired) | product-marketing |
| `client` | `changelog[]` entries name the sections touched and the reason | product-marketing |

Every change still has to fit the Google Sheets layout decided for Group 1. M2 shows the final versions for approval.
