# Architecture

## Runtime Principle

AetherCP uses a clear extension architecture:

- `content.js` detects what page/problem the user is on.
- `background.js` owns state, timer sessions, tab events, and storage writes.
- `popup.js` only displays state returned by the background script.

This prevents timer logic from being scattered across files.

## Source Layout

- `src/background/` - Extension service worker entrypoint.
- `src/content/` - Platform page detection scripts.
- `src/popup/` - Popup HTML, CSS, and display logic.
- `src/modules/` - Feature-specific logic as the app grows.
- `src/services/` - Cross-feature services such as messaging or analytics orchestration.
- `src/storage/` - Storage schema, migrations, and storage helpers.
- `src/platform/` - Platform-specific selectors and parsers.
- `src/utils/` - Small reusable helpers.
- `src/debug/` - Debug helpers that can be reused across files.

## File Responsibilities

### content scripts

Use content scripts for:

- Reading the current website DOM.
- Detecting platform and problem name.
- Sending detected problem info to background.
- Watching for SPA page changes or delayed DOM loading.

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
- Future sync scheduling.

### popup

Use popup for:

- Rendering the active problem.
- Rendering today time.
- Rendering current problem time.
- Sending read-only requests to background.

Never put these in popup:

- Timer source of truth.
- Direct problem detection.
- Complex storage mutation.
- Platform-specific selectors.

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
- Every new feature gets a short feature spec before implementation.
