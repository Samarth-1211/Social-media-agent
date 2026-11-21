---
name: <skill-name>
description: <one line, third person, what it does + when to use it>
---
# <skill-name>

## Purpose
<!-- One or two sentences: what this skill is for and which stage(s) it runs. -->

## Reads
<!-- Contract fields this skill reads, exactly as declared in stages.yaml (`reads` + `optional_reads`).
     See ${CLAUDE_PLUGIN_ROOT}/library/contracts/stages.yaml -->

## Writes
<!-- Contract fields this skill writes + the schema file each follows, e.g.
     - brief → ${CLAUDE_PLUGIN_ROOT}/library/contracts/brief.schema.json -->

## Steps
<!-- Numbered, imperative. Point to files in this skill's references/, prompts/, templates/. -->
1.

## Quality bar
<!-- What good looks like. Which reference files and examples/ to follow. -->

## Gate
<!-- Who approves: admin | editor | client | none. What to show them, in what format. -->

## If it fails
<!-- What to do instead of guessing: which question to ask, which stage to send back to. -->
