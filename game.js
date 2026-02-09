let player = {
  level: 1,
  xp: 0,
  xpNeeded: 100,
  str: 3,
  end: 2,
  hp: 100,
  maxHp: 100,
  stamina: 100,
  maxStamina: 100
};

let enemy = {
  name: "Training Dummy",
  emoji: "🥊",
  hp: 80,
  maxHp: 80,
  atk: 8,
  behavior: "aggressive" // aggressive | cautious
};

/* -------- SAVE / LOAD -------- */
function saveGame() {
  localStorage.setItem("fitnessRPG", JSON.stringify({ player }));
}

function loadGame() {
  const data = localStorage.getItem("fitnessRPG");
  if (data) player = JSON.parse(data).player;
}

/* -------- COMBAT CORE -------- */
function playerAction(type) {
  if (player.hp <= 0 || enemy.hp <= 0) return;

  let log = "";

  if (type === "attack") {
    enemy.hp -= player.str;
    player.stamina -= 10;
    player.xp += 3;
    log = "You strike the enemy.";
  }

  if (type === "defend") {
    player.stamina += 20;
    if (player.stamina > player.maxStamina)
      player.stamina = player.maxStamina;
    log = "You brace and recover stamina.";
  }

  if (type === "power") {
    if (player.stamina < 30) {
      alert("Not enough stamina!");
      return;
    }
    enemy.hp -= player.str * 3;
    player.stamina -= 30;
    player.xp += 8;
    log = "🔥 Massive hit!";
  }

  enemyTurn(type);
  checkOutcome();
  checkLevelUp();
  saveGame();
  updateUI();
}

/* -------- ENEMY AI -------- */
function enemyTurn(playerMove) {
  if (enemy.hp <= 0) return;

  let damage = enemy.atk;

  if (playerMove === "defend") {
    damage = Math.floor(damage / 2);
  }

  // Enemy adapts
  if (enemy.behavior === "aggressive" && player.stamina < 20) {
    damage += 4;
  }

  player.hp -= damage;
}

/* -------- OUTCOMES -------- */
function checkOutcome() {
  if (enemy.hp <= 0) {
    player.xp += 25;
    alert("🏆 Enemy defeated!");
    resetEnemy();
  }

  if (player.hp <= 0) {
    alert("💀 You were defeated. Recover and try again.");
    player.hp = player.maxHp;
    player.stamina = player.maxStamina;
  }
}

/* -------- LEVELING -------- */
function checkLevelUp() {
  if (player.xp >= player.xpNeeded) {
    player.level++;
    player.xp = 0;
    player.xpNeeded += 50;
    player.maxHp += 10;
    player.maxStamina += 10;
    player.hp = player.maxHp;
    player.stamina = player.maxStamina;
    alert("🎉 Level Up!");
  }
}

/* -------- ENEMY RESET -------- */
function resetEnemy() {
  enemy.hp = enemy.maxHp;
}

/* -------- UI -------- */
function updateUI() {
  document.getElementById("level").innerText = player.level;
  document.getElementById("playerHp").innerText = player.hp;
  document.getElementById("stamina").innerText = player.stamina;
  document.getElementById("str").innerText = player.str;
  document.getElementById("end").innerText = player.end;

  document.getElementById("enemyName").innerText = enemy.name;
  document.getElementById("enemyHp").innerText = enemy.hp;
  document.getElementById("enemyAvatar").innerText = enemy.emoji;

  document.getElementById("xpFill").style.width =
    (player.xp / player.xpNeeded) * 100 + "%";

  document.getElementById("avatar").innerText =
    player.level < 5 ? "🧍" :
    player.level < 10 ? "🏃" :
    player.level < 15 ? "💪" : "🦸";
}

/* -------- INIT -------- */
loadGame();
updateUI();
