var AETHERCP_CONSTANTS = {
  STORAGE_KEY: "aethercp",
  IDLE_TIMEOUT_MS: 900000, // 15 minutes — CP-friendly: allows thinking/paper solving without pausing
  RECENT_PROBLEMS_LIMIT: 5,
  SUPABASE_URL: "YOUR_SUPABASE_PROJECT_URL",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_PUBLISHABLE_ANON_KEY",
  MESSAGE_TYPES: {
    PROBLEM_DETECTED:   "PROBLEM_DETECTED",
    GET_TIMER_SNAPSHOT: "GET_TIMER_SNAPSHOT",
    USER_IDLE:          "USER_IDLE",
    USER_ACTIVE:        "USER_ACTIVE",
    // CPH — Competitive Programming Helper (VS Code)
    SEND_TO_CPH:        "SEND_TO_CPH",
    GET_CPH_STATUS:     "GET_CPH_STATUS",
    GET_CPH_TESTS:      "GET_CPH_TESTS",
    // Authentication
    SIGN_IN_GOOGLE:     "SIGN_IN_GOOGLE",
    SIGN_OUT:           "SIGN_OUT",
    GET_CURRENT_USER:   "GET_CURRENT_USER"
  },
  PLATFORMS: {
    CODEFORCES: "Codeforces",
    LEETCODE:   "LeetCode"
  },
  CPH_PORT: 27121
};
