/* ================= PLAYER ================= */
let player = {
  hp: 100,
  maxHp: 100,
  stamina: 3,
  maxStamina: 3,
  block: 0,
  xp: 0,
  xpNeeded: 100
};

/* ================= ENEMY ================= */
let enemy = {
  name: "Training Dummy",
  hp: 40,
  intents: [
    { type: "attack", value: 8 },
    { type: "block", value: 6 }
  ]
};

let enemyIntent = {};

/* ================= CARDS ================= */
const cards = {
  strike: {
    name: "Bench Press",
    cost: 1,
    type: "attack",
    text: "Deal 6 damage",
    play: () => enemy.hp -= 6
  },
  heavy: {
    name: "Deadlift",
    cost: 2,
    type: "attack",
    text: "Deal 10 damage",
    play: () => enemy.hp -= 10
  },
  block: {
    name: "Plank Hold",
    cost: 1,
    type: "block",
    text: "Gain 8 block",
    play: () => player.block += 8
  },
  breathe: {
    name: "Controlled Breathing",
    cost: 0,
    type: "skill",
    text: "Gain 1 stamina",
    play: () =>
      player.stamina = Math.min(player.stamina + 1, player.maxStamina)
  },

  /* REWARD CARDS */
  pushup: {
    name: "Push-Up Burn",
    cost: 1,
    type: "attack",
    text: "Deal 8 damage",
    play: () => enemy.hp -= 8
  },
  brace: {
    name: "Core Brace",
    cost: 1,
    type: "block",
    text: "Gain 12 block",
    play: () => player.block += 12
  },
  focus: {
    name: "Mind-Muscle",
    cost: 1,
    type: "skill",
    text: "Gain 2 stamina",
    play: () =>
      player.stamina = Math.min(player.stamina + 2, player.maxStamina)
  }
};

/* ================= DECK ================= */
let deck = ["strike", "strike", "block", "breathe", "heavy"];
let rewardPool = ["pushup", "brace", "focus"];

let drawPile = [];
let hand = [];
let discard = [];

/* ================= HELPERS ================= */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function drawCards(n) {
  for (let i = 0; i < n; i++) {
    if (drawPile.length === 0) {
      drawPile = shuffle(discard);
      discard = [];
    }
    if (drawPile.length) hand.push(drawPile.pop());
  }
}

function rollEnemyIntent() {
  enemyIntent = enemy.intents[Math.floor(Math.random() * enemy.intents.length)];
}

/* ================= COMBAT ================= */
function startCombat() {
  enemy.hp = 40;
  player.block = 0;
  player.stamina = player.maxStamina;

  drawPile = shuffle([...deck]);
  hand = [];
  discard = [];

  rollEnemyIntent();
  drawCards(5);
  updateUI();
}

function playCard(index) {
  const key = hand[index];
  const card = cards[key];

  if (player.stamina < card.cost) return;

  player.stamina -= card.cost;
  card.play();

  discard.push(hand.splice(index, 1)[0]);

  if (enemy.hp <= 0) {
    showReward();
    return;
  }

  updateUI();
}

function endTurn() {
  enemyTurn();
  player.block = 0;
  player.stamina = player.maxStamina;

  discard.push(...hand);
  hand = [];
  drawCards(5);
  updateUI();
}

function enemyTurn() {
  if (enemyIntent.type === "attack") {
    let dmg = enemyIntent.value - player.block;
    if (dmg < 0) dmg = 0;
    player.hp -= dmg;
  }

  if (enemyIntent.type === "block") {
    enemy.hp += enemyIntent.value;
  }

  if (player.hp <= 0) {
    alert("💀 Run failed");
    resetRun();
    return;
  }

  rollEnemyIntent();
}

/* ================= REWARD ================= */
function showReward() {
  const handDiv = document.getElementById("hand");
  handDiv.innerHTML = "<h3>Choose a Card</h3>";

  shuffle([...rewardPool]).slice(0, 3).forEach(key => {
    const c = cards[key];
    const card = document.createElement("div");
    card.className = `card ${c.type}`;
    card.innerHTML = `
      <div class="card-title">${c.name}</div>
      <div class="card-cost">Cost: ${c.cost}</div>
      <div class="card-text">${c.text}</div>
    `;
    card.onclick = () => {
      deck.push(key);
      startCombat();
    };
    handDiv.appendChild(card);
  });
}

function resetRun() {
  player.hp = player.maxHp;
  player.xp = 0;
  deck = ["strike", "strike", "block", "breathe", "heavy"];
  startCombat();
}

/* ================= UI ================= */
function updateUI() {
  document.getElementById("playerHp").innerText = player.hp;
  document.getElementById("stamina").innerText = player.stamina;
  document.getElementById("enemyHp").innerText = enemy.hp;
  document.getElementById("enemyName").innerText = enemy.name;
  document.getElementById("enemyIntent").innerText =
    `Intent: ${enemyIntent.type.toUpperCase()} ${enemyIntent.value}`;

  document.getElementById("xpFill").style.width =
    (player.xp / player.xpNeeded) * 100 + "%";

  const handDiv = document.getElementById("hand");
  handDiv.innerHTML = "";

  hand.forEach((key, i) => {
    const c = cards[key];
    const card = document.createElement("div");
    card.className = `card ${c.type}`;
    card.innerHTML = `
      <div class="card-title">${c.name}</div>
      <div class="card-cost">Cost: ${c.cost}</div>
      <div class="card-text">${c.text}</div>
    `;
    card.onclick = () => playCard(i);
    handDiv.appendChild(card);
  });
}

/* ================= START ================= */
startCombat();
