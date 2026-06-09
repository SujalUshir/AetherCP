// ============================================================
// content.js
// AetherCP – Content Script
//
// Responsibilities:
//   - Detect current platform and problem name from the DOM
//   - Send PROBLEM_DETECTED messages to background
//   - Watch for idle and active state transitions
//
// PAGE SCOPING
// --------------------------------------------------
// Tracking ONLY initializes on actual problem pages:
//   - codeforces.com/problemset/problem/*
//   - codeforces.com/contest/*/problem/*
//   - codeforces.com/gym/*/problem/*
//   - leetcode.com/problems/*
//
// Pages like /friends, /profile, /settings, /ratings
// get no observers, no messaging, no idle listeners.
//
// RUNTIME SAFETY
// --------------------------------------------------
// All chrome.runtime.sendMessage() calls go through
// safeSendMessage() which catches "Extension context
// invalidated" errors that occur after extension reloads
// instead of letting them bubble up as uncaught errors.
//
// IDLE DETECTION — CP-FRIENDLY (15 minutes)
// --------------------------------------------------
// Threshold is 15 min. Only keydown + click are tracked.
// Tab hidden triggers early idle. Tab visible resumes.
// ============================================================

let lastProblemKey       = "";
let idleTimerId          = null;
let lastActivityAt       = Date.now();
let isIdle               = false;
let problemObserver      = null;  // MutationObserver for problem title detection
let delayedSendTimer1    = null;  // setTimeout 1000ms retry
let delayedSendTimer2    = null;  // setTimeout 3000ms retry
let trackingInitialized  = false; // guard against duplicate init
let lastActivityNotificationTime = 0;

const MESSAGE_TYPES   = AETHERCP_CONSTANTS.MESSAGE_TYPES;
const PLATFORMS       = AETHERCP_CONSTANTS.PLATFORMS;
const IDLE_TIMEOUT_MS = AETHERCP_CONSTANTS.IDLE_TIMEOUT_MS; // 900000 ms = 15 min
const ACTIVITY_THROTTLE_MS = 10 * 1000;

// ──────────────────────────────────────────────
// Logging helpers
// ──────────────────────────────────────────────

function logContent(message, data) {
  console.log("[AetherCP CONTENT]", message, data !== undefined ? data : "");
}

function logTracking(message, data) {
  console.log("[AetherCP TRACKING]", message, data !== undefined ? data : "");
}

function logRuntime(message, data) {
  console.warn("[AetherCP RUNTIME]", message, data !== undefined ? data : "");
}

// ──────────────────────────────────────────────
// Safe runtime messaging
// Wraps chrome.runtime.sendMessage() to catch
// "Extension context invalidated" errors that
// occur when the extension is reloaded while
// the content script is still alive in the page.
// ──────────────────────────────────────────────

function safeSendMessage(payload, callback) {
  try {
    // Guard: if chrome.runtime is gone (e.g. after uninstall), bail immediately
    if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
      logRuntime("chrome.runtime unavailable — skipping message", payload.type);
      return;
    }

    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        const errMsg = chrome.runtime.lastError.message || "";

        // "Extension context invalidated" means the SW was reloaded.
        // Log it as a warning rather than letting it crash.
        if (
          errMsg.includes("Extension context invalidated") ||
          errMsg.includes("message port closed") ||
          errMsg.includes("receiving end does not exist")
        ) {
          logRuntime("Extension context invalidated — message dropped", {
            type: payload.type,
            error: errMsg
          });
        }
        // Any other lastError: swallow silently to avoid uncaught errors
        return;
      }

      if (typeof callback === "function") {
        callback(response);
      }
    });
  } catch (err) {
    // Synchronous throw — extension context already dead
    logRuntime("sendMessage threw synchronously", {
      type: payload.type,
      error: err.message
    });
  }
}

// ──────────────────────────────────────────────
// Page scoping — supported tracking pages only
// ──────────────────────────────────────────────

/**
 * Returns true if the current URL is a Codeforces problem page.
 *
 * Supported patterns:
 *   /problemset/problem/<contestId>/<index>
 *   /contest/<contestId>/problem/<index>
 *   /gym/<gymId>/problem/<index>
 */
