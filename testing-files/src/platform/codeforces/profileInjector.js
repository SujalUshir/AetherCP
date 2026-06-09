(() => {
if (window.__AETHERCP_PROFILE_INJECTOR__) {
  console.warn("[AetherCP] Injector already initialized");
  console.warn("[AetherCP LOAD] profileInjector.js skipped (duplicate injection prevented)");
  return;
}
window.__AETHERCP_PROFILE_INJECTOR__ = true;

// ============================================================
// profileInjector.js
// AetherCP – Codeforces Profile Page Injector
//
// Orchestrates both analytics systems on profile pages:
//
// 1. CF COMPETITIVE ANALYTICS (always injected, for every profile)
//    - Fetches Codeforces API for the viewed profile's handle
//    - Renders rating distribution bar chart  (FIRST)
//    - Renders topic/tag doughnut chart       (SECOND)
//    - Renders solved stats cards             (BELOW graphs)
//    - Injected ABOVE productivity analytics
//
// 2. PRODUCTIVITY ANALYTICS (own profile only)
//    - Requests timer snapshot from background via safeRuntimeMessage()
//    - Renders heatmap (with year selector)
//    - Renders coding time, history, platform charts
//    - Only shown when loggedInHandle === viewedHandle
//
// 3. VISIBILITY TOGGLES
//    - Heatmap toggle
//    - Productivity charts toggle
//    - CF Competitive Analytics toggle (from outside)
//
// RUNTIME STABILITY
// --------------------------------------------------
// All chrome.runtime.sendMessage() calls go through
// safeRuntimeMessage(), which catches "Extension context
// invalidated" errors produced when the extension is reloaded
// while the injected script is still alive in the page.
//
// If the runtime becomes invalid, the refresh interval is
// cleared immediately to stop the zombie loop.
//
// Cleanup also runs on window.beforeunload to prevent orphan
// timers when the user navigates away.
// ============================================================

let aetherProfileRoot      = null;
let aetherProfileRefreshId = null;
let injectorDestroyed      = false; // tracks if injector has been torn down

// ──────────────────────────────────────────────────────
// Logging helpers
// ──────────────────────────────────────────────────────

function logAetherInjector(message, data) {
  console.log("[AetherCP CF]", "[injector]", message, data !== undefined ? data : "");
}

function warnAetherInjector(message, data) {
  console.warn("[AetherCP CF]", "[injector]", message, data !== undefined ? data : "");
}

function logAetherRuntime(message, data) {
  console.warn("[AetherCP RUNTIME]", message, data !== undefined ? data : "");
}

// ──────────────────────────────────────────────────────
// Safe runtime messaging
//
// Wraps chrome.runtime.sendMessage() to handle the MV3
// "Extension context invalidated" error that occurs when:
//   - the extension is reloaded / updated
//   - the service worker restarts
//   - the old injected content script is still alive
//
// On invalidation: clears the refresh interval so the zombie
// loop stops immediately.
// ──────────────────────────────────────────────────────

function isRuntimeAlive() {
  try {
    // chrome.runtime.id becomes undefined when context is invalidated
    return Boolean(chrome && chrome.runtime && chrome.runtime.id);
  } catch (_) {
    return false;
  }
}

function stopRefreshInterval() {
  if (aetherProfileRefreshId !== null) {
    clearInterval(aetherProfileRefreshId);
    aetherProfileRefreshId = null;
    logAetherRuntime("Refresh interval cleared — extension context lost");
  }
}

/**
 * Safe wrapper for chrome.runtime.sendMessage().
 *
 * Catches all forms of runtime invalidation:
 *   - chrome.runtime.id missing (pre-call check)
 *   - lastError containing invalidation messages (post-call check)
 *   - synchronous throws (try/catch)
 *
 * On any invalidation, stops the refresh interval to prevent
 * further zombie calls.
 *
 * @param {Object}   payload   - message payload
 * @param {Function} [callback] - called with response if successful
 */
function safeRuntimeMessage(payload, callback) {
  if (!isRuntimeAlive()) {
    logAetherRuntime("Runtime not alive — skipping message", payload.type);
    stopRefreshInterval();
    return;
  }

  try {
    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        const errMsg = chrome.runtime.lastError.message || "";

        if (
          errMsg.includes("Extension context invalidated") ||
          errMsg.includes("message port closed")           ||
          errMsg.includes("receiving end does not exist")
        ) {
          logAetherRuntime("Extension context invalidated — stopping refresh", {
            type: payload.type,
            error: errMsg
          });
          stopRefreshInterval();
        } else {
          warnAetherInjector("sendMessage lastError", errMsg);
        }
        return;
      }

      if (typeof callback === "function") {
        callback(response);
      }
    });
  } catch (err) {
    // Synchronous throw — context fully dead
    logAetherRuntime("sendMessage threw synchronously — stopping refresh", {
      type: payload.type,
      error: err.message
    });
    stopRefreshInterval();
  }
}

