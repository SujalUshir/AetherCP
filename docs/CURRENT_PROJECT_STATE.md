# AetherCP — Current Project State

> Last updated: 2026-06-25
> Version: 1.2.0 (Manifest V3)
> This document reflects ONLY the current implementation. No planned features. No future architecture.

---

## 1. Current Architecture

AetherCP is a Chrome Manifest V3 extension. It has three runtime contexts that communicate via message passing:

```
content.js  ──PROBLEM_DETECTED──►  background.js  ◄──GET_TIMER_SNAPSHOT──  popup.js
            ──USER_IDLE──────────►
            ──USER_ACTIVE────────►
```

**content.js** — Injected into CF/LC problem pages and CF profile pages. Detects platform, problem name, and idle state. Never holds timer state.

**background.js** — Service worker. Owns all state. Handles tab events, session lifecycle, storage reads/writes. Imports all modules via `importScripts`.

**popup.js** — Renders only. Requests a snapshot from background every 1 second. Never modifies state.

**Profile scripts** — Injected into `codeforces.com/profile/*` pages. Render two independent analytics systems. Use `safeRuntimeMessage()` to communicate with background.

---

## 2. Source Layout

```
manifest.json
src/
├── background/
│   └── background.js          — Service worker entrypoint
├── content/
│   └── content.js             — Problem detection + idle tracking + CPH data extraction
├── popup/
│   ├── popup.html             — Popup UI (includes VS Code section)
│   ├── popup.css              — Popup styles (includes CPH button/status styles)
│   └── popup.js               — Popup renderer + CPH status/send logic
├── shared/
│   └── constants.js           — Shared constants (SEND_TO_CPH, GET_CPH_STATUS, CPH_PORT added)
├── utils/
│   ├── timezone.js            — IST date helpers (loaded before time.js)
│   └── time.js                — Date/overlap helpers (delegates to timezone.js)
├── modules/
│   ├── problem-tracking/
│   │   └── problemKeys.js     — getProblemKey(), normalizeUrl(), getPlatformShortName()
│   ├── analytics/
│   │   └── dailyAnalytics.js  — getDailyAnalytics()
│   ├── timer/
│   │   ├── sessionManager.js  — startSession(), stopSession(), switchSession()
│   │   ├── idleManager.js     — pauseForIdle(), resumeFromIdle(), checkAndApplyIdle()
│   │   └── timerSnapshot.js   — buildTimerSnapshot()
│   └── cph/                   — [NEW v1.2] Competitive Programming Helper integration
│       ├── cphClient.js       — sendToCph() — HTTP POST to localhost:27121
│       ├── cphPayloadBuilder.js — buildCphPayload() — Competitive Companion JSON
│       └── cphStatus.js       — checkCphReceiver() — 10s cached health check
├── platform/
│   ├── codeforces/
│   │   ├── profileIdentity.js       — getViewedProfileHandle(), getLoggedInHandle(), isOwnProfile()
│   │   ├── cfApi.js                 — fetchUserStatus() — Codeforces API client
│   │   ├── solvedProblemAnalytics.js — processCFSubmissions() — dedup + distributions
│   │   ├── graphTemplates.js        — HTML templates for CF and productivity panels
│   │   ├── profileAnalytics.js      — getAetherProfileAnalytics() — extract from snapshot
│   │   ├── profileSections.js       — Render stat cards, heatmap, history table
│   │   ├── profileCharts.js         — Render Chart.js charts (CF + productivity)
│   │   ├── profileInjector.js       — Orchestrate injection of both analytics systems
│   │   └── profileAnalytics.css     — Styles for all profile analytics
│   └── leetcode/                    — (reserved — no implementation)
├── vendor/
│   └── chart.umd.min.js            — Chart.js v4 (bundled locally, no CDN)
├── services/                        — (reserved — no implementation)
├── storage/                         — (reserved — no implementation)
└── modules/
    ├── ai/                          — (reserved — no implementation)
    ├── hints/                       — (reserved — no implementation)
    ├── recommendations/             — (reserved — no implementation)
    └── sync/                        — (reserved — no implementation)
```

