# AI Collaboration Workflow

Use this system when working with ChatGPT, Codex, Claude, Gemini, or other LLMs.

## Golden Rule

Do not let generated code become the only record of why a decision was made.

Save:

- Prompt
- Useful output
- Final manual edits
- Architecture decision
- Follow-up bugs

## Folder Usage

- `ai/prompts/` - Prompts you gave to LLMs.
- `ai/outputs/` - Useful generated responses.
- `ai/reasoning-history/` - Summaries of important reasoning.
- `ai/implementation-notes/` - What actually changed in the code.
- `ai/bugfix-sessions/` - Debug sessions with symptoms, attempts, and results.
- `ai/feature-specs/` - Feature-specific specs before implementation.

## Session Naming

Use date plus topic:

```txt
2026-05-21-timer-refactor.md
2026-05-21-project-structure.md
2026-05-22-leetcode-bugfix.md
```

## Context Packet For New LLM Session

Paste this at the start of a new model session:

```md
Project: AetherCP
Stack: Chrome Extension MV3, HTML/CSS/Vanilla JS, chrome.storage.local
Read these docs first:
- docs/PRD.md
- docs/ARCHITECTURE.md
- docs/TASKS.md
- docs/STORAGE_SCHEMA.md
- docs/TIMER_SYSTEM.md

Current goal:

Important constraints:
- No React
- No TypeScript
- No backend yet
- Beginner-friendly modular JavaScript
```
