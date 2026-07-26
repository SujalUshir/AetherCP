# Release Contents - AetherCP v1.2.0

This directory contains the production-ready distribution package of the AetherCP Chrome extension.
It includes only the files required at runtime for the extension to function.

## Validation Results
- **Manifest Syntax & Schema**: Valid (Version 3)
- **Runtime Dependencies**: Fully resolved (0 broken imports, 0 missing assets)
- **Files Verified**: 35 files copied successfully.

## Included Root Files
- `manifest.json`: Primary entry point/metadata.

## Included Folders
- `icons/`: Packaged subdirectory for extension runtime dependencies.
- `src/`: Packaged subdirectory for extension runtime dependencies.
- `src/background/`: Packaged subdirectory for extension runtime dependencies.
- `src/content/`: Packaged subdirectory for extension runtime dependencies.
- `src/modules/`: Packaged subdirectory for extension runtime dependencies.
- `src/modules/analytics/`: Packaged subdirectory for extension runtime dependencies.
- `src/modules/cph/`: Packaged subdirectory for extension runtime dependencies.
- `src/modules/problem-tracking/`: Packaged subdirectory for extension runtime dependencies.
- `src/modules/timer/`: Packaged subdirectory for extension runtime dependencies.
- `src/platform/`: Packaged subdirectory for extension runtime dependencies.
- `src/platform/codeforces/`: Packaged subdirectory for extension runtime dependencies.
- `src/popup/`: Packaged subdirectory for extension runtime dependencies.
- `src/services/`: Packaged subdirectory for extension runtime dependencies.
- `src/shared/`: Packaged subdirectory for extension runtime dependencies.
- `src/utils/`: Packaged subdirectory for extension runtime dependencies.
- `src/vendor/`: Packaged subdirectory for extension runtime dependencies.

## Why they were included:
- **manifest.json**: Extension configuration, declaring permissions, action popup, content scripts, background worker, and icons.
- **icons/**: Chrome extension icons in 16x16, 32x32, 48x48, and 128x128 sizes. Required for Chrome Web Store and toolbar UI.
- **src/popup/**: User interface that opens when the extension icon is clicked (popup.html, popup.css, popup.js).
- **src/background/**: Background service worker (background.js) coordinating analytics, idle timers, and CPH messaging.
- **src/content/**: Content scripts (content.js) tracking active problem solving on Codeforces and LeetCode.
- **src/platform/codeforces/**: Dashboard augmentation script and styles injected directly on Codeforces user profiles.
- **src/shared/**: Shared extension-wide configuration constants.
- **src/utils/**: Time and timezone calculation utilities.
- **src/vendor/**: Local dependency of Chart.js used to render profile analytics graphs offline.
- **src/modules/**: Modular features including session tracking (timer), CPH VS Code integration, and analytics storage.

## Intentionally Excluded Files and Folders
The following development-only resources were intentionally excluded to optimize release package size and comply with store policies:
- `website/`: Next.js landing page code.
- `testing/` & `testing-files/`: Local testing suites, snapshots, and tests workspace.
- `docs/` & `screenshot/`: Documentation guides, system design records, and repository media assets.
- `experiments/`: Prototype features and experimental coding trials.
- `logs/`: Local development environment log files.
- `.github/` & `.agents/`: CI/CD actions and AI agent workspace configuration.
- Root markdown files (`README.md`, `SECURITY.md`, `LICENSE`): Project repository documentation.
- Tooling files (`.gitignore`, `.gitattributes`, `scripts/`): Development configuration and packaging scripts.
