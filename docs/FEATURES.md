# Features

## Timer System

Status: active

Tracks active problem time, per-problem totals, and daily totals.
All daily boundaries use IST (Asia/Kolkata, UTC+5:30) to prevent off-by-one-day bugs.

## Problem Tracking

Status: active

Detects problem name and platform from supported websites.

## Problem History

Status: active

Shows recently worked problems in the popup, sorted by latest activity.

## Idle Detection

Status: active

CP-friendly idle detection. Pauses session accumulation after **15 minutes** of no meaningful
keyboard or click activity. This accommodates thinking time, paper solving, and external editor use.

Activity sources:
- `keydown` — actual typing
- `click` — intentional interaction
- `window focus` — tab regained (resumes immediately)
- `visibilitychange` — tab hidden triggers an early idle pause; tab visible resumes

Excluded events: `mousemove`, `scroll` (too noisy, cause false "active" signals).

## Coding Activity Heatmap

Status: active

Full-year GitHub/Codeforces contribution-style heatmap injected into the Productivity Analytics section
on the user's own Codeforces profile page.

- **Full-year view** — renders all 52+ weeks of the selected year (Jan 1 → Dec 31), Sunday-aligned
- **Year switching** — dropdown selector + ← / → navigation buttons to switch between years
- Cell color represents total coding time that day (5 intensity levels)
- Color scale: empty → light blue → medium blue → blue → dark blue (≥3h)
- Today's cell is highlighted with an outline ring
- Future days shown as inactive placeholders without hover/tooltip effects
- Hover tooltip shows formatted duration and date in a CSS tooltip balloon
- Data source: `dailyTotals` from local extension storage (IST-keyed)
- Dynamic month labels aligned with matching week columns
- Left column: weekday labels (Mon, Wed, Fri)
- Cell size: 12 × 12px (GitHub-accurate sizing)

## IST Timezone

Status: active

All date key generation, daily resets, streak logic, and heatmap dates use IST
(Asia/Kolkata, UTC+5:30) via `src/utils/timezone.js`.

Prevents off-by-one-day bugs for users whose machine clock is set to UTC or another timezone.

## Productivity Analytics

Status: active

Sourced from local extension timer state. Visible ONLY on the logged-in user's own Codeforces profile.

Current views:
- Daily coding time.
- Number of problems worked today.
- Most worked problem today.
- Codeforces profile page injection (own profile only).
- Platform distribution doughnut chart.
- Most worked problems pie chart.
- Last 7 days bar chart.
- Full-year coding activity heatmap with year selector.
- Recent problem history table.

## Analytics Visibility Toggles

Status: active

Two lightweight toggle checkboxes in the Productivity Analytics header:
- **Heatmap** — show/hide the heatmap section
- **Productivity** — show/hide the productivity charts section

Toggle state is persisted in `localStorage` and survives page reloads.

## Codeforces Competitive Analytics

Status: active

Sourced from the Codeforces public API (`user.status`). Visible on EVERY Codeforces profile page visited.
Shows analytics for whoever's profile is being viewed.

**Layout order (final):**
1. Rating Distribution bar chart (full width) — FIRST
2. Topic / Tag Distribution doughnut chart — SECOND
3. Solved Stats Cards (below graphs) — LAST

Current views:
- Problem Rating Distribution bar chart (colored by Codeforces rating tier).
- Topic / Tag Distribution doughnut chart with legend.
- Solved problem count badge in header.
- Solved stats cards: Total, Contest, Practice, Virtual, Gym, Rated.
- Loading and error states for API fetch.

Solve counting:
- Only counts submissions with `verdict === "OK"`.
- ALL participant types are counted: CONTESTANT, OUT_OF_COMPETITION, PRACTICE, VIRTUAL, MANAGER, SPECTATOR.
- **No normalized-name merging** — deduplication uses `contestId + index` as primary key.
- Gym solves: `contestId >= 100000`.
- Virtual solves: `participantType === "VIRTUAL"`.
- Practice solves: `participantType === "PRACTICE"`.
- Problems without a rating are excluded from the rating chart.

Deduplication key priority:
1. `contestId + index` (most reliable)
2. `problemsetName + index`
3. `contestId + name` (when index missing)
4. `name-exact-<name>` (exact, not normalized)
5. Hash fallback (last resort only)

## Hint System

Status: planned

## Recommendation System

Status: planned

## Sync System

Status: planned

## AI Integration

Status: planned
