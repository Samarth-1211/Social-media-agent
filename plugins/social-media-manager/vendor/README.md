# vendor/

Borrowed third-party material: prompts, references, scripts or skills from other repositories. It is kept separate so we always know what isn't ours.

## Rules

1. **Read the original fully first.** Know what every file does before copying anything.
2. **Check its licence.** No licence means no copying; take ideas only. Note any attribution or share-alike terms.
3. **Copy from a pinned commit only.** Never from a moving branch. Layout: `vendor/<source-name>/<files>`.
4. **Record it in `../ATTRIBUTION.md`:** what, where, source URL, commit hash, licence. Include the original `LICENSE` file in the vendored folder.
5. **Never edit vendored files.** Adapt them in our own skill (its `references/` or `prompts/`) and point back to the vendored original. To update, re-copy from a newer pinned commit and update `ATTRIBUTION.md`.

Material that only inspired our own writing (nothing copied) needs no vendoring. Credit it in the skill's `CHANGELOG.md`.
