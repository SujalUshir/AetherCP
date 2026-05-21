# Codeforces Profile Analytics

AetherCP enhances Codeforces profile pages directly.

Target URL:

```txt
https://codeforces.com/profile/<handle>
```

## Files

- `src/platform/codeforces/profileInjector.js` - orchestration and DOM mount
- `src/platform/codeforces/graphTemplates.js` - injected graph HTML and canvas sections
- `src/platform/codeforces/profileAnalytics.js` - prepares profile-specific analytics view data
- `src/platform/codeforces/profileSections.js` - builds overview cards and history table
- `src/platform/codeforces/profileCharts.js` - renders Chart.js charts
- `src/platform/codeforces/profileAnalytics.css` - injected page styling

## Flow

1. User opens a Codeforces profile page.
2. Manifest loads the profile-only content scripts.
3. `profileInjector.js` appends the graph template into the Codeforces page DOM.
4. `profileInjector.js` requests `GET_TIMER_SNAPSHOT` from background.
5. Background returns analytics derived from `chrome.storage.local`.
6. `profileSections.js` fills overview cards and history rows.
7. Chart.js renders visual analytics on the injected canvas elements.

## Charts

- Platform distribution: doughnut chart
- Most worked problems: pie chart
- Daily time distribution: bar chart for the last 7 days

Each circular chart has a custom legend beside the canvas so chart data is visible even before hovering.

## DOM Strategy

The injector mounts into `#pageContent` when available, falling back to `.content-with-sidebar` or `document.body`.

It uses a stable root id:

```txt
aethercp-profile-analytics
```

This prevents duplicate injection.
