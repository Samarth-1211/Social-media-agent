# Testing guide: how to check everything built so far

For Samarth (admin), the editors, and anyone checking the system before real clients use it. Version **0.4.0-alpha.1**.

## What exists today

| Built (real work) | Placeholder (runs, writes "not built yet", the approval still happens) |
|---|---|
| Producer (jobs, tracks, approvals, budgets), tracker (status, catch-up), brand-keeper (client profiles), client-feedback (client replies) | Style bible, casting, storyboard, production plan |
| Market research, brief, concepts, hooks + the creative pick | Clips, voice and music, QA, rough cut, captions, audio mix, final master, export |
| Script + the script pick, language version (Hinglish / Hindi / English), the client's script approval | Poster drafts and final poster, delivery |
| Tracker page (read-only board) | |

So today a job can go **from the request to a client-approved script**. Everything after that moves through placeholder steps, so you can test the flow and the approvals, but not real videos.

There are four layers of testing. Do them in this order; each one catches different problems.

| Layer | Who | Cost | Time | Catches |
|---|---|---|---|---|
| 1. Automatic checks | Samarth or a developer | free | ~3 min | Broken files, contracts, rules, links |
| 2. Automatic scenario runs | Samarth or a developer | about $30 per full suite | 30–60 min, unattended | Skills that misbehave on planted problems |
| 3. Hands-on walkthrough in the Claude app | Samarth + one editor (+ someone playing the client) | normal Claude use | ~90 min | What real people will hit: wording, flow, approvals, the tracker |
| 4. Quality review by people | Founder, an editor, a native Hindi/Hinglish speaker | free | ~30 min | Is the creative work actually good and natural? |

---

## Before you start (one time)

1. **Push and install the release.**
   - Push `main` and the tag `v0.4.0-alpha.1` to GitHub.
   - In the Claude app (or Claude Code), update the marketplace and install/update the `social-media-manager` plugin.
   - Check that the version shows 0.4.0-alpha.1.
2. **Connect Google Drive and Google Sheets** in the Claude app (Settings → Connectors), signed in to the agency account.
3. **Use the TEST database, never the real one.** Start every test session with "use TDM Studio TEST Database".
4. **Upgrade the TEST sheet to layout v5** (admin): say "upgrade the TDM Studio sheet". It adds the missing columns and Config rows (v3 → v4 → v5). Then check:
   - the Clients tab has a `pronunciation` column;
   - the Config tab has `script_versions`, `pace_overrides`, `localise_variant_languages` and `caption_max_chars_per_line`.
5. **Open the tracker page**, https://claude.ai/artifact/9vZTbn9j6WFZyMzvWC8XAj, and press **Allow** when it asks to read Google Sheets.
   - **If it works,** the header says "Live from Google Sheets".
   - **If it says "Sample data",** the connector isn't connected for you.
   - **Share it** from its Share menu with whoever will test.
6. **Decide who plays whom:**
   - Samarth = admin.
   - One editor = assigned editor (e.g. Ravi).
   - Someone plays the client: they write the WhatsApp replies you'll paste.

---

## Layer 1: automatic checks (free)

Run from the repository folder in a terminal:

```bash
npm ci                                                      # once
node scripts/validate.mjs                                   # 13 checks + Claude's own plugin validation
node evals/brief-fixtures.mjs check
node evals/concept-hooks-fixtures.mjs check
node evals/script-localise-fixtures.mjs check
node evals/script-localise/check-faults.mjs                 # 24 planted faults must all be caught
node evals/research/validator-faults.cjs                    # 18 planted faults
node evals/research/methods-consistency.cjs
python -I plugins/social-media-manager/skills/pre-production/localise/scripts/transliterate.py --self-test
npm i --no-save jsdom && node evals/research/tracker-page-render.cjs   # the tracker page renders
```

**Pass** = every line ends with ✔ / PASS / "caught" and nothing says ✘ or MISS. Or in one go: `node evals/script-localise/run-scenarios.mjs R1` runs most of these and shows "R1: 9/9".

Run Layer 1 after **every** change to the plugin. It's free.

---

## Layer 2: automatic scenario runs (paid)

These start real Claude sessions (Sonnet, headless) on fictional clients, plant problems, and check what the skills saved. They use Claude credits, so run them after a release or a big change, not every day.