function isCodeforcesProblemPage() {
  const path = window.location.pathname;

  return (
    /^\/problemset\/problem\/\d+\/[A-Za-z0-9]+/.test(path) ||
    /^\/contest\/\d+\/problem\/[A-Za-z0-9]+/.test(path)    ||
    /^\/gym\/\d+\/problem\/[A-Za-z0-9]+/.test(path)
  );
}

/**
 * Returns true if the current URL is a LeetCode problem page.
 *
 * Supported patterns:
 *   /problems/<slug>/
 *   /problems/<slug>/description/
 */
function isLeetCodeProblemPage() {
  return /^\/problems\/[^/]+/.test(window.location.pathname);
}

/**
 * Returns true if tracking (problem detection + idle watching)
 * should initialize on this page.
 */
function isSupportedTrackingPage() {
  const hostname = window.location.hostname;

  if (hostname.includes("codeforces.com")) return isCodeforcesProblemPage();
  if (hostname.includes("leetcode.com"))   return isLeetCodeProblemPage();

  return false;
}

// ──────────────────────────────────────────────
// Platform + problem detection
// ──────────────────────────────────────────────

function getPlatform() {
  const hostname = window.location.hostname;

  if (hostname.includes("codeforces.com")) return PLATFORMS.CODEFORCES;
  if (hostname.includes("leetcode.com"))   return PLATFORMS.LEETCODE;

  return "";
}

function getCodeforcesProblemName() {
  const title = document.querySelector(".title");
  return title ? title.textContent.trim() : "";
}

function getLeetCodeProblemName() {
  const title =
    document.querySelector('div[class*="text-title"]') ||
    document.querySelector('[data-cy="question-title"]')  ||
    document.querySelector("title");

  return title ? title.textContent.trim() : "";
}

function getProblemName(platform) {
  if (platform === "Codeforces") return getCodeforcesProblemName();
  if (platform === "LeetCode")   return getLeetCodeProblemName();
  return "";
}

function getProblemInfo() {
  const platform    = getPlatform();
  const problemName = getProblemName(platform);

  if (!platform || !problemName) return null;

  return { problemName, platform, url: window.location.href };
}

function getProblemKey(problem) {
  return `${problem.platform}:${problem.problemName}`.toLowerCase();
}

// ──────────────────────────────────────────────
// Problem detection — send to background
// ──────────────────────────────────────────────

function sendProblemInfo() {
  const problem = getProblemInfo();
  if (!problem) return;

  const problemKey = getProblemKey(problem);
  if (problemKey === lastProblemKey) return;

  lastProblemKey = problemKey;
  logTracking("Problem detected", { problemKey, platform: problem.platform });

  safeSendMessage(
    { type: MESSAGE_TYPES.PROBLEM_DETECTED, problem },
    () => {
      // If user was idle when problem changed, re-send idle to keep state accurate
      if (isIdle) sendIdleMessage();
    }
  );
}

function watchForProblemTitle() {
  sendProblemInfo();

  if (!document.body) return;

  // Disconnect any previous observer before creating a new one
  if (problemObserver) {
    problemObserver.disconnect();
    logContent("[AetherCP CLEANUP] Previous problem observer disconnected");
  }

  problemObserver = new MutationObserver(sendProblemInfo);
  problemObserver.observe(document.body, { childList: true, subtree: true });

  // Track delayed retries so they can be cleared on cleanup
  clearTimeout(delayedSendTimer1);
  clearTimeout(delayedSendTimer2);
  delayedSendTimer1 = setTimeout(sendProblemInfo, 1000);
  delayedSendTimer2 = setTimeout(sendProblemInfo, 3000);

  logTracking("Problem title watcher active");
}

// ──────────────────────────────────────────────
// Idle detection — CP-friendly 15-minute timeout
// ──────────────────────────────────────────────

function logIdle(message, data) {
  console.log("[AetherCP:idle]", message, data !== undefined ? data : "");
}

function sendIdleMessage() {
  if (isIdle) return; // already idle, don't double-send

  isIdle = true;

  const idleStartedAt = lastActivityAt + IDLE_TIMEOUT_MS;
  logIdle("Sending USER_IDLE", {
    lastActivityAt: new Date(lastActivityAt).toISOString(),
    idleStartedAt:  new Date(idleStartedAt).toISOString(),
    timeoutMs: IDLE_TIMEOUT_MS
  });

  safeSendMessage({ type: MESSAGE_TYPES.USER_IDLE, idleStartedAt });
}

