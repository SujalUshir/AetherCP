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

function getPlatformShortName(platform) {
  if (platform === AETHERCP_CONSTANTS.PLATFORMS.CODEFORCES) {
    return "CF";
  }

  if (platform === AETHERCP_CONSTANTS.PLATFORMS.LEETCODE) {
    return "LC";
  }

  return platform;
}
