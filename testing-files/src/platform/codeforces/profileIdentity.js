(() => {
// ============================================================
// profileIdentity.js
// AetherCP – Codeforces Profile Identity
//
// Responsibilities:
//   - Detect the currently logged-in Codeforces handle
//   - Detect whose profile is currently being viewed
//   - Expose isOwnProfile() for showing/hiding productivity analytics
// ============================================================

function logAetherIdentity(message, data) {
  console.log("[AetherCP CF]", "[identity]", message, data !== undefined ? data : "");
}

/**
 * Extract the profile handle from the current URL.
 * URL shape: https://codeforces.com/profile/<handle>
 * Returns empty string if not on a profile page.
 */
function getViewedProfileHandle() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  // parts[0] === "profile", parts[1] === handle
  const handle = (parts[0] === "profile" && parts[1]) ? parts[1] : "";
  logAetherIdentity("Viewed profile handle", handle);
  return handle;
}

/**
 * Detect the logged-in user's handle from the Codeforces page DOM.
 *
 * Codeforces renders the logged-in user's profile link in the header nav.
 * We look for anchor tags whose href starts with "/profile/" inside the
 * header or language chooser area.
 *
 * Returns empty string if the user is not logged in or the link is not found.
 */
function getLoggedInHandle() {
  // Strategy 1: language chooser area contains the logged-in handle link
  const langLinks = document.querySelectorAll(".lang-chooser a[href^='/profile/']");
  for (const link of langLinks) {
    const href = link.getAttribute("href") || "";
    const match = href.match(/^\/profile\/([^/]+)/);
    if (match && match[1]) {
      logAetherIdentity("Logged-in handle (lang-chooser)", match[1]);
      return match[1];
    }
  }

  // Strategy 2: top header personal links
  const headerLinks = document.querySelectorAll(
    "#header a[href^='/profile/'], .personal-sidebar a[href^='/profile/']"
  );
  for (const link of headerLinks) {
    const href = link.getAttribute("href") || "";
    const match = href.match(/^\/profile\/([^/]+)/);
    if (match && match[1]) {
      logAetherIdentity("Logged-in handle (header)", match[1]);
      return match[1];
    }
  }

  // Strategy 3: look for the enter/logout link area
  // When logged in, CF shows a "logout" link alongside the username
  const logoutLink = document.querySelector("a[href*='/logout']");
  if (logoutLink) {
    // Walk siblings or parent for a profile link
    const parent = logoutLink.closest("div, span, li, td");
    if (parent) {
      const profileLink = parent.querySelector("a[href^='/profile/']");
      if (profileLink) {
        const href = profileLink.getAttribute("href") || "";
        const match = href.match(/^\/profile\/([^/]+)/);
        if (match && match[1]) {
          logAetherIdentity("Logged-in handle (logout sibling)", match[1]);
          return match[1];
        }
      }
    }
  }

  logAetherIdentity("Logged-in handle not detected (user not logged in or DOM changed)");
  return "";
}

/**
 * Returns true if the currently viewed profile belongs to the logged-in user.
 * Returns false if:
 *   - The user is not logged in
 *   - The viewed profile is a different user
 */
function isOwnProfile() {
  const loggedIn = getLoggedInHandle();
  const viewed = getViewedProfileHandle();

  if (!loggedIn || !viewed) {
    logAetherIdentity("isOwnProfile: false (missing handle)", { loggedIn, viewed });
    return false;
  }

  const own = loggedIn.toLowerCase() === viewed.toLowerCase();
  logAetherIdentity("isOwnProfile", { loggedIn, viewed, own });
  return own;
}

// Expose functions to global scope
window.getViewedProfileHandle = getViewedProfileHandle;
window.getLoggedInHandle = getLoggedInHandle;
window.isOwnProfile = isOwnProfile;

console.log("[AetherCP LOAD] profileIdentity.js loaded");
})();

