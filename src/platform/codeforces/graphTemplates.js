(() => {
// ============================================================
// graphTemplates.js
// AetherCP - HTML templates for Codeforces profile injections
//
// Final profile order:
//   Native Codeforces profile
//   Competitive Analytics
//     - Problem Rating Distribution
//     - Problem Topics Distribution
//   Codeforces Solved Heatmap
//   Practice Analytics
//   Recent Problem History
// ============================================================

const AETHER_PROFILE_ROOT_ID = "aethercp-profile-analytics";
const AETHER_CF_ROOT_ID = "aethercp-cf-analytics";

function getCFAnalyticsTemplate(handle) {
  return `
    <section id="${AETHER_CF_ROOT_ID}" class="aethercp-profile-root aethercp-cf-root roundbox">
      <div class="roundbox-lt">&nbsp;</div>
      <div class="roundbox-rt">&nbsp;</div>
      <div class="roundbox-lb">&nbsp;</div>
      <div class="roundbox-rb">&nbsp;</div>

      <div class="aethercp-header aethercp-cf-header">
        <div>
          <p class="aethercp-eyebrow">Codeforces Analytics</p>
          <h3>Problem Rating Distribution</h3>
        </div>
        <span class="aethercp-status aethercp-cf-solved-badge" id="aetherCFSolvedBadge">Loading...</span>
      </div>

      <div class="aethercp-cf-loading" id="aetherCFLoadingMsg">
        <span>Fetching Codeforces data...</span>
      </div>

      <div class="aethercp-cf-error" id="aetherCFErrorMsg" style="display:none;">
        <span id="aetherCFErrorText">Failed to load data.</span>
      </div>

      <div class="aethercp-cf-charts-wrap" id="aetherCFChartsWrap" style="display:none;">
        <article class="aethercp-rating-panel">
          <div class="aethercp-rating-title-row">
            <div>
              <h4>Solved Problems by Rating</h4>
              <p>Accepted Codeforces problems grouped by official problem rating.</p>
            </div>
            <span class="aethercp-cf-handle">${handle || "Unknown"}</span>
          </div>
          <div class="aethercp-chart-box aethercp-rating-chart-box">
            <canvas id="aetherCFRatingChart"></canvas>
          </div>
        </article>

        <article class="aethercp-rating-panel aethercp-topic-panel">
          <div class="aethercp-rating-title-row">
            <div>
              <h4>Problem Topics Distribution</h4>
              <p>Accepted Codeforces problems grouped by public problem tags.</p>
            </div>
          </div>
          <div class="aethercp-topic-layout">
            <div class="aethercp-chart-box aethercp-topic-chart-box">
              <canvas id="aetherCFTopicChart"></canvas>
            </div>
            <ul id="aetherCFTopicLegend" class="aethercp-topic-legend"></ul>
          </div>
        </article>
      </div>
    </section>
  `;
}

function getAetherGraphTemplate() {
  const currentYear = new Date().getFullYear();
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

      <article class="aethercp-panel aethercp-panel-wide aethercp-heatmap-panel" id="aetherHeatmapSection" data-aether-heatmap>
        <div class="aethercp-heatmap-header">
          <div>
            <p class="aethercp-eyebrow">Codeforces Solved Heatmap</p>
            <h3>Coding Activity</h3>
          </div>
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

      <section class="aethercp-productivity-block" id="aetherProductivitySection">
        <div class="aethercp-header">
          <div>
            <p class="aethercp-eyebrow">AetherCP</p>
            <h3>Practice Analytics</h3>
          </div>
          <span class="aethercp-status" data-aether-status>Loading</span>
        </div>

        <div class="aethercp-overview-grid" data-aether-overview></div>

        <article class="aethercp-panel aethercp-panel-wide">
          <h4>Daily Coding Time - Last 7 Days</h4>
          <div class="aethercp-chart-box aethercp-chart-box-wide">
            <canvas id="aetherDailyChart"></canvas>
          </div>
        </article>
      </section>

      <article class="aethercp-panel aethercp-history-panel" data-aether-history>
        <h4>Recent Problem History</h4>
        <div class="aethercp-table-wrap">
          <table class="aethercp-history-table">
            <thead>
              <tr>
                <th>Problem Name</th>
                <th>Rating</th>
                <th>Time Spent</th>
                <th>Date Solved</th>
              </tr>
            </thead>
            <tbody data-aether-history-body>
              <tr>
                <td colspan="4" class="aethercp-empty">Loading AetherCP history...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

window.AETHER_PROFILE_ROOT_ID = AETHER_PROFILE_ROOT_ID;
window.AETHER_CF_ROOT_ID = AETHER_CF_ROOT_ID;
window.getCFAnalyticsTemplate = getCFAnalyticsTemplate;
window.getAetherGraphTemplate = getAetherGraphTemplate;

console.log("[AetherCP LOAD] graphTemplates.js loaded");
})();
