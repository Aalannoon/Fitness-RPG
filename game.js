let player = {
  level: 1,
  xp: 0,
  xpNeeded: 100,
  str: 1,
  end: 1,
  lastWorkout: null
};

let enemy = {
  name: "Sloth",
  maxHp: 30,
  hp: 30
};

/* ---------- SAVE / LOAD ---------- */
function saveGame() {
  localStorage.setItem("fitnessRPG", JSON.stringify({ player, enemy }));
}

function loadGame() {
  const data = localStorage.getItem("fitnessRPG");
  if (data) {
    const parsed = JSON.parse(data);
    player = parsed.player;
    enemy = parsed.enemy;
  }
}

/* ---------- DAILY LIMIT ---------- */
function canWorkoutToday() {
  const today = new Date().toDateString();
  return player.lastWorkout !== today;
}

/* ---------- WORKOUT ---------- */
function logWorkout(type) {
  if (!canWorkoutToday()) {
    alert("❌ Workout already logged today.");
    return;
  }

  if (type === "strength") player.str += 1;
  if (type === "cardio") player.end += 1;

  player.xp += 20;
  player.lastWorkout = new Date().toDateString();

  checkLevelUp();
  saveGame();
  updateUI();
}

/* ---------- COMBAT ---------- */
function attackEnemy() {
  enemy.hp -= player.str;

  if (enemy.hp <= 0) {
    alert("🧟 Enemy defeated! +30 XP");
    player.xp += 30;
    enemy.hp = enemy.maxHp;
    checkLevelUp();
  }

  saveGame();
  updateUI();
}

/* ---------- LEVEL UP ---------- */
function checkLevelUp() {
  if (player.xp >= player.xpNeeded) {
    player.level++;
    player.xp = 0;
    player.xpNeeded += 50;
    alert("🎉 LEVEL UP!");
  }
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

  document.getElementById("enemyName").innerText = enemy.name;
  document.getElementById("enemyHp").innerText = enemy.hp;

  const xpPercent = (player.xp / player.xpNeeded) * 100;
  document.getElementById("xpFill").style.width = xpPercent + "%";
}

/* ---------- INIT ---------- */
loadGame();
updateUI();
