let lastProblemKey = "";

function getPlatform() {
  const hostname = window.location.hostname;

  if (hostname.includes("codeforces.com")) {
    return "Codeforces";
  }

  if (hostname.includes("leetcode.com")) {
    return "LeetCode";
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

  chrome.runtime.sendMessage({
    type: "PROBLEM_DETECTED",
    problem
  });
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
  document.addEventListener("DOMContentLoaded", watchForProblemTitle);
} else {
  watchForProblemTitle();
}
