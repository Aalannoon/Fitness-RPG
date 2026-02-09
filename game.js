let player = {
  level: 1,
  xp: 0,
  xpNeeded: 100,
  str: 1,
  end: 1,
  hp: 100,
  maxHp: 100,
  streak: 0,
  lastActive: null
};

let zones = {
  gym: { name: "Gym Sloth", emoji: "🦥", hp: 30, atk: 4 },
  park: { name: "Lazy Jogger", emoji: "🏃‍♂️", hp: 45, atk: 6 },
  mountain: { name: "Mountain Beast", emoji: "🐻", hp: 70, atk: 8 }
};

let enemy = {
  name: "",
  emoji: "",
  hp: 0,
  atk: 0
};

/* SAVE / LOAD */
function saveGame() {
  localStorage.setItem("fitnessRPG", JSON.stringify({ player }));
}

function loadGame() {
  const data = localStorage.getItem("fitnessRPG");
  if (data) player = JSON.parse(data).player;
}

/* ZONES */
function enterZone(zoneKey) {
  const z = zones[zoneKey];
  enemy.name = z.name;
  enemy.emoji = z.emoji;
  enemy.hp = z.hp;
  enemy.atk = z.atk;
  updateUI();
}

/* COMBAT */
function attackEnemy() {
  if (!enemy.hp || player.hp <= 0) return;

  // Player attack
  enemy.hp -= player.str;
  player.xp += 5; // XP per hit

  // Enemy attack (if still alive)
  if (enemy.hp > 0) {
    player.hp -= enemy.atk;
  } else {
    player.xp += 25; // kill bonus
  }

  if (player.hp <= 0) {
    alert("💀 You were defeated. Rest and try again.");
    player.hp = player.maxHp;
    enemy.hp = 0;
  }

  checkLevelUp();
  saveGame();
  updateUI();
}

/* LEVEL UP */
function checkLevelUp() {
  if (player.xp >= player.xpNeeded) {
    player.level++;
    player.xp = 0;
    player.xpNeeded += 50;
    player.maxHp += 10;
    player.hp = player.maxHp;
    alert("🎉 Level Up!");
  }
}

/* AVATAR */
function updateAvatar() {
  document.getElementById("avatar").innerText =
    player.level < 5 ? "🧍" :
    player.level < 10 ? "🏃" :
    player.level < 15 ? "💪" : "🦸";
}

/* UI */
function updateUI() {
  document.getElementById("level").innerText = player.level;
  document.getElementById("str").innerText = player.str;
  document.getElementById("end").innerText = player.end;
  document.getElementById("playerHp").innerText = player.hp;

  document.getElementById("enemyName").innerText = enemy.name || "—";
  document.getElementById("enemyHp").innerText = enemy.hp || 0;
  document.getElementById("enemyAvatar").innerText = enemy.emoji || "❓";

  document.getElementById("xpFill").style.width =
    (player.xp / player.xpNeeded) * 100 + "%";

  updateAvatar();
}

/* INIT */
loadGame();
updateUI();
