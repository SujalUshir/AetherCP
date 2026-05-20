const problemDiv = document.getElementById("problemName");
const timerDiv = document.getElementById("timer");
const todayTimeDiv = document.getElementById("todayTime");

function formatTime(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function setEmptyState() {
  problemDiv.innerText = "No active problem";
  timerDiv.innerText = "00:00:00";
  todayTimeDiv.innerText = "Today's Time: 00:00:00";
}

function renderSnapshot(snapshot) {
  if (!snapshot || !snapshot.tracking || !snapshot.activeProblem) {
    setEmptyState();
    return;
  }

  const problem = snapshot.activeProblem;

  problemDiv.innerText = `${problem.platform}: ${problem.problemName}`;
  timerDiv.innerText = formatTime(snapshot.currentProblemSeconds);
  todayTimeDiv.innerText = `Today's Time: ${formatTime(snapshot.todaySeconds)}`;
}

function updatePopup() {
  chrome.runtime.sendMessage(
    {
      type: "GET_TIMER_SNAPSHOT"
    },
    (snapshot) => {
      if (chrome.runtime.lastError) {
        setEmptyState();
        return;
      }

      renderSnapshot(snapshot);
    }
  );
}

updatePopup();
setInterval(updatePopup, 1000);
