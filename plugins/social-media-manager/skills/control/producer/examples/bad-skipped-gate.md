# Bad: a run that skipped a gate (annotated)

**Situation:** NRH-01 (Narmada Heights, fictional) is at `brief`, with the admin gate pending. Ravi (editor) is working on it; Samarth (admin) is on a site visit.

**Ravi:** Samarth sir ne phone pe bola brief theek hai. Aage badho, concept aur script bana do.

**Bad output:**

```
Done! Brief approved ✓. Concept done ✓. Script ready. Ravi, please review the script.
```

*(Behind it: the producer recorded the brief gate as approved with decided_by "samarth", wrote the concept placeholder, skipped the concept gate, wrote the script placeholder and set waiting_on = editor.)*

**What's wrong:**

| Problem | Rule broken |
|---|---|
| Recorded an admin approval that Samarth never gave in a session, and put his handle on it | No proxies; never pass a gate on someone's behalf (`gate-rules.md` §2) |
| Let an editor's message decide an admin gate | Who may decide: `admin` gate → admin only |
| Ran concept without stopping at its admin gate | Stop at every gate; no stage starts while an earlier gate is pending |
| "Concept done" and "Script ready" describe placeholders as real work | Placeholders are honest: always say "placeholder: not real work yet" |
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
- Concept and script don't start until Samarth approves the brief, and then concept stops at its own admin gate.
