# CPH Integration — Competitive Programming Helper

## Overview

AetherCP v1.2 adds full **Competitive Companion protocol compatibility**.
When you are on a supported problem page, AetherCP can send the problem directly
to the [CPH (Competitive Programming Helper)](https://github.com/agrawal-d/cph)
extension running inside VS Code — without installing any additional extension.

The integration uses the **same protocol** as the original Competitive Companion
browser extension, so CPH receives it identically.

---

## Architecture

```
Browser (problem page)
    │
    ▼
content.js
 ├─ Detects problem name, platform, URL          (existing)
 ├─ Extracts sample test cases from DOM          (NEW — v1.2)
 ├─ Extracts time / memory limits from DOM       (NEW — v1.2)
 └─ Sends PROBLEM_DETECTED with full payload     (extended)
    │
    ▼
background.js
 ├─ Stores extended problem record in tabProblems
 ├─ SEND_TO_CPH  → buildCphPayload() → sendToCph()
 └─ GET_CPH_STATUS → checkCphReceiver()
    │
    ▼
src/modules/cph/
 ├─ cphPayloadBuilder.js  — Competitive Companion JSON
 ├─ cphClient.js          — HTTP POST to localhost:27121
 └─ cphStatus.js          — 10-second cached health check
    │
    ▼
CPH Receiver (localhost:27121)
    │
    ▼
VS Code
```

---

## Communication Flow

### Method 1 — Popup Button

1. User opens AetherCP popup.
2. Popup sends `GET_CPH_STATUS` → background checks localhost:27121.
3. Status badge shows **✓ Connected** or **Not running**.
4. User clicks **Open in VS Code**.
5. Popup sends `SEND_TO_CPH` → background builds payload → POSTs to CPH receiver.
6. VS Code opens the problem.

### Method 2 — Right-Click Context Menu

1. User right-clicks on a Codeforces or LeetCode problem page.
2. Selects **Open Problem in VS Code (AetherCP)**.
3. Background immediately builds payload and POSTs to CPH receiver.
4. No popup interaction required.

---

## Payload Format (Competitive Companion Protocol)

```json
{
  "name":        "1234A - Two Sum",
  "group":       "Codeforces - Contest 1234",
  "url":         "https://codeforces.com/contest/1234/problem/A",
  "interactive": false,
  "memoryLimit": 256,
  "timeLimit":   2000,
  "tests": [
    { "input": "3\n1 2 3\n", "output": "6\n" },
    { "input": "1\n5\n",     "output": "5\n" }
  ],
  "testType": "single",
  "input":    { "type": "stdin"  },
  "output":   { "type": "stdout" },
  "languages": {
    "java": { "mainClass": "Main", "taskClass": "MainTask1234ATwoSum" }
  },
  "batch": { "id": "lp8xk3a2-r4t7", "size": 1 }
}
```

---

## Sample Test Extraction

### Codeforces — Reliable (DOM-based)

Codeforces renders sample tests in a structured, stable DOM:

```
.sample-test
  .input  → pre  (one per test case)
  .output → pre  (one per test case)
```

AetherCP reads all `pre` elements within `.sample-test .input` and
`.sample-test .output`, pairs them in order, and normalises whitespace.

Time limit is read from `.time-limit` (e.g. "2 seconds" → 2000 ms).
Memory limit is read from `.memory-limit` (e.g. "256 megabytes" → 256 MB).

### LeetCode — Best-Effort (text parsing)

LeetCode does not use a structured sample DOM. Examples are embedded as plain
text in the problem description. AetherCP uses a regex to match:

```
Input: <text>
Output: <text>
```

This works for most standard problems. It may not extract all examples for:
- Interactive problems
- "Design" problems (no standard I/O)
- Problems where the example uses unusual formatting

If extraction fails, `tests: []` is used and CPH opens the problem without
pre-loaded samples. This is graceful degradation — CPH still works.

---

## Supported Platforms

| Platform   | Sample Extraction | Time/Memory Limits | Status     |
|---|---|---|---|
| Codeforces | ✅ Reliable DOM   | ✅ Reliable DOM    | Supported  |
| LeetCode   | ⚠️ Best-effort    | ❌ Not available   | Supported  |
| AtCoder    | —                 | —                  | Planned    |
| CodeChef   | —                 | —                  | Planned    |
| HackerRank | —                 | —                  | Planned    |
| SPOJ       | —                 | —                  | Planned    |

---

## Error Handling

| Scenario             | What happens |
|---|---|
| Receiver offline     | Popup shows "Not running", button disabled |
| Connection refused   | `reason: "refused"` returned |
| Request timeout (3s) | `reason: "timeout"` returned |
| HTTP 4xx/5xx         | Treated as success (receiver is running) |
| No active problem    | `reason: "no_problem"` returned |
| Extension error      | `chrome.runtime.lastError` caught, popup shows "Extension error" |
| DOM extraction fails | Falls back to `tests: []`, never throws |

---

## Status Cache

The `GET_CPH_STATUS` check uses a **10-second TTL cache** inside the service worker.

- Popup only triggers a real check once per popup lifetime.
- After a successful `SEND_TO_CPH`, the cache is invalidated so the next popup
  open reflects live state.
- The service worker cache resets if the SW sleeps (MV3 behaviour).

---

## Troubleshooting

### "Not running" / button greyed out

1. Ensure VS Code is open with the CPH extension installed.
2. Open any `.cpp` or `.py` file in VS Code so CPH activates.
3. Check that port 27121 is not blocked by firewall/antivirus.
4. Run `netstat -ano | findstr :27121` in Windows to verify the port is listening.

### No samples sent (tests: [])

- On Codeforces: reload the page and wait for the problem body to fully render.
  CPH sends a second refresh after the payload arrives, so samples can be sparse.
- On LeetCode: this is expected for interactive/design problems.

### VS Code opens but no file created

CPH needs an open workspace folder. Open a folder in VS Code before sending.

---

## Future Extension Points

1. **Auto Send** — Architecture is prepared. Add `autoSendOnDetect` flag to
   `cphStatus.js` and check it in `background.js` inside `handleProblemDetected`.
2. **Custom Port** — Replace the hardcoded `27121` in `cphClient.js` and
   `cphStatus.js` with a value from `chrome.storage.local` (options page).
3. **Native VS Code Bridge** — A VS Code extension that wraps CPH for deeper
   integration (auto-open specific editor, language selection, etc.).
4. **Additional Platforms** — Add extractors in `content.js` and group builders
   in `cphPayloadBuilder.js` following the same pattern.
