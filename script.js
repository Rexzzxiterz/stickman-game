
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let lives = 3;
let level = 1;
let highScore = localStorage.getItem("highScore") || 0;

// Load sprite image
const stickmanImg = new Image();
stickmanImg.src = "stickman-sprite.png";
let spriteFrame = 0;

const stickman = {
  x: 100,
  y: canvas.height - 150,
  width: 48,
  height: 48,
  velocityY: 0,
  jumping: false
};

const enemy = {
  x: canvas.width,
  y: canvas.height - 150,
  width: 30,
  height: 50,
  speed: 6
};

function drawStickman() {
  ctx.drawImage(stickmanImg, spriteFrame * 48, 0, 48, 48, stickman.x, stickman.y, stickman.width, stickman.height);
}

function drawEnemy() {
  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawUI() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("Lives: " + lives, 20, 60);
  ctx.fillText("Level: " + level, 20, 90);
  ctx.fillText("High Score: " + highScore, 20, 120);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resetEnemy() {
  enemy.x = canvas.width + Math.random() * 300;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gravity
  if (stickman.jumping) {
    stickman.velocityY += 1.5;
    stickman.y += stickman.velocityY;

    if (stickman.y >= canvas.height - 150) {
      stickman.y = canvas.height - 150;
      stickman.jumping = false;
      stickman.velocityY = 0;
    }
  }

  // Sprite animation
  spriteFrame = (spriteFrame + 1) % 4;

  // Enemy move
  enemy.x -= enemy.speed;
  if (enemy.x + enemy.width < 0) {
    score += 1;
    resetEnemy();

    if (score % 5 === 0) {
      level += 1;
      enemy.speed += 1;
    }

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
  }

  // Collision
  if (detectCollision(stickman, enemy)) {
    document.getElementById("hitSound").play();
    lives -= 1;
    resetEnemy();
    if (lives <= 0) {
      alert("Game Over! Score: " + score + " | High Score: " + highScore);
      document.location.reload();
    }
  }

  drawStickman();
  drawEnemy();
  drawUI();

  requestAnimationFrame(update);
}

document.getElementById("jumpBtn").addEventListener("click", function () {
  if (!stickman.jumping) {
    stickman.jumping = true;
    stickman.velocityY = -20;
    document.getElementById("jumpSound").play();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && !stickman.jumping) {
    stickman.jumping = true;
    stickman.velocityY = -20;
    document.getElementById("jumpSound").play();
  }
});

update();


// Power-up dan musuh tambahan
let powerUp = {
  x: canvas.width + 400,
  y: canvas.height - 180,
  width: 30,
  height: 30,
  active: true
};

let enemy2 = {
  x: canvas.width + 600,
  y: canvas.height - 150,
  width: 30,
  height: 50,
  speed: 5
};

function drawPowerUp() {
  if (powerUp.active) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(powerUp.x, powerUp.y, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEnemy2() {
  ctx.fillStyle = "purple";
  ctx.fillRect(enemy2.x, enemy2.y, enemy2.width, enemy2.height);
}

function resetPowerUp() {
  powerUp.x = canvas.width + Math.random() * 800;
  powerUp.active = true;
}

function updateEnhanced() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (stickman.jumping) {
    stickman.velocityY += 1.5;
    stickman.y += stickman.velocityY;
    if (stickman.y >= canvas.height - 150) {
      stickman.y = canvas.height - 150;
      stickman.jumping = false;
      stickman.velocityY = 0;
    }
  }

  spriteFrame = (spriteFrame + 1) % 4;

  enemy.x -= enemy.speed;
  enemy2.x -= enemy2.speed;
  powerUp.x -= 4;

  if (enemy.x + enemy.width < 0) {
    score += 1;
    resetEnemy();
    if (score % 5 === 0) {
      level += 1;
      enemy.speed += 1;
      enemy2.speed += 0.5;
    }
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
  }

  if (enemy2.x + enemy2.width < 0) {
    resetEnemy();
    enemy2.x = canvas.width + Math.random() * 500;
  }

  if (powerUp.x + powerUp.width < 0) {
    resetPowerUp();
  }

  if (powerUp.active && detectCollision(stickman, powerUp)) {
    lives += 1;
    powerUp.active = false;
  }

  if (detectCollision(stickman, enemy) || detectCollision(stickman, enemy2)) {
    document.getElementById("hitSound").play();
    lives -= 1;
    resetEnemy();
    enemy2.x = canvas.width + Math.random() * 500;
    if (lives <= 0) {
      alert("Game Over! Score: " + score + " | High Score: " + highScore);
      document.location.reload();
    }
  }

  drawStickman();
  drawEnemy();
  drawEnemy2();
  drawPowerUp();
  drawUI();

  requestAnimationFrame(updateEnhanced);
}

document.getElementById("bgm").volume = 0.2;
document.getElementById("bgm").play();

updateEnhanced();


let gamePaused = false;
let gameStarted = false;

const menu = document.createElement("div");
menu.id = "mainMenu";
menu.innerHTML = `
  <div id="menuContainer">
    <h1>Stickman Runner</h1>
    <button onclick="startGame()">Mulai Game</button>
  </div>
`;
document.body.appendChild(menu);

const gameOverScreen = document.createElement("div");
gameOverScreen.id = "gameOver";
gameOverScreen.style.display = "none";
gameOverScreen.innerHTML = `
  <div id="overContainer">
    <h2>Game Over</h2>
    <p id="finalScore"></p>
    <button onclick="restartGame()">Main Lagi</button>
  </div>
`;
document.body.appendChild(gameOverScreen);

function startGame() {
  gameStarted = true;
  menu.style.display = "none";
  requestAnimationFrame(updateEnhanced);
}

function showGameOver() {
  gameOverScreen.style.display = "flex";
  document.getElementById("finalScore").innerText =
    "Skor Akhir: " + score + " | High Score: " + highScore;
}

function restartGame() {
  score = 0;
  lives = 3;
  level = 1;
  enemy.speed = 6;
  enemy2.speed = 5;
  resetEnemy();
  resetPowerUp();
  gameOverScreen.style.display = "none";
  requestAnimationFrame(updateEnhanced);
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Escape") {
    gamePaused = !gamePaused;
    if (!gamePaused && gameStarted) requestAnimationFrame(updateEnhanced);
  }
});

