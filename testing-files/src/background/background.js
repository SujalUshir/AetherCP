importScripts(
  "../shared/constants.js",
  "../utils/timezone.js",
  "../utils/time.js",
  "../modules/problem-tracking/problemKeys.js",
  "../modules/analytics/dailyAnalytics.js",
  "../modules/timer/sessionManager.js",
  "../modules/timer/idleManager.js",
  "../modules/timer/timerSnapshot.js"
);

const STORAGE_KEY = AETHERCP_CONSTANTS.STORAGE_KEY;
const MESSAGE_TYPES = AETHERCP_CONSTANTS.MESSAGE_TYPES;

const EMPTY_STATE = {
  version: 1,
  activeSession: null,
  idleState: null,
  tabProblems: {},
  problems: {},
  dailyTotals: {}
};

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
  checkAndApplyIdle(state);

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
    switchSession(state, tabId, problemWithUrl);
  }

  await saveState(state);
}

async function handleActiveTabChanged(tabId) {
  const state = await getState();
  checkAndApplyIdle(state);
  const tabProblem = state.tabProblems[String(tabId)];

  if (tabProblem) {
    switchSession(state, tabId, tabProblem);
  } else {
    stopSession(state);
    state.idleState = null;
  }

  await saveState(state);
}

async function handleTabUpdated(tabId, changeInfo, tab) {
  if (changeInfo.status !== "complete") return;

  const state = await getState();
  checkAndApplyIdle(state);

  if (!isProblemUrl(tab.url)) {
    delete state.tabProblems[String(tabId)];
    clearSessionStateForTab(state, tabId);
    await saveState(state);
  }
}

async function handleTabRemoved(tabId) {
  const state = await getState();
  checkAndApplyIdle(state);

  delete state.tabProblems[String(tabId)];
  clearSessionStateForTab(state, tabId);

  await saveState(state);
}

async function handleUserIdle(tabId, idleStartedAt) {
  const state = await getState();

  pauseForIdle(state, tabId, idleStartedAt);

  await saveState(state);
}

async function handleUserActive(tabId) {
  const state = await getState();
  checkAndApplyIdle(state);
  resumeFromIdle(state, tabId);

  await saveState(state);
}

async function getSnapshot() {
  const state = await getState();
  const modified = checkAndApplyIdle(state);
  if (modified) {
    await saveState(state);
  }
  return buildTimerSnapshot(state);
}

function requireSenderTab(sender, sendResponse) {
  if (sender.tab?.id) {
    return sender.tab.id;
  }

  sendResponse({ ok: false });
  return null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === MESSAGE_TYPES.PROBLEM_DETECTED) {
    const tabId = requireSenderTab(sender, sendResponse);
    if (tabId === null) return false;

    handleProblemDetected(tabId, message.problem).then(() => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === MESSAGE_TYPES.USER_IDLE) {
    const tabId = requireSenderTab(sender, sendResponse);
    if (tabId === null) return false;

    handleUserIdle(tabId, message.idleStartedAt).then(() => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === MESSAGE_TYPES.USER_ACTIVE) {
    const tabId = requireSenderTab(sender, sendResponse);
    if (tabId === null) return false;

    handleUserActive(tabId).then(() => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === MESSAGE_TYPES.GET_TIMER_SNAPSHOT) {
    getSnapshot().then(sendResponse);
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
