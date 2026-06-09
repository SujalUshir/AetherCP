// ============================================================
// time.js
// AetherCP – Time Helpers
//
// All date/day operations delegate to timezone.js (IST) so that
// daily resets, heatmap dates, and streak logic all use
// Asia/Kolkata (UTC+5:30) as the canonical timezone.
//
// timezone.js MUST be loaded before this file.
// ============================================================

/**
 * Return a YYYY-MM-DD date key for the given Date object,
 * interpreted in IST.
 *
 * The `date` argument is treated as a holder for a UTC timestamp
 * via date.getTime(). The IST wall-clock date is then derived.
 *
 * @param {Date} date
 * @returns {string}
 */
function getDateKey(date) {
  return getISTDateKey(date.getTime());
}

/**
 * Return today's YYYY-MM-DD key in IST.
 * @returns {string}
 */
function getTodayKey() {
  return getISTTodayKey();
}

/**
 * Return the UTC timestamp of IST midnight at the start of today.
 * @returns {number}
 */
function getStartOfToday() {
  return getISTStartOfDay();
}

/**
 * Return the UTC timestamp of IST midnight at the start of the
 * day AFTER the day containing the given timestamp.
 *
 * Used by sessionManager to split sessions across midnight.
 *
 * @param {number} timestamp
 * @returns {number}
 */
function getNextDayStart(timestamp) {
  return getISTNextDayStart(timestamp);
}

/**
 * Calculate the overlap in seconds between two time ranges.
 * [startA, endA] and [startB, endB].
 * Returns 0 if ranges do not overlap.
 *
 * @param {number} startA
 * @param {number} endA
 * @param {number} startB
 * @param {number} endB
 * @returns {number}
 */
function getOverlapSeconds(startA, endA, startB, endB) {
  const start = Math.max(startA, startB);
  const end   = Math.min(endA, endB);

  if (end <= start) return 0;

  return Math.floor((end - start) / 1000);
}

/**
 * Format a number of seconds into a human-readable string.
 * Examples: "2h 30m", "45m", "30s"
 *
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatDurationShort(totalSeconds) {
  if (!totalSeconds || totalSeconds < 0) return "0m";

  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${totalSeconds}s`;
}
