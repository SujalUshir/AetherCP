importScripts(
  "../shared/constants.js",
  "../utils/timezone.js",
  "../utils/time.js",
  "../modules/problem-tracking/problemKeys.js",
  "../modules/analytics/dailyAnalytics.js",
  "../modules/timer/sessionManager.js",
  "../modules/timer/idleManager.js",
  "../modules/timer/timerSnapshot.js",
  // CPH — Competitive Programming Helper integration
  "../modules/cph/cphClient.js",
  "../modules/cph/cphPayloadBuilder.js",
  "../modules/cph/cphStatus.js"
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

  // Codeforces — all three official problem URL formats:
  //   /problemset/problem/<contestId>/<index>
  //   /contest/<contestId>/problem/<index>
  //   /gym/<gymId>/problem/<index>
  if (
    url.includes("codeforces.com/problemset/problem") ||
    url.includes("codeforces.com/contest/")           ||
    url.includes("codeforces.com/gym/")
  ) {
    // Confirm it is a problem sub-page, not just the contest/gym lobby
    return /codeforces\.com\/(problemset\/problem|contest\/\d+\/problem|gym\/\d+\/problem)\//.test(url);
  }

  return false;
}

function isCodeforcesProblem(problem) {
  return problem?.platform === AETHERCP_CONSTANTS.PLATFORMS.CODEFORCES;
}

function getCodeforcesTabProblem(state, tabId, tab) {
  const problem = state.tabProblems[String(tabId)];

  if (!problem || !isCodeforcesProblem(problem)) return null;
  if (!tab?.url || !isProblemUrl(tab.url)) return null;

  return problem;
}

function activateTrackedProblemTab(state, tabId, problem) {
  if (!problem || !isCodeforcesProblem(problem)) return false;

  const problemRecord = ensureProblemRecord(state, problem);
  const sameIdleProblem =
    state.idleState &&
    state.idleState.tabId === tabId &&
    state.idleState.problemKey === problemRecord.problemKey;

  if (sameIdleProblem) {
    resumeFromIdle(state, tabId);
  } else {
    switchSession(state, tabId, problem);
  }

  return true;
}

async function resolveCodeforcesRating(contestId, index) {
  if (!contestId || !index) return null;

  const cacheKey = "cfProblemsCache";
  let cache = await chrome.storage.local.get(cacheKey);
  let cacheData = cache[cacheKey];

  const CACHE_VALID_MS = 24 * 60 * 60 * 1000; // 24 hours
  const now = Date.now();

  if (!cacheData || !cacheData.problems || (now - cacheData.timestamp > CACHE_VALID_MS)) {
    try {
      console.log("[AetherCP Background] Fetching problemset.problems to resolve rating...");
      const response = await fetch("https://codeforces.com/api/problemset.problems");
      if (response.ok) {
        const data = await response.json();
        if (data.status === "OK" && data.result && data.result.problems) {
          const problemsMap = {};
          for (const prob of data.result.problems) {
            if (prob.contestId && prob.index && prob.rating !== undefined) {
              problemsMap[`${prob.contestId}:${prob.index}`.toUpperCase()] = prob.rating;
            }
          }
          cacheData = {
            timestamp: now,
            problems: problemsMap
          };
          await chrome.storage.local.set({ [cacheKey]: cacheData });
          console.log("[AetherCP Background] Resolved and cached Codeforces ratings map");
        }
      }
    } catch (err) {
      console.error("[AetherCP Background] Failed to fetch Codeforces problemset.problems", err);
    }
  }

  if (cacheData && cacheData.problems) {
    const key = `${contestId}:${index}`.toUpperCase();
    return cacheData.problems[key] || null;
  }
  return null;
}

