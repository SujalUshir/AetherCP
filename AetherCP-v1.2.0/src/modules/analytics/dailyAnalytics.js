// ============================================================
// dailyAnalytics.js
// AetherCP — Daily Analytics Module
//
// Calculates daily problem-solving session analytics including
// time spent today, problems worked today, and the most worked problem.
// ============================================================

// ──────────────────────────────────────────────
// Main Analytics Logic
// ──────────────────────────────────────────────

/**
 * Calculates daily analytics from the extension state and any currently active session.
 * Computes total time spent today, the number of distinct problems worked today, and
 * details on the most worked problem of the day.
 *
 * All overlap calculations delegate to local timezone-aware helpers to match IST boundaries.
 *
 * @param {object} state - The global extension state.
 * @param {object} state.problems - Map of problemKey to problem records.
 * @param {object} state.dailyTotals - Map of dateKey (YYYY-MM-DD) to daily total summaries.
 * @param {object|null} activeSession - The active timer session, if any.
 * @returns {object} The computed daily analytics snapshot.
 */
function getDailyAnalytics(state, activeSession) {
  const todayKey = getTodayKey();
  const todayStart = getStartOfToday();
  const now = Date.now();
  const perProblemSeconds = {};

  // Compute time spent today per problem from historical sessions
  Object.values(state.problems || {}).forEach((problem) => {
    (problem.sessions || []).forEach((session) => {
      const secondsToday = getOverlapSeconds(
        session.startedAt,
        session.endedAt,
        todayStart,
        now
      );

      if (secondsToday > 0) {
        perProblemSeconds[problem.problemKey] =
          (perProblemSeconds[problem.problemKey] || 0) + secondsToday;
      }
    });
  });

  // Factor in the currently active session if it matches a tracked problem
  if (activeSession) {
    const activeProblem = state.problems[activeSession.problemKey];
    const activeSecondsToday = getOverlapSeconds(
      activeSession.startedAt,
      now,
      todayStart,
      now
    );

    if (activeProblem && activeSecondsToday > 0) {
      perProblemSeconds[activeProblem.problemKey] =
        (perProblemSeconds[activeProblem.problemKey] || 0) + activeSecondsToday;
    }
  }

  // Find the problem that the user worked on the most today
  let mostWorkedProblem = null;
  let mostWorkedSeconds = 0;

  Object.entries(perProblemSeconds).forEach(([problemKey, seconds]) => {
    if (seconds > mostWorkedSeconds) {
      mostWorkedSeconds = seconds;
      mostWorkedProblem = state.problems[problemKey] || null;
    }
  });

  // Calculate today's overall total (previously saved + current active)
  const savedTodaySeconds = state.dailyTotals[todayKey]?.totalSeconds || 0;
  const activeTodaySeconds = activeSession
    ? getOverlapSeconds(activeSession.startedAt, now, todayStart, now)
    : 0;

  return {
    todaySeconds: savedTodaySeconds + activeTodaySeconds,
    problemsWorkedToday: Object.keys(perProblemSeconds).length,
    mostWorkedProblem: mostWorkedProblem
      ? {
          problemKey: mostWorkedProblem.problemKey,
          problemName: mostWorkedProblem.problemName,
          platform: mostWorkedProblem.platform,
          platformShortName: getPlatformShortName(mostWorkedProblem.platform),
          secondsToday: mostWorkedSeconds
        }
      : null
  };
}

