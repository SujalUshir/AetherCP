function pauseForIdle(state, tabId, idleStartedAt) {
  if (!state.activeSession || state.activeSession.tabId !== tabId) return;

  const pauseAt = Math.max(
    state.activeSession.startedAt,
    idleStartedAt || Date.now()
  );

  finalizeSession(
    state,
    state.activeSession.problemKey,
    state.activeSession.startedAt,
    pauseAt
  );

  state.idleState = {
    tabId,
    problemKey: state.activeSession.problemKey,
    idleStartedAt: pauseAt
  };

  state.activeSession = null;
}

function resumeFromIdle(state, tabId) {
  if (!state.idleState || state.idleState.tabId !== tabId) return;

  startSession(state, tabId, state.idleState.problemKey);
  state.idleState = null;
}

function clearIdleStateForTab(state, tabId) {
  if (state.idleState?.tabId === tabId) {
    state.idleState = null;
  }
}

function clearSessionStateForTab(state, tabId) {
  if (state.activeSession?.tabId === tabId) {
    stopSession(state);
  }

  clearIdleStateForTab(state, tabId);
}
