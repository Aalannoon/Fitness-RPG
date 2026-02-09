let player = {
  level: 1,
  xp: 0,
  xpNeeded: 100,
  str: 1,
  end: 1,
  weight: null,
  skillPoints: 0,
  skills: {
    strMastery: false,
    endMastery: false
  }
};

let enemy = {
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
  let bonus = player.skills.strMastery ? 2 : 0;
  return player.str + bonus + weightBonus();
}

function totalEND() {
  let bonus = player.skills.endMastery ? 2 : 0;
  return player.end + bonus;
}

function weightBonus() {
  if (!player.weight) return 0;
  if (player.weight <= 250) return 2;
  if (player.weight <= 270) return 1;
  return 0;
}

/* ---------- WEIGHT ---------- */
function logWeight() {
  const value = document.getElementById("weightInput").value;
  if (!value) return;

  player.weight = parseInt(value);
  saveGame();
  updateUI();
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

/* ---------- SKILLS ---------- */
function unlockSTR() {
  if (player.skillPoints <= 0 || player.skills.strMastery) return;
  player.skills.strMastery = true;
  player.skillPoints--;
  saveGame();
  updateUI();
}

function unlockEND() {
  if (player.skillPoints <= 0 || player.skills.endMastery) return;
  player.skills.endMastery = true;
  player.skillPoints--;
  saveGame();
  updateUI();
}

/* ---------- COMBAT ---------- */
function attackEnemy() {
  enemy.hp -= totalSTR();

  if (enemy.hp <= 0) {
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
    player.skillPoints++;
    alert("🎉 LEVEL UP! +1 Skill Point");
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
  document.getElementById("weight").innerText =
    player.weight ? player.weight : "—";
  document.getElementById("skillPoints").innerText = player.skillPoints;
  document.getElementById("enemyHp").innerText = enemy.hp;

  document.getElementById("xpFill").style.width =
    (player.xp / player.xpNeeded) * 100 + "%";

  updateAvatar();
}

/* ---------- INIT ---------- */
loadGame();
updateUI();
