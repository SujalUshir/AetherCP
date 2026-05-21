let aetherProfileRoot = null;
let aetherProfileRefreshId = null;

function logAetherInjector(message, data) {
  console.log("[AetherCP:profile-injector]", message, data || "");
}

function warnAetherInjector(message, data) {
  console.warn("[AetherCP:profile-injector]", message, data || "");
}

function isCodeforcesProfilePage() {
  return /^\/profile\/[^/]+\/?$/.test(window.location.pathname);
}

function getProfileMountPoint() {
  return (
    document.getElementById("pageContent") ||
    document.querySelector(".content-with-sidebar") ||
    document.body
  );
}

function requestAetherSnapshot(callback) {
  chrome.runtime.sendMessage(
    {
      type: AETHERCP_CONSTANTS.MESSAGE_TYPES.GET_TIMER_SNAPSHOT
    },
    (snapshot) => {
      if (chrome.runtime.lastError) {
        warnAetherInjector("Snapshot request failed", chrome.runtime.lastError);
        return;
      }

      if (!snapshot) {
        warnAetherInjector("Snapshot request returned no data");
        return;
      }

      logAetherInjector("Snapshot received");
      callback(snapshot);
    }
  );
}

function injectAetherProfileAnalytics() {
  if (!isCodeforcesProfilePage()) return;

  requestAetherSnapshot((snapshot) => {
    const analytics = getAetherProfileAnalytics(snapshot);
    const mountPoint = getProfileMountPoint();

    if (!aetherProfileRoot) {
      const existingRoot = document.getElementById(AETHER_PROFILE_ROOT_ID);
      aetherProfileRoot = existingRoot || createAetherProfileRoot(analytics);

      if (!existingRoot) {
        logAetherInjector("Appending graph template into Codeforces page", mountPoint);
        mountPoint.appendChild(aetherProfileRoot);
      } else {
        logAetherInjector("Existing analytics root found, reusing it");
      }
    } else {
      updateAetherProfileRoot(aetherProfileRoot, analytics);
    }

    logAetherInjector("Canvas mount check", {
      platform: Boolean(document.getElementById("aetherPlatformChart")),
      problems: Boolean(document.getElementById("aetherProblemChart")),
      daily: Boolean(document.getElementById("aetherDailyChart"))
    });

    renderAetherProfileCharts(analytics);
  });
}

function startAetherProfileInjector() {
  if (!isCodeforcesProfilePage()) {
    logAetherInjector("Not a Codeforces profile page, skipping");
    return;
  }

  aetherProfileRoot = document.getElementById(AETHER_PROFILE_ROOT_ID);

  if (aetherProfileRefreshId) {
    logAetherInjector("Injector already running, skipping duplicate start");
    return;
  }

  logAetherInjector("Starting Codeforces profile analytics injection");
  injectAetherProfileAnalytics();
  aetherProfileRefreshId = setInterval(injectAetherProfileAnalytics, 10000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startAetherProfileInjector);
} else {
  startAetherProfileInjector();
}
