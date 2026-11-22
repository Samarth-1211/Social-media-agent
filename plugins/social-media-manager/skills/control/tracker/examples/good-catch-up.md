# Good: catch-up card

**Input:** in a new session, Ravi says "continue SHL-01" (sample data, 22 Nov 2026).

**Output:**

```
**SHL-01 · Diwali curtain & sofa cleaning offer reel** (Shubh Laundry & Dry Clean, video, quick track)
Now: script · waiting on Ravi (editor)
Last done: hooks by Ravi, 15 Nov, 12:44
Recent:
- 15 Nov, 12:40 concept approved by samarth (admin).
- 15 Nov, 12:44 hooks (creative pick) approved by ravi (editor): QA, backups QC and QE.
- 15 Nov, 12:45 script placeholder written; waiting on editor (ravi).
Credits: 0 / 200
Deadline: 25 Nov
Next: Ravi to approve the script (placeholder) or request changes.

You're the approver for this gate. producer takes it from here: "approve" or "changes: <note>".
```

**Why it's good:**
- **Now** comes from `current_stage` + the pending script gate (`owner_role` editor → the assignee, Ravi).
- **Last done** is the latest `stage_history` entry with status `done` (hooks: the creative pick).
- **Recent** is the last 3 log lines, newest last.
- **Next** is copied word for word.
- The placeholder is called a placeholder.
- It hands acting on the job over to `producer`; the tracker doesn't approve anything itself.