// ──────────────────────────────────────────────────────
// Page helpers
// ──────────────────────────────────────────────────────

function isCodeforcesProfilePage() {
  return /^\/profile\/[^/]+\/?$/.test(window.location.pathname);
}

function getProfileMountPoint() {
  return (
    document.getElementById("pageContent") ||
    document.querySelector(".content-with-sidebar") ||
    document.body
  );
}

function getCFOfficialSolvedCount() {
  // Method A: Check elements with "_UserActivityFrame_" in class list
  const titleEl = document.querySelector("[class*='_UserActivityFrame_userActivityTitle']");
  if (titleEl) {
    const text = titleEl.textContent || "";
    const match = text.match(/(\d[\d,\s]*)\s+solved\s+problems/i);
    if (match) {
      const count = parseInt(match[1].replace(/[\s,]/g, ""), 10);
      if (!isNaN(count)) return count;
    }
  }

  // Method B: Search all elements containing "solved problems" text
  const allDivs = document.querySelectorAll("div, h1, h2, h3, h4, h5, span, a");
  for (const el of allDivs) {
    const text = el.textContent || "";
    if (text.includes("solved problems")) {
      const match = text.match(/(\d[\d,\s]*)\s+solved\s+problems/i);
      if (match) {
        const count = parseInt(match[1].replace(/[\s,]/g, ""), 10);
        if (!isNaN(count)) return count;
      }
    }
  }
  return null;
}

// ──────────────────────────────────────────────────────
// CF COMPETITIVE ANALYTICS STATE HELPERS
// ──────────────────────────────────────────────────────

function setCFLoading() {
  const loadingEl = document.getElementById("aetherCFLoadingMsg");
  const errorEl   = document.getElementById("aetherCFErrorMsg");
  const chartsEl  = document.getElementById("aetherCFChartsWrap");
  if (loadingEl) loadingEl.style.display = "";
  if (errorEl)   errorEl.style.display   = "none";
  if (chartsEl)  chartsEl.style.display  = "none";
}

function setCFError(message) {
  const loadingEl = document.getElementById("aetherCFLoadingMsg");
  const errorEl   = document.getElementById("aetherCFErrorMsg");
  const chartsEl  = document.getElementById("aetherCFChartsWrap");
  const errorText = document.getElementById("aetherCFErrorText");

  if (loadingEl) loadingEl.style.display = "none";
  if (errorEl)   errorEl.style.display   = "";
  if (chartsEl)  chartsEl.style.display  = "none";
  if (errorText) errorText.textContent   = message;

  warnAetherInjector("CF analytics error state", message);
}

function setCFReady(analyticsResult) {
  const loadingEl = document.getElementById("aetherCFLoadingMsg");
  const errorEl   = document.getElementById("aetherCFErrorMsg");
  const chartsEl  = document.getElementById("aetherCFChartsWrap");
  const badgeEl   = document.getElementById("aetherCFSolvedBadge");

  if (loadingEl) loadingEl.style.display = "none";
  if (errorEl)   errorEl.style.display   = "none";
  if (chartsEl)  chartsEl.style.display  = "";
  if (badgeEl)   badgeEl.textContent     = `${analyticsResult.solvedCount} solved`;

  // Update solved stats cards (below the graphs)
  updateSolvedStatsCards(analyticsResult);
}

/**
 * Update the solved stats cards below the graphs with the full breakdown.
 * @param {Object} result — from processCFSubmissions()
 */
