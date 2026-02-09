let player = {
  level: 1,
  xp: 0,
  xpNeeded: 100,
  str: 1,
  end: 1
};

function logWorkout(type) {
  let gain = 20;

  if (type === "strength") {
    player.str += 1;
  } else {
    player.end += 1;
  }

  player.xp += gain;

  if (player.xp >= player.xpNeeded) {
    player.level++;
    player.xp = 0;
    player.xpNeeded += 50;
    alert("LEVEL UP!");
  }

  updateUI();
}

function updateUI() {
  document.getElementById("level").innerText = player.level;
  document.getElementById("xp").innerText = player.xp;
  document.getElementById("xpNeeded").innerText = player.xpNeeded;
  document.getElementById("str").innerText = player.str;
  document.getElementById("end").innerText = player.end;
}

updateUI();
