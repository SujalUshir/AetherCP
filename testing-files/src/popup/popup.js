const problemDiv             = document.getElementById("problemName");
const timerDiv               = document.getElementById("timer");
const todayTimeDiv           = document.getElementById("todayTime");
const analyticsTimeDiv       = document.getElementById("analyticsTime");
const analyticsProblemsDiv   = document.getElementById("analyticsProblems");
const analyticsMostWorkedDiv = document.getElementById("analyticsMostWorked");
const recentProblemsList     = document.getElementById("recentProblemsList");

// CPH elements
const cphStatusText = document.getElementById("cphStatusText");
const cphSendBtn    = document.getElementById("cphSendBtn");

const MESSAGE_TYPES = AETHERCP_CONSTANTS.MESSAGE_TYPES;

// ──────────────────────────────────────────────
// Timer helpers
// ──────────────────────────────────────────────

function formatTime(totalSeconds) {
  const hours   = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function setEmptyState() {
  problemDiv.innerText   = "No active problem";
  timerDiv.innerText     = "00:00:00";
  todayTimeDiv.innerText = "Today's Time: 00:00:00";
}

function renderAnalytics(analytics) {
  analyticsTimeDiv.innerText     = formatDurationShort(analytics?.todaySeconds || 0);
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
    const emptyRow       = document.createElement("div");
    emptyRow.className   = "emptyText";
    emptyRow.innerText   = "No recent problems yet";
    recentProblemsList.appendChild(emptyRow);
    return;
  }

  recentProblems.forEach((problem) => {
    const row  = document.createElement("div");
    row.className = "problemRow";

    const name       = document.createElement("span");
    name.className   = "problemTitle";
    name.innerText   = `${problem.platformShortName} ${problem.problemName}`;

    const time       = document.createElement("strong");
    time.innerText   = formatDurationShort(problem.totalSeconds);

    row.appendChild(name);
    row.appendChild(time);
    recentProblemsList.appendChild(row);
  });
}

// ──────────────────────────────────────────────
// Snapshot rendering — timer display
// ──────────────────────────────────────────────

// Track whether the popup currently has an active problem (for CPH button)
let _hasActiveProblem = false;

function renderSnapshot(snapshot) {
  if (!snapshot || !snapshot.activeProblem) {
    setEmptyState();
    _hasActiveProblem = false;

    if (snapshot) {
      todayTimeDiv.innerText = `Today's Time: ${formatTime(snapshot.todaySeconds)}`;
    }
  } else {
    const problem    = snapshot.activeProblem;
    const idleLabel  = snapshot.idle ? " (Idle)" : "";

    problemDiv.innerText   = `${problem.platform}: ${problem.problemName}${idleLabel}`;
    timerDiv.innerText     = formatTime(snapshot.currentProblemSeconds);
    todayTimeDiv.innerText = `Today's Time: ${formatTime(snapshot.todaySeconds)}`;
    _hasActiveProblem      = true;
  }

  renderAnalytics(snapshot?.dailyAnalytics);
  renderRecentProblems(snapshot?.recentProblems);

  // Re-evaluate button state on every snapshot tick.
  // Without this call, the button is only evaluated once (inside
  // checkCphStatus), at which point _hasActiveProblem is still false
  // because the first GET_TIMER_SNAPSHOT hasn't returned yet.
  setCphButtonState(false);
}

function updatePopup() {
  chrome.runtime.sendMessage(
    { type: MESSAGE_TYPES.GET_TIMER_SNAPSHOT },
    (snapshot) => {
      if (chrome.runtime.lastError) {
        setEmptyState();
        return;
      }
      renderSnapshot(snapshot);
    }
  );
}

// ──────────────────────────────────────────────
// CPH — VS Code section
// ──────────────────────────────────────────────

function setCphStatus(state, text) {
  // Remove all state classes, add new one
  cphStatusText.className = `cphStatus cphStatus${state}`;
  cphStatusText.innerText = text;
}

function setCphButtonState(sending) {
  if (sending) {
    cphSendBtn.disabled    = true;
    cphSendBtn.className   = "cphButton cphSending";
    cphSendBtn.innerText   = "Sending...";
  } else {
    cphSendBtn.innerText   = "Open in VS Code";
    cphSendBtn.className   = "cphButton";
    // Enable only if there is an active problem AND receiver is known reachable
    cphSendBtn.disabled    = !_hasActiveProblem || !_cphReachable;
  }
}

// Cached receiver state — updated once on popup open
let _cphReachable = false;
let _cphStatusChecked = false;

function checkCphStatus() {
  if (_cphStatusChecked) return; // only check once per popup lifetime
  _cphStatusChecked = true;

  setCphStatus("Checking", "Checking...");

  chrome.runtime.sendMessage(
    { type: MESSAGE_TYPES.GET_CPH_STATUS },
    (response) => {
      if (chrome.runtime.lastError || !response) {
        setCphStatus("Disconnected", "Extension error");
        _cphReachable = false;
        setCphButtonState(false);
        return;
      }

      _cphReachable = Boolean(response.reachable);

      if (_cphReachable) {
        setCphStatus("Connected", "✓ Connected");
      } else {
        setCphStatus("Disconnected", "Not running");
      }

      setCphButtonState(false);
    }
  );
}

cphSendBtn.addEventListener("click", () => {
  if (cphSendBtn.disabled) return;

  setCphButtonState(true);

  chrome.runtime.sendMessage(
    { type: MESSAGE_TYPES.SEND_TO_CPH },
    (response) => {
      if (chrome.runtime.lastError || !response) {
        setCphStatus("Disconnected", "Extension error");
        setCphButtonState(false);
        return;
      }

      if (response.ok) {
        setCphStatus("Connected", "✓ Sent!");
        // Brief success indicator, then restore normal label
        setTimeout(() => {
          setCphStatus("Connected", "✓ Connected");
          setCphButtonState(false);
        }, 2000);
      } else {
        const reasons = {
          timeout:    "Timeout",
          refused:    "Not running",
          no_problem: "No problem",
          error:      "Failed"
        };
        const label = reasons[response.reason] || "Error";
        setCphStatus("Disconnected", label);
        _cphReachable = false;
        setCphButtonState(false);
      }
    }
  );
});

// ──────────────────────────────────────────────
// Startup
// ──────────────────────────────────────────────

updatePopup();
setInterval(updatePopup, 1000);

// Check CPH status once when popup opens
checkCphStatus();

