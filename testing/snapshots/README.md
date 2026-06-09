# Testing Snapshots

This directory contains captured Codeforces profile page HTML files used for offline development and testing.

## Files

- `profile.html` — Captured Codeforces profile page (own profile view)
- `tourist.html` — Captured Codeforces profile page (tourist/other user view)

## Usage

Open these files directly in the browser for:

- DOM selector testing without hitting the live Codeforces site
- Offline injection debugging (`profileInjector.js`, `profileSections.js`)
- CSS layout testing (`profileAnalytics.css`)
- Regression testing after changes to the profile analytics pipeline

## How to Use

1. Load the extension in `chrome://extensions` (Developer mode, Unpacked)
2. Open `profile.html` or `tourist.html` as a local file in Chrome
3. Because the file is local, content scripts will NOT auto-inject — use DevTools console to manually call injection functions

## Note

These snapshots are NOT part of the extension build. They are development aids only and should not be included in store submissions.