---

## 3. Manifest Script Loading Order

### Content script 1 — CF + LC problem pages (excludes CF profile)
```
src/shared/constants.js
src/content/content.js
```

### Content script 2 — CF profile pages
```
src/vendor/chart.umd.min.js
src/shared/constants.js
src/utils/timezone.js
src/utils/time.js
src/platform/codeforces/profileIdentity.js
src/platform/codeforces/cfApi.js
src/platform/codeforces/solvedProblemAnalytics.js
src/platform/codeforces/graphTemplates.js
src/platform/codeforces/profileAnalytics.js
src/platform/codeforces/profileSections.js
src/platform/codeforces/profileCharts.js
src/platform/codeforces/profileInjector.js
[CSS] src/platform/codeforces/profileAnalytics.css
```

### Background service worker
```
src/shared/constants.js
src/utils/timezone.js
src/utils/time.js
src/modules/problem-tracking/problemKeys.js
src/modules/analytics/dailyAnalytics.js
src/modules/timer/sessionManager.js
src/modules/timer/idleManager.js
src/modules/timer/timerSnapshot.js
```

### Popup
```
src/shared/constants.js
src/utils/time.js
src/popup/popup.js
```

---

## 4. Active Features

### Timer System
- Tracks per-problem time across sessions, tab switches, and popup closes
- Session is stored as a `startedAt` timestamp — elapsed time calculated on demand
- No polling interval in background (MV3 service workers can sleep)
- Supports multiple problems across multiple tabs; only the active tab is timed
- Sessions split across IST midnight are attributed to the correct day

### Problem Detection
- **Codeforces**: `/problemset/problem/<id>/<index>`, `/contest/<id>/problem/<index>`, `/gym/<id>/problem/<index>`
- **LeetCode**: `/problems/<slug>/`
- Problem name read from DOM. MutationObserver watches for late-loading titles. Two retry timers at 1s and 3s ensure detection on SPA navigations.
- Pages like `/profile`, `/friends`, `/settings` receive no tracking.

### Idle Detection
- Threshold: **15 minutes** (CP-friendly — accommodates thinking, paper solving, external editors)
- Activity events tracked: `keydown`, `click`, `window:focus`, `document:visibilitychange`
- Events deliberately excluded: `mousemove`, `scroll` (too noisy for CP workflow)
- Tab hidden: idle timer continues running in background
- Tab visible: checks elapsed time; if idle threshold exceeded, marks as idle
- Idle state persisted in background storage so popup always reflects correct state

### Popup Display
- Active problem name and platform
- Current problem elapsed time (live, updates every 1s)
- Today's total coding time
- Today's stats: time, problems worked count, most-worked problem
- Recent problems list (last 5 worked, sorted by recency)
- **VS Code section** — CPH receiver status + Open in VS Code button (v1.2)

### CPH Integration — Competitive Programming Helper (v1.2)
- **Protocol:** Official Competitive Companion protocol — POST http://localhost:27121
- **Trigger 1:** Popup button "Open in VS Code"
- **Trigger 2:** Right-click context menu "Open Problem in VS Code (AetherCP)"
- **Sample extraction — Codeforces:** DOM-based from `.sample-test .input/output pre`
- **Sample extraction — LeetCode:** Best-effort text parsing from description container
- **Limits — Codeforces:** Time from `.time-limit`, memory from `.memory-limit`
- **Connection status:** Shown in popup; 10-second cached health check prevents localhost spam
- **Error handling:** Covers timeout (3s), refused, no problem, network failures
- **Context menu:** Created on `onInstalled`; only shown on CF/LC problem URLs

