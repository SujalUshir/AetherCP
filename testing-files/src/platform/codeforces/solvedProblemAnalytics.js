(() => {
// ============================================================
// solvedProblemAnalytics.js
// AetherCP – Solved Problem Analytics
//
// Responsibilities:
//   - Deduplicate solved submissions by the most stable available key
//   - Build rating distribution: { rating -> count }
//   - Build topic distribution from Codeforces problem tags
//   - Return clean, sorted arrays ready for chart rendering
//   - Include full solve-type breakdown: contest, practice, gym, virtual
//
// COUNTING RULE (strict)
// --------------------------------------------------
// A solve counts when:   submission.verdict === "OK"
//
// Rating, contestId, index are NOT required to count.
// Only verdict === "OK" is required.
//
// DEDUPLICATION KEY PRIORITY
// --------------------------------------------------
//   1. contestId + index              (most stable)
//   2. problemsetName + index
//   3. contestId + name               (when index missing)
//   4. name-exact-<name>              (last resort, exact not normalized)
//   5. random hash                    (truly anonymous problem — never deduped)
//
// NOTE: gym problems (contestId >= 100000) use the SAME key scheme.
//       They are distinct from contest problems even if index matches.
//
// PARTICIPANT TYPE CLASSIFICATION
// --------------------------------------------------
//   CONTESTANT / OUT_OF_COMPETITION → contest solves
//   PRACTICE                        → practice solves
//   VIRTUAL                         → virtual solves
//   contestId >= 100000             → gym solves (regardless of participantType)
//   everything else                 → other (MANAGER, SPECTATOR, UNKNOWN…)
// ============================================================

function logCFAnalytics(message, data) {
  console.log("[AetherCP CF]", "[analytics]", message, data !== undefined ? data : "");
}

function logSolvedDetail(message, data) {
  console.log("[AetherCP SOLVED]", message, data !== undefined ? data : "");
}

// ──────────────────────────────────────────────────────
// DEDUPLICATION KEY
// ──────────────────────────────────────────────────────

/**
 * Generate a unique key for a Codeforces submission's problem.
 *
 * Only verdict===OK submissions reach this function.
 * No name normalization — exact name only to prevent false merges.
 *
 * @param {Object} sub — raw submission from CF API
 * @returns {string}
 */
function getProblemUniqueKey(sub) {
  const problem = sub.problem || {};

  // contestId: prefer submission-level, fall back to problem-level
  let contestId = sub.contestId;
  if (contestId === undefined || contestId === null || contestId === "") {
    contestId = problem.contestId;
  }

  const index          = typeof problem.index === "string" ? problem.index.trim().toUpperCase() : "";
  const problemsetName = typeof problem.problemsetName === "string" ? problem.problemsetName.trim() : "";
  const name           = typeof problem.name === "string" ? problem.name.trim() : "";

  // 1. contestId + index  (most stable)
  if (contestId !== undefined && contestId !== null && contestId !== "" && index) {
    return `c${contestId}-${index}`;
  }

  // 2. problemsetName + index
  if (problemsetName && index) {
    return `ps-${problemsetName}-${index}`;
  }

  // 3. contestId + exactName (when index missing)
  if (contestId !== undefined && contestId !== null && contestId !== "" && name) {
    return `c${contestId}-n:${name}`;
  }

  // 4. exactName ONLY as last-resort fallback (no normalization)
  if (name) {
    return `name:${name}`;
  }

  // 5. generated fallback hash (truly anonymous — never deduplicate)
  return `anon-${Math.random().toString(36).slice(2, 11)}`;
}

// ──────────────────────────────────────────────────────
// SOLVE SET BUILDER
// ──────────────────────────────────────────────────────

/**
 * Process all raw submissions into a deduplicated solve map.
 *
 * ONLY requirement to count: verdict === "OK".
 * No filtering on rating, contestId, index, or metadata.
 *
 * @param {Array} submissions — raw array from CF API
 * @returns {Object}
 */
function buildSolvedSet(submissions) {
  const solvedMap = new Map();

  // Diagnostic counters
  const totalSubmissions     = submissions.length;
  let acceptedCount          = 0;   // verdict === "OK" (before dedup)
  let skippedNonOk           = 0;
  let skippedNullSub         = 0;
  let skippedMissingProblem  = 0;   // verdict=OK but sub.problem missing
  let duplicateCount         = 0;   // deduped away (same problem, multiple solves)

  // Solve-type counters (counted BEFORE dedup, for raw breakdown insight)
  let contestSolves   = 0;
  let practiceSolves  = 0;
  let gymSolves       = 0;
  let virtualSolves   = 0;
  let otherSolves     = 0;

  // Participant type frequencies
  const ptCountsAll = {};
  const ptCountsOk = {};

  logSolvedDetail("=== BEGIN AUDIT ===");
  logSolvedDetail("Total submissions received from API:", totalSubmissions);

  for (const sub of submissions) {
    // Guard: null/undefined submission
    if (!sub) {
      skippedNullSub++;
      continue;
    }

    // Track participant type across ALL submissions (even non-OK)
    const pt = (sub.author && sub.author.participantType) || "UNKNOWN";
    ptCountsAll[pt] = (ptCountsAll[pt] || 0) + 1;

    // ── PRIMARY FILTER: only verdict === "OK" counts ──────────
    if (sub.verdict !== "OK") {
      skippedNonOk++;
      continue;
    }

    // Track participant type for OK submissions
    ptCountsOk[pt] = (ptCountsOk[pt] || 0) + 1;

    // ── Guard: problem metadata missing ───────────────────────
    if (!sub.problem) {
      skippedMissingProblem++;
      console.warn("[AetherCP SOLVED] skipped accepted submission: malformed problem object", {
        reason: "malformed problem object",
        submission: sub
      });
      continue;
    }

    acceptedCount++;

    // ── Classification (BEFORE dedup, for raw stats) ──────────
    let contestId = sub.contestId;
    if (contestId === undefined || contestId === null || contestId === "") {
      contestId = sub.problem.contestId;
    }
    const isGym = typeof contestId === "number" && contestId >= 100000;

    if (isGym) {
      gymSolves++;
    } else if (pt === "VIRTUAL") {
      virtualSolves++;
    } else if (pt === "CONTESTANT" || pt === "OUT_OF_COMPETITION") {
      contestSolves++;
    } else if (pt === "PRACTICE") {
      practiceSolves++;
    } else {
      // MANAGER, SPECTATOR, UNKNOWN — still count
      otherSolves++;
    }

    // ── Deduplication ─────────────────────────────────────────
    const key = getProblemUniqueKey(sub);

    if (!key) {
      console.warn("[AetherCP SOLVED] skipped accepted submission: missing unique key", {
        reason: "missing unique key",
        submission: sub
      });
      continue;
    }

    // Verify if metadata is weird (lacking basic identification details) but still allowed to count
    const hasAnyMetadata = sub.problem.name || sub.problem.index || contestId || sub.problem.problemsetName;
    if (!hasAnyMetadata) {
      console.warn("[AetherCP SOLVED] accepted submission has weird/invalid metadata (counting anyway)", {
        reason: "invalid metadata",
        key: key,
        submission: sub
      });
    }

    if (solvedMap.has(key)) {
      duplicateCount++;
      console.log("[AetherCP SOLVED] skipped accepted submission: duplicate key", {
        reason: "duplicate key",
        key: key,
        existing: solvedMap.get(key),
        duplicate: sub
      });
    } else {
      solvedMap.set(key, sub.problem);
    }
  }

  // ── Full diagnostic output ─────────────────────────────────
  console.log("[AetherCP SOLVED] Participant type distribution (ALL submissions):", ptCountsAll);
  console.log("[AetherCP SOLVED] Participant type distribution (OK submissions):", ptCountsOk);

  logSolvedDetail("--- Submission pipeline ---");
  logSolvedDetail("Total received from API:", totalSubmissions);
  logSolvedDetail("Null/invalid entries:", skippedNullSub);
  logSolvedDetail("Non-OK verdict (WA, TLE, CE…):", skippedNonOk);
  logSolvedDetail("Verdict=OK but sub.problem missing:", skippedMissingProblem);
  logSolvedDetail("Verdict=OK, counted (before dedup):", acceptedCount);
  logSolvedDetail("");
  logSolvedDetail("--- Raw solve breakdown (before dedup) ---");
  logSolvedDetail("Contest solves (CONTESTANT/OUT_OF_COMPETITION):", contestSolves);
  logSolvedDetail("Practice solves (PRACTICE):", practiceSolves);
  logSolvedDetail("Virtual solves (VIRTUAL):", virtualSolves);
  logSolvedDetail("Gym solves (contestId >= 100000):", gymSolves);
  logSolvedDetail("Other solves (MANAGER/SPECTATOR/UNKNOWN):", otherSolves);
  logSolvedDetail("Sum (should equal acceptedCount):", contestSolves + practiceSolves + virtualSolves + gymSolves + otherSolves);
  logSolvedDetail("");
  logSolvedDetail("--- Deduplication ---");
  logSolvedDetail("Duplicate removes (same problem solved multiple times/modes):", duplicateCount);
  logSolvedDetail("FINAL unique solved count:", solvedMap.size);
  logSolvedDetail("=== END AUDIT ===");

  // Count rated problems (for stats card — does NOT affect solved count)
  let ratedCount = 0;
  for (const [, problem] of solvedMap) {
    if (problem.rating != null) ratedCount++;
  }
  logSolvedDetail("Of those, problems with a difficulty rating:", ratedCount);
  logSolvedDetail("Problems WITHOUT a rating (unrated/gym/educational):", solvedMap.size - ratedCount);

  return {
    solvedMap,
    contestSolves,
    practiceSolves,
    gymSolves,
    virtualSolves,
    otherSolves,
    ratedCount
  };
}

// ──────────────────────────────────────────────────────
// RATING DISTRIBUTION
// (only for problems that HAVE a rating — unrated excluded from chart only)
// ──────────────────────────────────────────────────────

function buildRatingDistribution(solvedMap) {
  const ratingCounts = new Map();

  for (const [, problem] of solvedMap) {
    const rating = problem.rating;
    if (rating == null || rating === 0) continue; // exclude unrated from chart only
    ratingCounts.set(rating, (ratingCounts.get(rating) || 0) + 1);
  }

  const distribution = Array.from(ratingCounts.entries())
    .map(([rating, count]) => ({ rating: Number(rating), count }))
    .sort((a, b) => a.rating - b.rating);

  logCFAnalytics("Rating distribution buckets:", distribution.length);
  return distribution;
}

function buildTopicDistribution(solvedMap) {
  const tagCounts = new Map();

  for (const [, problem] of solvedMap) {
    const tags = Array.isArray(problem.tags) ? problem.tags : [];

    for (const tag of tags) {
      if (!tag) continue;
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  const distribution = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((first, second) => second.count - first.count || first.tag.localeCompare(second.tag));

  logCFAnalytics("Topic distribution buckets:", distribution.length);
  return distribution;
}

// ──────────────────────────────────────────────────────
// MASTER ENTRY POINT
// ──────────────────────────────────────────────────────

function processCFSubmissions(submissions) {
  const {
    solvedMap,
    contestSolves,
    practiceSolves,
    gymSolves,
    virtualSolves,
    otherSolves,
    ratedCount
  } = buildSolvedSet(submissions);

  const ratingDist = buildRatingDistribution(solvedMap);
  const topicDist = buildTopicDistribution(solvedMap);

  logCFAnalytics("Final result", {
    solvedCount:   solvedMap.size,
    ratingBuckets: ratingDist.length,
    topicBuckets: topicDist.length
  });

  return {
    solvedCount: solvedMap.size,
    ratingDist,
    topicDist,
    contestSolves,
    practiceSolves,
    gymSolves,
    virtualSolves,
    // mashupSolves removed — was misleading; gym already covers this
    otherSolves,
    ratedCount
  };
}

// Expose to global scope
window.processCFSubmissions = processCFSubmissions;

console.log("[AetherCP LOAD] solvedProblemAnalytics.js loaded");
})();
