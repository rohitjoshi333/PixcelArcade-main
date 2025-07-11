document.addEventListener("DOMContentLoaded", () => {
  const holes = document.querySelectorAll(".hole");
  const startBtn = document.getElementById("startButton");
  const endBtn = document.getElementById("endButton");
  const scoreEl = document.getElementById("score");
  const timerEl = document.getElementById("timer");

  const hitSound = new Audio("hit.mp3");
  const missSound = new Audio("miss.mp3");

  let score = 0;
  let timer = 20;
  let countdownInterval = null;
  let moleTimeout = null;
  let gameRunning = false;

  let missCounter = 0;   // for miss clicks (non-mole clicks)
  let noHitCounter = 0;  // for mole pops without hits

  let moleWasHit = false; // track if current mole was hit
  let isMissSoundPlaying = false; // to prevent overlapping miss sounds

  function clearMoles() {
    holes.forEach(h => {
      h.classList.remove("mole");
      h.removeEventListener("click", hitMole);
      h.removeEventListener("click", missClick);
    });
  }

  function playMissSound() {
    if (isMissSoundPlaying) return; // already playing
    isMissSoundPlaying = true;
    missSound.currentTime = 0;
    missSound.play();
    setTimeout(() => {
      missSound.pause();
      missSound.currentTime = 0;
      isMissSoundPlaying = false;
    }, 1800);
  }

  function hitMole(e) {
    if (!gameRunning) return;
    score++;
    scoreEl.textContent = `Score: ${score}`;
    this.classList.remove("mole");

    // Sound on hit
    hitSound.currentTime = 0;
    hitSound.play();

    missCounter = 0;
    noHitCounter = 0;  // reset no-hit counter because mole was hit
    moleWasHit = true;

    // Pause mole popping for 1.5 seconds
    clearTimeout(moleTimeout);
    holes.forEach(h => h.removeEventListener("click", hitMole));

    setTimeout(() => {
      if (!gameRunning) return;
      popUpMole();
    }, 1500);
  }

  function missClick(e) {
    if (!gameRunning) return;
    if (!this.classList.contains("mole")) {
      missCounter++;
      if (missCounter >= 3) {
        playMissSound();
        missCounter = 0; // Reset after playing
      }
    }
  }

  function popUpMole() {
    if (!gameRunning) return;

    // If mole wasn't hit last round, increase noHitCounter
    if (!moleWasHit) {
      noHitCounter++;
      if (noHitCounter >= 3) {
        // Play miss sound on 3 missed mole pops
        playMissSound();
        noHitCounter = 0;
      }
    } else {
      // Reset the flag after counting the hit mole
      moleWasHit = false;
    }

    clearMoles();

    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    randomHole.classList.add("mole");
    randomHole.addEventListener("click", hitMole);

    holes.forEach(h => h.addEventListener("click", missClick));

    let speed;
    if (timer > 20) speed = 700;
    else if (timer > 10) speed = 500;
    else speed = 300;

    moleTimeout = setTimeout(popUpMole, speed);
  }

  function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    score = 0;
    timer = 20;
    scoreEl.textContent = `Score: ${score}`;
    timerEl.textContent = `Time: ${timer}s`;
    missCounter = 0;
    noHitCounter = 0;
    moleWasHit = false;
    isMissSoundPlaying = false;

    startBtn.disabled = true;
    endBtn.disabled = false;

    popUpMole();

    countdownInterval = setInterval(() => {
      timer--;
      timerEl.textContent = `Time: ${timer}s`;

      if (timer <= 0) {
        endGame("Game Over!");
      }
    }, 1000);
  }

  function endGame(message = "Game Ended!") {
    clearInterval(countdownInterval);
    clearTimeout(moleTimeout);
    gameRunning = false;
    clearMoles();
    startBtn.disabled = false;
    endBtn.disabled = true;
    alert(`${message}\nYour final score: ${score}`);
    score = 0;
    timer = 20;
    missCounter = 0;
    noHitCounter = 0;
    moleWasHit = false;
    isMissSoundPlaying = false;
    scoreEl.textContent = `Score: ${score}`;
    timerEl.textContent = `Time: ${timer}s`;
  }

  startBtn.addEventListener("click", startGame);
  endBtn.addEventListener("click", () => endGame("You stopped the game."));
});
