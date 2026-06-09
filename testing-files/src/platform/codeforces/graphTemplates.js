(() => {
// ============================================================
// graphTemplates.js
// AetherCP – HTML Templates for injected analytics sections
//
// Contains:
//   - getCFAnalyticsTemplate()  — Competitive analytics (CF API data)
//   - getAetherGraphTemplate()  — Productivity analytics (timer data)
//
// CF analytics is injected ABOVE productivity analytics.
//
// LAYOUT HIERARCHY (FINAL):
//   CF Competitive Analytics
//     1. Rating distribution graph (full width)
//     2. Topic/tag doughnut chart
//     3. Solved stats cards (below graphs)
//   Productivity Analytics
//     1. Heatmap (with year selector)
//     2. Timing stats / charts
//     3. Problem history
// ============================================================

const AETHER_PROFILE_ROOT_ID  = "aethercp-profile-analytics";
const AETHER_CF_ROOT_ID        = "aethercp-cf-analytics";
const AETHER_TOGGLE_BAR_ID     = "aethercp-toggle-bar";

// ──────────────────────────────────────────────
// Standalone Toggle Bar template
// Injected AFTER native profile, BEFORE CF analytics
// Always injected (own profile only — caller decides)
// ──────────────────────────────────────────────

function getAetherToggleBarTemplate() {
  return `
    <div id="${AETHER_TOGGLE_BAR_ID}" class="aethercp-standalone-toggle-bar">
      <span class="aethercp-toggle-bar-label">AetherCP Views</span>
      <div class="aethercp-toggle-bar">
        <label class="aethercp-toggle-label" title="Toggle Questions Solved Analysis visibility">
          <input type="checkbox" id="aetherToggleCFAnalytics" checked>
          <span>Questions Solved</span>
        </label>
        <label class="aethercp-toggle-label" title="Toggle heatmap visibility">
          <input type="checkbox" id="aetherToggleHeatmap" checked>
          <span>Heatmap</span>
        </label>
        <label class="aethercp-toggle-label" title="Toggle productivity charts visibility">
          <input type="checkbox" id="aetherToggleProductivity" checked>
          <span>Productivity</span>
        </label>
      </div>
    </div>
  `;
}

// ──────────────────────────────────────────────
// CF Competitive Analytics template
// Order: graphs FIRST, solved stats BELOW
// ──────────────────────────────────────────────

function getCFAnalyticsTemplate(handle) {
  return `
    <section id="${AETHER_CF_ROOT_ID}" class="aethercp-profile-root roundbox">
      <div class="roundbox-lt">&nbsp;</div>
      <div class="roundbox-rt">&nbsp;</div>
      <div class="roundbox-lb">&nbsp;</div>
      <div class="roundbox-rb">&nbsp;</div>

      <div class="aethercp-header">
        <div>
          <p class="aethercp-eyebrow">AetherCP &middot; Competitive Analytics</p>
          <h3>Competitive Analytics &mdash; <span class="aethercp-cf-handle">${handle || "Unknown"}</span></h3>
        </div>
        <span class="aethercp-status aethercp-cf-solved-badge" id="aetherCFSolvedBadge">Loading&hellip;</span>
      </div>

      <div class="aethercp-cf-loading" id="aetherCFLoadingMsg">
        <span>Fetching Codeforces data&hellip;</span>
      </div>

      <div class="aethercp-cf-error" id="aetherCFErrorMsg" style="display:none;">
        <span id="aetherCFErrorText">Failed to load data.</span>
      </div>

      <div class="aethercp-cf-charts-wrap" id="aetherCFChartsWrap" style="display:none;">

        <!-- GRAPHS FIRST -->

        <article class="aethercp-panel aethercp-panel-wide">
          <h4>Problem Rating Distribution</h4>
          <div class="aethercp-chart-box aethercp-chart-box-wide">
            <canvas id="aetherCFRatingChart"></canvas>
          </div>
        </article>

        <div class="aethercp-cf-bottom-row">
          <article class="aethercp-panel aethercp-cf-tag-panel">
            <h4>Topic &amp; Tag Distribution</h4>
            <div class="aethercp-chart-layout">
              <div class="aethercp-chart-box">
                <canvas id="aetherCFTagChart"></canvas>
              </div>
              <ul id="aetherCFTagLegend" class="aethercp-chart-legend"></ul>
            </div>
          </article>
        </div>

        <!-- SOLVED STATS CARDS BELOW GRAPHS -->

        <div class="aethercp-cf-stats-row" id="aetherCFStatsRow">
          <article class="aethercp-stat-card">
            <span>Total Solved</span>
            <strong id="aetherCFStatTotal">&mdash;</strong>
          </article>
          <article class="aethercp-stat-card">
            <span>Contest Solves</span>
            <strong id="aetherCFStatContest">&mdash;</strong>
          </article>
          <article class="aethercp-stat-card">
            <span>Practice Solves</span>
            <strong id="aetherCFStatPractice">&mdash;</strong>
          </article>
          <article class="aethercp-stat-card">
            <span>Virtual Solves</span>
            <strong id="aetherCFStatVirtual">&mdash;</strong>
          </article>
          <article class="aethercp-stat-card">
            <span>Gym Solves</span>
            <strong id="aetherCFStatGym">&mdash;</strong>
          </article>
          <article class="aethercp-stat-card">
            <span>Rated Problems</span>
            <strong id="aetherCFStatRated">&mdash;</strong>
          </article>
        </div>

      </div>
    </section>
  `;
}

// ──────────────────────────────────────────────
// Productivity Analytics template
// Source: Local extension timer state
// ──────────────────────────────────────────────

function getAetherGraphTemplate() {
  const currentYear = new Date().getFullYear();
  // Build year options: current year down to 2023
  let yearOptions = "";
  for (let y = currentYear; y >= 2023; y--) {
    yearOptions += `<option value="${y}"${y === currentYear ? " selected" : ""}>${y}</option>`;
  }

  return `
    <section id="${AETHER_PROFILE_ROOT_ID}" class="aethercp-profile-root roundbox">
      <div class="roundbox-lt">&nbsp;</div>
      <div class="roundbox-rt">&nbsp;</div>
      <div class="roundbox-lb">&nbsp;</div>
      <div class="roundbox-rb">&nbsp;</div>

      <div class="aethercp-header">
        <div>
          <p class="aethercp-eyebrow">AetherCP</p>
          <h3>Productivity Analytics</h3>
        </div>
        <span class="aethercp-status" data-aether-status>Loading</span>
      </div>

      <div class="aethercp-overview-grid" data-aether-overview></div>

      <!-- PRODUCTIVITY CHARTS (toggleable) -->
      <div id="aetherProductivitySection">
        <div class="aethercp-graph-row">
          <article class="aethercp-panel">
            <h4>Platform Distribution</h4>
            <div class="aethercp-chart-layout">
              <div class="aethercp-chart-box">
                <canvas id="aetherPlatformChart"></canvas>
              </div>
              <ul id="aetherPlatformLegend" class="aethercp-chart-legend"></ul>
            </div>
          </article>

          <article class="aethercp-panel">
            <h4>Most Worked Problems</h4>
            <div class="aethercp-chart-layout">
              <div class="aethercp-chart-box">
                <canvas id="aetherProblemChart"></canvas>
              </div>
              <ul id="aetherProblemLegend" class="aethercp-chart-legend"></ul>
            </div>
          </article>
        </div>

        <article class="aethercp-panel aethercp-panel-wide">
          <h4>Daily Coding Time &mdash; Last 7 Days</h4>
          <div class="aethercp-chart-box aethercp-chart-box-wide">
            <canvas id="aetherDailyChart"></canvas>
          </div>
        </article>
      </div>

      <!-- HEATMAP (toggleable) -->
      <article class="aethercp-panel aethercp-panel-wide aethercp-heatmap-panel" id="aetherHeatmapSection" data-aether-heatmap>
        <div class="aethercp-heatmap-header">
          <h4>Coding Activity</h4>
          <div class="aethercp-heatmap-controls">
            <button class="aethercp-year-nav" id="aetherYearPrev" title="Previous year">&#8592;</button>
            <select class="aethercp-year-select" id="aetherHeatmapYearSelect">
              ${yearOptions}
            </select>
            <button class="aethercp-year-nav" id="aetherYearNext" title="Next year">&#8594;</button>
          </div>
        </div>
        <div class="aethercp-heatmap-wrap">
          <div class="aethercp-heatmap-months" data-aether-heatmap-months></div>
          <div class="aethercp-heatmap-grid" data-aether-heatmap-grid></div>
          <div class="aethercp-heatmap-legend">
            <span class="aethercp-heatmap-legend-label">Less</span>
            <span class="aethercp-heatmap-swatch level-0"></span>
            <span class="aethercp-heatmap-swatch level-1"></span>
            <span class="aethercp-heatmap-swatch level-2"></span>
            <span class="aethercp-heatmap-swatch level-3"></span>
            <span class="aethercp-heatmap-swatch level-4"></span>
            <span class="aethercp-heatmap-legend-label">More</span>
          </div>
        </div>
      </article>

      <!-- PROBLEM HISTORY -->
      <article class="aethercp-panel aethercp-history-panel" data-aether-history>
        <h4>Recent Problem History</h4>
        <div class="aethercp-table-wrap">
          <table class="aethercp-history-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Platform</th>
                <th>Total time</th>
                <th>Last worked</th>
                <th>Sessions</th>
              </tr>
            </thead>
            <tbody data-aether-history-body>
              <tr>
                <td colspan="5" class="aethercp-empty">Loading AetherCP history...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

// Expose variables and functions to global scope
window.AETHER_PROFILE_ROOT_ID   = AETHER_PROFILE_ROOT_ID;
window.AETHER_CF_ROOT_ID         = AETHER_CF_ROOT_ID;
window.AETHER_TOGGLE_BAR_ID      = AETHER_TOGGLE_BAR_ID;
window.getAetherToggleBarTemplate = getAetherToggleBarTemplate;
window.getCFAnalyticsTemplate    = getCFAnalyticsTemplate;
window.getAetherGraphTemplate    = getAetherGraphTemplate;

console.log("[AetherCP LOAD] graphTemplates.js loaded");
})();
