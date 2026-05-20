const STORAGE_KEY = "aethercp";

const EMPTY_STATE = {
  version: 1,
  activeSession: null,
  tabProblems: {},
  problems: {},
  dailyTotals: {}
};

function getTodayKey() {
  return getDateKey(new Date());
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function getNextDayStart(timestamp) {
  const date = new Date(timestamp);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  ).getTime();
}

function getProblemKey(problem) {
  return `${problem.platform}:${problem.problemName}`.toLowerCase();
}

function normalizeUrl(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch (error) {
    return url;
  }
}

async function getState() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  return {
    ...EMPTY_STATE,
    ...(data[STORAGE_KEY] || {}),
    tabProblems: {
      ...EMPTY_STATE.tabProblems,
      ...(data[STORAGE_KEY]?.tabProblems || {})
    },
    problems: {
      ...EMPTY_STATE.problems,
      ...(data[STORAGE_KEY]?.problems || {})
    },
    dailyTotals: {
      ...EMPTY_STATE.dailyTotals,
      ...(data[STORAGE_KEY]?.dailyTotals || {})
    }
  };
}

async function saveState(state) {
  await chrome.storage.local.set({
    [STORAGE_KEY]: state
  });
}

function ensureProblemRecord(state, problem) {
  const problemKey = getProblemKey(problem);

  if (!state.problems[problemKey]) {
    state.problems[problemKey] = {
      problemKey,
      problemName: problem.problemName,
      platform: problem.platform,
      url: normalizeUrl(problem.url),
      totalSeconds: 0,
      firstSeenAt: Date.now(),
      lastSeenAt: Date.now(),
      sessions: []
    };
  }

  state.problems[problemKey].problemName = problem.problemName;
  state.problems[problemKey].platform = problem.platform;
  state.problems[problemKey].url = normalizeUrl(problem.url);
  state.problems[problemKey].lastSeenAt = Date.now();

  return state.problems[problemKey];
}

function addTimeToTotals(state, problemKey, startedAt, endedAt) {
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

function stopActiveSession(state) {
  if (!state.activeSession) return;

  addTimeToTotals(
    state,
    state.activeSession.problemKey,
    state.activeSession.startedAt,
    Date.now()
  );

  state.activeSession = null;
}

function startProblemSession(state, tabId, problem) {
  const problemRecord = ensureProblemRecord(state, problem);
  const currentSession = state.activeSession;

  const sameActiveProblem =
    currentSession &&
    currentSession.problemKey === problemRecord.problemKey &&
    currentSession.tabId === tabId;

  if (sameActiveProblem) {
    return;
  }

  stopActiveSession(state);

  state.activeSession = {
    tabId,
    problemKey: problemRecord.problemKey,
    startedAt: Date.now()
  };
}

function isProblemUrl(url) {
  if (!url) return false;

  return (
    url.includes("codeforces.com/problemset/problem") ||
    url.includes("leetcode.com/problems/")
  );
}

async function handleProblemDetected(tabId, problem) {
  if (!problem || !problem.problemName || !problem.platform) return;

  const state = await getState();
  const problemWithUrl = {
    ...problem,
    url: problem.url || ""
  };

  state.tabProblems[String(tabId)] = problemWithUrl;

  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (activeTab && activeTab.id === tabId) {
    startProblemSession(state, tabId, problemWithUrl);
  }

  await saveState(state);
}

async function handleActiveTabChanged(tabId) {
  const state = await getState();
  const tabProblem = state.tabProblems[String(tabId)];

  if (tabProblem) {
    startProblemSession(state, tabId, tabProblem);
  } else {
    stopActiveSession(state);
  }

  await saveState(state);
}

async function handleTabUpdated(tabId, changeInfo, tab) {
  if (changeInfo.status !== "complete") return;

  const state = await getState();

  if (!isProblemUrl(tab.url)) {
    delete state.tabProblems[String(tabId)];

    if (state.activeSession?.tabId === tabId) {
      stopActiveSession(state);
    }

    await saveState(state);
  }
}

async function handleTabRemoved(tabId) {
  const state = await getState();

  delete state.tabProblems[String(tabId)];

  if (state.activeSession?.tabId === tabId) {
    stopActiveSession(state);
  }

  await saveState(state);
}

async function getTimerSnapshot() {
  const state = await getState();
  const todayKey = getTodayKey();
  const todaySavedSeconds = state.dailyTotals[todayKey]?.totalSeconds || 0;

  let activeProblem = null;
  let currentProblemSeconds = 0;
  let todaySeconds = todaySavedSeconds;

  if (state.activeSession) {
    const problem = state.problems[state.activeSession.problemKey];
    const activeElapsedSeconds = Math.floor(
      (Date.now() - state.activeSession.startedAt) / 1000
    );
    const todayActiveStartedAt = Math.max(
      state.activeSession.startedAt,
      getStartOfToday()
    );
    const todayActiveSeconds = Math.floor(
      (Date.now() - todayActiveStartedAt) / 1000
    );

    if (problem) {
      activeProblem = problem;
      currentProblemSeconds = problem.totalSeconds + activeElapsedSeconds;
      todaySeconds += Math.max(todayActiveSeconds, 0);
    }
  }

  return {
    tracking: Boolean(state.activeSession),
    activeProblem,
    currentProblemSeconds,
    todaySeconds,
    state
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PROBLEM_DETECTED") {
    if (!sender.tab?.id) {
      sendResponse({ ok: false });
      return false;
    }

    handleProblemDetected(sender.tab.id, message.problem).then(() => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === "GET_TIMER_SNAPSHOT") {
    getTimerSnapshot().then(sendResponse);
    return true;
  }

  return false;
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  handleActiveTabChanged(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  handleTabUpdated(tabId, changeInfo, tab);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  handleTabRemoved(tabId);
});
