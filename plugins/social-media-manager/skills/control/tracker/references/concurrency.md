# Writing safely: team, config, import

The tracker writes only team members, config and imports, and only for the admin. Every write follows the storage rules in `${CLAUDE_PLUGIN_ROOT}/library/storage/README.md` §3. This page is the tracker's checklist.

## The six steps

1. **Read** the current row (Team member, Config) or the target sheet (import).
2. **Show the change** as before → after, one line per field. For import, show counts and the conflict list.
3. **Confirm.** Wait for the admin's yes. If the person isn't the admin, refuse: "Only the admin (Samarth) can change <team/config/data>." Don't write.
4. **Re-read just before writing.** Compare `version` and `updated_at` with step 1, and compare the exact cells you'll overwrite.
   - **Unchanged:** go on.
   - **Changed in fields you aren't touching:** keep their change, apply yours, and say so.
   - **Changed in the same fields:** stop. Show both values and ask which wins.
5. **Write** the whole row, with `version` + 1 and `updated_at` = now (India time ISO). Use the cell rules in `${CLAUDE_PLUGIN_ROOT}/library/storage/google-sheets.md` §2: an apostrophe before text, numbers and booleans as they are.
6. **Read back** and confirm the row now shows the new values. Report "Saved" only after this.

## Team changes

- **Adding someone:** they need name, role (`admin`, `editor` or `designer`) and email.
  - The handle is lowercase with hyphens; it must not clash with an existing one.
  - Offer to share the TDM Studio folder (`setup.md` §4) and ask first.
- **Removing someone:** set `active` to false; never delete the row, because old jobs refer to the handle. If they have open jobs, list them and ask who takes them over (`producer` reassigns them).
- **There must always be at least one active admin.**

## Conflict message (use when step 4 finds a clash)

```
Someone changed <record> since I read it.
  Field: <field>
  Yours: <your value>
  Now in the sheet: <their value> (updated <time>)
Which should stay?
```

## History never shrinks

When reading any job, if its Gates or StageHistory row count is lower than you saw earlier this session, stop and report: "Rows are missing for <job> since my last read; someone may have deleted or overwritten them. Please check the sheet's version history (File → Version history)."