function updateSolvedStatsCards(result) {
  const fields = {
    aetherCFStatTotal:    result.solvedCount,
    aetherCFStatContest:  result.contestSolves,
    aetherCFStatPractice: result.practiceSolves,
    aetherCFStatVirtual:  result.virtualSolves,
    aetherCFStatGym:      result.gymSolves || 0,
    aetherCFStatRated:    result.ratedCount
  };

  for (const [id, value] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value !== undefined ? value : "—");
  }

  logAetherInjector("Solved stats cards updated", fields);
}

// ──────────────────────────────────────────────────────
// Native profile card anchor helper
//
// The Codeforces profile page DOM inside #pageContent:
//   .second-level-menu   ← nav tabs (NOT the profile card)
//   .roundbox            ← FIRST roundbox = native profile card
//   .roundbox            ← SECOND roundbox = rating graph
//
// We insert AFTER the FIRST .roundbox, not after
// .title-card (which is a div INSIDE the roundbox)
// and not after .second-level-menu (before the card).
// ──────────────────────────────────────────────────────

function getNativeProfileCard() {
  const mountPoint = getProfileMountPoint();
  const firstRoundbox = mountPoint.querySelector(".roundbox");
  console.log("[AetherCP DOM]", "Native profile card:", firstRoundbox ? "found (.roundbox)" : "NOT FOUND");
  return firstRoundbox;
}

// ──────────────────────────────────────────────────────
// CF COMPETITIVE ANALYTICS INJECTION
//
// DOM insertion order (FINAL):
//   1. toggleBar   → inserted afterend of native .roundbox
//   2. cfRoot      → inserted afterend of toggleBar
//   (productivity  → inserted afterend of cfRoot, separately)
// ──────────────────────────────────────────────────────

