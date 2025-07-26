let paused = false;
let stop = false;

document.getElementById("configForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  paused = false;
  stop = false;

  const reps = parseInt(document.getElementById("reps").value);
  const goal = parseInt(document.getElementById("goalTime").value);
  const rest = parseInt(document.getElementById("restTime").value);

  const timer = document.getElementById("timer");
  const status = document.getElementById("status");
  const repInfo = document.getElementById("repInfo");
  const progressBar = document.getElementById("progressBar");

  const startTone = document.getElementById("startTone");
  const swimTone = document.getElementById("swimTone");
  const restTone = document.getElementById("restTone");
  const endTone = document.getElementById("endTone");

  try { startTone.currentTime = 0; await startTone.play(); } catch (e) {}

  for (let i = 1; i <= reps; i++) {
    if (stop) break;

    document.body.className = "swim";
    status.textContent = "Status: 🏊 Swim";
    repInfo.textContent = `Rep ${i} of ${reps}`;
    try { swimTone.currentTime = 0; await swimTone.play(); } catch (e) {}

    await countdown(goal, timer);

    if (stop) break;

    document.body.className = "rest";
    status.textContent = "Status: 😌 Rest";
    try { restTone.currentTime = 0; await restTone.play(); } catch (e) {}

    await countdown(rest, timer);

    progressBar.style.width = (i / reps) * 100 + "%";
  }

  document.body.className = "";
  if (!stop) {
    status.textContent = "Status: ✅ Set Complete!";
    repInfo.textContent = "";
    try { endTone.currentTime = 0; await endTone.play(); } catch (e) {}
    timer.textContent = "0";
  }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  paused = !paused;
});

document.getElementById("resetBtn").addEventListener("click", () => {
  stop = true;
  document.getElementById("timer").textContent = "0";
  document.getElementById("status").textContent = "Status: Ready";
  document.getElementById("repInfo").textContent = "";
  document.getElementById("progressBar").style.width = "0%";
  document.body.className = "";
});

function countdown(seconds, display) {
  return new Promise((resolve) => {
    let remaining = seconds;
    display.textContent = remaining;

    const interval = setInterval(() => {
      if (stop) {
        clearInterval(interval);
        resolve();
        return;
      }

      if (!paused) {
        remaining--;
        display.textContent = remaining;
      }

      if (remaining <= 0) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
