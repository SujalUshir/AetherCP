function getDailyAnalytics(state, activeSession) {
  const todayKey = getTodayKey();
  const todayStart = getStartOfToday();
  const now = Date.now();
  const perProblemSeconds = {};

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

  let mostWorkedProblem = null;
  let mostWorkedSeconds = 0;

  Object.entries(perProblemSeconds).forEach(([problemKey, seconds]) => {
    if (seconds > mostWorkedSeconds) {
      mostWorkedSeconds = seconds;
      mostWorkedProblem = state.problems[problemKey] || null;
    }
  });

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
