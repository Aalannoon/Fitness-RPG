let player = {
  level: 1,
  xp: 0,
  xpNeeded: 100,
  str: 1,
  end: 1,
  gear: {
    shoes: null,
    belt: null
  }
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

/* ---------- TOTAL STATS ---------- */
function totalSTR() {
  return player.str + (player.gear.belt ? 2 : 0);
}

function totalEND() {
  return player.end + (player.gear.shoes ? 2 : 0);
}

/* ---------- WORKOUT ---------- */
function logWorkout(type) {
  if (type === "strength") player.str++;
  if (type === "cardio") player.end++;

  player.xp += 20;
  checkLevelUp();
  saveGame();
  updateUI();
}

/* ---------- GEAR ---------- */
function equipShoes() {
  player.gear.shoes = "Running Shoes";
  saveGame();
  updateUI();
}

function equipBelt() {
  player.gear.belt = "Lifting Belt";
  saveGame();
  updateUI();
}

/* ---------- COMBAT ---------- */
function attackEnemy() {
  enemy.hp -= totalSTR();

  if (enemy.hp <= 0) {
    alert("🧟 Enemy defeated! +30 XP");
    enemy.hp = enemy.maxHp;
    player.xp += 30;
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

/* ---------- AVATAR ---------- */
function updateAvatar() {
  const avatar = document.getElementById("avatar");

  if (player.level < 5) avatar.innerText = "🧍";
  else if (player.level < 10) avatar.innerText = "🏃";
  else if (player.level < 15) avatar.innerText = "💪";
  else avatar.innerText = "🦸";
}

/* ---------- UI ---------- */
function updateUI() {
  document.getElementById("level").innerText = player.level;
  document.getElementById("xp").innerText = player.xp;
  document.getElementById("xpNeeded").innerText = player.xpNeeded;
  document.getElementById("str").innerText = totalSTR();
  document.getElementById("end").innerText = totalEND();

  document.getElementById("shoes").innerText =
    player.gear.shoes ? player.gear.shoes : "None";
  document.getElementById("belt").innerText =
    player.gear.belt ? player.gear.belt : "None";

  document.getElementById("enemyHp").innerText = enemy.hp;

  document.getElementById("xpFill").style.width =
    (player.xp / player.xpNeeded) * 100 + "%";

  updateAvatar();
}

/* ---------- INIT ---------- */
loadGame();
updateUI();
