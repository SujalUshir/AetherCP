# AetherCP

AetherCP is a Chrome Extension (Manifest V3) for competitive programmers. It tracks problem-solving sessions and coding time on Codeforces and LeetCode, and injects rich analytics directly into Codeforces profile pages.

## Current Stack

- Chrome Extension Manifest V3
- HTML, CSS, Vanilla JavaScript
- `chrome.storage.local`
- Chart.js v4 (bundled locally — no CDN)
- No backend
- No external frontend framework

## Project Map

- `manifest.json` — Chrome extension manifest
- `src/` — Runtime extension source code
- `docs/` — Architecture, feature, debugging, storage, and project-state documentation
- `testing/snapshots/` — Captured Codeforces profile pages for offline DOM testing
- `testing-files/` — Self-contained, loadable copy of the extension for testing and store submission
- `ai/` — Prompt templates, LLM output templates, implementation note templates
- `logs/` — Manual debugging logs and investigation notes
- `experiments/` — Temporary ideas before they become real features
- `backend/` — Reserved for future backend code
- `ai-systems/` — Reserved for future local/cloud AI integrations

## Start Here

For a full picture of the current implementation, read:

1. `docs/CURRENT_PROJECT_STATE.md` — complete system overview (start here)
2. `docs/ARCHITECTURE.md` — architecture principles and file responsibilities
3. `docs/STORAGE_SCHEMA.md` — storage schema and naming rules
4. `docs/TIMER_SYSTEM.md` — timer design rationale
5. `docs/DEBUG_GUIDE.md` — debugging checklist and log prefixes

## Active Features

- Problem detection on Codeforces and LeetCode problem pages
- Session timer with idle detection (15-minute CP-friendly threshold)
- Popup showing active problem, today's time, and recent problem history
- Codeforces profile page analytics:
  - CF Competitive Analytics: rating distribution, tag distribution, solved stats (all profiles)
  - Productivity Analytics: heatmap, charts, problem history (own profile only)
