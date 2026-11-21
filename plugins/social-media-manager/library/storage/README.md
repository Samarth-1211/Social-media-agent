# Storage layer

How skills save and read clients, jobs, team and config. **Filled in Prompt 2 (Group 1).**

Fixed rules already:
- Skills save data **only** through the operations described here. No skill contains backend-specific logic.
- Never write data inside the plugin folder (`${CLAUDE_PLUGIN_ROOT}`). It is replaced on every plugin update.
- Every record is validated against `library/contracts/*.schema.json` before saving.

See also `docs/STORAGE.md` in the repository.