| Suite | Command | Runs | Cost last time | Checks |
|---|---|---|---|---|
| Market researcher | `node evals/research/run-scenarios.mjs` | 8 | ~$25 | Research plans, findings, confidence, freshness |
| Concept + hooks | `node evals/concept-hooks/run-scenarios.mjs` | 13 | see `evals/results/2026-11-22_v0.3.0-alpha.1.md` | Concepts, hooks, the creative pick, an end-to-end run to the script |
| Script + localise | `node evals/script-localise/run-scenarios.mjs` | 18 + R1 | ~$28 (first round) | Two script versions, fact guard, pick replies, Hinglish/Devanagari, captions, back-translation, client approval |

- **Results** print as `✔ name: 10/10`, or `✘ name: 7/8` with the failed check and why.
- **Raw outputs** are saved in `evals/results/<suite>-runs.local/<run>/`: open `transcript.json` to read what Claude said, and the `.tdm-studio/jobs/<id>/job.json` file to see what it saved.
- **To re-check without paying again:** add `--check-only`.
- **To re-run just one:** name it, e.g. `node evals/script-localise/run-scenarios.mjs S6-R2`.

**Due now:** re-run the script-pick runs and the client-approval runs (`S6-R1 … S6-R7 A1-ok A1-changes A1-offer`, about $15). The producer changes merged in 0.4.0-alpha.1 changed how those two approvals are handled.

---

## Layer 3: hands-on walkthrough in the Claude app (the most important)

One sitting, about 90 minutes, on the TEST sheet. Keep the tracker page open beside the chat and watch it after each step.

For each step:
- **Say:** what you type;
- **Expect:** what Claude should do;
- **Tracker:** what the board should show.

Tick each line; write down anything that surprises you.

### A. Start a session (5 min)

| Say | Expect | Tracker |
|---|---|---|
| "use TDM Studio TEST Database. I'm Samarth" | Finds the TEST sheet, confirms you as admin | — |
| "status" | A board of open jobs grouped by who they're waiting on | **Today** shows the same counts |

### B. A new client (10 min)

| Say | Expect | Tracker |
|---|---|---|
| "new client: Gupta Sweets, Indore" | Offers two ways: send their material, or answer one list of questions | — |
| Answer the questions (name, city, languages, decision maker, prices, do's and don'ts) | A short profile summary; fields you guessed are marked "guessed" | **Clients**: a new card with ? marks on guessed fields |

### C. One video job, full track, all the way to the client-approved script (40 min)

| Step | Say | Expect | Tracker |
|---|---|---|---|
| 1 | "new job for Gupta Sweets: Diwali mithai box reel, 20 sec, ₹499 box, WhatsApp order, full track, assign Ravi" | Proposes track, budget, deadline with reasons; waits for admin | **Today → Samarth needs to approve**: the job, step "New job set up" |
| 2 | "approve" | Research runs (or is skipped if urgent); the brief is drafted; it asks only what's missing, with a guess | Journey: New job ✓, Market research ✓ |
| 3 | Answer any brief question, then "approve" | Brief approved; concepts and hooks are written; **one creative-pick message**: 3 concepts × 3 hooks, one ⭐ | **Today → An editor needs to pick**, "Concept + hook pick" |
| 4 | As Ravi: "I'm Ravi. 2B" | Picks concept 2 + hook 2B; the script starts | Journey: Concept + hook pick ✓ "Approved by Ravi" |
| 5 | (automatic) | **Script pick message**: version A and B, one line per scene, ⭐ recommendation, any ⚠ (missing footage or facts) | "Script (pick A or B)", waiting on editor |
| 6 | "A, scene 3 line: <your words>" (or "shorter by 5 sec") | Applies the edit, re-checks timing and facts, one-line confirmation; the language version runs straight away | Script ✓, Language version ✓ |
| 7 | (automatic) | A **WhatsApp message for the client**, ready to copy: greeting, hook line, 4–5 moments, the exact ₹499 and the CTA, "Reply OK to approve" | **Waiting for the client**, "Client approves script" |
| 8 | Paste what the "client" replied: "client approved: haan theek hai" | Recorded as the client's approval; the job moves on to placeholder steps | Client approves script ✓; the next steps show "not built yet" |