### Codeforces Competitive Analytics (CF API)
- Injected on **every** Codeforces profile page (own and others)
- Fetches `codeforces.com/api/user.status` — full submission history (paginated, up to 200,000)
- Renders: Problem Rating Distribution bar chart, Problem Topics Distribution pie chart, and solved count badge
- Solved count: only `verdict === "OK"` submissions, deduplicated by problem key

### Practice Analytics (Timer State)
- Injected on **own profile only** (`loggedInHandle === viewedHandle`)
- Source: local extension storage (background state)
- Renders: stat cards, last 7 days bar chart, heatmap, and recent problem history
- Refreshes every 10 seconds via `setInterval`

### Coding Activity Heatmap
- Full-year view (Jan 1 → Dec 31 of selected year), Sunday-aligned, 52–54 week columns
- Year selector dropdown + ← / → navigation buttons (min 2023, max current year)
- 5 color intensity levels: empty, <30m, <60m, <180m, ≥180m
- Today highlighted with outline ring; future days shown as inactive placeholders
- CSS tooltip on hover showing duration and date
- Data from `dailyTotals` in extension storage (IST-keyed)
- Dynamic month label alignment

### Profile Identity
- `getViewedProfileHandle()` — from URL pathname
- `getLoggedInHandle()` — from Codeforces header DOM (3 fallback strategies)
- `isOwnProfile()` — case-insensitive comparison

---

## 5. Runtime Flow

### Problem page flow (content → background)
```
1. content.js injected on CF/LC problem page
2. isSupportedTrackingPage() → true
3. watchForProblemTitle() → reads DOM → sendProblemInfo()
4. safeSendMessage(PROBLEM_DETECTED, { problemName, platform, url })
5. background: handleProblemDetected()
   → ensureProblemRecord() creates/updates problem record
   → state.tabProblems[tabId] = problem
   → if tab is active: switchSession()
   → saveState()
```

### Timer session lifecycle
```
Tab activated → background: handleActiveTabChanged()
  → checkAndApplyIdle() (retroactive idle check)
  → if tabProblems[tabId]: switchSession() → startSession()
  → else: stopSession()

switchSession():
  → if same problem + same tab: no-op (prevents duplicate starts)
  → else: stopSession() → startSession()

startSession():
  → state.activeSession = { tabId, problemKey, startedAt, lastActivityAt }

stopSession():
  → finalizeSession() → adds seconds to problem.totalSeconds + dailyTotals
  → state.activeSession = null
```

### Idle flow
```
content.js: No keydown/click for 15 min
  → sendIdleMessage() → USER_IDLE { idleStartedAt }
  → background: pauseForIdle()
    → finalizeSession(startedAt → idleStartedAt)
    → state.idleState = { tabId, problemKey, idleStartedAt }
    → state.activeSession = null

content.js: Activity detected (keydown/click)
  → sendActiveMessage() → USER_ACTIVE
  → background: resumeFromIdle()
    → startSession(tabId, problemKey)
    → state.idleState = null
```

### Popup snapshot flow
```
popup.js: setInterval(updatePopup, 1000)
  → sendMessage(GET_TIMER_SNAPSHOT)
  → background: getSnapshot()
    → checkAndApplyIdle() (retroactive check)
    → buildTimerSnapshot(state)
      → getDailyAnalytics() — today stats
      → getRecentProblemRows() — last 5 problems by recency
      → getPlatformDistribution(), getProblemTimeDistribution(), getLastSevenDays()
    → returns full snapshot object
  → popup.js: renderSnapshot() → update DOM
```

