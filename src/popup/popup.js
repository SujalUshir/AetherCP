const IS_CLOUD_BUILD = (typeof AETHERCP_BUILD_CONFIG !== "undefined" && AETHERCP_BUILD_CONFIG.BUILD_MODE === "cloud");
function isCloudBuild() {
  return IS_CLOUD_BUILD;
}

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
  if (isCloudBuild()) {
    updateLastBackupUI();
  }
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
// Authentication Flow
// ──────────────────────────────────────────────

const authLoadingDiv   = document.getElementById("authLoading");
const authLoggedOutDiv = document.getElementById("authLoggedOut");
const authLoggedInDiv  = document.getElementById("authLoggedIn");
const userAvatarImg    = document.getElementById("userAvatar");
const userNameSpan     = document.getElementById("userName");
const userEmailSpan    = document.getElementById("userEmail");
const googleSignInBtn  = document.getElementById("googleSignInBtn");
const signOutBtn       = document.getElementById("signOutBtn");
const syncStatusSpan   = document.getElementById("syncStatus");
const lastBackupSpan   = document.getElementById("lastBackup");

let lastBackupTimestamp = null;
let currentSyncStatus = "Synced";

function updateSyncStatusUI(status) {
  if (!syncStatusSpan) return;
  currentSyncStatus = status;

  // Offline status overrides others if offline
  const displayStatus = !navigator.onLine ? "Offline" : status;

  if (displayStatus === "Synced") {
    syncStatusSpan.innerText = "☁ Synced";
    syncStatusSpan.style.color = "#188038";
  } else if (displayStatus === "Uploading") {
    syncStatusSpan.innerText = "Uploading...";
    syncStatusSpan.style.color = "#f29900";
  } else if (displayStatus === "Pending Sync") {
    syncStatusSpan.innerText = "Pending Sync";
    syncStatusSpan.style.color = "#f29900";
  } else if (displayStatus === "Offline") {
    syncStatusSpan.innerText = "Offline";
    syncStatusSpan.style.color = "#d93025";
  } else {
    syncStatusSpan.innerText = "☁ Synced";
    syncStatusSpan.style.color = "#188038";
  }
}

function getRelativeTime(timestamp) {
  if (!timestamp) return "Never";
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${diffSec} seconds ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function updateLastBackupUI() {
  if (!lastBackupSpan) return;
  lastBackupSpan.innerText = `Last Backup: ${getRelativeTime(lastBackupTimestamp)}`;
}

function loadSyncState() {
  chrome.storage.local.get(["aethercp_sync_status", "aethercp_last_backup_time"], (result) => {
    const status = result["aethercp_sync_status"] || "Synced";
    lastBackupTimestamp = result["aethercp_last_backup_time"] || null;
    updateSyncStatusUI(status);
    updateLastBackupUI();
  });
}

// Watch for sync state updates broadcasted from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SYNC_STATUS_CHANGED") {
    updateSyncStatusUI(message.status);
  } else if (message.type === "SYNC_TIMESTAMP_CHANGED") {
    lastBackupTimestamp = message.timestamp;
    updateLastBackupUI();
  }
});

// Update offline state display dynamically if connectivity drops/restores
window.addEventListener("online", () => updateSyncStatusUI(currentSyncStatus));
window.addEventListener("offline", () => updateSyncStatusUI(currentSyncStatus));

function setAuthLoading(isLoading) {
  authLoadingDiv.style.display = isLoading ? "block" : "none";
  googleSignInBtn.disabled = isLoading;
  signOutBtn.disabled = isLoading;
}

function renderLoggedOut() {
  setAuthLoading(false);
  authLoggedOutDiv.style.display = "block";
  authLoggedInDiv.style.display = "none";
  userAvatarImg.removeAttribute("src");
  userNameSpan.innerText = "";
  userEmailSpan.innerText = "";
}

function renderLoggedIn(user) {
  setAuthLoading(false);
  authLoggedOutDiv.style.display = "none";
  authLoggedInDiv.style.display = "block";
  if (user.avatarUrl) {
    userAvatarImg.src = user.avatarUrl;
  } else {
    userAvatarImg.removeAttribute("src");
  }
  userNameSpan.innerText = user.name || user.email || "Google user";
  userEmailSpan.innerText = user.email || "";
}

function logPopupAuthError(context, response) {
  const runtimeError = chrome.runtime.lastError;
  console.error(`[AetherCP Auth Popup] ${context}`, {
    runtimeError: runtimeError ? runtimeError.message : null,
    response
  });
}

function checkAuthStatus() {
  chrome.runtime.sendMessage({ type: MESSAGE_TYPES.GET_CURRENT_USER }, (response) => {
    if (chrome.runtime.lastError || !response || !response.ok || !response.user) {
      if (chrome.runtime.lastError || response?.debugError) {
        logPopupAuthError("Current user check failed.", response);
      }
      renderLoggedOut();
    } else {
      renderLoggedIn(response.user);
    }
  });
}

googleSignInBtn.addEventListener("click", () => {
  setAuthLoading(true);
  authLoggedOutDiv.style.display = "none";
  authLoggedInDiv.style.display = "none";

  chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SIGN_IN_GOOGLE }, (response) => {
    if (chrome.runtime.lastError || !response || !response.ok) {
      logPopupAuthError("Google sign-in failed.", response);
      const errorMsg = response?.error || "Google Sign-In failed";
      alert(errorMsg);
      renderLoggedOut();
      return;
    }
    renderLoggedIn(response.user);
  });
});

signOutBtn.addEventListener("click", () => {
  setAuthLoading(true);
  authLoggedOutDiv.style.display = "none";
  authLoggedInDiv.style.display = "none";

  chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SIGN_OUT }, (response) => {
    if (chrome.runtime.lastError || !response || !response.ok) {
      logPopupAuthError("Sign-out failed.", response);
      const errorMsg = response?.error || "Sign-Out failed";
      alert(errorMsg);
      checkAuthStatus();
      return;
    }
    renderLoggedOut();
  });
});

// ──────────────────────────────────────────────
// Startup
// ──────────────────────────────────────────────

updatePopup();
setInterval(updatePopup, 1000);

// Check CPH status once when popup opens
checkCphStatus();

function renderCommunityCard() {
  const authSection = document.getElementById("authSection");
  if (!authSection) return;

  const card = document.createElement("div");
  card.className = "communityCard";

  const title = document.createElement("div");
  title.className = "communityTitle";
  title.textContent = "AetherCP Community Edition";

  const subtitle = document.createElement("div");
  subtitle.className = "communitySubtitle";
  subtitle.textContent = "Your coding history is stored locally in this browser.";

  const status = document.createElement("div");
  status.className = "communityStatus";
  status.textContent = "Cloud Sync — ";

  const badge = document.createElement("span");
  badge.className = "comingSoonBadge";
  badge.textContent = "Unavailable";
  status.appendChild(badge);

  const note = document.createElement("div");
  note.className = "communityNote";
  note.textContent = "Cloud Sync is available in the Chrome Web Store edition.";

  card.appendChild(title);
  card.appendChild(subtitle);
  card.appendChild(status);
  card.appendChild(note);

  authSection.replaceChildren(card);
}

if (isCloudBuild()) {
  // Check auth status once when popup opens
  checkAuthStatus();

  // Load backup status once when popup opens
  loadSyncState();
} else {
  renderCommunityCard();
}