async function injectCFAnalytics(handle) {
  if (!handle) {
    warnAetherInjector("injectCFAnalytics called with empty handle");
    return;
  }

  logAetherInjector("Starting CF competitive analytics injection", { handle });

  const mountPoint = getProfileMountPoint();
  const nativeCard = getNativeProfileCard();

  console.log("[AetherCP DOM]", "mountPoint:", mountPoint ? (mountPoint.id || mountPoint.className) : "NOT FOUND");
  console.log("[AetherCP DOM]", "nativeCard anchor:", nativeCard ? "ok" : "missing — will use mountPoint");

  // ── Step A: Inject standalone toggle bar AFTER native profile card ──
  if (!document.getElementById(AETHER_TOGGLE_BAR_ID)) {
    const tbWrapper = document.createElement("div");
    tbWrapper.innerHTML = getAetherToggleBarTemplate().trim();
    const toggleBarEl = tbWrapper.firstElementChild;

    if (nativeCard) {
      nativeCard.insertAdjacentElement("afterend", toggleBarEl);
      console.log("[AetherCP DOM]", "Toggle bar → inserted afterend of native .roundbox");
    } else {
      mountPoint.appendChild(toggleBarEl);
      console.log("[AetherCP DOM]", "Toggle bar → appended to mountPoint (fallback)");
    }

    // Wire all 3 toggles now — toggle bar is in the DOM
    initAetherToggles();
  }

  // ── Step B: Inject CF analytics section AFTER the toggle bar ──
  if (document.getElementById(AETHER_CF_ROOT_ID)) {
    logAetherInjector("CF analytics root already exists, skipping injection");
    return;
  }

  const templateWrapper = document.createElement("div");
  templateWrapper.innerHTML = getCFAnalyticsTemplate(handle).trim();
  const cfRoot = templateWrapper.firstElementChild;

  const toggleBarInDom = document.getElementById(AETHER_TOGGLE_BAR_ID);
  if (toggleBarInDom) {
    toggleBarInDom.insertAdjacentElement("afterend", cfRoot);
    console.log("[AetherCP DOM]", "CF analytics → inserted afterend of toggle bar");
  } else if (nativeCard) {
    nativeCard.insertAdjacentElement("afterend", cfRoot);
    console.log("[AetherCP DOM]", "CF analytics → inserted afterend of native card (toggle bar missing)");
  } else {
    mountPoint.appendChild(cfRoot);
    console.log("[AetherCP DOM]", "CF analytics → appended to mountPoint (fallback)");
  }

  logAetherInjector("CF analytics section injected into DOM");

  setCFLoading();

  try {
    logAetherInjector("Calling fetchUserStatus", handle);
    const submissions = await fetchUserStatus(handle);
    logAetherInjector("Submissions received", { count: submissions.length });

    const analyticsResult = processCFSubmissions(submissions);
    logAetherInjector("Analytics processed", {
      solvedCount: analyticsResult.solvedCount,
      ratingBuckets: analyticsResult.ratingDist.length,
      tagBuckets: analyticsResult.tagDist.length
    });

    // Solve comparison debugging
    try {
      const officialCount = getCFOfficialSolvedCount();
      if (officialCount !== null) {
        const diff = officialCount - analyticsResult.solvedCount;
        console.log("[AetherCP SOLVED] COMPARISON SUMMARY:");
        console.log(`[AetherCP SOLVED] - Official CF Solved Count: ${officialCount}`);
        console.log(`[AetherCP SOLVED] - AetherCP Solved Count: ${analyticsResult.solvedCount}`);
        console.log(`[AetherCP SOLVED] - Discrepancy (Official - AetherCP): ${diff}`);
        if (diff > 0) {
          console.warn(`[AetherCP SOLVED] WARNING: AetherCP solved count is lower than official by ${diff}!`);
          console.warn("[AetherCP SOLVED] Possible causes:");
          console.warn("[AetherCP SOLVED] 1. API status call pagination limits (Safety cap reached).");
          console.warn("[AetherCP SOLVED] 2. Submissions still being processed/loaded.");
          console.warn("[AetherCP SOLVED] 3. Deduplication is too aggressive (false merges).");
          console.warn("[AetherCP SOLVED] 4. Some solved problems are in other accounts / hidden contests.");
        } else if (diff < 0) {
          console.log(`[AetherCP SOLVED] AetherCP solved count is HIGHER than official by ${Math.abs(diff)}.`);
        } else {
          console.log("[AetherCP SOLVED] PERFECT PARITY: Counts match perfectly!");
        }
      } else {
        console.log("[AetherCP SOLVED] Could not extract official solved count from page DOM.");
      }
    } catch (compareError) {
      console.warn("[AetherCP SOLVED] Error running comparison helper:", compareError.message);
    }

    if (analyticsResult.solvedCount === 0) {
      setCFError("No solved problems found for this handle.");
      return;
    }

    setCFReady(analyticsResult);

    logAetherInjector("Rendering CF charts");
    renderCFRatingChart(analyticsResult.ratingDist);
    renderCFTagChart(analyticsResult.tagDist);

    logAetherInjector("CF analytics fully rendered for", handle);
  } catch (err) {
    warnAetherInjector("CF analytics fetch/render failed", err.message);
    setCFError(`Could not load Codeforces data: ${err.message}`);
  }
}

// ──────────────────────────────────────────────────────
// PRODUCTIVITY ANALYTICS INJECTION
// Uses safeRuntimeMessage() — no raw chrome.runtime calls
// ──────────────────────────────────────────────────────

function requestAetherSnapshot(callback) {
  safeRuntimeMessage(
    { type: AETHERCP_CONSTANTS.MESSAGE_TYPES.GET_TIMER_SNAPSHOT },
    (snapshot) => {
      if (!snapshot) {
        warnAetherInjector("Snapshot request returned no data");
        return;
      }

      logAetherInjector("Snapshot received");
      callback(snapshot);
    }
  );
}

