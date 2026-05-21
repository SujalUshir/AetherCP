let lastProblemKey = "";
let idleTimerId = null;
let lastActivityAt = Date.now();
let isIdle = false;

const MESSAGE_TYPES = AETHERCP_CONSTANTS.MESSAGE_TYPES;
const PLATFORMS = AETHERCP_CONSTANTS.PLATFORMS;
const IDLE_TIMEOUT_MS = AETHERCP_CONSTANTS.IDLE_TIMEOUT_MS;

function getPlatform() {
  const hostname = window.location.hostname;

  if (hostname.includes("codeforces.com")) {
    return PLATFORMS.CODEFORCES;
  }

  if (hostname.includes("leetcode.com")) {
    return PLATFORMS.LEETCODE;
  }

  return "";
}

function getCodeforcesProblemName() {
  const title = document.querySelector(".title");
  return title ? title.textContent.trim() : "";
}

function getLeetCodeProblemName() {
  const title =
    document.querySelector('div[class*="text-title"]') ||
    document.querySelector('[data-cy="question-title"]') ||
    document.querySelector("title");

  return title ? title.textContent.trim() : "";
}

function getProblemName(platform) {
  if (platform === "Codeforces") {
    return getCodeforcesProblemName();
  }

  if (platform === "LeetCode") {
    return getLeetCodeProblemName();
  }

  return "";
}

function getProblemInfo() {
  const platform = getPlatform();
  const problemName = getProblemName(platform);

  if (!platform || !problemName) {
    return null;
  }

  return {
    problemName,
    platform,
    url: window.location.href
  };
}

function getProblemKey(problem) {
  return `${problem.platform}:${problem.problemName}`.toLowerCase();
}

function sendProblemInfo() {
  const problem = getProblemInfo();

  if (!problem) return;

  const problemKey = getProblemKey(problem);
  if (problemKey === lastProblemKey) return;

  lastProblemKey = problemKey;

  chrome.runtime.sendMessage(
    {
      type: MESSAGE_TYPES.PROBLEM_DETECTED,
      problem
    },
    () => {
      if (chrome.runtime.lastError) return;

      if (isIdle) {
        sendIdleMessage();
      }
    }
  );
}

function sendIdleMessage() {
  isIdle = true;

  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.USER_IDLE,
    idleStartedAt: lastActivityAt + IDLE_TIMEOUT_MS
  }, () => chrome.runtime.lastError);
}

function resetIdleTimer() {
  clearTimeout(idleTimerId);
  idleTimerId = setTimeout(sendIdleMessage, IDLE_TIMEOUT_MS);
}

function handleUserActivity() {
  lastActivityAt = Date.now();

  if (isIdle) {
    isIdle = false;

    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.USER_ACTIVE
    }, () => chrome.runtime.lastError);
  }

  resetIdleTimer();
}

function watchForUserActivity() {
  const activityEvents = ["mousemove", "keydown", "scroll"];

  activityEvents.forEach((eventName) => {
    window.addEventListener(eventName, handleUserActivity, {
      passive: true
    });
  });

  resetIdleTimer();
}

function watchForProblemTitle() {
  sendProblemInfo();

  if (!document.body) return;

  const observer = new MutationObserver(sendProblemInfo);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setTimeout(sendProblemInfo, 1000);
  setTimeout(sendProblemInfo, 3000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    watchForProblemTitle();
    watchForUserActivity();
  });
} else {
  watchForProblemTitle();
  watchForUserActivity();
}
