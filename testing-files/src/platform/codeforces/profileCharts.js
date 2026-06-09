(() => {
// ============================================================
// profileCharts.js
// AetherCP – Chart.js chart rendering
//
// Contains:
//   - renderCFRatingChart(ratingDist)
//   - renderCFTagChart(tagDist)
//   - renderAetherProfileCharts(analytics)
// ============================================================

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

const AETHER_CF_RATING_COLORS = {
  800:  "#808080", // grey     (newbie)
  900:  "#808080",
  1000: "#808080",
  1100: "#808080",
  1200: "#008000", // green    (pupil)
  1300: "#008000",
  1400: "#03a89e", // cyan     (specialist)
  1500: "#03a89e",
  1600: "#0000ff", // blue     (expert)
  1700: "#0000ff",
  1800: "#0000ff",
  1900: "#aa00aa", // violet   (candidate master)
  2000: "#aa00aa",
  2100: "#ff8c00", // orange   (master)
  2200: "#ff8c00",
  2300: "#ff8c00",
  2400: "#ff0000", // red      (grandmaster+)
  2500: "#ff0000",
  2600: "#ff0000",
  2700: "#ff0000",
  2800: "#ff0000",
  2900: "#ff0000",
  3000: "#ff0000",
  3100: "#ff0000",
  3200: "#ff0000",
  3300: "#ff0000",
  3400: "#ff0000",
  3500: "#ff0000"
};

function getRatingColor(rating) {
  const tiers = Object.keys(AETHER_CF_RATING_COLORS).map(Number).sort((a, b) => a - b);
  let color = "#808080";
  for (const tier of tiers) {
    if (rating >= tier) color = AETHER_CF_RATING_COLORS[tier];
  }
  return color;
}

let aetherCFCharts = {
  rating: null,
  tag: null
};

function logAetherCFChart(message, data) {
  console.log("[AetherCP CHART]", message, data !== undefined ? data : "");
}

function warnAetherCFChart(message, data) {
  console.warn("[AetherCP CHART]", message, data !== undefined ? data : "");
}

function renderCFRatingChart(ratingDist) {
  if (typeof Chart === "undefined") {
    warnAetherCFChart("Chart.js not available — cannot render rating chart");
    return;
  }

  const canvas = document.getElementById("aetherCFRatingChart");
  if (!canvas) {
    warnAetherCFChart("Canvas #aetherCFRatingChart not found in DOM");
    return;
  }

  logAetherCFChart("Canvas found: #aetherCFRatingChart", { buckets: ratingDist.length });

  const labels = ratingDist.map((d) => String(d.rating));
  const data   = ratingDist.map((d) => d.count);
  const colors = ratingDist.map((d) => getRatingColor(d.rating));

  if (aetherCFCharts.rating) {
    aetherCFCharts.rating.data.labels = labels;
    aetherCFCharts.rating.data.datasets[0].data = data;
    aetherCFCharts.rating.data.datasets[0].backgroundColor = colors;
    aetherCFCharts.rating.update("none");
    logAetherCFChart("Rating chart updated", { labels, data });
    return;
  }

  aetherCFCharts.rating = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Problems solved",
          data,
          backgroundColor: colors,
          borderColor: colors.map((c) => c),
          borderWidth: 1,
          borderRadius: 3,
          maxBarThickness: 40
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Problem Rating",
            color: "#555",
            font: { size: 11 }
          },
          ticks: {
            color: "#555",
            font: { size: 11 }
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Problems Solved",
            color: "#555",
            font: { size: 11 }
          },
          ticks: {
            precision: 0,
            color: "#555",
            font: { size: 11 }
          },
          grid: { color: "#f0f0f0" }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => `Rating ${items[0].label}`,
            label: (item) => ` ${item.raw} problem${item.raw === 1 ? "" : "s"} solved`
          }
        }
      }
    }
  });

  logAetherCFChart("Rating chart created", { labels, data });
}

function renderCFTagChart(tagDist) {
  const MAX_TAGS = 12;

  if (typeof Chart === "undefined") {
    warnAetherCFChart("Chart.js not available — cannot render tag chart");
    return;
  }

  const canvas = document.getElementById("aetherCFTagChart");
  if (!canvas) {
    warnAetherCFChart("Canvas #aetherCFTagChart not found in DOM");
    return;
  }

  logAetherCFChart("Canvas found: #aetherCFTagChart", { totalTags: tagDist.length });

  const topTags  = tagDist.slice(0, MAX_TAGS);
  const restTags = tagDist.slice(MAX_TAGS);
  const restCount = restTags.reduce((sum, t) => sum + t.count, 0);

  const displayTags = restCount > 0
    ? [...topTags, { tag: "Other", count: restCount }]
    : topTags;

  const labels = displayTags.map((d) => d.tag);
  const data   = displayTags.map((d) => d.count);
  const colors = getChartColors(displayTags.length);
  const total  = data.reduce((s, v) => s + v, 0);

  renderCFTagLegend("aetherCFTagLegend", displayTags, colors, total);

  if (aetherCFCharts.tag) {
    aetherCFCharts.tag.data.labels = labels;
    aetherCFCharts.tag.data.datasets[0].data = data;
    aetherCFCharts.tag.data.datasets[0].backgroundColor = colors;
    aetherCFCharts.tag.update("none");
    logAetherCFChart("Tag chart updated", { labels, data });
    return;
  }

  aetherCFCharts.tag = new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          label: "Problems solved",
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
      cutout: "60%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => {
              const pct = total ? Math.round((item.raw / total) * 100) : 0;
              return ` ${item.label}: ${item.raw} (${pct}%)`;
            }
          }
        }
      }
    }
  });

  logAetherCFChart("Tag chart created", { labels, data });
}

function renderCFTagLegend(legendId, tags, colors, total) {
  const legend = document.getElementById(legendId);
  if (!legend) {
    warnAetherCFChart("Legend container missing", legendId);
    return;
  }

  legend.innerHTML = "";

  tags.forEach((item, index) => {
    const pct = total ? Math.round((item.count / total) * 100) : 0;
    const li = document.createElement("li");
    const swatch = document.createElement("span");
    const label = document.createElement("span");

    swatch.className = "aethercp-legend-swatch";
    swatch.style.backgroundColor = colors[index];
    label.className = "aethercp-legend-text";
    label.textContent = `${item.tag}: ${item.count} (${pct}%)`;

    li.appendChild(swatch);
    li.appendChild(label);
    legend.appendChild(li);
  });
}

function getChartColors(count) {
  return Array.from({ length: count }, (_, index) =>
    AETHER_CHART_COLORS[index % AETHER_CHART_COLORS.length]
  );
}

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
    label.className = "aethercp-legend-text";
    label.textContent = `${row.label}: ${formatDurationShort(row.seconds)} (${percent}%)`;

    item.appendChild(swatch);
    item.appendChild(label);
    legend.appendChild(item);
  });
}

function getTotalFromArray(values) {
  return values.reduce((total, value) => total + value, 0);
}

// Expose functions to global scope
window.renderCFRatingChart = renderCFRatingChart;
window.renderCFTagChart = renderCFTagChart;
window.renderAetherProfileCharts = renderAetherProfileCharts;

console.log("[AetherCP LOAD] profileCharts.js loaded");
})();

