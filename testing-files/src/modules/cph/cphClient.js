// ============================================================
// cphClient.js
// AetherCP — CPH HTTP Client
//
// Sends a Competitive Companion–compatible problem payload to
// the CPH receiver running at http://localhost:27121.
//
// Protocol reference:
//   https://github.com/jmerle/competitive-companion
//
// All errors are caught and returned as structured objects.
// This function NEVER throws.
// ============================================================

const CPH_ENDPOINT  = "http://localhost:27121";
const CPH_TIMEOUT_MS = 3000; // 3 seconds

/**
 * POST the given payload to the CPH receiver.
 *
 * @param {object} payload — Competitive Companion–compatible JSON object
 * @returns {Promise<{ok: boolean, status?: number, reason?: string, message?: string}>}
 */
async function sendToCph(payload) {
  console.log("[AetherCP CPH] Sending request to CPH receiver", {
    endpoint: CPH_ENDPOINT,
    problem: payload.name,
    tests: payload.tests ? payload.tests.length : 0
  });

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), CPH_TIMEOUT_MS);

  try {
    const body = JSON.stringify(payload);

    const response = await fetch(CPH_ENDPOINT, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal:  controller.signal
    });

    clearTimeout(timeoutId);

    console.log("[AetherCP CPH] Response received", { status: response.status });

    // CPH typically responds with 200. Any response means it was received.
    return { ok: true, status: response.status };

  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      console.warn("[AetherCP CPH] Request timed out", { timeoutMs: CPH_TIMEOUT_MS });
      return {
        ok:      false,
        reason:  "timeout",
        message: `Request timed out after ${CPH_TIMEOUT_MS}ms`
      };
    }

    // ECONNREFUSED / ERR_CONNECTION_REFUSED — receiver not listening
    const isRefused =
      err.message &&
      (err.message.includes("Failed to fetch") ||
       err.message.includes("ECONNREFUSED")     ||
       err.message.includes("ERR_CONNECTION_REFUSED"));

    if (isRefused) {
      console.warn("[AetherCP CPH] Connection refused — receiver not running");
      return {
        ok:      false,
        reason:  "refused",
        message: "CPH receiver is not running"
      };
    }

    console.warn("[AetherCP CPH] Request failed", { error: err.message });
    return {
      ok:      false,
      reason:  "error",
      message: err.message || "Unknown network error"
    };
  }
}
