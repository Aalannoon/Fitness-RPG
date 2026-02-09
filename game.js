let player = {
  build: "balanced",
  level: 1,
  xp: 0,
  xpNeeded: 100,
  str: 4,
  end: 4,
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
  atk: 8
};

/* BUILDS */
function setBuild(type) {
  player.build = type;

  if (type === "strength") {
    player.str = 7;
    player.end = 2;
    player.maxStamina = 80;
  }

  if (type === "endurance") {
    player.str = 3;
    player.end = 7;
    player.maxStamina = 130;
  }

  if (type === "balanced") {
    player.str = 4;
    player.end = 4;
    player.maxStamina = 100;
  }

  player.stamina = player.maxStamina;
  updateUI();
  saveGame();
}

/* SAVE */
function saveGame() {
  localStorage.setItem("fitnessRPG", JSON.stringify({ player }));
}

function loadGame() {
  const data = localStorage.getItem("fitnessRPG");
  if (data) player = JSON.parse(data).player;
}

/* COMBAT */
function playerAction(type) {
  if (player.hp <= 0 || enemy.hp <= 0) return;

  let damage = 0;

  if (type === "attack") {
    damage = player.str;
    player.stamina -= 10;
    player.xp += 3;
  }

  if (type === "defend") {
    player.stamina += 20 + player.end * 2;
    if (player.stamina > player.maxStamina)
      player.stamina = player.maxStamina;
    enemyAttack(true);
    updateUI();
    return;
  }

  if (type === "power") {
    if (player.stamina < 30) return alert("Not enough stamina!");
    damage = player.str * 3;
    player.stamina -= 30;
    player.xp += 10;
  }

  enemy.hp -= damage;
  showHit(damage);
  enemyAttack(false);
  checkOutcome();
  checkLevelUp();
  saveGame();
  updateUI();
}

/* ENEMY */
function enemyAttack(defended) {
  let dmg = enemy.atk;
  if (defended) dmg = Math.floor(dmg / 2);
  player.hp -= dmg;
}

/* FEEDBACK */
function showHit(dmg) {
  const panel = document.getElementById("enemyPanel");
  const text = document.getElementById("damageText");
  text.innerText = `-${dmg}`;
  panel.classList.add("hit");

  setTimeout(() => {
    panel.classList.remove("hit");
    text.innerText = "";
  }, 300);
}

/* OUTCOME */
function checkOutcome() {
  if (enemy.hp <= 0) {
    player.xp += 25;
    enemy.hp = enemy.maxHp;
  }

  if (player.hp <= 0) {
    player.hp = player.maxHp;
    player.stamina = player.maxStamina;
  }
}

/* LEVEL */
function checkLevelUp() {
  if (player.xp >= player.xpNeeded) {
    player.level++;
    player.xp = 0;
    player.xpNeeded += 50;
    player.maxHp += 10;
    player.hp = player.maxHp;
  }
}

/* UI */
function updateUI() {
  document.getElementById("level").innerText = player.level;
  document.getElementById("playerHp").innerText = player.hp;
  document.getElementById("stamina").innerText = player.stamina;
  document.getElementById("str").innerText = player.str;
  document.getElementById("end").innerText = player.end;
  document.getElementById("enemyHp").innerText = enemy.hp;
  document.getElementById("buildName").innerText = player.build;

  document.getElementById("xpFill").style.width =
    (player.xp / player.xpNeeded) * 100 + "%";

  document.getElementById("avatar").innerText =
    player.build === "strength" ? "💪" :
    player.build === "endurance" ? "🏃" : "🧍";
}

/* INIT */
loadGame();
updateUI();
