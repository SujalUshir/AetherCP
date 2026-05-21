function getAetherProfileNameFromUrl() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] || "profile";
}

function getAetherProfileAnalytics(snapshot) {
  const analytics = snapshot?.profileAnalytics || {};
  const state = snapshot?.state || {};
  const charts = analytics.charts || {};

  const profileAnalytics = {
    handle: getAetherProfileNameFromUrl(),
    totalCodingSeconds: analytics.totalCodingSeconds || 0,
    todaySeconds: analytics.todaySeconds || 0,
    totalProblemsWorked: analytics.totalProblemsWorked || 0,
    currentStreak: getCurrentStreak(
      state.dailyTotals || {},
      analytics.todaySeconds || 0
    ),
    mostWorkedProblem: analytics.mostWorkedProblem,
    mostUsedPlatform: getMostUsedPlatform(charts.platformDistribution || []),
    currentActiveProblem: analytics.currentActiveProblem,
    status: analytics.status || "Stopped",
    allRecentProblems: analytics.allRecentProblems || [],
    charts: {
      platformDistribution: charts.platformDistribution || [],
      problemTimeDistribution: charts.problemTimeDistribution || [],
      lastSevenDays: charts.lastSevenDays || []
    }
  };

  console.log("[AetherCP:profile]", "analytics generated", profileAnalytics);

  return profileAnalytics;
}

function getMostUsedPlatform(platformDistribution) {
  if (!platformDistribution.length) return null;

  return platformDistribution.reduce((best, current) => {
    if (!best || current.seconds > best.seconds) {
      return current;
    }

    return best;
  }, null);
}

function getCurrentStreak(dailyTotals, todaySeconds) {
  let streak = 0;
  const date = new Date();

  while (true) {
    const dateKey = getDateKey(date);
    const savedSeconds = dailyTotals[dateKey]?.totalSeconds || 0;
    const totalSeconds = dateKey === getTodayKey() ? todaySeconds : savedSeconds;

    if (totalSeconds <= 0) break;

    streak += 1;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}

function formatAetherProblemName(problem) {
  if (!problem) return "None";

  const prefix = problem.platformShortName || problem.platform || "";
  return `${prefix} ${problem.problemName}`.trim();
}
