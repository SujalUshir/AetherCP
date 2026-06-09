var AETHERCP_CONSTANTS = {
  STORAGE_KEY: "aethercp",
  IDLE_TIMEOUT_MS: 900000, // 15 minutes — CP-friendly: allows thinking/paper solving without pausing
  RECENT_PROBLEMS_LIMIT: 5,
  MESSAGE_TYPES: {
    PROBLEM_DETECTED: "PROBLEM_DETECTED",
    GET_TIMER_SNAPSHOT: "GET_TIMER_SNAPSHOT",
    USER_IDLE: "USER_IDLE",
    USER_ACTIVE: "USER_ACTIVE"
  },
  PLATFORMS: {
    CODEFORCES: "Codeforces",
    LEETCODE: "LeetCode"
  }
};
