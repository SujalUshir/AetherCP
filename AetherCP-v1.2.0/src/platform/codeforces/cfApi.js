(() => {
// ============================================================
// cfApi.js
// AetherCP – Codeforces API Client
//
// Responsibilities:
//   - Fetch ALL user submissions from Codeforces public API
//   - Validate HTTP and API-level response status
//   - Return raw submissions array or throw on failure
//   - All errors are surfaced to callers — no silent swallows
//
// IMPORTANT: user.status without a `count` param returns only a
// small default slice (typically the most recent ~10 submissions).
// We MUST pass count=10000 to get full history.
// If a user has more than 10000 submissions we paginate.
// ============================================================

const AETHER_CF_API_BASE = "https://codeforces.com/api";

// Maximum submissions to request per API call.
// CF API allows up to an arbitrary count per call (no documented hard cap).
// 10 000 covers all but the most prolific competitive programmers.
const AETHER_CF_PAGE_SIZE = 10000;

function logCFApi(message, data) {
  console.log("[AetherCP API]", message, data !== undefined ? data : "");
}

function warnCFApi(message, data) {
  console.warn("[AetherCP API]", message, data !== undefined ? data : "");
}

/**
 * Fetch ONE page of submissions from user.status.
 *
 * @param {string} handle
 * @param {number} from   — 1-based start index
 * @param {number} count  — how many to return
 * @returns {Promise<Array>}
 */
async function fetchUserStatusPage(handle, from, count) {
  const url = `${AETHER_CF_API_BASE}/user.status?handle=${encodeURIComponent(handle)}&from=${from}&count=${count}`;
  logCFApi("Fetching page", { handle, from, count, url });

  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    warnCFApi("Network fetch failed", networkError.message);
    throw new Error(`[AetherCP API] Network error fetching user.status for '${handle}': ${networkError.message}`);
  }

  logCFApi("HTTP response", { status: response.status, ok: response.ok });

  if (!response.ok) {
    throw new Error(`[AetherCP API] HTTP ${response.status} for handle '${handle}'`);
  }

  let text;
  try {
    text = await response.text();
  } catch (readError) {
    warnCFApi("Reading response body failed", readError.message);
    throw new Error(`[AetherCP API] Failed to read response body for handle '${handle}'`);
  }

  const responseSize = text.length;

  let json;
  try {
    json = JSON.parse(text);
  } catch (parseError) {
    warnCFApi("JSON parse failed", parseError.message);
    throw new Error(`[AetherCP API] Failed to parse response JSON for handle '${handle}'`);
  }

  if (json.status !== "OK") {
    const comment = json.comment || "Unknown API error";
    warnCFApi("API returned non-OK status", { status: json.status, comment });
    throw new Error(`[AetherCP API] Codeforces API error for '${handle}': ${comment}`);
  }

  return {
    result: json.result || [],
    size: responseSize
  };
}

/**
 * Fetch ALL submissions for a given Codeforces handle.
 *
 * Paginates until all submissions are retrieved.
 * Each page requests AETHER_CF_PAGE_SIZE (10 000) submissions.
 *
 * The CF API returns submissions in descending submission-ID order
 * (most recent first). When the returned page is smaller than
 * PAGE_SIZE, we have reached the end.
 *
 * API endpoint:
 *   GET https://codeforces.com/api/user.status?handle=<handle>&from=<n>&count=<n>
 *
 * @param {string} handle
 * @returns {Promise<Array>} all raw submission objects
 */
async function fetchUserStatus(handle) {
  if (!handle) {
    throw new Error("[AetherCP API] fetchUserStatus called with empty handle");
  }

  logCFApi("Starting full submission fetch", { handle, pageSize: AETHER_CF_PAGE_SIZE });

  const allSubmissions = [];
  let from = 1;
  let pageNumber = 1;
  let totalResponseSize = 0;

  while (true) {
    const { result: page, size } = await fetchUserStatusPage(handle, from, AETHER_CF_PAGE_SIZE);
    totalResponseSize += size;

    logCFApi("Page received", {
      pageNumber,
      from,
      returned: page.length,
      cumulative: allSubmissions.length + page.length
    });

    allSubmissions.push(...page);

    // If we got fewer than PAGE_SIZE, this was the last page
    if (page.length < AETHER_CF_PAGE_SIZE) {
      logCFApi("Last page reached — all submissions fetched", {
        totalPages: pageNumber,
        totalSubmissions: allSubmissions.length
      });
      break;
    }

    // Warn if we're paginating past 10 000 (very prolific user)
    if (pageNumber === 1) {
      warnCFApi("User has more than 10 000 submissions — fetching next page", {
        handle,
        pageNumber
      });
    }

    from += AETHER_CF_PAGE_SIZE;
    pageNumber++;

    // Safety cap: stop after 20 pages (200 000 submissions) to prevent infinite loops
    if (pageNumber > 20) {
      warnCFApi("Reached safety cap of 20 pages (200 000 submissions) — stopping", { handle });
      break;
    }
  }

  let oldestTime = Infinity;
  let newestTime = -Infinity;

  for (const sub of allSubmissions) {
    if (sub.creationTimeSeconds) {
      if (sub.creationTimeSeconds < oldestTime) oldestTime = sub.creationTimeSeconds;
      if (sub.creationTimeSeconds > newestTime) newestTime = sub.creationTimeSeconds;
    }
  }

  // Mandatory format requirements for logging
  console.log("[AetherCP API] total submissions fetched:", allSubmissions.length);
  console.log("[AetherCP API] API response size:", totalResponseSize);
  console.log("[AetherCP API] oldest submission timestamp:", oldestTime !== Infinity ? oldestTime : "N/A");
  console.log("[AetherCP API] newest submission timestamp:", newestTime !== -Infinity ? newestTime : "N/A");

  logCFApi("All submissions fetched", { handle, total: allSubmissions.length });

  return allSubmissions;
}

// Expose functions to global scope
window.fetchUserStatus = fetchUserStatus;

console.log("[AetherCP LOAD] cfApi.js loaded");
})();
