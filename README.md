# AetherCP

AetherCP is a Chrome Extension for competitive programmers. It tracks problem-solving sessions, coding time, and eventually analytics, hints, recommendations, sync, and AI-assisted workflows.

## Current Stack

- Chrome Extension Manifest V3
- HTML, CSS, Vanilla JavaScript
- `chrome.storage.local`
- No backend yet
- No external frontend framework

## Project Map

- `manifest.json` - Chrome extension manifest.
- `src/` - Runtime extension source code.
- `docs/` - Product, architecture, debugging, storage, and planning docs.
- `ai/` - Prompts, LLM outputs, reasoning history, and implementation notes.
- `logs/` - Manual debugging logs and investigation notes.
- `experiments/` - Temporary ideas before they become real features.
- `backend/` - Reserved for future backend code.
- `ai-systems/` - Reserved for future local/cloud AI integrations.

Start every new development session by reading:

1. `docs/PRD.md`
2. `docs/ARCHITECTURE.md`
3. `docs/TASKS.md`
4. `docs/STORAGE_SCHEMA.md`
5. The latest file in `ai/implementation-notes/`
