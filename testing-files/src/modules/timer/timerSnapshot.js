function getTotalCodingSeconds(state, activeSession) {
  const savedSeconds = Object.values(state.problems || {}).reduce(
    (total, problem) => total + (problem.totalSeconds || 0),
    0
  );

  if (!activeSession) return savedSeconds;

  return savedSeconds + Math.floor((Date.now() - activeSession.startedAt) / 1000);
}

function getMostWorkedProblem(state) {
  return Object.values(state.problems || {}).reduce((currentBest, problem) => {
    if (!currentBest || problem.totalSeconds > currentBest.totalSeconds) {
      return problem;
    }

    return currentBest;
  }, null);
}

function getRecentProblemRows(state, activeSession) {
  const now = Date.now();

  return Object.values(state.problems || {})
    .map((problem) => {
      const liveSeconds =
        activeSession?.problemKey === problem.problemKey
          ? Math.floor((now - activeSession.startedAt) / 1000)
          : 0;

      return {
        problemKey: problem.problemKey,
        problemName: problem.problemName,
        platform: problem.platform,
        platformShortName: getPlatformShortName(problem.platform),
        totalSeconds: problem.totalSeconds + liveSeconds,
        lastSeenAt: problem.lastSeenAt || problem.firstSeenAt || 0,
        sessionCount: (problem.sessions || []).length
      };
    })
    .sort((first, second) => second.lastSeenAt - first.lastSeenAt);
}

function getPlatformDistribution(state, activeSession) {
  const totals = {};
  const now = Date.now();

  Object.values(state.problems || {}).forEach((problem) => {
    const liveSeconds =
      activeSession?.problemKey === problem.problemKey
        ? Math.floor((now - activeSession.startedAt) / 1000)
        : 0;

    totals[problem.platform] =
      (totals[problem.platform] || 0) + problem.totalSeconds + liveSeconds;
  });

  return Object.entries(totals)
    .filter(([, seconds]) => seconds > 0)
    .map(([label, seconds]) => ({
      label,
      seconds
    }));
}

function getProblemTimeDistribution(state, activeSession, limit = 6) {
  return getRecentProblemRows(state, activeSession)
    .filter((problem) => problem.totalSeconds > 0)
    .sort((first, second) => second.totalSeconds - first.totalSeconds)
    .slice(0, limit)
    .map((problem) => ({
      label: `${problem.platformShortName} ${problem.problemName}`,
      seconds: problem.totalSeconds
    }));
}

function getLastSevenDays(state, activeSession) {
  const now = Date.now();
  const today = new Date();
  const days = [];

  for (let index = 6; index >= 0; index--) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);

    const dateKey = getDateKey(date);
    let seconds = state.dailyTotals[dateKey]?.totalSeconds || 0;

    if (activeSession && dateKey === getTodayKey()) {
      seconds += getOverlapSeconds(
        activeSession.startedAt,
        now,
        getStartOfToday(),
        now
      );
    }

    days.push({
      label: dateKey.slice(5),
      date: dateKey,
      seconds
    });
  }

  return days;
}

function buildTimerSnapshot(state) {
  const activeSession = state.activeSession;
  const dailyAnalytics = getDailyAnalytics(state, activeSession);
  const allRecentProblems = getRecentProblemRows(state, activeSession);
  const mostWorkedProblem = getMostWorkedProblem(state);

  let activeProblem = null;
  let currentProblemSeconds = 0;

  if (activeSession) {
    const problem = state.problems[activeSession.problemKey];
    const activeElapsedSeconds = Math.floor(
      (Date.now() - activeSession.startedAt) / 1000
    );

    if (problem) {
      activeProblem = problem;
      currentProblemSeconds = problem.totalSeconds + activeElapsedSeconds;
    }
  }

  if (!activeProblem && state.idleState) {
    activeProblem = state.problems[state.idleState.problemKey] || null;
    currentProblemSeconds = activeProblem?.totalSeconds || 0;
  }

  return {
    tracking: Boolean(activeSession),
    idle: Boolean(state.idleState),
    activeProblem,
    currentProblemSeconds,
    todaySeconds: dailyAnalytics.todaySeconds,
    dailyAnalytics,
    recentProblems: allRecentProblems.slice(0, AETHERCP_CONSTANTS.RECENT_PROBLEMS_LIMIT),
    profileAnalytics: {
      totalCodingSeconds: getTotalCodingSeconds(state, activeSession),
      totalProblemsWorked: Object.keys(state.problems || {}).length,
      todaySeconds: dailyAnalytics.todaySeconds,
      problemsWorkedToday: dailyAnalytics.problemsWorkedToday,
      mostWorkedProblem: mostWorkedProblem
        ? {
            problemName: mostWorkedProblem.problemName,
            platform: mostWorkedProblem.platform,
            platformShortName: getPlatformShortName(mostWorkedProblem.platform),
            totalSeconds: mostWorkedProblem.totalSeconds
          }
        : null,
      currentActiveProblem: activeProblem
        ? {
            problemName: activeProblem.problemName,
            platform: activeProblem.platform,
            platformShortName: getPlatformShortName(activeProblem.platform)
          }
        : null,
      status: state.idleState ? "Idle" : activeSession ? "Tracking" : "Stopped",
      allRecentProblems,
      charts: {
        platformDistribution: getPlatformDistribution(state, activeSession),
        problemTimeDistribution: getProblemTimeDistribution(state, activeSession),
        lastSevenDays: getLastSevenDays(state, activeSession)
      }
    },
    state
  };
}