**Check during C:**
- Every price and date on screen and in the WhatsApp message is exactly what the brief said (₹499, the real date). Nothing invented ("10,000 happy customers", "No.1 in Indore").
- The script's scenes read like an editor could shoot them: what we see, camera, where.
- The Hinglish sounds like Indore, not a translation.
- Ask "A poora dikhao" at step 5: the full scene table appears.

### D. A quick-track repeat job (15 min)

Say: "new job for Shubh Laundry: same as last Diwali offer reel, curtain cleaning 15% off till 15 Dec, quick track".

**Expect:**
- No concept step: it reuses the last format.
- Hooks for that format, then a script pick, then the language version.

**Tracker:** the journey has fewer steps (16 instead of 22 for video).

### E. Client feedback (10 min)

At a "waiting for the client" step, paste each of these in turn (start again from the client step each time, or use three jobs):

| Paste | Expect |
|---|---|
| "client feedback: 'dhulne ke baad' ki jagah 'wash ke baad' likho" | Split into one item, labelled **in scope**, routed to the **language version**. After you say "route ok", only that step re-runs, and a short "after changes" message for the client appears. |
| "client feedback: end mein dukaan ka naam bhi bolo" | Routed to the **script**; the editor sees only the changed scene, before → after. |
| "client feedback: offer 25% kar do" | Labelled **new work (change request)**, routed to the brief; **only Samarth** can confirm it. A polite message for the client is drafted. |
| "client feedback: thoda aur attractive banao" | Treated as a vague note: 2–3 possible meanings and **one question** for the client; nothing changes yet |

### F. Guardrails (10 min)

| Try | Expect |
|---|---|
| As an editor, "approve" a brief | Politely refused: only Samarth approves the brief |
| As Pooja (not assigned), reply "A" at Ravi's script pick | Refused, naming Ravi or Samarth |
| Ask for "likh do 5000+ customers ne try kiya" in the script | Refused or replaced: no invented numbers; it asks for a real figure |
| Pick a Hindi brief for older buyers (devanagari) | Devanagari text; the record says "unverified" with words to check if IndicXlit isn't installed |
| "log 250 credits for clips" on a 200-credit job | A budget approval opens for Samarth before anything else spends |

### G. A poster job (5 min)

Say: "new job for Gupta Sweets: Diwali offer poster".

**Expect:** intake, research, brief, then the poster placeholder steps, each still stopping at its approval. **Tracker:** the phases read Plan → Poster → Deliver.

---

## Layer 4: quality review by people (30 min)

The automatic checks prove that the rules hold. Only people can judge whether the work is **good**.

1. **Founder's creative read** (any 3 scripts from Layer 3). Score each 0–2:
   - Would the first second stop your thumb on mute?
   - Does every scene earn its place?
   - Is the one CTA clear?
   - Would a real Indore shop owner say these lines?
   - Is the script shootable by our team with a phone?

   Full rubric: `evals/rubrics/script-localise.md` (and `concept-hooks.md` for concepts and hooks).
2. **Native-speaker sheet:** a Hinglish speaker and a Hindi (Devanagari) reader score every voiceover line and card 0–2 (0 = "I'd screenshot this as AI", 2 = "sounds like the shop owner"). Pass = no 0, and an average of 1.6 or more. Also check the words the Devanagari record marks as "unverified".
3. **Editor's practical read:** could you storyboard and shoot from the scene table without asking a question? Note every question you would have asked.

---

## Recording results and reporting problems

- **One results file per test day:** `evals/results/<date>_<version>.md`, with what you ran, pass/fail, the rubric scores and every problem.
- **Write each problem like this:**

  ```
  Where: job SHL-40, step "Script (pick A or B)", Claude app
  I said: "A with scene 3 from B"
  Expected: B's scene 3 inside A
  Got: picked B instead
  How bad: blocks work / wrong but workable / cosmetic
  Screenshot: (attach)
  ```

- **Fixes** go into the skills, then Layer 1 again, then just the affected Layer 2 runs.

## What can't be tested yet

- **Real videos, voices, captions and posters:** those stages are placeholders until the generation and edit groups are built.
- **IndicXlit-verified Devanagari:** not installed on this machine. The fallback is tested, and its output is always marked "unverified".
- **Things only the Claude app can confirm** (`docs/STORAGE.md`, VERIFY-IN-CLAUDE-APP): live tracker data for each teammate, `get_now` in the app, plugin install steps on claude.ai. Layer 3 covers them: write down what you see.
