# AetherCP

> A privacy-first Chrome extension for competitive programmers that tracks your Codeforces and LeetCode sessions, visualises your productivity, and integrates with VS Code — all without a backend.

[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blue)](https://developer.chrome.com/docs/extensions/mv3/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## What is AetherCP?

AetherCP is a Chrome / Edge browser extension that helps competitive programmers track their coding sessions, analyse their practice habits, and solve problems more effectively.

Everything runs locally — no accounts, no servers, no data leaving your browser.

---

## Features

| Feature | Description |
|---|---|
| **Session Timer** | Automatically starts/stops timing when you visit a problem page. Idle-aware — pauses after 15 minutes of inactivity |
| **Problem History** | Tracks every problem you've worked on, including time spent and rating |
| **Today's Analytics** | Shows today's total coding time, problems worked on, and most-worked problem |
| **Heatmap** | GitHub-style activity heatmap injected into your Codeforces profile |
| **Competitive Analytics** | Rating distribution, tag distribution, and problem-solving stats on any Codeforces profile |
| **Productivity Analytics** | Detailed personal analytics — daily trends, session breakdowns — on your own profile |
| **VS Code Integration** | Send the current problem's sample test cases to VS Code via the CPH extension (optional) |
| **Right-click to Open** | Context menu "Open in VS Code" on supported problem pages |

**Supported Platforms:** Codeforces, LeetCode

---

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open `chrome://extensions` (or `edge://extensions`)
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the repository root folder

The extension icon will appear in your toolbar.

### From the Chrome Web Store / Edge Add-ons

> Store listing coming soon.

---

## Screenshots

| Popup | Codeforces Profile |
|---|---|
| *(coming soon)* | *(coming soon)* |

---

## Architecture

AetherCP is a pure Manifest V3 extension — no build step, no bundler, no backend.

```
manifest.json          — Extension configuration
src/
  background/          — Service worker (timer logic, message routing)
  content/             — Content script (problem detection, test extraction)
  popup/               — Extension popup (HTML + CSS + JS)
  shared/              — Shared constants
  modules/
    timer/             — Session management, idle detection, snapshots
    analytics/         — Daily analytics computation
    cph/               — CPH/VS Code integration (optional)
    problem-tracking/  — Problem key generation
  platform/
    codeforces/        — Profile page injection, API client, chart rendering
    leetcode/          — (Planned)
  utils/               — Time formatting, timezone utilities
  vendor/              — Bundled Chart.js v4 (MIT)
docs/                  — Architecture, feature, and debugging documentation
testing/               — Offline DOM snapshots for development testing
```

---

## Tech Stack

| Component | Technology |
|---|---|
| Extension platform | Chrome / Edge (Manifest V3) |
| Language | Vanilla JavaScript (ES2020) |
| Styling | Vanilla CSS |
| Charts | [Chart.js v4.4.7](https://www.chartjs.org/) — bundled locally (MIT) |
| Storage | `chrome.storage.local` |
| Backend | None |
| CDN | None |

---

## Privacy

AetherCP is **local-first** and **privacy-first**:

- All data is stored in `chrome.storage.local` — it never leaves your browser
- No accounts or sign-up required
- No analytics or telemetry
- No third-party SDKs
- Only two external network endpoints are used:
  - `https://codeforces.com/api/` — the **public** Codeforces API (same data your browser loads anyway)
  - `http://localhost:27121` — the CPH VS Code receiver, **local only, user-initiated, optional**

See [SECURITY.md](SECURITY.md) for the full privacy and security documentation.

---

## Data Stored

All data is stored **locally** in `chrome.storage.local`:

- Problem sessions (name, platform, URL, timestamps, time spent)
- Daily coding totals
- Cached Codeforces problem ratings (24-hour TTL)

Nothing is uploaded, synced, or shared.

---

## Documentation

| Document | Description |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture principles and file responsibilities |
| [STORAGE_SCHEMA.md](docs/STORAGE_SCHEMA.md) | Storage schema and naming rules |
| [TIMER_SYSTEM.md](docs/TIMER_SYSTEM.md) | Timer design and idle detection rationale |
| [DEBUG_GUIDE.md](docs/DEBUG_GUIDE.md) | Debugging checklist and log prefix conventions |
| [FEATURES.md](docs/FEATURES.md) | Feature descriptions |
| [ROADMAP.md](docs/ROADMAP.md) | Planned features |
| [CHANGELOG.md](docs/CHANGELOG.md) | Version history |
| [CPH_INTEGRATION.md](docs/features/CPH_INTEGRATION.md) | VS Code / CPH integration guide |
| [SECURITY.md](SECURITY.md) | Security and privacy documentation |

---

## VS Code Integration (Optional)

AetherCP integrates with [Competitive Programming Helper (CPH)](https://github.com/agrawal-d/cph) via the Competitive Companion protocol.

**Setup:**

1. Install the [CPH extension](https://marketplace.visualstudio.com/items?itemName=DivyanshuAgrawal.competitive-programming-helper) in VS Code
2. Open a `.cpp` or `.py` file in VS Code so CPH activates
3. Navigate to a Codeforces or LeetCode problem in your browser
4. Click **Open in VS Code** in the AetherCP popup, or right-click and select **Open Problem in VS Code (AetherCP)**

CPH must be running locally. The extension works fully without it.

---

## Roadmap

- [ ] AtCoder support
- [ ] CodeChef support
- [ ] Auto-send problems to VS Code on detection
- [ ] Options page (custom idle timeout, port configuration)
- [ ] Light / dark theme toggle
- [ ] Export session history as CSV

---

## Contributing

Contributions are welcome. Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request with a clear description

For security vulnerabilities, see [SECURITY.md](SECURITY.md).

---

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.
