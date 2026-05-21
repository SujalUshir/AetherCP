function createAetherProfileRoot(analytics) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = getAetherGraphTemplate().trim();

  const root = wrapper.firstElementChild;

  renderAetherOverview(root, analytics);
  renderAetherHistory(root, analytics.allRecentProblems);

  return root;
}

function updateAetherProfileRoot(root, analytics) {
  root.querySelector("[data-aether-status]").textContent = analytics.status;
  renderAetherOverview(root, analytics);
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
    ["Most worked problem", formatAetherProblemName(analytics.mostWorkedProblem)],
    ["Most used platform", analytics.mostUsedPlatform?.label || "None"]
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

  if (!problems.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "aethercp-empty";
    cell.textContent = "No tracked problem history yet.";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  problems.forEach((problem) => {
    const row = document.createElement("tr");

    appendAetherCell(row, problem.problemName);
    appendAetherCell(row, problem.platform);
    appendAetherCell(row, formatDurationShort(problem.totalSeconds));
    appendAetherCell(row, formatAetherDate(problem.lastSeenAt));
    appendAetherCell(row, String(problem.sessionCount));

    tbody.appendChild(row);
  });
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
    hour: "2-digit",
    minute: "2-digit"
  });
}