function sendActiveMessage(isResume = true) {
  if (isResume) {
    logIdle("Sending USER_ACTIVE (resuming from idle)");
  } else {
    logIdle("Sending USER_ACTIVE (activity update)");
  }
  safeSendMessage({ type: MESSAGE_TYPES.USER_ACTIVE });
}

function resetIdleTimer() {
  clearTimeout(idleTimerId);
  idleTimerId = setTimeout(() => {
    logIdle("Idle timeout fired", { timeoutMs: IDLE_TIMEOUT_MS });
    sendIdleMessage();
  }, IDLE_TIMEOUT_MS);
}

function handleUserActivity() {
  lastActivityAt = Date.now();

  if (isIdle) {
    isIdle = false;
    logIdle("Activity detected — resuming from idle");
    sendActiveMessage(true);
    lastActivityNotificationTime = lastActivityAt;
  } else {
    // Throttled notification for active sessions
    if (lastActivityAt - lastActivityNotificationTime > ACTIVITY_THROTTLE_MS) {
      sendActiveMessage(false);
      lastActivityNotificationTime = lastActivityAt;
    }
  }

  resetIdleTimer();
}

function handleWindowFocus() {
  logIdle("Window focus — treating as activity");
  handleUserActivity();
}

function handleVisibilityChange() {
  if (document.hidden) {
    logIdle("Tab hidden — letting idle timer continue in background");
  } else {
    logIdle("Tab visible — checking activity");
    // If we exceeded the idle timeout while hidden, treat as idle resumed
    if (Date.now() - lastActivityAt > IDLE_TIMEOUT_MS) {
      isIdle = true;
    }
    handleUserActivity();
  }
}

function watchForUserActivity() {
  window.addEventListener("keydown", handleUserActivity, { passive: true });
  window.addEventListener("click",   handleUserActivity, { passive: true });
  window.addEventListener("focus",   handleWindowFocus);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  logIdle("Activity watchers registered", { IDLE_TIMEOUT_MS });
  resetIdleTimer();
}

// ──────────────────────────────────────────────
// Cleanup — full teardown of all tracking state
// ──────────────────────────────────────────────

function logCleanup(message) {
  console.log("[AetherCP CLEANUP]", message);
}

function cleanupContentScript() {
  logCleanup("Cleanup triggered");

  // 1. Disconnect MutationObserver
  if (problemObserver) {
    problemObserver.disconnect();
    problemObserver = null;
    logCleanup("Problem observer disconnected");
  }

  // 2. Clear idle timer
  if (idleTimerId !== null) {
    clearTimeout(idleTimerId);
    idleTimerId = null;
    logCleanup("Idle timer cleared");
  }

  // 3. Clear delayed send timers
  if (delayedSendTimer1 !== null) {
    clearTimeout(delayedSendTimer1);
    delayedSendTimer1 = null;
  }
  if (delayedSendTimer2 !== null) {
    clearTimeout(delayedSendTimer2);
    delayedSendTimer2 = null;
    logCleanup("Delayed send timers cleared");
  }

  // 4. Remove activity event listeners
  window.removeEventListener("keydown", handleUserActivity);
  window.removeEventListener("click",   handleUserActivity);
  window.removeEventListener("focus",   handleWindowFocus);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  logCleanup("Activity listeners removed");

  // 5. Mark as destroyed so any in-flight callbacks bail
  trackingInitialized = false;
  logCleanup("Cleanup complete");
}

// ──────────────────────────────────────────────
// Startup — page-scoped initialization
// ──────────────────────────────────────────────

function initializeTracking() {
  // Prevent duplicate initialization from stale script instances
  if (trackingInitialized) {
    logContent("Tracking already initialized — skipping duplicate start");
    return;
  }

  const url       = window.location.href;
  const supported = isSupportedTrackingPage();

  if (!supported) {
    logContent("Page not a supported tracking page — skipping init", { url });
    return;
  }

  trackingInitialized = true;
  logContent("Supported tracking page detected — initializing", { url });
  watchForProblemTitle();
  watchForUserActivity();
}

// Cleanup on page unload — prevents orphan observers/timers
window.addEventListener("beforeunload", cleanupContentScript);

if (document.readyState === "loading") {
  // { once: true } prevents stale re-firing after extension reload
  document.addEventListener("DOMContentLoaded", initializeTracking, { once: true });
} else {
  initializeTracking();
}