### CF profile analytics flow
```
profileInjector.js loaded on codeforces.com/profile/*
  → startAetherProfileInjector()
  → getViewedProfileHandle() + isOwnProfile()

Step 1 (always): injectCFAnalytics(handle)
  → inject CF analytics section DOM after native .roundbox
  → setCFLoading()
  → fetchUserStatus(handle) — paginated CF API calls
  → processCFSubmissions(submissions) — dedup + distributions
  → setCFReady()
  → renderCFRatingChart() + renderCFTopicChart()

Step 2 (own profile only): injectAetherProfileAnalytics()
  → safeRuntimeMessage(GET_TIMER_SNAPSHOT)
  → getAetherProfileAnalytics(snapshot)
  → createAetherProfileRoot(analytics) — injects DOM after CF section
  → renderAetherHeatmap() — full-year grid
  → renderAetherProfileCharts() — Chart.js charts
  → setInterval(injectAetherProfileAnalytics, 10000) — refresh every 10s
```

---

## 6. Timer System Design

### Why no background interval?
MV3 service workers can sleep. A `setInterval` in background is unreliable. Instead, AetherCP stores `startedAt` and calculates elapsed time on demand when popup requests a snapshot.

### Session splitting across midnight
`finalizeSession()` iterates from `startedAt` to `endedAt`, calling `getNextDayStart()` to split time across IST midnight boundaries. Each day's slice is credited to the correct `dailyTotals` entry.

### Retroactive idle detection
On every `getState()` → action cycle, `checkAndApplyIdle()` is called. If the active session's `lastActivityAt` is more than 15 minutes in the past (e.g. background woke up late), the session is retroactively finalized to `lastActivityAt + 15min`.

### Deduplication of problem records
`switchSession()` checks if `activeSession.problemKey === newProblemKey && activeSession.tabId === tabId` before switching. Refreshing the same problem page does not reset the timer.

---

## 7. IST Timezone Layer

All date key generation uses IST (Asia/Kolkata, UTC+5:30) to prevent off-by-one-day bugs.

**`timezone.js`** provides:
- `getISTDate(ts)` — Date shifted to IST wall clock
- `getISTDateKey(ts)` — YYYY-MM-DD in IST
- `getISTTodayKey()` — today's IST date key
- `getISTStartOfDay(ts)` — UTC timestamp of IST midnight
- `getISTNextDayStart(ts)` — UTC timestamp of next IST midnight

**`time.js`** wraps these:
- `getDateKey(date)`, `getTodayKey()`, `getStartOfToday()`, `getNextDayStart(ts)`
- Also provides: `getOverlapSeconds()`, `formatDurationShort()`

**Rule:** `timezone.js` must always be loaded before `time.js`.

---

## 8. Storage Schema

Storage key: `"aethercp"` — `chrome.storage.local`

```js
{
  version: 1,
  activeSession: {
    tabId: 123,
    problemKey: "codeforces:1234a - problem title",
    startedAt: 1749500000000,
    lastActivityAt: 1749500500000
  },
  idleState: {
    tabId: 123,
    problemKey: "codeforces:1234a - problem title",
    idleStartedAt: 1749500900000
  },
  tabProblems: {
    "123": { problemName: "...", platform: "Codeforces", url: "https://..." }
  },
  problems: {
    "codeforces:1234a - problem title": {
      problemKey: "codeforces:1234a - problem title",
      problemName: "1234A - Problem Title",
      platform: "Codeforces",
      url: "https://codeforces.com/problemset/problem/1234/A",
      totalSeconds: 480,
      firstSeenAt: 1749500000000,
      lastSeenAt: 1749500480000,
      sessions: [
        { startedAt: 1749500000000, endedAt: 1749500480000, seconds: 480 }
      ]
    }
  },
  dailyTotals: {
    "2026-06-10": { date: "2026-06-10", totalSeconds: 480 }
  }
}
```

**Conventions:**
- All durations stored as seconds (integers)
- All timestamps stored as Unix milliseconds (`Date.now()`)
- Daily keys use IST YYYY-MM-DD format
- Problem keys are lowercase: `platform:problemName`

---

## 9. CF Solved Problem Counting

### Counting rule
Only `verdict === "OK"` submissions are counted. No filtering on rating, contestId, participantType, or any other field.