async function handleProblemDetected(tabId, problem) {
  if (!problem || !problem.problemName || !problem.platform) return;
  if (!isCodeforcesProblem(problem)) return;

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
    activateTrackedProblemTab(state, tabId, problemWithUrl);
  }

  await saveState(state);

  // Resolve rating asynchronously in the background so we don't block session activation/saving
  if (
    problem.platform === AETHERCP_CONSTANTS.PLATFORMS.CODEFORCES &&
    (problem.rating === null || problem.rating === undefined)
  ) {
    (async () => {
      try {
        const resolvedRating = await resolveCodeforcesRating(problem.contestId, problem.index);
        if (resolvedRating !== null) {
          const freshState = await getState();
          if (freshState.tabProblems[String(tabId)]) {
            freshState.tabProblems[String(tabId)].rating = resolvedRating;
          }
          const problemKey = getProblemKey(problem);
          if (freshState.problems[problemKey]) {
            freshState.problems[problemKey].rating = resolvedRating;
            await saveState(freshState);
            console.log("[AetherCP Background] Asynchronously updated problem rating to", resolvedRating);
          }
        }
      } catch (err) {
        console.error("[AetherCP Background] Error resolving rating asynchronously:", err);
      }
    })();
  }
}

async function handleActiveTabChanged(tabId) {
  const state = await getState();
  checkAndApplyIdle(state);
  let tab = null;

  try {
    tab = await chrome.tabs.get(tabId);
  } catch (err) {
    console.warn("[AetherCP Background] Could not read activated tab", {
      tabId,
      error: err.message
    });
  }

  const tabProblem = getCodeforcesTabProblem(state, tabId, tab);

  if (tabProblem) {
    activateTrackedProblemTab(state, tabId, tabProblem);
  } else {
    stopSession(state);
    state.idleState = null;
  }

  await saveState(state);
}

async function handleWindowFocusChanged(windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;

  const [activeTab] = await chrome.tabs.query({
    active: true,
    windowId
  });

  if (!activeTab?.id) return;

  await handleActiveTabChanged(activeTab.id);
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

  // ── CPH: Send the current problem to VS Code ──────────────────────
  if (message.type === MESSAGE_TYPES.SEND_TO_CPH) {
    (async () => {
      const state = await getState();

      // Determine the active problem record (name, platform, url)
      let tabId = sender.tab?.id;
      if (!tabId) {
        const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (activeTab) {
          tabId = activeTab.id;
        }
      }

      const problem =
        (tabId && state.tabProblems[String(tabId)]) ||
        (state.activeSession && state.problems[state.activeSession.problemKey]) ||
        null;

      if (!problem || !problem.problemName) {
        console.warn("[AetherCP CPH] No active problem to send");
        sendResponse({ ok: false, reason: "no_problem", message: "No active problem" });
        return;
      }

      if (!isCodeforcesProblem(problem)) {
        console.warn("[AetherCP CPH] Non-Codeforces problem ignored");
        sendResponse({ ok: false, reason: "no_problem", message: "No active Codeforces problem" });
        return;
      }

      console.log("[AetherCP CPH] Problem send requested", {
        name:     problem.problemName,
        platform: problem.platform,
        tabId
      });

      // ── Fetch fresh tests from the live DOM at send time ─────────────
      // We do NOT rely on tests stored in tabProblems at detection time.
      // PROBLEM_DETECTED fires early (sometimes before .sample-test renders).
      // Asking the content script now guarantees the DOM is fully loaded.
      let freshTests  = [];
      let timeLimit   = problem.timeLimit   || 2000;
      let memoryLimit = problem.memoryLimit || 256;

      if (tabId) {
        try {
          const testResponse = await new Promise((resolve) => {
            chrome.tabs.sendMessage(
              tabId,
              { type: MESSAGE_TYPES.GET_CPH_TESTS },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.warn("[AetherCP CPH] GET_CPH_TESTS failed", {
                    error: chrome.runtime.lastError.message
                  });
                  resolve(null);
                  return;
                }
                resolve(response);
              }
            );
          });

          if (testResponse && Array.isArray(testResponse.tests)) {
            freshTests  = testResponse.tests;
            timeLimit   = testResponse.timeLimit   || timeLimit;
            memoryLimit = testResponse.memoryLimit || memoryLimit;

            console.log("[AetherCP CPH] Fresh tests received from content script", {
              count:      freshTests.length,
              timeLimit,
              memoryLimit
            });
          } else {
            console.warn("[AetherCP CPH] No test response from content script — using stored tests");
            freshTests = Array.isArray(problem.tests) ? problem.tests : [];
          }
        } catch (err) {
          console.warn("[AetherCP CPH] GET_CPH_TESTS threw", { error: err.message });
          freshTests = Array.isArray(problem.tests) ? problem.tests : [];
        }
      } else {
        // No tabId — fall back to stored tests (context menu from non-tab context)
        freshTests = Array.isArray(problem.tests) ? problem.tests : [];
        console.warn("[AetherCP CPH] No tabId — using stored tests", { count: freshTests.length });
      }

      // ── Build payload ─────────────────────────────────────────────────
      const problemWithFreshTests = {
        ...problem,
        tests:       freshTests,
        timeLimit,
        memoryLimit
      };

      const payload = buildCphPayload(problemWithFreshTests);

      const result = await sendToCph(payload);

      if (result.ok) {
        invalidateCphStatusCache();
      }

      sendResponse(result);
    })();
    return true;
  }

  // ── CPH: Check whether the receiver is currently reachable ────────
  if (message.type === MESSAGE_TYPES.GET_CPH_STATUS) {
    checkCphReceiver().then((status) => {
      sendResponse(status);
    });
    return true;
  }

  return false;
});

