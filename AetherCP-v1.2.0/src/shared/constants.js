var AETHERCP_CONSTANTS = {
  STORAGE_KEY: "aethercp",
  IDLE_TIMEOUT_MS: 900000, // 15 minutes — CP-friendly: allows thinking/paper solving without pausing
  RECENT_PROBLEMS_LIMIT: 5,
  SUPABASE_URL: "https://nyvrbzphsakrbcjczbjl.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dnJienBoc2FrcmJjamN6YmpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4ODA5NjgsImV4cCI6MjA5ODQ1Njk2OH0.lQ8gQVwXCbTIpB3wZhR-fpo4XoHMJ3LgW1xzwLvTdMw",
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
