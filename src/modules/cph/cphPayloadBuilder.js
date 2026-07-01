// ============================================================
// cphPayloadBuilder.js
// AetherCP — Competitive Companion Payload Builder
//
// Constructs the official Competitive Companion JSON payload
// from an AetherCP problem record.
//
// Payload schema matches the Competitive Companion protocol:
//   https://github.com/jmerle/competitive-companion
//
// Fields:
//   name         — problem display name
//   group        — platform + contest identifier
//   url          — problem URL
//   interactive  — always false for Codeforces
//   memoryLimit  — MB (integer)
//   timeLimit    — ms (integer)
//   tests        — array of { input, output } strings
//   testType     — "single"
//   input/output — { type: "stdin" } / { type: "stdout" }
//   languages    — java taskClass hint
//   batch        — { id, size }
// ============================================================

// ──────────────────────────────────────────────
// Helper Functions
// ──────────────────────────────────────────────

/**
 * Generates a unique batch identifier without external dependencies.
 * Uses a combination of the current base-36 timestamp and a random alphanumeric string.
 *
 * @returns {string} The generated batch ID.
 */
function generateBatchId() {
  // Simple unique-enough ID without crypto dependency
  const ts   = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${ts}-${rand}`;
}

/**
 * Constructs the group name for a Codeforces problem based on its URL.
 * Matches contest/gym identifiers or defaults to the problemset.
 *
 * @param {string} url - The URL of the Codeforces problem.
 * @returns {string} The formatted group name.
 */
function buildCodeforcesGroup(url) {
  // /contest/2100/problem/A  → "Codeforces - Contest 2100"
  const contestMatch = url.match(/\/contest\/(\d+)\//);
  if (contestMatch) return `Codeforces - Contest ${contestMatch[1]}`;

  // /gym/100001/problem/A → "Codeforces - Gym 100001"
  const gymMatch = url.match(/\/gym\/(\d+)\//);
  if (gymMatch) return `Codeforces - Gym ${gymMatch[1]}`;

  // /problemset/problem/2100/A → "Codeforces - Problemset"
  return "Codeforces - Problemset";
}

/**
 * Converts a problem name into a valid Java class name.
 * "1234A - Sum of Two Numbers" → "Task1234ASumOfTwoNumbers"
 *
 * @param {string} name - The display name of the problem.
 * @returns {string} The sanitized Java class name.
 */
function toTaskClassName(name) {
  if (!name) return "Task";
  return "Task" + name
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
    .slice(0, 40); // reasonable cap
}

// ──────────────────────────────────────────────
// Main Builder
// ──────────────────────────────────────────────

/**
 * Build a Competitive Companion–compatible payload from a problem record.
 *
 * The problem record is the object stored in background state.tabProblems,
 * which is now extended by content.js to include:
 *   - tests       : Array<{ input: string, output: string }>
 *   - timeLimit   : number  (milliseconds)
 *   - memoryLimit : number  (megabytes)
 *
 * @param {object} problem — problem record from background state
 * @returns {object} payload ready to POST to CPH receiver
 */
function buildCphPayload(problem) {
  const platform    = problem.platform || "";
  const isCodeforces = platform === AETHERCP_CONSTANTS.PLATFORMS.CODEFORCES;

  // ── Tests ────────────────────────────────
  const tests = Array.isArray(problem.tests) ? problem.tests : [];

  // ── Limits ───────────────────────────────
  // content.js provides timeLimit (ms) and memoryLimit (MB).
  // Fall back to sensible defaults if extraction failed.
  const timeLimit   = (typeof problem.timeLimit === "number" && problem.timeLimit > 0)
    ? problem.timeLimit
    : (isCodeforces ? 2000 : 0); // LC doesn't expose time limits

  const memoryLimit = (typeof problem.memoryLimit === "number" && problem.memoryLimit > 0)
    ? problem.memoryLimit
    : 256;

  // ── Group ────────────────────────────────
  let group = platform || "Unknown";
  if (isCodeforces) group = buildCodeforcesGroup(problem.url || "");

  // ── Payload ──────────────────────────────
  const payload = {
    name:        problem.problemName || "Unknown Problem",
    group,
    url:         problem.url || "",
    interactive: false,
    memoryLimit,
    timeLimit,
    tests,
    testType:    "single",
    input:       { type: "stdin" },
    output:      { type: "stdout" },
    languages: {
      java: {
        mainClass: "Main",
        taskClass: toTaskClassName(problem.problemName)
      }
    },
    batch: {
      id:   generateBatchId(),
      size: 1
    }
  };

  console.log("[AetherCP CPH] Payload built", {
    name:        payload.name,
    group:       payload.group,
    platform,
    tests:       tests.length,
    timeLimit,
    memoryLimit
  });

  return payload;
}
