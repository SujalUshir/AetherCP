# Feature Architecture Plan

This is the practical long-term shape for AetherCP features.

## Timer System

Owner: `src/modules/timer/`

Entrypoint today: `src/background/background.js`

Responsibilities:

- active session start/stop
- elapsed time calculation
- daily total calculation
- timer snapshot generation

Storage:

- `activeSession`
- `problems`
- `dailyTotals`

## Problem Tracking

Owner: `src/modules/problem-tracking/`

Platform code: `src/platform/`

Responsibilities:

- problem identity
- platform name
- normalized URL
- stable `problemKey`

## Analytics

Owner: `src/modules/analytics/`

Responsibilities:

- summarize local storage
- calculate daily/weekly/monthly stats
- prepare popup/dashboard display data

## Hint System

Owner: `src/modules/hints/`

Responsibilities:

- store hint requests
- manage hint levels
- avoid spoiling full solutions too early

## Recommendation System

Owner: `src/modules/recommendations/`

Responsibilities:

- select next practice problems
- use history and weak areas
- explain why a problem was recommended

## Sync System

Owner: `src/modules/sync/`

Responsibilities:

- export local data
- import data
- future cloud sync
- conflict handling

## AI Integration

Owner: `src/modules/ai/`

Development memory: root `ai/`

Responsibilities:

- prompt runtime AI systems
- summarize practice
- generate study plans
- explain mistakes

## Rule For Adding A Feature

Before coding:

1. Add or update a feature spec in `ai/feature-specs/`.
2. Add tasks to `docs/TASKS.md`.
3. Decide storage changes in `docs/STORAGE_SCHEMA.md`.
4. Implement in the smallest owning module.
5. Update `docs/CHANGELOG.md`.