// ── Context menu — right-click on Codeforces problem pages ─────────────
//
// Created once on install. Shows only on supported problem URLs via
// documentUrlPatterns, mirroring the manifest content_scripts matches.

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id:                   "aethercp-send-to-cph",
    title:                "Open Problem in VS Code (AetherCP)",
    contexts:             ["page"],
    documentUrlPatterns:  [
      "https://codeforces.com/problemset/problem/*/*",
      "https://codeforces.com/contest/*/problem/*",
      "https://codeforces.com/gym/*/problem/*"
    ]
  });

  console.log("[AetherCP CPH] Context menu registered");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "aethercp-send-to-cph") return;
  if (!tab || !tab.id) return;

  (async () => {
    const state   = await getState();
    const problem = state.tabProblems[String(tab.id)] || null;

    if (!problem || !problem.problemName) {
      console.warn("[AetherCP CPH] Context menu: no problem detected for tab", tab.id);
      return;
    }

    if (!isCodeforcesProblem(problem)) {
      console.warn("[AetherCP CPH] Context menu: non-Codeforces problem ignored");
      return;
    }

    console.log("[AetherCP CPH] Context menu triggered", {
      name:     problem.problemName,
      platform: problem.platform
    });

    // ── Fetch fresh tests from live DOM ───────────────────────────────
    let freshTests  = [];
    let timeLimit   = problem.timeLimit   || 2000;
    let memoryLimit = problem.memoryLimit || 256;

    try {
      const testResponse = await new Promise((resolve) => {
        chrome.tabs.sendMessage(
          tab.id,
          { type: MESSAGE_TYPES.GET_CPH_TESTS },
          (response) => {
            if (chrome.runtime.lastError) {
              console.warn("[AetherCP CPH] Context menu GET_CPH_TESTS failed", {
                error: chrome.runtime.lastError.message
              });
              resolve(null);
              return;
            }
            resolve(response);
          }
        );
      });

      if (testResponse && Array.isArray(testResponse.tests)) {
        freshTests  = testResponse.tests;
        timeLimit   = testResponse.timeLimit   || timeLimit;
        memoryLimit = testResponse.memoryLimit || memoryLimit;
        console.log("[AetherCP CPH] Context menu: fresh tests received", {
          count: freshTests.length
        });
      } else {
        freshTests = Array.isArray(problem.tests) ? problem.tests : [];
        console.warn("[AetherCP CPH] Context menu: no test response — using stored tests");
      }
    } catch (err) {
      freshTests = Array.isArray(problem.tests) ? problem.tests : [];
      console.warn("[AetherCP CPH] Context menu: GET_CPH_TESTS threw", { error: err.message });
    }

    const problemWithFreshTests = {
      ...problem,
      tests:       freshTests,
      timeLimit,
      memoryLimit
    };

    const payload = buildCphPayload(problemWithFreshTests);

    const result = await sendToCph(payload);

    if (result.ok) {
      invalidateCphStatusCache();
      console.log("[AetherCP CPH] Problem sent via context menu", { name: problem.problemName });
    } else {
      console.warn("[AetherCP CPH] Context menu send failed", result);
    }
  })();
});


chrome.tabs.onActivated.addListener((activeInfo) => {
  handleActiveTabChanged(activeInfo.tabId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  handleWindowFocusChanged(windowId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  handleTabUpdated(tabId, changeInfo, tab);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  handleTabRemoved(tabId);
});
