# Timer System

## Goal

The timer must survive popup closing, tab switching, page refreshes, and popup reopening.

## Current Design

The background service worker is the source of truth.

It stores:

- Active tab id.
- Active problem key.
- Session start timestamp.
- Saved total seconds per problem.
- Saved total seconds per day.

Timer behavior is split into focused modules:

- `src/modules/timer/sessionManager.js` starts, stops, switches, and finalizes sessions.
- `src/modules/timer/idleManager.js` pauses and resumes sessions around idle state.
- `src/modules/timer/timerSnapshot.js` builds popup and Codeforces profile analytics snapshots.

`src/background/background.js` only routes messages, listens for tab events, reads/writes storage, and calls these modules.

## Why No Background Interval?

Manifest V3 service workers can sleep. A permanent timer loop is unreliable.

Instead, AetherCP stores `startedAt` and calculates elapsed time when needed.

## Flow

1. Content script detects problem.
2. Content script sends problem info to background.
3. Background records the problem for that tab.
4. Background starts a session if the tab is active.
5. When tab changes, background stops the old session and starts the new one.
6. Popup requests a snapshot every second.
7. Codeforces profile analytics requests the same snapshot when rendering charts.
8. Background returns calculated totals and derived analytics data.

## Problem Switching Rule

Only one problem is actively timed at a time.

When the user switches to a different active problem:

- old session is finalized
- old problem total is updated
- today's total is updated
- new session starts

## Refresh Rule

Refreshing the same problem should not reset total time. The content script redetects the same problem, and background continues using the existing problem record.

## Idle Rule

The content script listens for keyboard input, click events, window focus, and document visibility changes.

If no activity happens for 15 minutes:

- content sends `USER_IDLE`
- background finalizes the session up to the idle threshold
- timer accumulation pauses

When activity returns:

- content sends `USER_ACTIVE`
- background starts a new session for the paused problem

The popup does not control idle state. It only displays the snapshot returned by background.
