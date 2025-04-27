const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let dino = { x: 50, y: 250, width: 40, height: 40, vy: 0, jumping: false };
let obstacles = [];
let gravity = 1;
let score = 0;
let gameOver = false;
let obstacleSpeed = 5;

const dinoModal = document.getElementById("dinoModal");
const closeDino = document.getElementById("closeDino");
const startGameBtn = document.getElementById("startGameBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");

// Отрисовка динозаврика
const drawDino = () => {
  ctx.fillStyle = "lime";
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
};

// Отрисовка препятствий
const drawObstacles = () => {
  ctx.fillStyle = "tomato";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
};

// Основной игровой цикл
const update = () => {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDino();
  drawObstacles();

  dino.y += dino.vy;
  dino.vy += gravity;

  if (dino.y >= 250) {
    dino.y = 250;
    dino.vy = 0;
    dino.jumping = false;
  }
  
  obstacleSpeed = 5 + Math.floor(score / 1000); // каждые 1000 очков скорость увеличивается

  obstacles.forEach(obs => {
    obs.x -= obstacleSpeed;
  });

  const minDistance = 300;
  const lastObstacle = obstacles[obstacles.length - 1];
  const canSpawnObstacle = !lastObstacle || (800 - lastObstacle.x) >= minDistance;

  if (Math.random() < 0.02 && canSpawnObstacle) {
    obstacles.push({ x: 800, y: 270, width: 20, height: 30 });
  }

  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  for (const obs of obstacles) {
    if (
      dino.x < obs.x + obs.width &&
      dino.x + dino.width > obs.x &&
      dino.y < obs.y + obs.height &&
      dino.y + dino.height > obs.y
    ) {
      if (!gameOver) {
        gameOver = true;
        alert(`Игра окончена! Ваш счёт: ${score}`);
        document.location.reload();
      }
    }
  }

  score += 1;
  ctx.fillStyle = "#FF5733";
  ctx.font = "20px Arial";
  ctx.fillText(`Счёт: ${score}`, 700, 20);

  requestAnimationFrame(update);
};

// Прыжок на пробел
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !dino.jumping && !gameOver) {
    dino.vy = -15;
    dino.jumping = true;
  }
});
// Прыжок на клик мыши
canvas.addEventListener("click", () => {
  if (!dino.jumping && !gameOver) {
    dino.vy = -15;
    dino.jumping = true;
  }
});

const startGame = () => {
  gameOver = false;
  score = 0;
  obstacles = [];
  dino = { ...dino, y: 250, vy: 0, jumping: false };
  dinoModal.style.display = "none";
  update();
};

// Закрыть игру
closeDino.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// Начать игру
startGameBtn.addEventListener("click", () => {
  startGame();
});

// Переключение темы
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  canvas.classList.toggle("light-theme");
  dinoModal.classList.toggle("light-theme");
});
