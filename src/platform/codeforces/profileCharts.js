(() => {
// ============================================================
// profileCharts.js
// AetherCP - Chart.js rendering for Codeforces profile UI
// ============================================================

const CF_RATING_TIERS = [
  { min: 2400, bg: "#e53935", border: "#b71c1c", hover: "#d32f2f" },
  { min: 2000, bg: "#ff8c00", border: "#d34f00", hover: "#ff6f00" },
  { min: 1600, bg: "#aa00aa", border: "#7d007d", hover: "#920092" },
  { min: 1300, bg: "#4364d8", border: "#2f49b7", hover: "#3657c8" },
  { min: 1000, bg: "#03a89e", border: "#02877f", hover: "#02998f" },
  { min: 900, bg: "#008000", border: "#006c00", hover: "#007400" },
  { min: 0, bg: "#808080", border: "#676767", hover: "#707070" }
];

const CF_TOPIC_COLORS = [
  "#2f6fbb",
  "#03a89e",
  "#008000",
  "#aa00aa",
  "#ff8c00",
  "#e53935",
  "#64748b",
  "#7c3aed",
  "#0891b2",
  "#ca8a04",
  "#be123c"
];

let aetherCFCharts = {
  rating: null,
  topics: null
};

let aetherProfileCharts = {
  daily: null
};

function logAetherCFChart(message, data) {
  console.log("[AetherCP CHART]", message, data !== undefined ? data : "");
}

function warnAetherCFChart(message, data) {
  console.warn("[AetherCP CHART]", message, data !== undefined ? data : "");
}

function getRatingPalette(rating) {
  return CF_RATING_TIERS.find((tier) => rating >= tier.min) || CF_RATING_TIERS[CF_RATING_TIERS.length - 1];
}

function renderCFRatingChart(ratingDist) {
  if (typeof Chart === "undefined") {
    warnAetherCFChart("Chart.js not available - cannot render rating chart");
    return;
  }

  const canvas = document.getElementById("aetherCFRatingChart");
  if (!canvas) {
    warnAetherCFChart("Canvas #aetherCFRatingChart not found in DOM");
    return;
  }

  const labels = ratingDist.map((d) => String(d.rating));
  const data = ratingDist.map((d) => d.count);
  const palettes = ratingDist.map((d) => getRatingPalette(d.rating));
  const backgroundColor = palettes.map((p) => p.bg);
  const borderColor = palettes.map((p) => p.border);
  const hoverBackgroundColor = palettes.map((p) => p.hover);

  if (aetherCFCharts.rating) {
    const dataset = aetherCFCharts.rating.data.datasets[0];
    aetherCFCharts.rating.data.labels = labels;
    dataset.data = data;
    dataset.backgroundColor = backgroundColor;
    dataset.borderColor = borderColor;
    dataset.hoverBackgroundColor = hoverBackgroundColor;
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
          label: "Solved",
          data,
          backgroundColor,
          borderColor,
          hoverBackgroundColor,
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 36
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 10,
          right: 14,
          bottom: 4,
          left: 8
        }
      },
      animation: {
        duration: 350,
        easing: "easeOutQuart"
      },
      interaction: {
        intersect: false,
        mode: "index"
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Problem rating",
            color: "#555",
            font: {
              family: "Verdana, Arial, sans-serif",
              size: 11,
              weight: "600"
            }
          },
          ticks: {
            color: "#555",
            autoSkipPadding: 12,
            maxRotation: 0,
            font: {
              family: "Verdana, Arial, sans-serif",
              size: 11
            }
          },
          grid: {
            display: false
          },
          border: {
            color: "#d6d6d6"
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Problems solved",
            color: "#555",
            font: {
              family: "Verdana, Arial, sans-serif",
              size: 11,
              weight: "600"
            }
          },
          ticks: {
            precision: 0,
            color: "#555",
            padding: 8,
            font: {
              family: "Verdana, Arial, sans-serif",
              size: 11
            }
          },
          grid: {
            color: "rgba(0, 0, 0, 0.055)",
            drawTicks: false
          },
          border: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "rgba(33, 37, 41, 0.96)",
          borderColor: "rgba(255, 255, 255, 0.18)",
          borderWidth: 1,
          cornerRadius: 5,
          displayColors: false,
          padding: 10,
          titleFont: {
            family: "Verdana, Arial, sans-serif",
            size: 12,
            weight: "700"
          },
          bodyFont: {
            family: "Verdana, Arial, sans-serif",
            size: 12
          },
          callbacks: {
            title: (items) => `Rating ${items[0].label}`,
            label: (item) => `${item.raw} problem${item.raw === 1 ? "" : "s"} solved`
          }
        }
      },
      onHover: (event, elements) => {
        if (event.native?.target) {
          event.native.target.style.cursor = elements.length ? "pointer" : "default";
        }
      }
    }
  });

  logAetherCFChart("Rating chart created", { labels, data });
}

