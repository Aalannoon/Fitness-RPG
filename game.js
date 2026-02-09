let player = {
  level: 1,
  xp: 0,
  xpNeeded: 100,
  str: 1,
  end: 1,
  streak: 0,
  lastActive: null
};

let zones = {
  gym: { name: "Gym Bro", hp: 25 },
  park: { name: "Lazy Jogger", hp: 35 },
  mountain: { name: "Mountain Beast", hp: 50 }
};

let enemy = { name: "", hp: 0 };

let quest = {
  text: "Do any workout today",
  completed: false
};

/* SAVE / LOAD */
function saveGame() {
  localStorage.setItem("fitnessRPG", JSON.stringify({ player, quest }));
}

function loadGame() {
  const data = localStorage.getItem("fitnessRPG");
  if (data) {
    const d = JSON.parse(data);
    player = d.player;
    quest = d.quest;
  }
}

/* DAILY STREAK */
function checkStreak() {
  const today = new Date().toDateString();
  if (player.lastActive === today) return;

  if (player.lastActive) {
    const diff =
      (new Date(today) - new Date(player.lastActive)) / 86400000;
    player.streak = diff === 1 ? player.streak + 1 : 1;
  } else {
    player.streak = 1;
  }

  player.lastActive = today;
  quest.completed = false;
}

/* QUEST */
function completeQuest() {
  if (quest.completed) return;
  player.xp += 40;
  quest.completed = true;
  checkLevelUp();
  saveGame();
  updateUI();
}

/* ZONES */
function enterZone(zoneKey) {
  enemy.name = zones[zoneKey].name;
  enemy.hp = zones[zoneKey].hp;
  updateUI();
}

/* COMBAT */
function attackEnemy() {
  if (!enemy.hp) return;
  enemy.hp -= player.str;

  if (enemy.hp <= 0) {
    player.xp += 30;
    enemy.hp = 0;
    checkLevelUp();
  }
  saveGame();
  updateUI();
}

/* LEVEL */
function checkLevelUp() {
  if (player.xp >= player.xpNeeded) {
    player.level++;
    player.xp = 0;
    player.xpNeeded += 50;
  }
}

/* AVATAR */
function updateAvatar() {
  const a = document.getElementById("avatar");
  a.innerText =
    player.level < 5 ? "🧍" :
    player.level < 10 ? "🏃" :
    player.level < 15 ? "💪" : "🦸";
}

/* UI */
function updateUI() {
  document.getElementById("level").innerText = player.level;
  document.getElementById("str").innerText = player.str;
  document.getElementById("end").innerText = player.end;
  document.getElementById("streak").innerText = player.streak;
  document.getElementById("enemyName").innerText = enemy.name;
  document.getElementById("enemyHp").innerText = enemy.hp;
  document.getElementById("questText").innerText =
    quest.completed ? "Quest Complete ✅" : quest.text;

  document.getElementById("xpFill").style.width =
    (player.xp / player.xpNeeded) * 100 + "%";

  updateAvatar();
}

/* INIT */
loadGame();
checkStreak();
updateUI();
