let player = {
  level: 1,
  xp: 0,
  xpNeeded: 100,
  str: 1,
  end: 1,
  lastWorkout: null
};

/* ---------- SAVE / LOAD ---------- */
function saveGame() {
  localStorage.setItem("fitnessRPG", JSON.stringify(player));
}

function loadGame() {
  const data = localStorage.getItem("fitnessRPG");
  if (data) {
    player = JSON.parse(data);
  }
}

/* ---------- DAILY LIMIT ---------- */
function canWorkoutToday() {
  const today = new Date().toDateString();
  return player.lastWorkout !== today;
}

/* ---------- GAME LOGIC ---------- */
function logWorkout(type) {
  if (!canWorkoutToday()) {
    alert("❌ Workout already logged today. Come back tomorrow!");
    return;
  }

  const xpGain = 20;

  if (type === "strength") {
    player.str += 1;
  } else if (type === "cardio") {
    player.end += 1;
  }

  player.xp += xpGain;
  player.lastWorkout = new Date().toDateString();

  if (player.xp >= player.xpNeeded) {
    player.level += 1;
    player.xp = 0;
    player.xpNeeded += 50;
    alert("🎉 LEVEL UP!");
  }

  saveGame();
  updateUI();
}

/* ---------- UI ---------- */
function updateUI() {
  document.getElementById("level").innerText = player.level;
  document.getElementById("xp").innerText = player.xp;
  document.getElementById("xpNeeded").innerText = player.xpNeeded;
  document.getElementById("str").innerText = player.str;
  document.getElementById("end").innerText = player.end;
  document.getElementById("lastWorkout").innerText =
    player.lastWorkout ? player.lastWorkout : "None";
}

/* ---------- INIT ---------- */
loadGame();
updateUI();