function renderCFTopicChart(topicDist) {
  const MAX_TOPICS = 10;

  if (typeof Chart === "undefined") {
    warnAetherCFChart("Chart.js not available - cannot render topic chart");
    return;
  }

  const canvas = document.getElementById("aetherCFTopicChart");
  if (!canvas) {
    warnAetherCFChart("Canvas #aetherCFTopicChart not found in DOM");
    return;
  }

  const topTopics = topicDist.slice(0, MAX_TOPICS);
  const otherCount = topicDist.slice(MAX_TOPICS).reduce((total, topic) => total + topic.count, 0);
  const displayTopics = otherCount > 0
    ? [...topTopics, { tag: "Other", count: otherCount }]
    : topTopics;

  const labels = displayTopics.map((topic) => topic.tag);
  const data = displayTopics.map((topic) => topic.count);
  const colors = displayTopics.map((_, index) => CF_TOPIC_COLORS[index % CF_TOPIC_COLORS.length]);
  const total = data.reduce((sum, value) => sum + value, 0);

  renderCFTopicLegend(displayTopics, colors, total);

  if (aetherCFCharts.topics) {
    const dataset = aetherCFCharts.topics.data.datasets[0];
    aetherCFCharts.topics.data.labels = labels;
    dataset.data = data;
    dataset.backgroundColor = colors;
    dataset.hoverBackgroundColor = colors;
    aetherCFCharts.topics.update("none");
    logAetherCFChart("Topic chart updated", { labels, data });
    return;
  }

  aetherCFCharts.topics = new Chart(canvas.getContext("2d"), {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Solved",
          data,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 350,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "rgba(33, 37, 41, 0.96)",
          borderColor: "rgba(255, 255, 255, 0.18)",
          borderWidth: 1,
          cornerRadius: 5,
          displayColors: true,
          padding: 10,
          titleFont: {
            family: "Verdana, Arial, sans-serif",
            size: 12,
            weight: "700"
          },
          bodyFont: {
            family: "Verdana, Arial, sans-serif",
            size: 12
          },
          callbacks: {
            label: (item) => {
              const percent = total ? Math.round((item.raw / total) * 100) : 0;
              return `${item.label}: ${item.raw} solved (${percent}%)`;
            }
          }
        }
      }
    }
  });

  logAetherCFChart("Topic chart created", { labels, data });
}

function renderCFTopicLegend(topics, colors, total) {
  const legend = document.getElementById("aetherCFTopicLegend");
  if (!legend) {
    warnAetherCFChart("Topic legend missing");
    return;
  }

  legend.innerHTML = "";

  if (!topics.length) {
    const item = document.createElement("li");
    item.className = "aethercp-topic-empty";
    item.textContent = "No tagged solved problems.";
    legend.appendChild(item);
    return;
  }

  topics.forEach((topic, index) => {
    const percent = total ? Math.round((topic.count / total) * 100) : 0;
    const item = document.createElement("li");
    const swatch = document.createElement("span");
    const label = document.createElement("span");
    const value = document.createElement("strong");

    swatch.className = "aethercp-topic-swatch";
    swatch.style.backgroundColor = colors[index];
    label.className = "aethercp-topic-label";
    label.textContent = topic.tag;
    value.textContent = `${topic.count} (${percent}%)`;

    item.appendChild(swatch);
    item.appendChild(label);
    item.appendChild(value);
    legend.appendChild(item);
  });
}

function renderAetherProfileCharts(analytics) {
  if (typeof Chart === "undefined") {
    warnAetherCFChart("Chart.js is not available");
    return;
  }

  aetherProfileCharts.daily = renderAetherDailyChart({
    existingChart: aetherProfileCharts.daily,
    canvasId: "aetherDailyChart",
    rows: analytics.charts.lastSevenDays
  });
}

function renderAetherDailyChart(config) {
  const canvas = document.getElementById(config.canvasId);

  if (!canvas) {
    warnAetherCFChart("Daily chart canvas missing", config.canvasId);
    return config.existingChart;
  }

  const rows = config.rows || [];
  const labels = rows.map((row) => row.label);
  const data = rows.map((row) => Math.round(row.seconds / 60));

  if (config.existingChart) {
    config.existingChart.data.labels = labels;
    config.existingChart.data.datasets[0].data = data;
    config.existingChart.update("none");
    return config.existingChart;
  }

  return new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Minutes",
          data,
          backgroundColor: "#2f6fbb",
          borderColor: "#1f4f90",
          hoverBackgroundColor: "#255fa6",
          borderWidth: 1,
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 40
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: "#555",
            font: { family: "Verdana, Arial, sans-serif", size: 11 }
          },
          grid: { display: false },
          border: { color: "#d6d6d6" }
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            color: "#555",
            padding: 8,
            font: { family: "Verdana, Arial, sans-serif", size: 11 }
          },
          grid: { color: "rgba(0, 0, 0, 0.055)", drawTicks: false },
          border: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(33, 37, 41, 0.96)",
          displayColors: false,
          cornerRadius: 5,
          padding: 9,
          callbacks: {
            label: (item) => `${item.raw}m`
          }
        }
      }
    }
  });
}

window.renderCFRatingChart = renderCFRatingChart;
window.renderCFTopicChart = renderCFTopicChart;
window.renderAetherProfileCharts = renderAetherProfileCharts;

console.log("[AetherCP LOAD] profileCharts.js loaded");
})();
