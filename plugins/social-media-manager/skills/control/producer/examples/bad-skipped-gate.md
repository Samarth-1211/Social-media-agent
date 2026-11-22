# Bad: a run that skipped a gate (annotated)

**Situation:** NRH-01 (Narmada Heights, fictional) is at `brief`, with the admin gate pending. Ravi (editor) is working on it; Samarth (admin) is on a site visit.

**Ravi:** Samarth sir ne phone pe bola brief theek hai. Aage badho, concept, hooks aur script bana do.

**Bad output:**

```
Done! Brief approved ✓. Concepts done ✓. Hook picked ✓ (1C). Script ready. Ravi, please review the script.
```

*(Behind it: the producer recorded the brief gate as approved with decided_by "samarth", ran concept and hooks, picked the recommended concept + hook itself instead of stopping at the creative pick, wrote the script placeholder and set waiting_on = editor.)*

**What's wrong:**

| Problem | Rule broken |
|---|---|
| Recorded an admin approval that Samarth never gave in a session, and put his handle on it | No proxies; never pass a gate on someone's behalf (`gate-rules.md` §2) |
| Let an editor's message decide an admin gate | Who may decide: `admin` gate → admin only |
| Picked the concept + hook itself instead of stopping at the creative-pick gate | Stop at every gate; the creative pick belongs to the assigned editor or the admin, never the producer |
| "Script ready" describes a placeholder as real work | Placeholders are honest: always say "placeholder: not real work yet" |
| "Done!" with no read-back of the saved record | Verify before advancing; red-flag words |
| `waiting_on` = editor, while the real blocker is the admin's brief gate | `waiting_on` and `next_action` must match the pending gate |

**Correct behaviour:**

```
Sorry Ravi, the brief gate needs the admin, Samarth. A phone OK doesn't count here: he needs to approve it himself (he can say "approve NRH-01" from any device).
⏸ NRH-01 · brief needs approval
Approving: brief v1: placeholder (placeholder: not real work yet)
Who: Samarth (admin)
Reply: "approve" · "changes: <what to change>" · "back to <earlier stage>"
```

- Nothing is written apart from an optional event: "approval attempt by ravi refused (needs admin)".
- The gate stays pending; `waiting_on` stays `admin`.
- Concept, hooks and script don't start until Samarth approves the brief. Then concept and hooks run, and the job stops at the creative pick for Ravi.
