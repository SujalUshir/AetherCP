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
7. Background returns calculated totals.

## Problem Switching Rule

Only one problem is actively timed at a time.

When the user switches to a different active problem:

- old session is finalized
- old problem total is updated
- today's total is updated
- new session starts

## Refresh Rule

Refreshing the same problem should not reset total time. The content script redetects the same problem, and background continues using the existing problem record.
