# Codeforces Competitive Analytics

AetherCP injects a competitive analytics panel into every Codeforces profile page it visits. This panel is independent of practice analytics - it runs on any profile, not just the logged-in user's own.

---

## 1. Injection and Layout Order

AetherCP dynamically injects into the Codeforces profile DOM in this order:

1. **Native Codeforces profile** (unchanged)
2. **CF Competitive Analytics section** — inserted `afterend` of the native `.roundbox` (profile card)
3. **Practice Analytics section** (own profile only) — inserted `afterend` of the CF section

Layout within the CF analytics section (top to bottom):

1. Problem Rating Distribution bar chart
2. Problem Topics Distribution pie chart
3. Solved count badge

---

## 2. API Fetching

**Endpoint:** `https://codeforces.com/api/user.status?handle=<handle>&from=<n>&count=10000`

**Behavior:**
- Fetches the full submission history for the viewed profile handle
- Paginated: each page requests 10,000 submissions
- The CF API returns submissions newest-first; when a page returns fewer than 10,000 entries, it is the last page
- Safety cap: 20 pages maximum (200,000 submissions)
- **No caching** — the API is called fresh on every profile page load
- All network errors and HTTP errors are surfaced to the UI via an error state

---

## 3. Solved Problem Counting

### Counting rule (strict)

A problem counts as solved when `submission.verdict === "OK"`.

No other fields are required to count. Problems without a rating, contestId, or index are still counted if their verdict is OK.

### Participant types (all counted)

- `CONTESTANT` / `OUT_OF_COMPETITION` → contest solves
- `PRACTICE` → practice solves
- `VIRTUAL` → virtual solves
- `MANAGER`, `SPECTATOR`, `UNKNOWN` → other (counted)
- `contestId >= 100000` → gym solves (regardless of participantType)

### Deduplication key priority

Each accepted submission is deduplicated to one unique problem using this key priority:

| Priority | Key format | Used when |
|---|---|---|
| 1 | `c<contestId>-<index>` | contestId and index both present |
| 2 | `ps-<problemsetName>-<index>` | problemsetName and index present |
| 3 | `c<contestId>-n:<exactName>` | contestId present, index missing |
| 4 | `name:<exactName>` | last resort — no normalization applied |
| 5 | random hash | truly anonymous problem — never deduplicated |

**Note:** Gym problems (contestId >= 100000) use the same key scheme as standard problems. The `contestId` in the key ensures gym problems don't collide with standard contest problems of the same index.

---

## 4. Competitive Charts

After API processing, AetherCP renders:

- Problem Rating Distribution: unique accepted Codeforces problems grouped by official problem rating. Problems without a rating still count toward the solved badge, but they are excluded from this chart.
- Problem Topics Distribution: unique accepted Codeforces problems grouped by public Codeforces problem tags.

---

## 5. Logging and Diagnostics

The browser console uses these prefixes during CF analytics processing:

| Prefix | Source |
|---|---|
| `[AetherCP API]` | `cfApi.js` — fetch lifecycle |
| `[AetherCP CF][analytics]` | `solvedProblemAnalytics.js` — processing |
| `[AetherCP SOLVED]` | `solvedProblemAnalytics.js` — full audit trail |
| `[AetherCP CF][injector]` | `profileInjector.js` — DOM injection |
| `[AetherCP DOM]` | `profileInjector.js` — DOM insertion points |

A comparison between AetherCP's solved count and Codeforces' officially displayed count is logged under `[AetherCP SOLVED] COMPARISON SUMMARY` for debugging discrepancies.

---

## 6. Known Limitation

AetherCP's solved count may differ from Codeforces' official displayed number. Possible causes:
- Deduplication logic differs (AetherCP counts unique problems; CF may count differently)
- API pagination cap (200,000 max submissions)
- Hidden contest results or server-side processing delays
