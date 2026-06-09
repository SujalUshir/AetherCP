# AetherCP — Known Issues and Limitations

This document lists confirmed quirks, edge cases, and platform limitations in the current implementation.

---

## 1. MV3 Extension Context Invalidation

**Quirk:** When the extension is reloaded via `chrome://extensions`, content scripts previously injected into open Codeforces or LeetCode tabs become disconnected from the extension runtime.

**Impact:** Any subsequent `chrome.runtime.sendMessage()` calls from those orphaned scripts throw an `Extension context invalidated` error.

**Handling:** All runtime calls in content scripts and profile injectors go through `safeSendMessage()` / `safeRuntimeMessage()`. These wrappers detect the invalidation message and silently stop any active polling intervals or timers. A single console warning may still appear during reloads — this is expected.

---

## 2. Virtual Contest and Mashup Problem Name Collisions

**Quirk:** Gym and mashup contests (contestId >= 100000) use generic problem indexes (A, B, C…) that can match standard contest problems.

**Impact:** Without scoping, a practice solve of problem "A" in a mashup could deduplicate against a completely different problem "A" from a standard contest.

**Handling:** AetherCP prepends `contestId` to the deduplication key for any submission where `contestId >= 100000` (e.g. key becomes `c102345-A`). This ensures gym/mashup problems are always distinct from standard contest problems.

---

## 3. IST Timezone Hardcoded

**Quirk:** All daily resets, date key generation, and heatmap rendering use IST (Indian Standard Time, UTC+5:30) regardless of the user's local system timezone.

**Impact:** Users outside India will see their daily rollover at an unexpected local time (e.g. a UTC user's "day" ends at 6:30 PM local time instead of midnight). Heatmap dates are labeled in IST dates.

**No workaround currently available.**

---

## 4. Heatmap Horizontal Overflow on Narrow Screens

**Quirk:** The full-year heatmap renders 52–54 columns of 12×12px cells. The grid width is fixed.

**Impact:** On narrow browser windows or zoomed-in browsers, the heatmap may overflow its container horizontally and trigger a scrollbar inside the analytics panel. Cells do not wrap or resize.

---

## 5. LeetCode Productivity Not Visible on Profile

**Quirk:** LeetCode problem timing works correctly and accumulates in extension storage. However, there is no profile page injection for LeetCode.

**Impact:** Productivity analytics (heatmap, charts, stat cards) are only visible on the user's own Codeforces profile page. LeetCode time is included in totals shown on the CF profile page, but cannot be viewed directly on LeetCode.

---

## 6. Solved Count May Differ from Official Codeforces Count

**Quirk:** AetherCP's solved count is computed from the Codeforces public API submission history and may not match the number displayed on the Codeforces profile page.

**Known causes:**
- AetherCP deduplicates by unique problem key; Codeforces may count differently
- API pagination cap: AetherCP fetches a maximum of 200,000 submissions (20 pages of 10,000)
- Hidden contest results or submissions still being processed on Codeforces' side
- Problems solved in non-standard contexts not captured by the public API

AetherCP logs a full comparison summary in the browser console under `[AetherCP SOLVED] COMPARISON SUMMARY` for diagnostic purposes.
