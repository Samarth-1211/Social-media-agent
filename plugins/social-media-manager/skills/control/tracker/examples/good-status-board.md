# Good: status board

**Input:** Samarth types "status" on 22 Nov 2026. The data is the sample data (`library/storage/tracker-page/sample-data.json`).

**Output:**

```
**TDM Studio · Sun 22 Nov** (3 open · 1 admin · 1 editor · 1 client · 1 overdue)

**Waiting on admin (1)**
- NRH-01 · Navratri site-visit offer reel · Narmada Heights Developers · brief · Ravi · due 5 Dec

**Waiting on editor (1)**
- SHL-01 · Diwali curtain & sofa cleaning offer reel · Shubh Laundry & Dry Clean · script · Ravi · due 25 Nov

**Waiting on client (1)**
- SHL-02 · Wedding season saree dry-clean poster · Shubh Laundry & Dry Clean · client-poster-approval · Pooja · due 20 Nov · OVERDUE

You have 1 gate waiting (NRH-01 brief): say "approve NRH-01" to producer.
```

**Why it's good:**
- Every open job appears once, in the group of its `waiting_on`.
- SHL-02 is marked overdue: 20 Nov is before 22 Nov, India time.
- It shows names (Ravi, Pooja), not handles.
- The nudge is specific to the person asking: Samarth is the admin.
- No credits or log detail. That's what the catch-up card and the credits view are for.
