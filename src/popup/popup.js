const problemDiv = document.getElementById("problemName");
const timerDiv = document.getElementById("timer");
const todayTimeDiv = document.getElementById("todayTime");
const analyticsTimeDiv = document.getElementById("analyticsTime");
const analyticsProblemsDiv = document.getElementById("analyticsProblems");
const analyticsMostWorkedDiv = document.getElementById("analyticsMostWorked");
const recentProblemsList = document.getElementById("recentProblemsList");

const MESSAGE_TYPES = AETHERCP_CONSTANTS.MESSAGE_TYPES;

function formatTime(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function setEmptyState() {
  problemDiv.innerText = "No active problem";
  timerDiv.innerText = "00:00:00";
  todayTimeDiv.innerText = "Today's Time: 00:00:00";
}

function renderAnalytics(analytics) {
  analyticsTimeDiv.innerText = formatDurationShort(analytics?.todaySeconds || 0);
  analyticsProblemsDiv.innerText = String(analytics?.problemsWorkedToday || 0);

  if (analytics?.mostWorkedProblem) {
    analyticsMostWorkedDiv.innerText =
      `${analytics.mostWorkedProblem.platformShortName} ` +
      analytics.mostWorkedProblem.problemName;
  } else {
    analyticsMostWorkedDiv.innerText = "None";
  }
}

function renderRecentProblems(recentProblems) {
  recentProblemsList.innerHTML = "";

  if (!recentProblems || recentProblems.length === 0) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "emptyText";
    emptyRow.innerText = "No recent problems yet";
    recentProblemsList.appendChild(emptyRow);
    return;
  }

  recentProblems.forEach((problem) => {
    const row = document.createElement("div");
    row.className = "problemRow";

    const name = document.createElement("span");
    name.className = "problemTitle";
    name.innerText = `${problem.platformShortName} ${problem.problemName}`;

    const time = document.createElement("strong");
    time.innerText = formatDurationShort(problem.totalSeconds);

    row.appendChild(name);
    row.appendChild(time);
    recentProblemsList.appendChild(row);
  });
}

function renderSnapshot(snapshot) {
  if (!snapshot || !snapshot.activeProblem) {
    setEmptyState();
    if (snapshot) {
      todayTimeDiv.innerText = `Today's Time: ${formatTime(snapshot.todaySeconds)}`;
    }
  } else {
    const problem = snapshot.activeProblem;
    const idleLabel = snapshot.idle ? " (Idle)" : "";

    problemDiv.innerText = `${problem.platform}: ${problem.problemName}${idleLabel}`;
    timerDiv.innerText = formatTime(snapshot.currentProblemSeconds);
    todayTimeDiv.innerText = `Today's Time: ${formatTime(snapshot.todaySeconds)}`;
  }

  renderAnalytics(snapshot?.dailyAnalytics);
  renderRecentProblems(snapshot?.recentProblems);
}

function updatePopup() {
  chrome.runtime.sendMessage(
    {
      type: MESSAGE_TYPES.GET_TIMER_SNAPSHOT
    },
    (snapshot) => {
      if (chrome.runtime.lastError) {
        setEmptyState();
        return;
      }

      renderSnapshot(snapshot);
    }
  );
}

updatePopup();
setInterval(updatePopup, 1000);
