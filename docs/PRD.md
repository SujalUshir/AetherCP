# Product Requirements Document

## Product

AetherCP helps competitive programmers understand their practice behavior by tracking problem sessions, time spent, platforms used, and future learning signals.

## Target User

Students and competitive programmers who solve problems on platforms like Codeforces and LeetCode and want lightweight practice tracking without manual logging.

## Core Goals

- Detect active coding problems automatically.
- Track time per problem.
- Track total coding time per day.
- Preserve local history using `chrome.storage.local`.
- Keep the extension simple, fast, and beginner-friendly.

## Current Scope

- Chrome Extension only.
- Manifest V3.
- Popup display.
- Content script problem detection.
- Background script timer/session logic.
- Local-only storage.

## Future Scope

- Codeforces profile analytics injection.
- Problem recommendation system.
- Hint system.
- Cloud sync.
- AI-assisted review and practice planning.

## Non-Goals For Now

- No React.
- No TypeScript.
- No backend.
- No external libraries.
- No user accounts.

## Success Criteria

- Timer survives popup close, tab switches, and refreshes.
- Timer tracks each problem separately.
- Storage remains understandable and easy to debug.
- Future LLM sessions can understand the project quickly.
