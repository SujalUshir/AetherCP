# GitHub Workflow

This is a practical solo workflow for a serious student project.

## Branches

- `main` should stay stable.
- Use feature branches for new work.
- Use fix branches for bugs.
- Use docs branches for documentation-only changes.

Examples:

```txt
feature/timer-system
fix/timer-refresh-reset
docs/project-structure
experiment/hint-engine
```

## Commit Style

Commit small, understandable chunks:

- One architecture change.
- One feature step.
- One bug fix.
- One documentation update.

Good commits:

```txt
Move extension files into src
Add storage schema documentation
Fix active session stop on tab close
```

## Release Versions

Use simple semantic versions:

- `0.1.0` first usable local version
- `0.2.0` analytics added
- `0.3.0` hints added
- `1.0.0` stable public version

Update these together:

1. `manifest.json`
2. `docs/CHANGELOG.md`
3. release notes in `docs/releases/`

## Pull Requests Even When Solo

For larger changes, open a PR to yourself. It creates a review checkpoint and a clean place to paste LLM summaries.

PR template:

```md
## What changed

## Why

## How tested

## LLM assistance used

## Follow-up tasks
```