function updateEnhanced() {
  if (!gameStarted || gamePaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (stickman.jumping) {
    stickman.velocityY += 1.5;
    stickman.y += stickman.velocityY;
    if (stickman.y >= canvas.height - 150) {
      stickman.y = canvas.height - 150;
      stickman.jumping = false;
      stickman.velocityY = 0;
    }
  }

  spriteFrame = (spriteFrame + 1) % 4;

  enemy.x -= enemy.speed;
  enemy2.x -= enemy2.speed;
  powerUp.x -= 4;

  if (enemy.x + enemy.width < 0) {
    score += 1;
    resetEnemy();
    if (score % 5 === 0) {
      level += 1;
      enemy.speed += 1;
      enemy2.speed += 0.5;
    }
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
  }

  if (enemy2.x + enemy2.width < 0) {
    enemy2.x = canvas.width + Math.random() * 500;
  }

  if (powerUp.x + powerUp.width < 0) {
    resetPowerUp();
  }

  if (powerUp.active && detectCollision(stickman, powerUp)) {
    lives += 1;
    powerUp.active = false;
  }

  if (detectCollision(stickman, enemy) || detectCollision(stickman, enemy2)) {
    document.getElementById("hitSound").play();
    lives -= 1;
    resetEnemy();
    enemy2.x = canvas.width + Math.random() * 500;
    if (lives <= 0) {
      gameStarted = false;
      showGameOver();
      return;
    }
  }

  drawStickman();
  drawEnemy();
  drawEnemy2();
  drawPowerUp();
  drawUI();

  requestAnimationFrame(updateEnhanced);
}