function injectAetherProfileAnalytics() {
  if (injectorDestroyed) {
    logAetherInjector("injectAetherProfileAnalytics called after injector destroyed — aborting");
    return;
  }
  if (!isCodeforcesProfilePage()) return;

  // Bail early if runtime is gone — stopRefreshInterval() called inside safeRuntimeMessage
  if (!isRuntimeAlive()) {
    logAetherRuntime("Runtime gone — aborting productivity analytics refresh");
    stopRefreshInterval();
    return;
  }

  requestAetherSnapshot((snapshot) => {
    const analytics  = getAetherProfileAnalytics(snapshot);
    const mountPoint = getProfileMountPoint();

    if (!aetherProfileRoot) {
      const existingRoot = document.getElementById(AETHER_PROFILE_ROOT_ID);
      aetherProfileRoot  = existingRoot || createAetherProfileRoot(analytics);

      if (!existingRoot) {
        logAetherInjector("Appending productivity template into Codeforces page");

        // Always insert AFTER CF analytics (which is already in the DOM)
        const cfRoot = document.getElementById(AETHER_CF_ROOT_ID);
        if (cfRoot) {
          cfRoot.insertAdjacentElement("afterend", aetherProfileRoot);
          console.log("[AetherCP DOM]", "Productivity analytics → inserted afterend of CF analytics");
        } else {
          // CF analytics not yet injected — append to mountPoint as fallback
          mountPoint.appendChild(aetherProfileRoot);
          console.log("[AetherCP DOM]", "Productivity analytics → appended to mountPoint (CF root not found)");
        }
      } else {
        logAetherInjector("Existing productivity analytics root found, reusing");
      }

      // toggles were already wired by injectCFAnalytics; only init year nav here
      initAetherYearNav(analytics);
    } else {
      updateAetherProfileRoot(aetherProfileRoot, analytics);
    }

    logAetherInjector("Canvas mount check", {
      platform: Boolean(document.getElementById("aetherPlatformChart")),
      problems: Boolean(document.getElementById("aetherProblemChart")),
      daily:    Boolean(document.getElementById("aetherDailyChart"))
    });

    renderAetherProfileCharts(analytics);
  });
}


// ──────────────────────────────────────────────────────
// VISIBILITY TOGGLE INITIALIZATION
// Wires toggle checkboxes to show/hide sections.
// State is persisted in localStorage.
// ──────────────────────────────────────────────────────

function initAetherToggles() {
  const heatmapCheckbox      = document.getElementById("aetherToggleHeatmap");
  const productivityCheckbox = document.getElementById("aetherToggleProductivity");
  const cfAnalyticsCheckbox  = document.getElementById("aetherToggleCFAnalytics");

  if (!heatmapCheckbox || !productivityCheckbox) {
    logAetherInjector("Toggle checkboxes not found, skipping toggle init");
    return;
  }

  // Restore persisted state
  // Sections may not exist yet (e.g. viewing another user's profile) — null-safe
  const heatmapHidden      = localStorage.getItem("aethercp-toggle-heatmap")      === "hidden";
  const productivityHidden = localStorage.getItem("aethercp-toggle-productivity") === "hidden";
  const cfAnalyticsHidden  = localStorage.getItem("aethercp-toggle-cf-analytics") === "hidden";

  if (heatmapHidden) {
    heatmapCheckbox.checked = false;
    const s = document.getElementById("aetherHeatmapSection");
    if (s) s.style.display = "none";
  }
  if (productivityHidden) {
    productivityCheckbox.checked = false;
    const s = document.getElementById("aetherProductivitySection");
    if (s) s.style.display = "none";
  }
  if (cfAnalyticsHidden && cfAnalyticsCheckbox) {
    cfAnalyticsCheckbox.checked = false;
    const s = document.getElementById(AETHER_CF_ROOT_ID);
    if (s) s.style.display = "none";
  }

  // Event listeners do fresh lookups — sections may be injected AFTER toggles are wired
  heatmapCheckbox.addEventListener("change", () => {
    const visible = heatmapCheckbox.checked;
    const s = document.getElementById("aetherHeatmapSection");
    if (s) s.style.display = visible ? "" : "none";
    localStorage.setItem("aethercp-toggle-heatmap", visible ? "visible" : "hidden");
    logAetherInjector("Heatmap toggle", { visible });
  });

  productivityCheckbox.addEventListener("change", () => {
    const visible = productivityCheckbox.checked;
    const s = document.getElementById("aetherProductivitySection");
    if (s) s.style.display = visible ? "" : "none";
    localStorage.setItem("aethercp-toggle-productivity", visible ? "visible" : "hidden");
    logAetherInjector("Productivity toggle", { visible });
  });

  if (cfAnalyticsCheckbox) {
    cfAnalyticsCheckbox.addEventListener("change", () => {
      const visible = cfAnalyticsCheckbox.checked;
      const s = document.getElementById(AETHER_CF_ROOT_ID);
      if (s) s.style.display = visible ? "" : "none";
      localStorage.setItem("aethercp-toggle-cf-analytics", visible ? "visible" : "hidden");
      logAetherInjector("CF Analytics toggle", { visible });
    });
  }

  logAetherInjector("Toggles initialized");
}


