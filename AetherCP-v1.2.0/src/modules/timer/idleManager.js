function pauseForIdle(state, tabId, idleStartedAt) {
  if (!state.activeSession || state.activeSession.tabId !== tabId) return;

  const pauseAt = Math.max(
    state.activeSession.startedAt,
    idleStartedAt || Date.now()
  );

  const problemKey = state.activeSession.problemKey;
  console.log(`[AetherCP IDLE] Pausing session for tab ${tabId} on ${problemKey} at ${new Date(pauseAt).toISOString()}`);

  finalizeSession(
    state,
    problemKey,
    state.activeSession.startedAt,
    pauseAt
  );

  state.idleState = {
    tabId,
    problemKey,
    idleStartedAt: pauseAt
  };

  state.activeSession = null;
}

function resumeFromIdle(state, tabId) {
  if (!state.idleState || state.idleState.tabId !== tabId) {
    if (state.activeSession && state.activeSession.tabId === tabId) {
      state.activeSession.lastActivityAt = Date.now();
      console.log(`[AetherCP TIMER] Active session activity updated for tab ${tabId} at ${new Date().toISOString()}`);
    }
    return;
  }

  const problemKey = state.idleState.problemKey;
  console.log(`[AetherCP IDLE] Resuming session from idle for tab ${tabId} on ${problemKey} at ${new Date().toISOString()}`);
  startSession(state, tabId, problemKey);
  state.idleState = null;
}

function checkAndApplyIdle(state, now = Date.now()) {
  if (!state.activeSession) return false;

  const idleThreshold = AETHERCP_CONSTANTS.IDLE_TIMEOUT_MS;
  const lastActivity = state.activeSession.lastActivityAt || state.activeSession.startedAt;

  if (now - lastActivity > idleThreshold) {
    const pauseAt = lastActivity + idleThreshold;
    const problemKey = state.activeSession.problemKey;
    const tabId = state.activeSession.tabId;

    console.log(`[AetherCP TIMER] Inactivity threshold exceeded (${(idleThreshold / 60000).toFixed(1)} mins). Retroactively finalizing session for ${problemKey} at ${new Date(pauseAt).toISOString()}`);

    finalizeSession(
      state,
      problemKey,
      state.activeSession.startedAt,
      pauseAt
    );

    state.idleState = {
      tabId,
      problemKey,
      idleStartedAt: pauseAt
    };

    state.activeSession = null;
    return true;
  }

  return false;
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
