const tilesContainer = document.querySelector(".tiles");
const scoreDisplay = document.querySelector(".score");
const timerDisplay = document.querySelector(".timer");
const resetButton = document.querySelector(".reset");

const colors = [
  "crimson", "chartreuse", "dodgerblue", "gold",
  "mediumvioletred", "orange", "springgreen", "cyan",
  "deeppink", "orchid", "firebrick", "turquoise",
  "slateblue", "tomato"
];

let tiles = [];
let timer = null;
let startTime = null;

let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;
let moves = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateScore() {
  scoreDisplay.textContent = `Moves: ${moves}`;
}

function startTimer() {
  startTime = Date.now();
  timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${elapsed}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function buildTile(color) {
  const element = document.createElement("div");
  element.classList.add("tile");
  element.setAttribute("data-color", color);
  element.setAttribute("data-revealed", "false");

  element.addEventListener("click", () => {
    const revealed = element.getAttribute("data-revealed");

    if (awaitingEndOfMove || revealed === "true" || element === activeTile) {
      return;
    }

    element.classList.add("revealed");
    element.style.backgroundColor = color;

    if (!activeTile) {
      activeTile = element;
      return;
    }

    const colorToMatch = activeTile.getAttribute("data-color");

    if (colorToMatch === color) {
      element.setAttribute("data-revealed", "true");
      activeTile.setAttribute("data-revealed", "true");

      activeTile = null;
      awaitingEndOfMove = false;
      revealedCount += 2;
      moves++;
      updateScore();

      if (revealedCount === tiles.length) {
        stopTimer();
        setTimeout(() => alert(`🎉 You win in ${moves} moves and ${Math.floor((Date.now() - startTime) / 1000)} seconds!`), 200);
      }

      return;
    }

    awaitingEndOfMove = true;
    moves++;
    updateScore();

    setTimeout(() => {
      activeTile.classList.remove("revealed");
      activeTile.style.backgroundColor = null;
      element.classList.remove("revealed");
      element.style.backgroundColor = null;

      awaitingEndOfMove = false;
      activeTile = null;
    }, 600);
  });

  return element;
}

function initGame() {
  tilesContainer.innerHTML = "";
  revealedCount = 0;
  activeTile = null;
  awaitingEndOfMove = false;
  moves = 0;
  updateScore();
  timerDisplay.textContent = "Time: 0s";
  stopTimer();

  const colorPairs = [...colors, ...colors, ...colors, ...colors];
  shuffleArray(colorPairs);
  tiles = colorPairs.map(color => buildTile(color));
  tiles.forEach(tile => tilesContainer.appendChild(tile));

  startTimer();
}

resetButton.addEventListener("click", initGame);

initGame(); // Start game on page load
