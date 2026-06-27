(() => {
// ============================================================
// profileSections.js
// AetherCP – Dynamic DOM generation for injected analytics sections
//
// Contains:
//   - createAetherProfileRoot()  — first injection
//   - updateAetherProfileRoot()  — subsequent refreshes
//   - renderAetherOverview()     — stat cards
//   - renderAetherHistory()      — recent problem history table
//   - renderAetherHeatmap()      — full-year GitHub-style contribution heatmap
//   - getHeatmapLevel()          — color level from minutes
//
// HEATMAP
// --------------------------------------------------
// Renders a full-year contribution-style heatmap (52 weeks).
// Starts from the Sunday of the week containing Jan 1 of the selected year.
// Ends at the Saturday of the week containing Dec 31.
// Data source: dailyTotals keyed by YYYY-MM-DD (IST).
// Year is controlled by the #aetherHeatmapYearSelect dropdown.
//
// Logs:
//   [AetherCP TIME]    — IST day key generation
//   [AetherCP HEATMAP] — yearly filtering, cell generation
// ============================================================

function createAetherProfileRoot(analytics) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = getAetherGraphTemplate().trim();

  const root = wrapper.firstElementChild;

  renderAetherOverview(root, analytics);

  const selectedYear = new Date().getFullYear(); // default to current year
  renderAetherHeatmap(root, analytics, selectedYear);
  renderAetherHistory(root, analytics.allRecentProblems);

  return root;
}

function updateAetherProfileRoot(root, analytics) {
  const status = root.querySelector("[data-aether-status]");
  if (status) status.textContent = analytics.status;
  renderAetherOverview(root, analytics);

  // Re-render heatmap for whichever year is currently selected
  const yearSelect = document.getElementById("aetherHeatmapYearSelect");
  const selectedYear = yearSelect
    ? parseInt(yearSelect.value, 10)
    : new Date().getFullYear();
  renderAetherHeatmap(root, analytics, selectedYear);
  renderAetherHistory(root, analytics.allRecentProblems);
}

function renderAetherOverview(root, analytics) {
  const overview = root.querySelector("[data-aether-overview]");
  overview.className = "aethercp-overview-grid";

  overview.innerHTML = "";

  const cards = [
    ["Total coding time", formatDurationShort(analytics.totalCodingSeconds)],
    ["Today's coding time", formatDurationShort(analytics.todaySeconds)],
    ["Total problems worked", String(analytics.totalProblemsWorked)],
    ["Current streak", `${analytics.currentStreak} day${analytics.currentStreak === 1 ? "" : "s"}`],
    ["Most worked problem", formatAetherProblemName(analytics.mostWorkedProblem)]
  ];

  cards.forEach(([label, value]) => {
    const card = document.createElement("article");
    const labelElement = document.createElement("span");
    const valueElement = document.createElement("strong");

    card.className = "aethercp-stat-card";
    labelElement.textContent = label;
    valueElement.textContent = value;

    card.appendChild(labelElement);
    card.appendChild(valueElement);
    overview.appendChild(card);
  });
}

function renderAetherHistory(root, problems) {
  const tbody = root.querySelector("[data-aether-history-body]");
  tbody.innerHTML = "";

  const recentProblems = (problems || []).slice(0, 5);

  if (!recentProblems.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "aethercp-empty";
    cell.textContent = "No tracked problem history yet.";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  recentProblems.forEach((problem) => {
    const row = document.createElement("tr");

    appendAetherCell(row, problem.problemName);
    appendAetherCell(row, formatAetherRating(problem));
    appendAetherCell(row, formatDurationShort(problem.totalSeconds));
    appendAetherCell(row, formatAetherDate(problem.solvedAt || problem.lastSeenAt));

    tbody.appendChild(row);
  });
}

function formatAetherRating(problem) {
  const rating = problem?.rating || problem?.problemRating;
  return rating ? String(rating) : "-";
}

function appendAetherCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  row.appendChild(cell);
}

function formatAetherDate(timestamp) {
  if (!timestamp) return "-";

  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

// ──────────────────────────────────────────────
// Heatmap — Full-Year GitHub/Codeforces Style
// ──────────────────────────────────────────────

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

/**
 * Render or update the full-year coding activity heatmap.
 *
 * Layout matches GitHub contribution graph:
 *   - Columns = weeks (Sunday to Saturday)
 *   - Rows = weekday (Sun=0 .. Sat=6)
 *   - Month labels above columns
 *   - Weekday labels on the left
 *   - Full year: from Sunday of the week containing Jan 1
 *              to Saturday of the week containing Dec 31
 *
 * @param {Element} root        — the analytics section root element
 * @param {Object}  analytics   — from getAetherProfileAnalytics(snapshot)
 * @param {number}  selectedYear — the year to render (e.g. 2026)
 */
function renderAetherHeatmap(root, analytics, selectedYear) {
  const grid            = root.querySelector("[data-aether-heatmap-grid]");
  const monthsContainer = root.querySelector("[data-aether-heatmap-months]");

  if (!grid) {
    console.warn("[AetherCP HEATMAP]", "Grid container not found");
    return;
  }

  const dailyTotals  = analytics.dailyTotals || {};
  const todayKey     = getTodayKey();
  const todaySeconds = analytics.todaySeconds || 0;
  const msInDay      = 86400000;

  console.log("[AetherCP TIME]", "Rendering heatmap for year", {
    selectedYear,
    todayKey,
    todaySeconds
  });

  // ── Determine year boundary ──────────────────────────────────
  // IST midnight = UTC midnight - IST offset
  // AETHER_IST_OFFSET_MS is 330 * 60 * 1000 = +5:30 ahead of UTC
  // So IST midnight is UTC midnight minus the offset
  const istOffsetMs = (typeof AETHER_IST_OFFSET_MS !== "undefined")
    ? AETHER_IST_OFFSET_MS
    : 330 * 60 * 1000; // fallback: 5h30m

  // Start: IST midnight of Jan 1 of selectedYear
  const jan1Ts    = Date.UTC(selectedYear, 0, 1) - istOffsetMs;
  const jan1Date  = getISTDate(jan1Ts);
  const jan1Weekday = jan1Date.getUTCDay(); // 0=Sun .. 6=Sat

  // First cell: Sunday of the week containing Jan 1
  const firstCellTs = jan1Ts - jan1Weekday * msInDay;

  // End: IST midnight of Dec 31 of selectedYear
  const dec31Ts    = Date.UTC(selectedYear, 11, 31) - istOffsetMs;
  const dec31Date  = getISTDate(dec31Ts);
  const dec31Weekday = dec31Date.getUTCDay();

  // Last cell: Saturday of the week containing Dec 31
  const lastCellTs = dec31Ts + (6 - dec31Weekday) * msInDay;

  // Total cells = from firstCellTs to lastCellTs inclusive
  const totalCells = Math.round((lastCellTs - firstCellTs) / msInDay) + 1;
  const totalWeeks = Math.ceil(totalCells / 7);

  console.log("[AetherCP HEATMAP]", "Year range computed", {
    selectedYear,
    firstCell: getISTDateKey(firstCellTs),
    lastCell:  getISTDateKey(lastCellTs),
    totalCells,
    totalWeeks
  });

  // ── Build CSS grid columns ───────────────────────────────────
  // 1 column for weekday labels (28px), then totalWeeks columns (12px each)
  const weekColSize = "12px";
  const gridCols = `28px repeat(${totalWeeks}, ${weekColSize})`;

  grid.style.gridTemplateColumns = gridCols;
  grid.style.gridTemplateRows = "repeat(7, 12px)";
  grid.innerHTML = "";

  if (monthsContainer) {
    monthsContainer.style.gridTemplateColumns = gridCols;
    monthsContainer.innerHTML = "";
  }

  // ── Weekday labels (first column) ───────────────────────────
  WEEKDAY_LABELS.forEach((dayText) => {
    const label = document.createElement("span");
    label.className = "aethercp-heatmap-label";
    label.textContent = dayText;
    grid.appendChild(label);
  });

  // ── Day cells ───────────────────────────────────────────────
  const weekColumnMonths = []; // track which month each week column shows
  let cellsGenerated = 0;
  let cellsWithActivity = 0;

  for (let i = 0; i < totalCells; i++) {
    const cellTs   = firstCellTs + i * msInDay;
    const key      = getISTDateKey(cellTs);
    const cellDate = getISTDate(cellTs);

    // Track week's starting month for month labels
    if (i % 7 === 0) {
      weekColumnMonths.push(cellDate.getUTCMonth());
    }

    const savedSeconds = dailyTotals[key]?.totalSeconds || 0;
    // For today: use the live session blend if it's larger
    const totalSeconds = (key === todayKey)
      ? Math.max(savedSeconds, todaySeconds)
      : savedSeconds;

    const isFuture = key > todayKey;
    const minutes  = Math.floor(totalSeconds / 60);
    const level    = getHeatmapLevel(minutes);

    const cell = document.createElement("span");
    cell.className = "aethercp-heatmap-cell";

    if (isFuture) {
      cell.classList.add("aethercp-heatmap-future");
    } else {
      cell.classList.add(`level-${level}`);
      if (key === todayKey) {
        cell.classList.add("aethercp-heatmap-today");
      }

      const dateString = `${MONTH_NAMES[cellDate.getUTCMonth()]} ${cellDate.getUTCDate()}, ${cellDate.getUTCFullYear()}`;
      const tooltipText = minutes > 0
        ? `${formatDurationShort(totalSeconds)} on ${dateString}`
        : `No activity on ${dateString}`;

      cell.setAttribute("data-tooltip", tooltipText);

      if (minutes > 0) cellsWithActivity++;
    }

    grid.appendChild(cell);
    cellsGenerated++;
  }

  console.log("[AetherCP HEATMAP]", "Cells generated", {
    cellsGenerated,
    cellsWithActivity,
    totalWeeks
  });

  // ── Month labels ─────────────────────────────────────────────
  if (monthsContainer) {
    // Spacer for the weekday-labels column
    const spacer = document.createElement("span");
    monthsContainer.appendChild(spacer);

    for (let c = 0; c < weekColumnMonths.length; c++) {
      const currentMonth = weekColumnMonths[c];
      const prevMonth    = c > 0 ? weekColumnMonths[c - 1] : -1;

      // Only draw label at start of a new month
      if (c === 0 || currentMonth !== prevMonth) {
        const monthLabel = document.createElement("span");
        monthLabel.className = "aethercp-heatmap-months-label";
        monthLabel.textContent = MONTH_NAMES[currentMonth];
        // grid-column is 1-indexed, +2 because: index 0 = col 2 (after spacer)
        monthLabel.style.gridColumn = `${c + 2}`;
        monthsContainer.appendChild(monthLabel);
      }
    }
  }

  console.log("[AetherCP TIME]", "Heatmap render complete for year", selectedYear);
}

/**
 * Return the heatmap color level based on daily minutes.
 *
 * @param {number} minutes
 * @returns {number} level (0 to 4)
 */
function getHeatmapLevel(minutes) {
  if (minutes <= 0)   return 0;
  if (minutes < 30)   return 1;
  if (minutes < 60)   return 2;
  if (minutes < 180)  return 3;
  return 4;
}

// Expose functions to global scope
window.createAetherProfileRoot = createAetherProfileRoot;
window.updateAetherProfileRoot = updateAetherProfileRoot;
window.renderAetherOverview    = renderAetherOverview;
window.renderAetherHistory     = renderAetherHistory;
window.renderAetherHeatmap     = renderAetherHeatmap;

console.log("[AetherCP LOAD] profileSections.js loaded");
})();
