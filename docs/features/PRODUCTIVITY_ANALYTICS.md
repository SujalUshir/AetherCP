# Productivity Analytics

The AetherCP Productivity Analytics suite shows the logged-in user's own coding session history, daily stats, and activity heatmap directly on their Codeforces profile page.

This system is **only visible on the user's own profile** (`loggedInHandle === viewedHandle`). Visiting another user's profile shows no productivity data.

---

## 1. Timer and Session Tracking

**Trigger:** Timer starts automatically when the user opens a Codeforces or LeetCode problem page.

**Tracking scope:**
- One problem tracked at a time per browser tab
- When the active tab changes, the old session finalizes and the new one begins
- Time is stored as a `startedAt` timestamp; elapsed time is calculated on demand

**Idle pause:**
- After 15 minutes of no `keydown` or `click` activity, the session pauses
- Resuming activity starts a new session from the resume time
- The 15-minute threshold is CP-friendly — it accommodates thinking, paper solving, and external editor use

**Data source:** `chrome.storage.local` — keyed under `"aethercp"`

---

## 2. IST Daily Rollovers

All daily stats, heatmap dates, and streak calculations use **IST (Indian Standard Time, GMT+5:30)** as the canonical timezone.

This prevents off-by-one-day bugs for users whose machine clock is set to UTC or another timezone. At IST midnight, any active session time is credited to the previous day's total before the new day's counter starts.

---

## 3. Coding Activity Heatmap

The heatmap renders a full-year view of daily coding activity, styled similarly to GitHub's contribution graph.

**Layout:**
- Covers Jan 1 → Dec 31 of the selected year
- Sunday-aligned columns (first column = Sunday of the week containing Jan 1)
- 52–54 columns depending on the year's calendar
- Left column: weekday labels (Mon, Wed, Fri)
- Month labels aligned dynamically above the column where each month begins

**Year navigation:**
- Dropdown selector showing available years (minimum 2023)
- ← (previous year) and → (next year) navigation buttons
- Buttons are disabled at the minimum/maximum year boundary

**Cell appearance:**
- 12×12px cells, 2px gap
- `level-0` (no activity) → `level-4` (≥3 hours) using sequential blue intensity
- Today's cell is highlighted with an outline ring
- Future dates shown as inactive placeholders (no tooltip, reduced opacity)
- Hover tooltip: formatted duration and date (e.g. `2h 15m on Jun 10, 2026`)

**Data source:** `dailyTotals` from extension storage (IST YYYY-MM-DD keys)

---

## 4. Stat Cards

Displayed at the top of the productivity section:

| Card | Value |
|---|---|
| Total Time | Sum of all `problem.totalSeconds` + live session if active |
| Today's Time | `dailyTotals[today].totalSeconds` + live overlap if active |
| Current Streak | Consecutive IST days with any coding time |
| Most Worked Problem | Problem with highest `totalSeconds` (all time) |
| Current Platform | Platform with highest total coding time |
| Status | `Tracking` / `Idle` / `Stopped` |

---

## 5. Charts

Three Chart.js charts are rendered in the productivity section:

| Chart | Type | Data |
|---|---|---|
| Platform Distribution | Doughnut | Seconds per platform (CF vs LC) |
| Most Worked Problems | Bar (horizontal) | Top 6 problems by total seconds |
| Last 7 Days | Bar | `dailyTotals` for past 7 IST days |

Live session seconds are blended into all charts in real-time (refreshed every 10 seconds).

---

## 6. Recent Problem History

A table below the charts showing the most recently visited problems:

- Sorted by `lastSeenAt` descending
- Columns: Platform, Problem Name, Total Time
- Reflects all problems ever tracked (not just today)

---

## 7. Refresh Cycle

On the user's own profile, the productivity analytics section refreshes every **10 seconds** via `setInterval`. Each refresh:

1. Sends `GET_TIMER_SNAPSHOT` to background via `safeRuntimeMessage()`
2. Extracts analytics from the snapshot
3. Updates all stat card values in-place
4. Re-renders all three Chart.js charts

If the extension context is invalidated (e.g. after a reload), `safeRuntimeMessage()` catches the error and clears the interval immediately to stop the zombie loop.

---

## 8. Visibility Toggles

Three checkbox toggles control section visibility in the profile page header:

| Toggle | Controls | Persisted in |
|---|---|---|
| Heatmap | `#aetherHeatmapSection` | `localStorage["aethercp-toggle-heatmap"]` |
| Productivity | `#aetherProductivitySection` | `localStorage["aethercp-toggle-productivity"]` |
| CF Analytics | CF analytics root element | `localStorage["aethercp-toggle-cf-analytics"]` |

Toggle state survives page reloads. Sections are null-safe — toggles wire up even if sections haven't injected yet.
