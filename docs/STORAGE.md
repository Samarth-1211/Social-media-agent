# Storage

_To be written in Prompt 2 (Group 1): the storage operations, the two backends (tracker page in the Claude app, local files in `.tdm-studio/`), how the backend is chosen, and export/import between them._

Facts already settled:
- **Never store data inside the plugin folder.** `${CLAUDE_PLUGIN_ROOT}` is replaced on every plugin update.
- **Bash commands can't see `${CLAUDE_PLUGIN_ROOT}`.** It is substituted in skill text, not set in their environment.
- **`.tdm-studio/` is git-ignored** in this repo. Client data is never committed here.
