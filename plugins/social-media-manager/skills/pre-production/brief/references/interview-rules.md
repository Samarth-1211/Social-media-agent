# Interview rules: how to ask

**Zero questions is the goal.** Ask only for a **blocking** essential (`essentials.md`) that you couldn't look up (`inference-rules.md` §3). Each question carries your guess, so people react instead of thinking from scratch.

## 1. Pick the mode

| Situation | Mode |
|---|---|
| No blockers | **None.** Show the card and go to the gate. |
| The job is urgent: `job.urgent` is true, the person says "jaldi", "abhi chahiye", "urgent", "aaj hi", or the deadline is within 2 days | **Express** |
| A blocker only the client can know: a new offer, its price or last date, a new product detail, a stat or testimonial | **Client** |
| Anything else (the team may know: channel, objective, which project, RERA number on file) | **Team** |

Mixed blockers: ask the team first; whatever is left that only the client knows goes in one client message. Any team question can carry the option "Client se poochna padega", which moves it to the client message.

## 2. Team mode (editor or admin in chat)

- **One question per message.** Wait for the answer before the next one; the next question may depend on it.
- **At most `config.brief_max_questions` (default 5)** per job, across the whole brief. Stop early as soon as the blockers are covered. If you reach the cap with blockers left, stop: mark them `guessed`, list them in `open_questions`, and say so at the gate.
- **Ask only questions whose earlier answers are settled.** Ask "koi offer hai?" before "kitne ka?"; never ask about validity for a job with no offer.
- **Every question has:**
  1. the question, one idea, short;
  2. your **guess** with a reason in a few words ("pichli baar WhatsApp tha");
  3. **2–4 options**, the guess first, worded so "haan" takes it;
  4. "other": they can type anything.

  Template: `${CLAUDE_SKILL_DIR}/templates/question.md`.
- **Use the ask-the-user tool when the app has one.** In Claude Code it is `AskUserQuestion`: one question per call, `multiSelect: false`, a `header` of 12 characters or fewer ("Price", "Channel"), and 2–4 options whose first label ends with "(guess)". The tool adds "Other" itself. Without such a tool, write the question as text with numbered options:

  ```
  Video dekh ke log kya karein?
  Guess: WhatsApp karein (pichli baar yahi tha)
  1. WhatsApp karein  2. Call karein  3. Shop aayein  — ya kuch aur likh dein
  ```

- **Match the person's language.** Hinglish to Hinglish, Hindi (Devanagari) to Hindi, English to English. Copy their script: if they write Roman Hindi, reply in Roman Hindi.
- **Confirm back in one line, only when the answer changes a blocking essential:** "Theek hai: ₹299 per piece, 30 Nov tak." Never read back the whole brief mid-interview.

## 3. Client mode (one WhatsApp message)

Use it for blockers only the client knows. Write **one** message (`${CLAUDE_SKILL_DIR}/templates/client-whatsapp-questions.md`):
- in the client's language and script (profile `languages`; Roman Hinglish if unsure);
- a one-line greeting with the job in plain words ("Winter blanket offer video ke liye 2 cheezein confirm karni hain");
- **numbered questions, each with a guess**, so the client can reply "1 haan, 2 nahi, ₹249";
- at most 4 questions; blocking ones first;
- no jargon, no internal names (job ids, stage names), no phone numbers.

Then:
1. Save the brief with `status: awaiting-client`. Fill `client_questions` (`status: open`, `asked_at` from `get_now`). The storage layer mirrors them to `BriefQuestions`.
2. Set the job's `waiting_on: client` and `next_action`: "Brief: waiting for client reply (sent <date>): <assignee> to paste <client>'s answers to <n> questions." No gate yet. (Storage README §5.) The status board, the catch-up card and the Dashboard all show this line as is.
3. Give the message to the team member to send. We never send it ourselves.

**When a reply is pasted, read it as answers to brief questions only if this job's brief is `awaiting-client`.** Otherwise it's ordinary client feedback and not ours.

**Reading the reply:**

| Reply | Read as |
|---|---|
| "1 haan" / "1 ok" / "1 👍" / "theek hai" for one question | The guess for 1 is `confirmed` (basis: "client reply <date>") |
| "2 nahi" with no new value | Guess rejected, value unknown: still blocking. Ask one follow-up in the same thread, or ask the team. |
| A bare value: "₹249", "249 rs", "ढाई सौ" | Goes to the question whose field fits (price → `offer_detail.price`). Two possible fields → ask. |
| "15 tak", "agle hafte tak", "Diwali tak" | A date → `validity`, converted with the sheet clock's year. "agle hafte tak" → Sunday of next week, `guessed`, confirmed back in one line. |
| A voice-note transcript ("haan haan vo 249 wala hi rakho aur mahine ke end tak") | Pull each value out; match by meaning, not by order. |
| "Jaise pichli baar" | The value from the last client-approved job (`inference-rules.md` §5) |
| No answer to a question | Stays `open`. After the others are filled, it's still blocking → a reminder message (§5). |
| Something new ("aur 10% student discount bhi daalo") | Not asked: add it to the brief as a client-confirmed change and say so at the gate |

After reading: set each answered question's `status` to `answered` with `answer` and `answered_at`, fill the fields, bump the version with a changelog line ("client reply <date>"), set `waiting_on` back to `none`, and continue with the self-check.

## 4. Express mode

- Ask only the **Never** essentials that block. All of them go in **one** numbered message (team) or one client message: an urgent person would rather answer once.
- Everything else is `guessed` and listed. Say it in one line: "Jaldi mode: baaki sab guess kiya hai, gate pe check kar lena."
- Express never skips the self-check or the gate.

## 5. Waiting and reminders

- Client questions open longer than `config.client_question_reminder_hours` (default 24) show on the sheet Dashboard as "Brief: waiting for client reply". The job sits under "Waiting on client" on the status board.
- When someone opens the job after that time, offer a short reminder message in the client's language: "Namaste, winter offer video ke 2 sawal pending hain: 1) rate, 2) last date. Reply kar dein toh aaj video start ho jayega."
- Never invent an answer because the client is slow. The admin may decide to go ahead on the guesses; that is recorded as the admin's decision ("admin approved guess", `confirmed`).

## 6. Plain-language rules

- Write like a friendly agency person on WhatsApp: short sentences, one idea per question.
- **Never use jargon in a question.** Translate it:

| Don't say | Say |
|---|---|
| objective, KPI, goal | "Video dekh ke log kya karein?" / "Isse aapko kya chahiye: call, order ya shop visit?" |
| CTA | "End mein log kya karein: WhatsApp, call ya shop aayein?" |
| target audience, TG | "Ye video kiske liye hai?" |
| USP | "Aapki dukaan mein aisa kya hai jo doosron mein nahi?" |
| awareness | "Log aapka naam yaad rakhein" |
| funnel, conversion | (don't ask; infer it) |
| aspect ratio, format | "Reel, status ya post?" |
| duration | "Kitna lamba: chhota sa (15-20 sec) ya thoda detail (45 sec)?" |
| validity | "Offer kab tak chalega?" |
| proof point, testimonial | "Koi customer ki baat ya number jo hum dikha sakein?" |

- Accept messy answers: typos, mixed scripts, voice-note text, emojis, "same as last time". Map them with `layman-glossary.md`.
- Don't ask what the profile or research already says, and don't ask "anything else?" at the end.
