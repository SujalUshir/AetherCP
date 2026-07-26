// ============================================================
// cphStatus.js
// AetherCP — CPH Connection Health
//
// Checks whether the CPH receiver is reachable at localhost:27121.
//
// Uses a 10-second in-memory cache so the popup never spams
// localhost on every 1-second refresh cycle. The cache lives
// in the service worker's memory and resets if the SW sleeps.
// ============================================================

const CPH_STATUS_ENDPOINT   = "http://localhost:27121";
const CPH_STATUS_TIMEOUT_MS = 2000;   // 2 seconds — faster than send timeout
const CPH_STATUS_TTL_MS     = 10000;  // 10 second cache

// In-memory cache — service worker scope
let _cphStatusCache = {
  checkedAt:  0,
  reachable:  false
};

/**
 * Check whether the CPH receiver is currently reachable.
 *
 * Returns a cached result if the last check was within 10 seconds.
 * A real check sends a minimal POST — ANY HTTP response (even 4xx/5xx)
 * means the receiver is running. Only a connection error means it is not.
 *
 * @returns {Promise<{ reachable: boolean, cached: boolean }>}
 */
async function checkCphReceiver() {
  const now = Date.now();

  if (now - _cphStatusCache.checkedAt < CPH_STATUS_TTL_MS) {
    console.log("[AetherCP CPH] Status cache hit", {
      reachable: _cphStatusCache.reachable,
      ageMs: now - _cphStatusCache.checkedAt
    });
    return { reachable: _cphStatusCache.reachable, cached: true };
  }

  console.log("[AetherCP CPH] Checking receiver status");

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), CPH_STATUS_TIMEOUT_MS);

  try {
    // Send a minimal POST. CPH receiver responds to any POST.
    const response = await fetch(CPH_STATUS_ENDPOINT, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    "{}",
      signal:  controller.signal
    });

    clearTimeout(timeoutId);

    _cphStatusCache = { checkedAt: now, reachable: true };
    console.log("[AetherCP CPH] Receiver detected", { status: response.status });
    return { reachable: true, cached: false };

  } catch (err) {
    clearTimeout(timeoutId);

    _cphStatusCache = { checkedAt: now, reachable: false };

    if (err.name === "AbortError") {
      console.log("[AetherCP CPH] Receiver status: timeout");
    } else {
      console.log("[AetherCP CPH] Receiver status: connection failed", {
        error: err.message
      });
    }

    return { reachable: false, cached: false };
  }
}

/**
 * Immediately invalidate the cache, forcing the next call to re-check.
 * Call this after a successful SEND_TO_CPH to refresh status eagerly.
 */
function invalidateCphStatusCache() {
  _cphStatusCache = { checkedAt: 0, reachable: false };
}
