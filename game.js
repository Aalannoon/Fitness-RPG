let player = {
  hp: 100,
  maxHp: 100,
  stamina: 3,
  maxStamina: 3,
  xp: 0,
  xpNeeded: 100,
  block: 0
};

let enemy = {
  name: "Training Dummy",
  hp: 40,
  atk: 8
};

/* CARD DEFINITIONS */
const cards = {
  strike: {
    name: "Bench Press",
    cost: 1,
    type: "attack",
    text: "Deal 6 damage",
    play: () => {
      enemy.hp -= 6;
    }
  },
  heavy: {
    name: "Deadlift",
    cost: 2,
    type: "attack",
    text: "Deal 10 damage",
    play: () => {
      enemy.hp -= 10;
    }
  },
  block: {
    name: "Plank Hold",
    cost: 1,
    type: "block",
    text: "Gain 8 block",
    play: () => {
      player.block += 8;
    }
  },
  breathe: {
    name: "Controlled Breathing",
    cost: 0,
    type: "skill",
    text: "Gain 1 stamina",
    play: () => {
      player.stamina = Math.min(player.stamina + 1, player.maxStamina);
    }
  }
};

/* STARTER DECK */
let deck = ["strike", "strike", "block", "breathe", "heavy"];
let drawPile = [];
let hand = [];
let discard = [];

/* DECK HELPERS */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function drawCards(n) {
  for (let i = 0; i < n; i++) {
    if (drawPile.length === 0) {
      drawPile = shuffle(discard);
      discard = [];
    }
    if (drawPile.length > 0) {
      hand.push(drawPile.pop());
    }
  }
}

/* COMBAT FLOW */
function startCombat() {
  drawPile = shuffle([...deck]);
  hand = [];
  discard = [];
  player.stamina = player.maxStamina;
  drawCards(5);
  updateUI();
}

function playCard(index) {
  const cardKey = hand[index];
  const card = cards[cardKey];

  if (player.stamina < card.cost) return;

  player.stamina -= card.cost;
  card.play();

  discard.push(hand.splice(index, 1)[0]);

  if (enemy.hp <= 0) {
    winCombat();
    return;
  }

  updateUI();
}

function endTurn() {
  enemyAttack();
  player.block = 0;
  player.stamina = player.maxStamina;
  discard.push(...hand);
  hand = [];
  drawCards(5);
  updateUI();
}

function enemyAttack() {
  let dmg = enemy.atk - player.block;
  if (dmg < 0) dmg = 0;
  player.hp -= dmg;

  if (player.hp <= 0) {
    alert("💀 Run failed");
    resetRun();
  }
}

function winCombat() {
  player.xp += 30;
  enemy.hp = 40;
  alert("🏆 Victory! (Run continues)");
  startCombat();
}

function resetRun() {
  player.hp = player.maxHp;
  player.xp = 0;
  startCombat();
}

/* UI */
function updateUI() {
  document.getElementById("playerHp").innerText = player.hp;
  document.getElementById("stamina").innerText = player.stamina;
  document.getElementById("enemyHp").innerText = enemy.hp;

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

/* INIT */
startCombat();
