# Security & Privacy Policy

AetherCP is designed from the ground up to be **local-first**, **privacy-first**, and **transparent**. This document describes exactly what data the extension handles, what network requests it makes, and what permissions it uses.

---

## Security Philosophy

AetherCP follows these principles:

- **Local-first**: All data is stored in the browser, on the user's machine. Nothing is uploaded to any server.
- **Minimal permissions**: Only the permissions strictly required for the extension to function are requested.
- **No credentials**: No API keys, secrets, or authentication credentials exist in the codebase.
- **No cloud backend**: There is no server-side component. AetherCP communicates only with Codeforces' public API and an optional local VS Code helper.
- **Graceful degradation**: Every network call is wrapped in error handling. If any endpoint is unavailable, the extension continues to function without it.
- **Transparent data handling**: This document is the complete and accurate record of everything the extension does with user data.

---

## Data Storage

All data is stored exclusively in [`chrome.storage.local`](https://developer.chrome.com/docs/extensions/reference/storage/), which:

- Resides on the user's local machine
- Is sandboxed to this extension only
- Is **never transmitted** to any remote server
- Can be cleared at any time via `chrome://extensions` → "Clear data"

### What is stored

| Data | Description |
|---|---|
| **Problem sessions** | Problem name, platform, URL, start/end timestamps, seconds spent |
| **Daily totals** | Total seconds coded per calendar date |
| **Recent problems** | Last 5 problems worked on (name, platform, time, rating) |
| **Problem ratings** | Codeforces problem rating (fetched from public API, cached for 24 hours) |
| **CPH status cache** | Whether the local CPH receiver was reachable (in-memory only, never persisted) |

### What is NOT stored

- Codeforces account credentials or session cookies
- LeetCode account credentials or session cookies
- Browsing history
- Any data from pages other than Codeforces and LeetCode problem pages

---

## Network Communication

AetherCP makes exactly **two types of external network requests**:

### 1. Codeforces Public API

**Endpoint:** `https://codeforces.com/api/`

**Requests made:**

| Endpoint | Purpose | When |
|---|---|---|
| `user.status?handle=<handle>` | Fetch submission history for the viewed profile | On Codeforces profile page load |
| `problemset.problems` | Fetch problem metadata (ratings) | When a problem without a known rating is detected; cached 24h |

**Authentication:** None. These are fully public, unauthenticated Codeforces API endpoints.

**Data sent:** Only the Codeforces handle, which is already publicly visible on the page being viewed.

### 2. Localhost CPH Receiver (Optional)

**Endpoint:** `http://localhost:27121`

**Purpose:** Send problem data to the [Competitive Programming Helper (CPH)](https://github.com/agrawal-d/cph) VS Code extension.

**Characteristics:**

- **Optional** — the extension works fully without it
- **Local only** — `localhost` never leaves the user's machine
- **User-initiated** — only triggered when the user clicks "Open in VS Code" or uses the context menu
- **No data persistence** — this is a one-way send; no response data is stored

---

## Permissions

The following permissions are declared in `manifest.json`:

| Permission | Why it is needed |
|---|---|
| `storage` | Store timer state, problem sessions, daily totals, and cached problem metadata in `chrome.storage.local` |
| `tabs` | Detect which tab is active, identify when the user navigates to or from a problem page, and send messages to the active content script |
| `contextMenus` | Register the "Open Problem in VS Code (AetherCP)" right-click menu item on supported problem pages |

### Host Permissions

| Host | Why it is needed |
|---|---|
| `https://codeforces.com/*` | Inject the content script on Codeforces problem and profile pages; fetch from the Codeforces public API |
| `https://leetcode.com/*` | Inject the content script on LeetCode problem pages |
| `http://localhost:27121/*` | POST problem payloads to the local CPH receiver (optional) |
| `http://127.0.0.1:27121/*` | Same as above, using the loopback IP address as a fallback |

No broad wildcard permissions (e.g., `<all_urls>`, `*://*/*`) are used.

---

## Privacy

AetherCP explicitly does **not**:

- Collect analytics or telemetry
- Send usage data to any server
- Fingerprint users or browsers
- Use cookies for tracking
- Use tracking pixels or beacons
- Upload or sync your coding history
- Sell or share user data
- Require an account or sign-in of any kind

---

## Third-Party Libraries

| Library | Version | License | Usage |
|---|---|---|---|
| [Chart.js](https://www.chartjs.org/) | v4.4.7 | MIT | Chart rendering in the Codeforces profile analytics panel |

Chart.js is **bundled locally** as `src/vendor/chart.umd.min.js`. No CDN is used. No external scripts are loaded at runtime.

---

## Secure Development Practices

This project is developed following these practices:

- **Least privilege**: Only permissions strictly necessary for the feature are requested
- **No secrets**: No API keys, OAuth tokens, or credentials are present in the source code or git history
- **No cloud backend**: No server to compromise, no database to breach
- **Local-first architecture**: User data never leaves the device
- **Public API only**: External requests use only public, unauthenticated Codeforces API endpoints
- **Graceful error handling**: All network calls are wrapped in try/catch with fallback behaviour
- **Minimal external requests**: The extension does not make any background polling or periodic requests beyond what is directly triggered by user activity

---

## Responsible Disclosure

If you discover a **security vulnerability** in AetherCP:

- **For general bugs**, open a [GitHub Issue](../../issues).
- **For security vulnerabilities**, please use [GitHub Security Advisories](../../security/advisories/new) to report privately. This avoids public disclosure before a fix is available.

Please provide:
- A clear description of the vulnerability
- Steps to reproduce
- Potential impact

We will respond as quickly as possible and credit reporters in the changelog if they wish.

---

## Security Checklist

- [x] No API keys or secrets committed to the repository
- [x] No credentials in source code or git history
- [x] No telemetry or analytics SDKs
- [x] No unnecessary browser permissions
- [x] No broad host permission wildcards
- [x] All user data stored locally (`chrome.storage.local`)
- [x] External requests limited to the public Codeforces API
- [x] Localhost integration is optional and user-initiated
- [x] All network calls have error handling and timeouts
- [x] No third-party CDN dependencies at runtime
- [x] Chart.js bundled locally under MIT license
- [x] Manifest V3 service worker architecture (no persistent background page)
