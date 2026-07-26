function ensureProblemRecord(state, problem) {
  const problemKey = getProblemKey(problem);

  if (!state.problems[problemKey]) {
    state.problems[problemKey] = {
      problemKey,
      problemName: problem.problemName,
      name: problem.problemName,
      platform: problem.platform,
      url: normalizeUrl(problem.url),
      rating: problem.rating !== undefined ? problem.rating : null,
      contestId: problem.contestId !== undefined ? problem.contestId : null,
      index: problem.index !== undefined ? problem.index : null,
      totalSeconds: 0,
      firstSeenAt: Date.now(),
      lastSeenAt: Date.now(),
      sessions: []
    };
  }

  state.problems[problemKey].problemName = problem.problemName;
  state.problems[problemKey].name = problem.problemName;
  state.problems[problemKey].platform = problem.platform;
  state.problems[problemKey].url = normalizeUrl(problem.url);
  state.problems[problemKey].lastSeenAt = Date.now();

  if (problem.rating !== undefined) {
    state.problems[problemKey].rating = problem.rating;
  }
  if (problem.contestId !== undefined) {
    state.problems[problemKey].contestId = problem.contestId;
  }
  if (problem.index !== undefined) {
    state.problems[problemKey].index = problem.index;
  }

  return state.problems[problemKey];
}

function finalizeSession(state, problemKey, startedAt, endedAt) {
  if (!problemKey || !startedAt || endedAt <= startedAt) return;

  const totalSeconds = Math.floor((endedAt - startedAt) / 1000);
  if (totalSeconds <= 0) return;

  const problem = state.problems[problemKey];

  if (problem) {
    problem.totalSeconds += totalSeconds;
    problem.lastSeenAt = endedAt;
    problem.sessions.push({
      startedAt,
      endedAt,
      seconds: totalSeconds
    });
  }

  let currentStart = startedAt;

  while (currentStart < endedAt) {
    const currentEnd = Math.min(endedAt, getNextDayStart(currentStart));
    const daySeconds = Math.floor((currentEnd - currentStart) / 1000);
    const dateKey = getDateKey(new Date(currentStart));

    if (!state.dailyTotals[dateKey]) {
      state.dailyTotals[dateKey] = {
        date: dateKey,
        totalSeconds: 0
      };
    }

    state.dailyTotals[dateKey].totalSeconds += daySeconds;
    currentStart = currentEnd;
  }
}

function stopSession(state, endedAt = Date.now()) {
  if (!state.activeSession) return;

  const problemKey = state.activeSession.problemKey;
  console.log(`[AetherCP TIMER] Stopping and finalising session for ${problemKey} at ${new Date(endedAt).toISOString()}`);

  finalizeSession(
    state,
    problemKey,
    state.activeSession.startedAt,
    endedAt
  );

  state.activeSession = null;
}

function startSession(state, tabId, problemKey, startedAt = Date.now()) {
  console.log(`[AetherCP TIMER] Starting session for tab ${tabId} on ${problemKey} at ${new Date(startedAt).toISOString()}`);
  state.activeSession = {
    tabId,
    problemKey,
    startedAt,
    lastActivityAt: startedAt
  };
}

function switchSession(state, tabId, problem) {
  const problemRecord = ensureProblemRecord(state, problem);
  const currentSession = state.activeSession;
  const currentIdleState = state.idleState;

  const sameIdleProblem =
    currentIdleState &&
    currentIdleState.problemKey === problemRecord.problemKey &&
    currentIdleState.tabId === tabId;

  const sameActiveProblem =
    currentSession &&
    currentSession.problemKey === problemRecord.problemKey &&
    currentSession.tabId === tabId;

  if (sameActiveProblem || sameIdleProblem) {
    return;
  }

  stopSession(state);
  state.idleState = null;
  startSession(state, tabId, problemRecord.problemKey);
}
