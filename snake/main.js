var blocksize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

var snakeX = blocksize * 5;
var snakeY = blocksize * 5;

var snakeBody = [];

var velocityX = 0;
var velocityY = 0;

var appleX;
var appleY;

var gameover = false;
var gameInterval;
var gameoverSound = new Audio("gameover.mp3"); // Make sure file exists
var gameoverSoundPlayed = false;

var started = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = rows * blocksize;
  board.width = cols * blocksize;
  context = board.getContext("2d");

  document.addEventListener("keydown", handleKey);

  // Optional buttons, check if exist
  document.getElementById("up")?.addEventListener("click", () => simulateKey("ArrowUp"));
  document.getElementById("down")?.addEventListener("click", () => simulateKey("ArrowDown"));
  document.getElementById("left")?.addEventListener("click", () => simulateKey("ArrowLeft"));
  document.getElementById("right")?.addEventListener("click", () => simulateKey("ArrowRight"));
  document.getElementById("restart")?.addEventListener("click", restartGame);

  placeApple();

  gameInterval = setInterval(update, 1000 / 10);
};

function update() {
  if (gameover) {
    if (!gameoverSoundPlayed) {
      gameoverSound.play();
      gameoverSoundPlayed = true;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "white";
    context.textAlign = "center";

    let fontSize = board.width < 400 ? 18 : 30;
    context.font = fontSize + "px Arial";

    const lines = [
      "Game Over!",
      "Press any arrow or WASD key",
      "to restart."
    ];

    const lineHeight = fontSize * 1.3;
    let startY = board.height / 2 - (lines.length / 2) * lineHeight + lineHeight / 2;

    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], board.width / 2, startY + i * lineHeight);
    }
    return;
  }

  // Clear board
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);

  // Draw apple
  context.fillStyle = "red";
  context.fillRect(appleX, appleY, blocksize, blocksize);

  // Eat apple
  if (snakeX === appleX && snakeY === appleY) {
    snakeBody.push([appleX, appleY]);
    placeApple();
  }

  // Move snake body segments
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = [...snakeBody[i - 1]];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  // Move snake head
  snakeX += velocityX * blocksize;
  snakeY += velocityY * blocksize;

  // Check collisions with walls
  if (snakeX < 0 || snakeX >= board.width || snakeY < 0 || snakeY >= board.height) {
    gameover = true;
  }

  // Check collisions with self
  for (let segment of snakeBody) {
    if (snakeX === segment[0] && snakeY === segment[1]) {
      gameover = true;
    }
  }

  // Draw snake
  context.fillStyle = "lime";
  context.fillRect(snakeX, snakeY, blocksize, blocksize);
  for (let segment of snakeBody) {
    context.fillRect(segment[0], segment[1], blocksize, blocksize);
  }
}

function placeApple() {
  appleX = Math.floor(Math.random() * cols) * blocksize;
  appleY = Math.floor(Math.random() * rows) * blocksize;
}

function handleKey(e) {
  const key = e.code;

  // If gameover and user presses valid key, restart
  if (gameover && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyA","KeyS","KeyD"].includes(key)) {
    restartGame();
    return;
  }

  // Hide instructions on first key press
  if (!started) {
    document.getElementById("instructions")?.style.setProperty("display", "none");
    started = true;
  }

  if (!gameover) {
    if ((key === "ArrowUp" || key === "KeyW") && velocityY !== 1) {
      velocityX = 0;
      velocityY = -1;
    } else if ((key === "ArrowDown" || key === "KeyS") && velocityY !== -1) {
      velocityX = 0;
      velocityY = 1;
    } else if ((key === "ArrowLeft" || key === "KeyA") && velocityX !== 1) {
      velocityX = -1;
      velocityY = 0;
    } else if ((key === "ArrowRight" || key === "KeyD") && velocityX !== -1) {
      velocityX = 1;
      velocityY = 0;
    }
  }
}

function simulateKey(key) {
  const event = new KeyboardEvent("keydown", { code: key });
  document.dispatchEvent(event);
}

function restartGame() {
  gameover = false;
  gameoverSound.pause();
  gameoverSound.currentTime = 0;
  gameoverSoundPlayed = false;

  snakeX = blocksize * 5;
  snakeY = blocksize * 5;
  snakeBody = [];
  velocityX = 0;
  velocityY = 0;
  placeApple();

  started = false;
  document.getElementById("instructions")?.style.setProperty("display", "block");
}
