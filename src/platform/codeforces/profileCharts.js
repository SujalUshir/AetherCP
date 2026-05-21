const AETHER_CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#64748b",
  "#ec4899"
];

let aetherProfileCharts = {
  platform: null,
  problems: null,
  daily: null
};

function logAetherProfileDebug(message, data) {
  console.log("[AetherCP:profile]", message, data || "");
}

function warnAetherProfileDebug(message, data) {
  console.warn("[AetherCP:profile]", message, data || "");
}

function renderAetherProfileCharts(analytics) {
  if (typeof Chart === "undefined") {
    warnAetherProfileDebug("Chart.js is not available");
    return;
  }

  logAetherProfileDebug("Rendering charts", analytics.charts);

  aetherProfileCharts.platform = renderAetherCircularChart({
    existingChart: aetherProfileCharts.platform,
    canvasId: "aetherPlatformChart",
    legendId: "aetherPlatformLegend",
    rows: analytics.charts.platformDistribution,
    label: "Platform time",
    type: "doughnut"
  });

  aetherProfileCharts.problems = renderAetherCircularChart({
    existingChart: aetherProfileCharts.problems,
    canvasId: "aetherProblemChart",
    legendId: "aetherProblemLegend",
    rows: analytics.charts.problemTimeDistribution,
    label: "Problem time",
    type: "pie"
  });

  aetherProfileCharts.daily = renderAetherBarChart({
    existingChart: aetherProfileCharts.daily,
    canvasId: "aetherDailyChart",
    rows: analytics.charts.lastSevenDays
  });
}

function renderAetherCircularChart(config) {
  const canvas = document.getElementById(config.canvasId);

  if (!canvas) {
    warnAetherProfileDebug("Chart canvas missing", config.canvasId);
    return config.existingChart;
  }

  const rows = normalizeChartRows(config.rows);
  const labels = rows.map((row) => row.label);
  const data = rows.map((row) => row.seconds);
  const colors = getChartColors(rows.length);

  renderAetherLegend(config.legendId, rows, colors);

  if (config.existingChart) {
    updateAetherChart(config.existingChart, labels, data, colors);
    logAetherProfileDebug("Updated chart", config.canvasId);
    return config.existingChart;
  }

  const chart = new Chart(canvas.getContext("2d"), {
    type: config.type,
    data: {
      labels,
      datasets: [
        {
          label: config.label,
          data,
          backgroundColor: colors,
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: config.type === "doughnut" ? "60%" : undefined,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (item) => {
              const total = getTotalFromArray(item.dataset.data);
              const percent = total ? Math.round((item.raw / total) * 100) : 0;
              return `${item.label}: ${formatDurationShort(item.raw)} (${percent}%)`;
            }
          }
        }
      }
    }
  });

  logAetherProfileDebug("Created chart", {
    canvasId: config.canvasId,
    type: config.type,
    rows
  });

  return chart;
}

function renderAetherBarChart(config) {
  const canvas = document.getElementById(config.canvasId);

  if (!canvas) {
    warnAetherProfileDebug("Daily chart canvas missing", config.canvasId);
    return config.existingChart;
  }

  const rows = config.rows || [];
  const labels = rows.map((row) => row.label);
  const data = rows.map((row) => Math.round(row.seconds / 60));

  if (config.existingChart) {
    updateAetherChart(config.existingChart, labels, data, ["#3b82f6"]);
    logAetherProfileDebug("Updated daily chart", config.canvasId);
    return config.existingChart;
  }

  const chart = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Minutes",
          data,
          backgroundColor: "#3b82f6",
          borderRadius: 4,
          maxBarThickness: 44
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (item) => `${item.raw}m`
          }
        }
      }
    }
  });

  logAetherProfileDebug("Created daily bar chart", rows);
  return chart;
}

function updateAetherChart(chart, labels, data, colors) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.data.datasets[0].backgroundColor = colors;
  chart.update("none");
}

function normalizeChartRows(rows) {
  if (rows && rows.length > 0) {
    return rows;
  }

  return [
    {
      label: "No data yet",
      seconds: 1
    }
  ];
}

function getChartColors(count) {
  return Array.from({ length: count }, (_, index) => {
    return AETHER_CHART_COLORS[index % AETHER_CHART_COLORS.length];
  });
}

function renderAetherLegend(legendId, rows, colors) {
  const legend = document.getElementById(legendId);

  if (!legend) {
    warnAetherProfileDebug("Legend container missing", legendId);
    return;
  }

  const total = getTotalFromArray(rows.map((row) => row.seconds));
  legend.innerHTML = "";

  rows.forEach((row, index) => {
    const percent = total ? Math.round((row.seconds / total) * 100) : 0;
    const item = document.createElement("li");
    const swatch = document.createElement("span");
    const label = document.createElement("span");

    swatch.className = "aethercp-legend-swatch";
    swatch.style.backgroundColor = colors[index];
    label.textContent = `${row.label}: ${formatDurationShort(row.seconds)} (${percent}%)`;

    item.appendChild(swatch);
    item.appendChild(label);
    legend.appendChild(item);
  });
}

function getTotalFromArray(values) {
  return values.reduce((total, value) => total + value, 0);
}