### Deduplication key priority
1. `contestId + index` (most stable — e.g. `c1234-A`)
2. `problemsetName + index`
3. `contestId + exactName` (when index missing)
4. `exactName` only (last resort — no normalization)
5. Random hash (truly anonymous problem — never deduplicated)

### Participant type classification (diagnostics)
- `CONTESTANT` / `OUT_OF_COMPETITION` → contest solves
- `PRACTICE` → practice solves
- `VIRTUAL` → virtual solves
- `contestId >= 100000` → gym solves (regardless of participantType)
- `MANAGER`, `SPECTATOR`, `UNKNOWN` → other (still counted)

### API fetching
- Endpoint: `codeforces.com/api/user.status?handle=<handle>&from=<n>&count=10000`
- Paginates until all submissions fetched (page < 10,000 = last page)
- Safety cap: 20 pages (200,000 submissions max)
- **No caching** — fetched fresh on each profile page load

---

## 10. Current Known Issues

### 1. MV3 Context Invalidation
When the extension is reloaded (`chrome://extensions`), content scripts in open tabs become disconnected. Subsequent `chrome.runtime.sendMessage()` calls throw `Extension context invalidated`. AetherCP wraps all runtime calls in `safeSendMessage()` / `safeRuntimeMessage()` which catch this error and stop any active timers/intervals. A single console warning may still appear during reload.

### 2. Virtual + Mashup Problem Name Collisions
Gym and mashup contests (contestId >= 100000) often have generic problem indexes ("A", "B", etc.) shared with standard contest problems. AetherCP scopes these using `contestId` as part of the deduplication key (`c102345-A`), preventing cross-contest false merges.

### 3. IST Timezone Hardcoded
Daily resets and heatmap dates use IST (GMT+5:30) regardless of the user's local timezone. Users outside India may see their daily rollover at an unexpected local time.

### 4. Heatmap Horizontal Overflow on Narrow Screens
The full-year heatmap grid uses fixed 12×12px cells with 52–54 columns. On narrow browser windows or high zoom levels, the grid may overflow horizontally and trigger a scrollbar inside the analytics panel.

### 5. LeetCode Productivity Not Tracked on Profile
LeetCode problem timing works correctly, but there is no equivalent profile page injection for LeetCode. All productivity analytics are only visible on the Codeforces profile page.

### 6. Solved Count vs Official CF Count
AetherCP's solved count may differ from Codeforces' official displayed count due to:
- Deduplication logic (AetherCP counts unique problems, CF may count differently)
- API pagination cap (200,000 submissions max)
- Hidden contest results or processing delays
AetherCP logs a comparison summary in the console for debugging.

---

## 11. Current Limitations

- **No backend** — all data is local to the browser, not synced across devices
- **No export** — no way to export timer data or analytics as JSON/CSV
- **No LeetCode profile analytics** — LC time tracking works, but no profile injection
- **No AtCoder / CodeChef / other platforms** — CF and LC only
- **No streak system** — streak is calculated in `profileAnalytics.js` but not prominently displayed
- **No notifications** — no reminders, session end alerts, or daily goal notifications
- **Popup does not auto-refresh when closed** — only active while popup is open
- **No dark mode support** — extension popup and profile injection use fixed color scheme

---

## 12. Next Priorities

(Ordered by impact and feasibility)

1. **LeetCode profile analytics page** — parity with CF profile (time stats, heatmap, charts)
2. **Data export** — JSON/CSV download of `problems` and `dailyTotals`
3. **CHANGELOG update** — promote [Unreleased] → a proper versioned release
4. **Popup UI refresh** — current popup is functional but minimal; visual upgrade needed
5. **AtCoder support** — extend content.js and platform layer
6. **Streak prominence** — surface current streak more visibly in popup and profile

---

*End of document. This reflects the live codebase as of 2026-06-10.*
