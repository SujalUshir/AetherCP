# Architecture

## Runtime Principle

AetherCP uses a clear extension architecture:

- `content.js` detects what page/problem the user is on and manages idle detection.
- `background.js` owns state, timer sessions, tab events, and storage writes.
- `popup.js` only displays state returned by the background script.

This prevents timer logic from being scattered across files.

## Source Layout

- `src/background/` - Extension service worker entrypoint.
- `src/content/` - Platform page detection and idle tracking scripts.
- `src/popup/` - Popup HTML, CSS, and display logic.
- `src/modules/` - Feature-specific logic (timer, analytics, problem tracking).
- `src/services/` - Cross-feature services.
- `src/storage/` - Storage schema and helpers.
- `src/platform/` - Platform-specific selectors and injectors.
- `src/utils/` - Small reusable helpers (`time.js`, `timezone.js`).
- `src/debug/` - Debug helpers.

## Timezone Layer

All date/day operations in AetherCP use **IST (Asia/Kolkata, UTC+5:30)** as the canonical timezone.

**File:** `src/utils/timezone.js`

Exports:
- `getISTDate(timestamp?)` — Date object shifted to IST wall clock
- `getISTDateKey(timestamp?)` — YYYY-MM-DD string in IST
- `getISTTodayKey()` — today's IST date key
- `getISTStartOfDay(timestamp?)` — UTC timestamp of IST midnight
- `getISTNextDayStart(timestamp)` — UTC timestamp of next IST midnight

**File:** `src/utils/time.js`

All functions (`getDateKey`, `getTodayKey`, `getStartOfToday`, `getNextDayStart`) delegate to `timezone.js`. `timezone.js` MUST load before `time.js`.

**Why IST?** AetherCP is developed and used primarily in India. Using IST prevents off-by-one-day bugs when the machine clock is UTC or another timezone.

## Idle Detection

**File:** `src/content/content.js`

CP-friendly idle threshold: **15 minutes** (`IDLE_TIMEOUT_MS = 900000`).

Activity events registered:
- `keydown` — actual keyboard use
- `click` — intentional click interaction
- `window:focus` — tab regained focus (immediate resume)
- `document:visibilitychange` — tab hidden triggers early idle; tab visible resumes

Deliberately excluded: `mousemove`, `scroll` (too noisy for CP workflow).

Message protocol to background is unchanged: `USER_IDLE` / `USER_ACTIVE`.

## File Responsibilities

### content scripts

Use content scripts for:

- Reading the current website DOM.
- Detecting platform and problem name.
- Sending detected problem info to background.
- Watching for SPA page changes or delayed DOM loading.
- Tracking idle/active state via minimal event listeners.

Do not use content scripts for:

- Long-term timer state.
- Analytics calculations.
- Popup UI updates.

### background service worker

Use background for:

- Active session state.
- Tab switching behavior.
- Timer start/stop logic.
- Storage reads and writes.
- Data snapshots for popup.

### popup

Use popup for:

- Rendering the active problem.
- Rendering today time.
- Rendering current problem time.
- Sending read-only requests to background.

## Codeforces Profile Analytics — Two-System Architecture

AetherCP injects TWO architecturally separate analytics systems into Codeforces profile pages.

**Injection order:** CF Competitive Analytics (above) → Productivity Analytics (below, own profile only).

### System 1: Codeforces Competitive Analytics (CF API)

Source: `https://codeforces.com/api/user.status?handle=<handle>`

Injected on: every profile page visited, regardless of login state.

Files:
- `cfApi.js` — fetch and validate Codeforces API responses.
- `solvedProblemAnalytics.js` — deduplicate, build rating/tag distributions.
- `profileIdentity.js` — detect viewed handle (URL) and logged-in handle (DOM).
- `graphTemplates.js` — `getCFAnalyticsTemplate()`.
- `profileCharts.js` — `renderCFRatingChart()` and `renderCFTagChart()`.
- `profileInjector.js` — `injectCFAnalytics()`.

### System 2: Productivity Analytics (Timer State)

Source: local extension background state.

Injected on: **own profile only** — when `loggedInHandle === viewedProfileHandle`.

Contains:
- Stat cards (total time, today, streak, most worked problem).
- Platform doughnut, problems pie, last 7 days bar chart.
- **Coding activity heatmap** — full-year (52+ weeks), Sunday-aligned CSS grid with dynamic column count, year dropdown + nav buttons, sequential blue level colors, HTML/CSS tooltips, future-day placeholders.
- Recent problem history table.
- **Visibility toggles** — checkbox toggles for heatmap and productivity sections, state persisted in `localStorage`.

Files:
- `profileAnalytics.js` — extract analytics from snapshot (includes `dailyTotals`).
- `profileSections.js` — render stat cards, heatmap, history table.
- `graphTemplates.js` — `getAetherGraphTemplate()` (includes heatmap placeholder).
- `profileCharts.js` — `renderAetherProfileCharts()`.
- `profileInjector.js` — `injectAetherProfileAnalytics()`.

### Heatmap Rendering Flow

1. `injectAetherProfileAnalytics()` → `requestAetherSnapshot()`
2. `getAetherProfileAnalytics(snapshot)` extracts `dailyTotals` from `snapshot.state`
3. `createAetherProfileRoot(analytics)` calls `renderAetherHeatmap(root, analytics, selectedYear)`
4. `renderAetherHeatmap` computes Jan 1 and Dec 31 IST boundaries for the selected year
5. First cell = Sunday of the week containing Jan 1; last cell = Saturday of week containing Dec 31
6. Iterates all cells, looks up `dailyTotals[key]?.totalSeconds`, colorizes via `getHeatmapLevel(minutes)`
7. Grid column count = total weeks in that year's display (typically 53–54 columns)
8. Year navigation: `#aetherHeatmapYearSelect` dropdown + `#aetherYearPrev` / `#aetherYearNext` buttons
9. `initAetherYearNav()` in `profileInjector.js` wires the controls to re-call `renderAetherHeatmap`

Logs: `[AetherCP TIME]` for IST day key, `[AetherCP HEATMAP]` for cell generation.

### Profile Identity

`profileIdentity.js` exposes:
- `getViewedProfileHandle()` — from `window.location.pathname`
- `getLoggedInHandle()` — from Codeforces header DOM
- `isOwnProfile()` — case-insensitive comparison

## Communication Flow

1. `content.js` sends `PROBLEM_DETECTED`.
2. `background.js` stores tab/problem mapping.
3. `background.js` starts or stops sessions based on active tab.
4. `popup.js` sends `GET_TIMER_SNAPSHOT`.
5. `background.js` returns calculated live totals.

## Anti-Spaghetti Rules

- One feature should have one owning module.
- Popup should mostly render data.
- Background should coordinate, not become a junk drawer.
- Storage writes should go through storage helpers once the app grows.
- Platform selectors should live in `src/platform/`.
- CF API data must never mix with local timer data.
- All date keys use IST — never raw `new Date()` local methods.
