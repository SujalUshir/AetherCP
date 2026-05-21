const AETHER_PROFILE_ROOT_ID = "aethercp-profile-analytics";

function getAetherGraphTemplate() {
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
        <h4>Daily Coding Time - Last 7 Days</h4>
        <div class="aethercp-chart-box aethercp-chart-box-wide">
          <canvas id="aetherDailyChart"></canvas>
        </div>
      </article>

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
