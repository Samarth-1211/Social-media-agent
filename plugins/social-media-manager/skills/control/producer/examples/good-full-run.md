# Good: a full quick-track video run with placeholders (condensed)

**Situation:** Shubh Laundry (SHL, fictional) already has an offer reel in the same style (SHL-01). Samarth (admin) starts a new reel; Ravi (editor) is assigned. Every stage after intake is a placeholder. The transcript is shortened: each reply shows only its key lines, and the storage calls are summarised in *italics*.

---

**Samarth:** Shubh Laundry ke liye winter blanket cleaning offer reel chahiye, 15% off, 10 Dec tak live.

**Producer:** *(list_clients → SHL; get_brand_brief SHL; list_jobs SHL; create_job → SHL-03; request v1 saved and read back; gate requested)*

```
⏸ SHL-03 · intake needs approval (Samarth, admin)
Shubh Laundry: Winter blanket cleaning 15% off reel (video) · Winter
Deliverables: Instagram reel 9:16 ~20s
Track: quick, because it's a repeat offer reel in their existing style, one language
Budget: 200 credits · Assignee: Ravi · Deadline: 10 Dec
Assumed: assignee Ravi (made SHL-01); budget is the video default 200
Reply: "approve" · "approve, full track / budget 150 / assign Pooja" · "changes: <note>"
```

**Samarth:** approve

**Producer:** *(intake gate approved by samarth (admin); request.track.chosen = quick; brief placeholder v1 written and read back; admin gate requested)*

```
✓ intake approved.
⏸ SHL-03 · brief needs approval
Approving: brief v1: placeholder (placeholder: not real work yet)
Who: Samarth (admin)
Reply: "approve" · "changes: <what to change>" · "back to <earlier stage>"
```

**Samarth:** approve → *(quick track: no concept stage; hooks runs for the client's last approved format and stops at the creative-pick gate, editor)* **Samarth:** QA → *(creative pick recorded by samarth (admin); script placeholder; editor gate. next_action: "Ravi to approve the script (placeholder) or request changes.")*

**Samarth:** I'm Ravi now.

**Producer:** Switched: you're Ravi (editor). *(event logged)*

**Ravi:** script approve

**Producer:** *(script approved by ravi (editor); client-script-approval opened. It has no outputs, so shown_outputs = {script: 1})*

```
⏸ SHL-03 · client-script-approval: waiting on the client (Neha ji)
To send: script v1 (placeholder: nothing real to send yet)
Ravi: send it to Neha ji, then paste their reply here:
  "client approved: <their message>"  or  "client feedback: <their message>"
```

**Ravi:** client approved: "haan theek hai, aage badhao"

**Producer:** *(client gate approved, decided_by ravi (editor), note "client (Neha ji): haan theek hai, aage badhao"; storyboard placeholder; editor gate)* **Ravi:** approve

**Producer:** *(clips: credit_spend, gate none. Budget check, then placeholder written, verified and closed automatically. Runs on to voice-music: credit_spend, editor gate)*

```
✓ storyboard approved.
Budget check (clips): 0 used + 0 estimated = 0 / 200 ✓ (placeholder, nothing generated)
✓ clips done (placeholder, no gate).
Budget check (voice-music): 0 used + 0 estimated = 0 / 200 ✓ (placeholder)
⏸ SHL-03 · voice-music needs approval
Approving: voiceover v1, music v1: placeholder (placeholder: not real work yet)
Who: Ravi (editor) or Samarth (admin)
Reply: "approve" · "changes: <what to change>" · "back to <earlier stage>"
```

**Ravi:** approve → qa-clips ⏸ → approve → assemble ⏸ → approve → captions-motion ⏸ → approve → finish ⏸ (admin)

**Ravi:** finish approve

**Producer:**

```
Sorry Ravi, the finish gate needs the admin, Samarth. I've left it pending; Samarth can say "approve SHL-03".
```

**Samarth:** I'm Samarth. approve

**Producer:** *(finish approved by samarth (admin); client-final-approval opened with shown_outputs {master: 1})* … **Samarth:** client approved: "perfect, post kar do" → *(delivery placeholder; admin gate)* **Samarth:** approve

**Producer:** *(delivery approved; status delivered, waiting_on none; read back)*

```
✓ SHL-03 delivered (hooks real; every later stage a placeholder, so nothing was produced).
Path: ✓intake ✓research ✓brief ✓hooks ✓script ✓client-script-approval ✓storyboard ✓clips ✓voice-music ✓qa-clips ✓assemble ✓captions-motion ✓finish ✓client-final-approval ✓delivery
Credits: 0 / 200
Next: Delivered on 22 Nov. Nothing pending.
```

---

**Why this is good**

| Behaviour | Rule |
|---|---|
| Every default (track, budget, assignee) is stated with its reason at the intake gate | Say defaults out loud |
| Each of the 12 gates on the path stopped and was recorded with the right owner role and decider | Stop at every gate |
| `clips` (gate none) ran on without asking, after a budget check | Keep going between gates |
| Ravi's attempt on the admin gate was refused, named Samarth, and left the gate pending | Who may decide |
| The client gate was recorded by the assignee, from the client's own words | Client gates |
| Every reply says "placeholder" | Placeholders are honest |
| Each move was read back before being reported | Verify before advancing |
