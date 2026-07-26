// ============================================================
// timezone.js
// AetherCP – IST (Indian Standard Time) Date Helpers
//
// All daily resets and date key generation in AetherCP
// use IST (Asia/Kolkata, UTC+5:30) as the canonical timezone.
//
// This prevents off-by-one-day bugs for users whose machine
// clock is set to UTC or any other timezone.
//
// Rule: Every "what day is it?" question must go through
//       these helpers, not raw new Date() local methods.
// ============================================================

// IST is UTC+5:30 = 330 minutes ahead of UTC
var AETHER_IST_OFFSET_MINUTES = 330;
var AETHER_IST_OFFSET_MS = AETHER_IST_OFFSET_MINUTES * 60 * 1000;

/**
 * Convert a UTC timestamp (ms) to an IST-shifted Date object.
 * The returned Date has its local time set to IST wall clock time,
 * but in the local JS timezone. Use only for date arithmetic.
 *
 * @param {number} [timestamp] defaults to Date.now()
 * @returns {Date}
 */
function getISTDate(timestamp) {
  var ts = (timestamp !== undefined) ? timestamp : Date.now();
  // Shift the timestamp by +5:30 so that getUTC* methods return IST time
  return new Date(ts + AETHER_IST_OFFSET_MS);
}

/**
 * Return a YYYY-MM-DD date key in IST for the given timestamp.
 *
 * @param {number} [timestamp] defaults to Date.now()
 * @returns {string} e.g. "2026-05-21"
 */
function getISTDateKey(timestamp) {
  var d = getISTDate(timestamp);
  var year  = d.getUTCFullYear();
  var month = String(d.getUTCMonth() + 1).padStart(2, "0");
  var day   = String(d.getUTCDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

/**
 * Return today's date key in IST.
 *
 * @returns {string} e.g. "2026-05-21"
 */
function getISTTodayKey() {
  return getISTDateKey(Date.now());
}

/**
 * Return the timestamp (ms, UTC) of IST midnight (start of day) for the
 * given timestamp's IST date.
 *
 * @param {number} [timestamp] defaults to Date.now()
 * @returns {number} UTC timestamp of IST midnight
 */
function getISTStartOfDay(timestamp) {
  var ts = (timestamp !== undefined) ? timestamp : Date.now();
  var d  = getISTDate(ts);

  // Build IST midnight as a UTC timestamp:
  // UTC midnight of the IST-shifted date, then subtract the IST offset
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    0, 0, 0, 0
  ) - AETHER_IST_OFFSET_MS;
}

/**
 * Return the timestamp (ms, UTC) of IST midnight of the NEXT day
 * for the given timestamp's IST date.
 *
 * Used for slicing sessions that cross midnight in IST.
 *
 * @param {number} timestamp
 * @returns {number} UTC timestamp of next IST midnight
 */
function getISTNextDayStart(timestamp) {
  var d = getISTDate(timestamp);

  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate() + 1,
    0, 0, 0, 0
  ) - AETHER_IST_OFFSET_MS;
}
