# Changelog

All notable changes to AetherCP should be recorded here.

## [Unreleased]

### Changed

- Refined Codeforces profile injection order to show the native profile, competitive analytics, heatmap, practice analytics, and recent history in that order.
- Polished the Codeforces rating and topics distribution charts with consistent cards, cleaner spacing, improved tooltips, and Codeforces-inspired colors.
- Simplified profile practice UI to remove platform/problem pie and doughnut charts, platform counters, solved stat cards, and visibility toggles while retaining the Codeforces topics pie chart.
- Reduced Recent Problem History on the Codeforces profile to the last 5 tracked rows with problem name, rating, time spent, and date solved columns.

## [1.1.0] - 2026-06-10

### Added

- Professional project folder structure.
- Documentation system.
- AI collaboration workspace.
- Source files moved under `src/`.
- Problem history in popup.
- Idle detection for timer pause/resume.
- Daily analytics in popup.
- Shared constants and lightweight feature modules.
- Timer logic refactored into session, idle, and snapshot modules.
- Codeforces profile page analytics injection.
- Local Chart.js-powered charts embedded into Codeforces profiles.
- Graph-template based Codeforces profile injection with visible canvas charts and custom legends.
- Codeforces Competitive Analytics: rating distribution bar chart and topic/tag doughnut chart
  injected into every Codeforces profile page, sourced from the Codeforces public API.
- Profile Identity module (`profileIdentity.js`): detects logged-in handle and viewed profile
  handle to gate productivity analytics to own profile only.
- Two-system analytics architecture: CF competitive analytics (public API) is fully separated
  from productivity analytics (local timer state).
- Productivity analytics gating: timer/session charts and history now only appear on the
  logged-in user's own profile.
- Codeforces rating tier colors on the rating distribution bar chart.
- Loading and error states for CF API fetch.
- **`src/utils/timezone.js`**: IST (Asia/Kolkata, UTC+5:30) date helpers — `getISTDateKey`,
  `getISTTodayKey`, `getISTStartOfDay`, `getISTNextDayStart`.
- **Coding activity heatmap**: 98-day Sunday-aligned CSS grid (14 columns × 7 rows) showing daily coding intensity on own profile page. Color-coded by time spent. Left column displays weekday labels (Mon, Wed, Fri), and months align dynamically above matching weeks. Premium CSS-based balloon tooltips appear on hover. Today's cell is highlighted with an outline ring. Future days are styled as disabled placeholders.
- **Gym & Mashup Deduplication**: Scopes problems in gyms and mashup contests by prepending `contestId` to generic names to avoid colliding names, ensuring accurate solved problem tracking.
- **Standardized Console Logging**: Enforces `[AetherCP API]` and `[AetherCP SOLVED]` logging prefixes for clean diagnostics.

### Changed

- Manifest paths now point to `src/background`, `src/content`, and `src/popup`.
- `profileInjector.js` orchestrates two independent injection flows.
- `graphTemplates.js` contains both `getCFAnalyticsTemplate()` and `getAetherGraphTemplate()`.
- `profileCharts.js` contains both CF chart functions and existing productivity chart functions.
- `profileAnalytics.css` extended with CF analytics, state, and heatmap styles.
- **`IDLE_TIMEOUT_MS` raised from 60 s to 900 s (15 min)** — accommodates CP thinking time.
- **Idle activity events reduced to `keydown` + `click`** — `mousemove` and `scroll` removed
  to avoid false "active" signals during reading/thinking.
- **Tab visibility awareness added** — hiding a tab triggers early idle; showing it resumes.
- **`profileAnalytics.js`** now exposes `dailyTotals` in the analytics object for heatmap.
- `time.js` now delegates all date/day operations to `timezone.js` IST helpers.
- `background.js` `importScripts` now loads `timezone.js` before `time.js`.

## [1.0.0] - Initial

### Added

- Manifest V3 extension.
- Popup UI.
- Content script problem detection.
- Background timer tracking.