// ──────────────────────────────────────────────────────
// YEAR NAVIGATION
// Wires year selector dropdown and nav buttons
// ──────────────────────────────────────────────────────

function initAetherYearNav(analytics) {
  const yearSelect = document.getElementById("aetherHeatmapYearSelect");
  const prevBtn    = document.getElementById("aetherYearPrev");
  const nextBtn    = document.getElementById("aetherYearNext");

  if (!yearSelect) {
    logAetherInjector("Year select not found, skipping year nav init");
    return;
  }

  function refreshHeatmapForYear() {
    const year = parseInt(yearSelect.value, 10);
    const heatmapRoot = document.getElementById("aetherHeatmapSection") ||
                        document.querySelector("[data-aether-heatmap]");
    if (heatmapRoot) {
      renderAetherHeatmap(heatmapRoot, analytics, year);
    }

    // Update button states
    if (prevBtn) prevBtn.disabled = (year <= 2023);
    if (nextBtn) nextBtn.disabled = (year >= new Date().getFullYear());
  }

  yearSelect.addEventListener("change", refreshHeatmapForYear);

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const current = parseInt(yearSelect.value, 10);
      if (current > 2023) {
        yearSelect.value = String(current - 1);
        refreshHeatmapForYear();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const current = parseInt(yearSelect.value, 10);
      if (current < new Date().getFullYear()) {
        yearSelect.value = String(current + 1);
        refreshHeatmapForYear();
      }
    });
  }

  // Initial button states
  const initialYear = parseInt(yearSelect.value, 10);
  if (prevBtn) prevBtn.disabled = (initialYear <= 2023);
  if (nextBtn) nextBtn.disabled = (initialYear >= new Date().getFullYear());

  logAetherInjector("Year nav initialized", { initialYear });
}

// ──────────────────────────────────────────────────────
// Cleanup — called on unload or runtime invalidation
// ──────────────────────────────────────────────────────

function cleanupAetherProfileInjector() {
  logAetherInjector("Cleanup triggered — clearing intervals and marking injector destroyed");
  stopRefreshInterval();
  injectorDestroyed = true;
}

// ──────────────────────────────────────────────────────
// STARTUP — orchestrates both systems
// ──────────────────────────────────────────────────────

function startAetherProfileInjector() {
  if (injectorDestroyed) {
    logAetherInjector("startAetherProfileInjector called after injector destroyed — skipping");
    return;
  }
  if (!isCodeforcesProfilePage()) {
    logAetherInjector("Not a Codeforces profile page, skipping");
    return;
  }

  if (aetherProfileRefreshId) {
    logAetherInjector("Injector already running, skipping duplicate start");
    return;
  }

  const viewedHandle = getViewedProfileHandle();
  const ownProfile   = isOwnProfile();

  logAetherInjector("Profile page detected", {
    viewedHandle,
    loggedInHandle: getLoggedInHandle(),
    isOwnProfile: ownProfile
  });

  // ── Step 1: Always inject CF competitive analytics (above productivity)
  injectCFAnalytics(viewedHandle);

  // ── Step 2: Only inject productivity analytics on own profile
  if (ownProfile) {
    logAetherInjector("Own profile — also injecting productivity analytics");
    aetherProfileRoot = document.getElementById(AETHER_PROFILE_ROOT_ID);
    injectAetherProfileAnalytics();
    aetherProfileRefreshId = setInterval(injectAetherProfileAnalytics, 10000);
    logAetherInjector("Productivity refresh interval started", { intervalMs: 10000 });
  } else {
    logAetherInjector("Viewing another user's profile — productivity analytics hidden");
  }
}

// ──────────────────────────────────────────────────────
// Lifecycle — cleanup on page unload
// ──────────────────────────────────────────────────────

window.addEventListener("beforeunload", cleanupAetherProfileInjector);

if (document.readyState === "loading") {
  // { once: true } prevents stale re-firing after extension reload
  document.addEventListener("DOMContentLoaded", startAetherProfileInjector, { once: true });
} else {
  startAetherProfileInjector();
}

console.log("[AetherCP LOAD] profileInjector.js loaded");
})();
