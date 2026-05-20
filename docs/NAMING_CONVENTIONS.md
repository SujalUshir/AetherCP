# Naming Conventions

## Files And Folders

- Use kebab-case for folders: `problem-tracking`, `bugfix-sessions`.
- Use kebab-case for docs: `timer-refactor-notes.md`.
- Use camelCase for JavaScript variables and functions.
- Use PascalCase only for future class names or constructor functions.

## JavaScript

```js
const problemName = "Two Sum";
function getProblemInfo() {}
function startProblemSession() {}
```

## Storage Keys

- Root key: `aethercp`
- Object keys: camelCase
- Stable ids: lowercase strings with `platform:name`

Examples:

```js
activeSession
dailyTotals
problemKey = "leetcode:two-sum"
```

## Message Types

Use uppercase snake case:

```js
PROBLEM_DETECTED
GET_TIMER_SNAPSHOT
```

## Branch Names

```txt
feature/timer-system
feature/problem-analytics
fix/leetcode-title-detection
docs/ai-workflow
experiment/local-hints
```

## Commit Messages

Use short imperative commits:

```txt
Add timer storage schema
Fix LeetCode problem title detection
Document AI collaboration workflow
Move popup files into src
```
