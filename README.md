# AetherCP

A privacy-first, local-first browser extension for competitive programmers that tracks practice sessions, visualizes productivity statistics, and integrates with VS Code.

[![Manifest V3](https://img.shields.io/badge/Extension%20Platform-Manifest%20V3-blue.svg?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Commits](https://img.shields.io/badge/Commits-66-blueviolet.svg?style=flat-square)](https://github.com/SujalUshir/AetherCP/commits/main)
[![Contributors](https://img.shields.io/badge/Contributors-1-orange.svg?style=flat-square)](https://github.com/SujalUshir/AetherCP/graphs/contributors)

---

## Technical Overview

AetherCP is a Chrome and Microsoft Edge browser extension engineered specifically for competitive programmers. It automates training diagnostics by tracking solve times, generating granular performance metrics, and streamlining the edit-compile-test pipeline through direct integration with local editor receivers.

Unlike traditional coding trackers that rely on telemetry, centralized databases, and remote user accounts, **AetherCP is built on a strict local-first architecture**. All session logs, problem histories, and metadata remain sandboxed in the client's browser, eliminating external data dependencies and latency.

### Codebase Metrics
* **Lines of Code**: ~11,000+ lines of handwritten JavaScript and TypeScript (excluding vendor libraries)
* **Modular Components**: 18+ reusable modules (state management, session tracking, platform injectors)
* **Integration Interfaces**: 3 distinct API interfaces (Codeforces Public API, LeetCode DOM parsing, VS Code localhost socket bridge)
* **User Interfaces**: 12+ custom UI components (extension popups, injected charts, tooltips, selection selectors)
* **Documentation Pages**: 13 detailed developer guides and specifications

---

## Core System Features

### 1. Asynchronous Session Tracking
* **Automatic Detection**: Automatically initializes timer instances upon loading supported problem URLs on Codeforces and LeetCode.
* **Smart Idle Observer**: Features a custom-built 15-minute idle detection threshold (observing keydown/click actions, while deliberately ignoring noisy mousemove and scroll events) to accurately protect practice telemetry during offline thinking and paper-sketching sessions.
* **Midnight Partitioning**: Automatically partitions active sessions crossing the IST midnight boundary (GMT+5:30) to preserve date-key data consistency.

### 2. Dual-System Profile Analytics
AetherCP injects two decoupled diagnostic systems directly into Codeforces profiles:
* **Codeforces Competitive Analytics**: Fetches and processes up to 200,000 profile submissions using the Codeforces Public API. Visualizes unique rating distribution charts and tag-based topic spreads on any visited profile page.
* **Personal Practice Analytics**: (Logged-in profile only) Visualizes local timers, daily streaks, 7-day effort distribution charts, and a full-year Sunday-aligned activity heatmap.

### 3. VS Code CPH Automation
* **One-Click Export**: Sends parsed problem statements and test cases directly to the *Competitive Programming Helper* (CPH) receiver extension inside Visual Studio Code.
* **Zero-Touch Configuration**: Uses a local loopback server connection (`localhost:27121`) implementing the standard Competitive Companion protocol to transmit parsed inputs/outputs, memory/time limits, and compiler flags in milliseconds.

---

## Architecture

AetherCP implements a modular, event-driven Chrome Manifest V3 architecture with zero build steps or compilation overhead.

```
                  ┌─────────────────────────────────────┐
                  │        Chromium Browser Tab         │
                  └──────────────────┬──────────────────┘
                                     │
                     Loads supported problem page DOM
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │      Content Script (DOM/Idle)      │
                  └──────────────────┬──────────────────┘
                                     │
                 PROBLEM_DETECTED / USER_IDLE messages
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │      Background Service Worker      │
                  └──────┬───────────┬───────────┬──────┘
                         │           │           │
           Saves state   │           │           │ Requests live snapshot
                         ▼           │           ▼
  ┌───────────────────────────┐      │     ┌───────────┐
  │   chrome.storage.local    │      │     │  Popup UI │
  └───────────────────────────┘      │     └───────────┘
                                     │
                          POSTs Competitive Companion JSON
                                     ▼
                  ┌─────────────────────────────────────┐
                  │  VS Code CPH Receiver (:27121)      │
                  └─────────────────────────────────────┘
```

### Module Structure
```
manifest.json
src/
├── background/
│   └── background.js          # Service worker coordinator and message router
├── content/
│   └── content.js             # Content scripts for problem detection and idle observation
├── popup/
│   ├── popup.html             # Sandboxed popup user interface
│   ├── popup.css              # Custom styling definitions
│   └── popup.js               # Popup rendering and status checking engine
├── shared/
│   └── constants.js           # Shared message keys, limits, and port allocations
├── utils/
│   ├── timezone.js            # Asia/Kolkata (IST) canonical timezone wrapper
│   └── time.js                # Session partitioning and formatting utilities
├── modules/
│   ├── problem-tracking/      # Normalization keys and platform URL parsing rules
│   ├── analytics/             # Aggregation scripts for local telemetry
│   ├── timer/                 # Session lifecycle managers and retroactive idle recovery
│   └── cph/                   # Competitive Companion API client and port checker
├── platform/
│   ├── codeforces/            # DOM selectors and Chart.js injector scripts for CF profiles
│   └── leetcode/              # (Reserved platform hooks)
└── vendor/
    └── chart.umd.min.js       # Bundled Chart.js dependency for offline profile rendering
```

---

## Getting Started

### Prerequisites
A Chromium-based browser (Google Chrome, Microsoft Edge, Brave, Opera, etc.)

### Installation from Source

1. Clone this repository to your local directory:
   ```bash
   git clone https://github.com/SujalUshir/AetherCP.git
   ```
2. Open your browser's extension management page:
   * Chrome: Navigate to `chrome://extensions`
   * Edge: Navigate to `edge://extensions`
3. Toggle the **Developer mode** switch (top right corner).
4. Click on the **Load unpacked** button (top left corner).
5. Select the repository root folder containing `manifest.json`.

The AetherCP extension icon will now appear in your browser toolbar, ready for use.

---

## Screenshots

<div align="center">
  <h3>Interactive Extension Popup</h3>
  <img src="docs/images/vscode.png" width="800" alt="Popup view and VS Code CPH button state">
  
  <h3>Codeforces Competitive Analytics Dashboard</h3>
  <img src="docs/images/competitive.png" width="800" alt="Codeforces rating and tags visualization dashboard">
  
  <h3>Personal Practice Analytics & heatmaps</h3>
  <img src="docs/images/practice.png" width="800" alt="Full-year Sunday-aligned coding activity heatmap">
</div>

---

## Project Roadmap

* **Phase 1: Multi-Platform Augmentation**
  * Support AtCoder session tracking and profile injections.
  * Support CodeChef session tracking and contest analytics.
* **Phase 2: Data Portability & Backup**
  * Implement JSON and CSV telemetry export configurations.
  * Implement client-side configuration import pipelines.
* **Phase 3: Deep Customization**
  * Add configurable user idle timeout limits (currently fixed at 15 minutes).
  * Instate native light and dark styling variants.

---

## FAQ

#### How is data collected and transmitted?
It isn't. AetherCP does not execute any remote telemetry or tracking scripts. All problem timing records and heatmap statistics are stored inside your browser's `chrome.storage.local` sandbox. Only two network actions are ever performed: fetches to the public, read-only `codeforces.com/api/user.status` endpoint, and loopback POST requests to `localhost:27121`.

#### How does the idle timer accommodate pauses?
Competitive programming requires thinking, whiteboard work, and reading. To prevent skewing your session metrics, our content scripts observe page interactions (`keydown` and `click`). If no event fires for 15 minutes, state is retroactively paused back to the 15-minute point. Once a keypress or click occurs, tracking resumes instantly.

#### What permissions are required?
* `storage`: To persist session logs and user statistics.
* `tabs`: To check whether the currently active tab is timing a problem.
* `contextMenus`: To register the right-click "Open Problem in VS Code" actions.

---

## Contributing

Contributions are highly valued. To contribute:
1. Fork this repository.
2. Create a clean feature branch: `git checkout -b feature/your-feature-name`
3. Commit your documentation or style additions: `git commit -m "docs: improve description of XYZ"`
4. Push your changes: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Please read [SECURITY.md](SECURITY.md) before reporting security vulnerabilities.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
