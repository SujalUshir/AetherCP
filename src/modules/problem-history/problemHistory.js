function getRecentProblems(state, activeSession) {
  const problems = Object.values(state.problems || {});
  const now = Date.now();

  return problems
    .map((problem) => {
      let liveSeconds = 0;

      if (activeSession?.problemKey === problem.problemKey) {
        liveSeconds = Math.floor((now - activeSession.startedAt) / 1000);
      }

      return {
        problemKey: problem.problemKey,
        problemName: problem.problemName,
        platform: problem.platform,
        platformShortName: getPlatformShortName(problem.platform),
        totalSeconds: problem.totalSeconds + liveSeconds,
        lastSeenAt: problem.lastSeenAt || problem.firstSeenAt || 0
      };
    })
    .sort((first, second) => second.lastSeenAt - first.lastSeenAt)
    .slice(0, AETHERCP_CONSTANTS.RECENT_PROBLEMS_LIMIT);
}
