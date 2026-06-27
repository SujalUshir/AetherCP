# Source Code

This folder contains code that can eventually ship with the extension.

## Current Runtime Entrypoints

- `background/background.js` - Manifest V3 service worker.
- `content/content.js` - Website DOM detector.
- `popup/popup.html` - Popup page.
- `popup/popup.css` - Popup styles.
- `popup/popup.js` - Popup renderer.

## Growth Strategy

Keep entrypoint files small over time. Move reusable logic into:

- `modules/` for feature logic.
- `storage/` for storage helpers and migrations.
- `platform/` for site-specific detection.
- `utils/` for generic helpers.
- `services/` for cross-feature coordination.
- `debug/` for logging and diagnostics.
